import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { Permission, RolePermission } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { Op } from 'sequelize';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission) private readonly PERMISSION: typeof Permission,
    @InjectModel(RolePermission) private readonly ROLE_PERMISSION: typeof RolePermission,
    private readonly helpers: Helpers,
  ) {}

  async getAllPermissions(queryParams: AfterQueryParamsInterface) {
    const { page = 1, itemsPerPage = 10, getAll, searchText, startDate, endDate, sort } = queryParams;

    let query: any = {};

    if (searchText) {
      query = {
        [Op.or]: [
          {
            can: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
          {
            route: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
        ],
      };
    }

    if (startDate && endDate) {
      query.created_at = {
        [Op.gte]: new Date(startDate),
        [Op.lt]: new Date(endDate),
      };
    }

    const sorting: [string, string][] = this.helpers.getSorting(sort, 'can');

    try {
      const { count: totalItems, rows: permissions } = await this.PERMISSION.findAndCountAll({
        where: query,
        order: sorting,
        ...(!getAll && {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        }),
        raw: true,
      });

      return {
        success: true,
        message: 'Permissions retrieved successfully',
        data: { ...this.helpers.pagination(permissions, page, totalItems, itemsPerPage, getAll) },
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async createPermission(permissionData: CreatePermissionDto) {
    try {
      const { can, route, description, parents } = permissionData;

      const findPermission = await this.PERMISSION.findOne({ where: { can } });

      if (findPermission) {
        throw new HttpException(
          { success: false, message: `Permission with the can '${can}' already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      await this.PERMISSION.create({ can, route, description, parents });

      return { success: true, message: 'Permission created successfully' };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async getUnqiueParents() {
    try {
      const parentPermissions = await this.PERMISSION.findAll({
        where: {
          parents: {
            [Op.eq]: ['$'],
          },
        },
        attributes: ['can'],
      });
      return { success: true, message: 'Parent permissions retrieved successfuly', parentPermissions };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async updatePermission(id: number, permissionData: CreatePermissionDto) {
    try {
      const { can, route, description, parents } = permissionData;

      const findPermission = await this.PERMISSION.findByPk(id);

      if (!findPermission) {
        throw new HttpException({ success: false, message: 'Permission not found!' }, HttpStatus.NOT_FOUND);
      }

      const isPermissionExists = await this.PERMISSION.findOne({
        where: {
          can,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (isPermissionExists) {
        throw new HttpException(
          { success: false, message: `Permission with the can '${can}' already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      await this.PERMISSION.update({ can, route, description, parents }, { where: { id } });

      return { success: true, message: 'Permission updated successfully' };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async deletePermission(id: number) {
    try {
      const findPermission = await this.PERMISSION.findByPk(id);

      if (!findPermission) {
        throw new HttpException({ success: false, message: 'Permission not found!' }, HttpStatus.NOT_FOUND);
      }

      const ifRoleAsociated = await this.ROLE_PERMISSION.findOne({ where: { permissionId: id } });

      if (ifRoleAsociated) {
        throw new HttpException(
          { success: false, message: 'This permission is associated with a role. Clear it from the role first.' },
          HttpStatus.FORBIDDEN,
        );
      }

      await this.PERMISSION.destroy({ where: { id } });

      return { success: true, messge: 'Permission deleted successfully' };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }
}
