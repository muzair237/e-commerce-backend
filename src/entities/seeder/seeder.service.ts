import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, Permission, Admin } from 'src/models';
import { permissionsList } from 'src/utils/seeders/permissionsList';
import { Transaction } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { Helpers } from 'src/utils/helpers';
import { getEnvVariables } from 'src/config/configuration';

@Injectable()
export class SeederService {
  private readonly ADMIN_EMAIL: string;
  private readonly ADMIN_PASSWORD: string;

  constructor(
    @InjectModel(Permission) private readonly PERMISSION: typeof Permission,
    @InjectModel(Role) private readonly ROLE: typeof Role,
    @InjectModel(Admin) private readonly ADMIN: typeof Admin,
    private readonly configService: ConfigService,
    private readonly helper: Helpers,
  ) {
    ({ ADMIN_EMAIL: this.ADMIN_EMAIL, ADMIN_PASSWORD: this.ADMIN_PASSWORD } = getEnvVariables(configService));
  }

  async seedPermissionsAndRoles(transaction: Transaction) {
    try {
      for (const permission of permissionsList) {
        await this.PERMISSION.upsert(permission, { transaction });
      }

      const permissions = await this.PERMISSION.findAll({ transaction });

      await this.ROLE.upsert(
        {
          type: 'SUPER_ADMIN',
          description: 'Role for Super Admin',
          permissions: permissions.map(({ id }) => id),
        },
        {
          transaction,
          conflictFields: ['type'],
        },
      );
    } catch (error) {
      throw new HttpException(
        `Failed to seed permissions and roles: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createFirstAdmin(transaction: Transaction) {
    try {
      const role = await this.ROLE.findOne({
        where: { type: 'SUPER_ADMIN' },
        transaction,
      });

      const permissions = await this.PERMISSION.findAll({ transaction });

      await this.ADMIN.upsert(
        {
          name: 'Admin',
          email: this.ADMIN_EMAIL,
          password: this.helper.hashPassword(this.ADMIN_PASSWORD),
          permissions: permissions?.map(({ can }) => can),
          roles: [role.id],
        },
        { transaction },
      );
    } catch (error) {
      throw new HttpException(`Failed to create the first admin: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
