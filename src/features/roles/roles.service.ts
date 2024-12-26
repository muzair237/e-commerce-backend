import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AdminRole, Permission, Role, RolePermission } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { CreateRoleDto } from './dto/create-role.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Permission) private readonly PERMISSION: typeof Permission,
    @InjectModel(Role) private readonly ROLE: typeof Role,
    @InjectModel(RolePermission) private readonly ROLE_PERMISSION: typeof RolePermission,
    @InjectModel(AdminRole) private readonly ADMIN_ROLE: typeof AdminRole,
    private readonly helpers: Helpers,
    private readonly sequelize: Sequelize,
  ) {}

  async getAllRoles(queryParams: AfterQueryParamsInterface) {
    const { page = 1, itemsPerPage = 10, getAll, searchText, startDate, endDate, sort } = queryParams;

    let query: any = {};

    // Search filter for type and description
    if (searchText) {
      query = {
        [Op.or]: [{ type: { [Op.iLike]: `%${searchText}%` } }, { description: { [Op.iLike]: `%${searchText}%` } }],
      };
    }

    // Date filter
    if (startDate && endDate) {
      query.created_at = {
        [Op.gte]: new Date(startDate),
        [Op.lt]: new Date(endDate),
      };
    }

    const sorting: [string, string][] = this.helpers.getSorting(sort, 'can');

    try {
      const { count: totalItems, rows: roles } = await this.ROLE.findAndCountAll({
        where: query,
        order: sorting,
        include: [
          {
            model: Permission,
            as: 'permissions',
            attributes: ['id'],
            required: false,
          },
        ],
        ...(!getAll && {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
          distinct: true,
        }),
      });

      return {
        success: true,
        message: 'Roles retrieved successfully',
        data: {
          ...this.helpers.pagination(
            roles.map((role: any) => ({
              id: role.id,
              type: role.type,
              description: role.description,
              created_at: role.created_at,
              updated_at: role.updated_at,
              permissions: role.permissions.map(permission => permission.id),
            })),
            page,
            totalItems,
            itemsPerPage,
            getAll,
          ),
        },
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async createRole(roleData: CreateRoleDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const { type, description, permissions } = roleData;

      const findRole = await this.ROLE.findOne({
        where: { type },
        transaction,
      });

      if (findRole) {
        throw new HttpException(
          { success: false, message: `Role with the type '${type}' already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      const createdRole = await this.ROLE.create({ type, description }, { transaction });

      const permissionForThisRole = permissions?.map(permissionId => ({
        roleId: createdRole.id,
        permissionId,
      }));

      if (permissionForThisRole?.length) {
        await RolePermission.bulkCreate(permissionForThisRole, { transaction });
      }

      await transaction.commit();

      return { success: true, message: 'Role created successfully' };
    } catch (err) {
      await transaction.rollback();
      this.helpers.handleException(err);
    }
  }

  async updateRole(id: number, roleData: CreateRoleDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const { type, description, permissions } = roleData;

      const findRole = await this.ROLE.findByPk(id, { transaction });
      if (!findRole) {
        throw new HttpException({ success: false, message: 'Role not found!' }, HttpStatus.NOT_FOUND);
      }

      const existingRole = await this.ROLE.findOne({
        where: { type, id: { [Op.ne]: id } },
        transaction,
      });
      if (existingRole) {
        throw new HttpException(
          { success: false, message: `Role with the type '${type}' already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      await this.ROLE.update({ type, description }, { where: { id }, transaction });

      await this.ROLE_PERMISSION.destroy({ where: { roleId: id }, transaction });

      const permissionForThisRole = permissions?.map(permissionId => ({
        roleId: id,
        permissionId,
      }));
      if (permissionForThisRole?.length) {
        await RolePermission.bulkCreate(permissionForThisRole, { transaction });
      }

      await transaction.commit();

      return { success: true, message: 'Role updated successfully' };
    } catch (err) {
      await transaction.rollback();
      this.helpers.handleException(err);
    }
  }

  async deleteRole(id: number) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const findRole = await this.ROLE.findByPk(id, { transaction });
      if (!findRole) {
        throw new HttpException({ success: false, message: 'Role not found!' }, HttpStatus.NOT_FOUND);
      }

      const isRoleAssociatedWithAdmin = await this.ADMIN_ROLE.findOne({
        where: { roleId: id },
        transaction,
      });
      if (isRoleAssociatedWithAdmin) {
        throw new HttpException(
          { success: false, message: 'This role is associated with an admin. Clear it from the admin first.' },
          HttpStatus.CONFLICT,
        );
      }

      await this.ROLE_PERMISSION.destroy({ where: { roleId: id }, transaction });

      await this.ROLE.destroy({ where: { id }, transaction });

      await transaction.commit();

      return { success: true, message: 'Role deleted successfully' };
    } catch (err) {
      await transaction.rollback();
      this.helpers.handleException(err);
    }
  }
}
