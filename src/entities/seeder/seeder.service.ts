import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, Permission, Admin, RolePermission, AdminRole } from 'src/models';
import { permissionsList } from 'src/utils/seeders/permissionsList';
import { Transaction } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { Helpers } from 'src/utils/helpers';
import { getEnvVariables } from 'src/config/configuration';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SeederService {
  private readonly ADMIN_EMAIL: string;
  private readonly ADMIN_PASSWORD: string;

  constructor(
    @InjectModel(Permission) private readonly PERMISSION: typeof Permission,
    @InjectModel(Role) private readonly ROLE: typeof Role,
    @InjectModel(Admin) private readonly ADMIN: typeof Admin,
    @InjectModel(RolePermission) private readonly ROLE_PERMISSION: typeof RolePermission,
    @InjectModel(AdminRole) private readonly ADMIN_ROLE: typeof AdminRole,
    private readonly configService: ConfigService,
    private readonly helper: Helpers,
    private readonly sequelize: Sequelize,
  ) {
    ({ ADMIN_EMAIL: this.ADMIN_EMAIL, ADMIN_PASSWORD: this.ADMIN_PASSWORD } = getEnvVariables(configService));
  }

  async seedPermissionsAndRoles(transaction: Transaction) {
    try {
      for (const permission of permissionsList) {
        // Ensuring permissions are upserted
        await this.PERMISSION.upsert(permission, { transaction });
      }

      const permissions = await this.PERMISSION.findAll({ transaction });

      const [role] = await this.ROLE.upsert(
        {
          type: 'SUPER_ADMIN',
          description: 'Role for Super Admin',
        },
        { returning: true, transaction },
      );

      // Now associate permissions with the SUPER_ADMIN role
      for (const permission of permissions) {
        await this.ROLE_PERMISSION.upsert(
          {
            roleId: role.id,
            permissionId: permission.id,
          },
          { transaction },
        );
      }
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

      if (!role) {
        throw new HttpException('Role SUPER_ADMIN not found', HttpStatus.NOT_FOUND);
      }

      const [admin] = await this.ADMIN.upsert(
        {
          name: 'Admin',
          email: this.ADMIN_EMAIL,
          password: this.helper.hashPassword(this.ADMIN_PASSWORD),
        },
        { transaction },
      );

      // Assign the role to the first admin
      if (admin) {
        await this.ADMIN_ROLE.upsert(
          {
            adminId: admin.id,
            roleId: role.id,
          },
          { transaction },
        );
      }
    } catch (error) {
      throw new HttpException(`Failed to create the first admin: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async seedRPA() {
    const transaction = await this.sequelize.transaction();

    try {
      await this.seedPermissionsAndRoles(transaction);
      await this.createFirstAdmin(transaction);

      await transaction.commit();

      return { message: 'Permissions, Roles, and Admin seeded successfully' };
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(`Seeding failed: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
