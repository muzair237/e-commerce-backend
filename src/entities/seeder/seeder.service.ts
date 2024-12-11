/* eslint-disable no-console */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, Permission, Admin } from 'src/models';
import { permissionsList } from 'src/utils/seeders/permissionsList';
import { rolesList } from 'src/utils/seeders/rolesList';
import { Transaction } from 'sequelize';
import { getEnvVariables } from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';
import { Helpers } from 'src/utils/helpers';

@Injectable()
export class SeederService {
  private readonly ADMIN_EMAIL: string;
  private readonly ADMIN_PASSWORD: string;
  private readonly ADMIN_ROLE: string;
  constructor(
    @InjectModel(Permission) private readonly PERMISSION: typeof Permission,
    @InjectModel(Role) private readonly ROLE: typeof Role,
    @InjectModel(Admin) private readonly ADMIN: typeof Admin,
    private readonly configService: ConfigService,
    private readonly helper: Helpers,
  ) {
    ({
      ADMIN_EMAIL: this.ADMIN_EMAIL,
      ADMIN_PASSWORD: this.ADMIN_PASSWORD,
      ADMIN_ROLE: this.ADMIN_ROLE,
    } = getEnvVariables(configService));
  }

  async seedPermissionsAndRoles(transaction: Transaction) {
    try {
      const permissions = await this.PERMISSION.findAll({ transaction });
      const permissionToCreate = permissionsList.filter(
        perm => !permissions.some(existingPerm => existingPerm.can === perm.can),
      );

      if (permissionToCreate.length > 0) {
        await this.PERMISSION.bulkCreate(permissionToCreate, { ignoreDuplicates: true, transaction });
      }

      const roles = await this.ROLE.findAll({ transaction });
      const rolesToCreate = rolesList.filter(role => !roles.some(existingRole => existingRole.type === role.type));

      await Promise.all(
        rolesToCreate.map(async role => {
          const newPermissions = await this.PERMISSION.findAll({
            where: { can: role.permissions.map(val => val.can) },
            transaction,
          });

          const permissionIds = newPermissions.map(perm => perm.id);

          await this.ROLE.bulkCreate(
            [
              {
                type: role.type,
                description: role.description,
                permissions: permissionIds,
              },
            ],
            { ignoreDuplicates: true, transaction },
          );
        }),
      );
    } catch (err) {
      throw new HttpException(`Failed to seed roles and permissions: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createFirstAdmin(transaction: Transaction) {
    try {
      const existingAdmin = await this.ADMIN.findOne({ transaction });
      if (existingAdmin) return;
      console.log('Hashing....');
      const hashedPassword = this.helper.hashPassword(this.ADMIN_PASSWORD);

      const roles = await this.ROLE.findAll({
        where: { type: this.ADMIN_ROLE },
        transaction,
      });

      const permissionsFindArray = roles.flatMap(role => role.permissions);

      const permissions = await this.PERMISSION.findAll({
        where: { id: permissionsFindArray },
        transaction,
      });

      const permissionCans = permissions.map(permission => permission.can);

      await this.ADMIN.create(
        {
          name: 'admin',
          email: this.ADMIN_EMAIL,
          password: hashedPassword,
          permissions: permissionCans,
          roles: [roles[0].id],
        },
        { transaction },
      );
    } catch (err) {
      throw new HttpException(`Failed to create the first admin: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
