import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Admin, AdminJwt, AdminRole, Role } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { Sequelize } from 'sequelize-typescript';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin) private readonly ADMIN: typeof Admin,
    @InjectModel(AdminJwt) private readonly ADMIN_JWT: typeof AdminJwt,
    @InjectModel(AdminRole) private readonly ADMIN_ROLE: typeof AdminRole,
    private readonly helpers: Helpers,
    private readonly sequelize: Sequelize,
  ) {}

  async getAllAdmins(queryParams: AfterQueryParamsInterface) {
    const { page = 1, itemsPerPage = 10, getAll, searchText, startDate, endDate, sort, roleType } = queryParams;

    let adminQuery: any = {};
    const roleQuery: any = {};

    if (roleType && roleType !== 'all') {
      roleQuery.id = roleType;
    }

    if (searchText) {
      adminQuery = {
        [Op.or]: [{ name: { [Op.iLike]: `%${searchText}%` } }, { email: { [Op.iLike]: `%${searchText}%` } }],
      };
    }

    if (startDate && endDate) {
      adminQuery.created_at = {
        [Op.gte]: new Date(startDate),
        [Op.lt]: new Date(endDate),
      };
    }

    const sorting: [string, string][] = this.helpers.getSorting(sort, 'name');

    try {
      const { count: totalItems, rows: admins } = await this.ADMIN.findAndCountAll({
        attributes: { exclude: ['password'] },
        where: adminQuery,
        order: sorting,
        include: [
          {
            model: Role,
            as: 'roles',
            attributes: ['type'],
            where: roleQuery,
            required: !!roleType,
          },
        ],
        ...(!getAll && {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        }),
        distinct: true,
      });

      return {
        success: true,
        message: 'Admins retrieved successfully',
        data: {
          ...this.helpers.pagination(
            admins.map((admin: any) => ({
              id: admin.id,
              name: admin.name,
              email: admin.email,
              roles: admin.roles.map(role => role.type),
              created_at: admin.created_at?.toISOString(),
              updated_at: admin.updated_at?.toISOString(),
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

  async createAdmin(adminData: CreateAdminDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const { name, email, newPassword, confirmPassword, roles } = adminData;

      const findAdmin = await this.ADMIN.findOne({ where: { email }, transaction });
      if (findAdmin) {
        throw new HttpException(
          { success: false, message: `Admin with the email ${email} already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      if (newPassword !== confirmPassword) {
        throw new HttpException({ success: false, message: 'Passwords do not match' }, HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = this.helpers.hashPassword(newPassword);
      const createdAdmin = await this.ADMIN.create({ name, email, password: hashedPassword });

      const rolesForThisAdmin = roles?.map(roleId => ({
        adminId: createdAdmin?.id,
        roleId,
      }));

      if (rolesForThisAdmin?.length) {
        await this.ADMIN_ROLE.bulkCreate(rolesForThisAdmin, { transaction });
      }

      await transaction.commit();

      return {
        success: true,
        message: 'Admin created successfully',
      };
    } catch (err) {
      await transaction.rollback();
      this.helpers.handleException(err);
    }
  }

  async updateAdmin(id: number, adminData: UpdateAdminDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const { email, roles, ...restData } = adminData;

      const existingAdmin = await this.ADMIN.findByPk(id, { transaction });
      if (!existingAdmin) {
        throw new HttpException({ success: false, message: 'Admin not found' }, HttpStatus.NOT_FOUND);
      }

      const emailExists = await this.ADMIN.findOne({
        where: {
          email,
          id: {
            [Op.ne]: id,
          },
        },
        transaction,
      });
      if (emailExists) {
        throw new HttpException(
          { success: false, message: 'Email you provided is already in use!' },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.ADMIN.update({ email, ...restData }, { where: { id }, transaction });

      if (roles) {
        await this.ADMIN_ROLE.destroy({ where: { adminId: id }, transaction });

        const rolesForThisAdmin = roles.map(roleId => ({
          adminId: id,
          roleId,
        }));

        await this.ADMIN_ROLE.bulkCreate(rolesForThisAdmin, { transaction });
      }

      await transaction.commit();

      return { success: true, message: 'Admin updated successfully' };
    } catch (err) {
      await transaction.rollback();
      this.helpers.handleException(err);
    }
  }

  async updatePassword(id: number, adminData: UpdateAdminDto) {
    try {
      const { newPassword, confirmPassword } = adminData;

      const existingAdmin = await this.ADMIN.findByPk(id);
      if (!existingAdmin) {
        throw new HttpException({ success: false, message: 'Admin not found' }, HttpStatus.NOT_FOUND);
      }

      if (newPassword !== confirmPassword) {
        throw new HttpException({ success: false, message: 'Passwords do not match' }, HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = this.helpers.hashPassword(newPassword);
      await this.ADMIN.update({ password: hashedPassword }, { where: { id } });

      return { success: true, message: 'Password updated successfully' };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async deleteAdmin(id: number) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const findAdmin = await this.ADMIN.findByPk(id);
      if (!findAdmin) {
        throw new HttpException({ success: false, message: 'Admin not found' }, HttpStatus.NOT_FOUND);
      }

      await this.ADMIN_ROLE.destroy({ where: { adminId: id }, transaction });
      await this.ADMIN.destroy({ where: { id }, transaction });
      await this.ADMIN_JWT.destroy({ where: { admin_id: id }, transaction });

      await transaction.commit();

      return { success: true, message: 'Admin deleted successfully' };
    } catch (err) {
      await transaction.rollback();
      this.helpers.handleException(err);
    }
  }
}
