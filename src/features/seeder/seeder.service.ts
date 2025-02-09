import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, Permission, Admin, RolePermission, AdminRole, Brand, Product, ProductVariation } from 'src/models';
import { permissionsList } from 'src/utils/seeders/permissionsList';
import { brandsList } from 'src/utils/seeders/brandsList';
import { productsList, productVariationsList } from 'src/utils/seeders/productsList';
import { Transaction } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { Helpers } from 'src/utils/helpers';
import { getEnvVariables } from 'src/config/configuration';
import { Sequelize } from 'sequelize-typescript';
import { GeneralApiResponse } from 'src/utils/interfaces';

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
    @InjectModel(Brand) private readonly BRAND: typeof Brand,
    @InjectModel(Product) private readonly PRODUCT: typeof Product,
    @InjectModel(ProductVariation) private readonly PRODUCT_VARIATION: typeof ProductVariation,
    private readonly configService: ConfigService,
    private readonly helper: Helpers,
    private readonly sequelize: Sequelize,
  ) {
    ({ ADMIN_EMAIL: this.ADMIN_EMAIL, ADMIN_PASSWORD: this.ADMIN_PASSWORD } = getEnvVariables(configService));
  }

  async seedPermissionsAndRoles(transaction: Transaction): Promise<void> {
    try {
      for (const permission of permissionsList) {
        await this.PERMISSION.upsert(permission, { transaction });
      }

      const permissions: Permission[] = await this.PERMISSION.findAll({ transaction });

      const [role] = await this.ROLE.upsert(
        {
          type: 'SUPER_ADMIN',
          description: 'Role for Super Admin',
        },
        { returning: true, transaction },
      );

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

  async createFirstAdmin(transaction: Transaction): Promise<void> {
    try {
      const role: Role = await this.ROLE.findOne({
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

  async seedRPA(): Promise<GeneralApiResponse> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      await this.seedPermissionsAndRoles(transaction);
      await this.createFirstAdmin(transaction);

      await transaction.commit();

      return { success: true, message: 'Permissions, Roles, and Admin seeded successfully' };
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(`Seeding failed: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async seedBrands(transaction: Transaction): Promise<void> {
    try {
      for (const brand of brandsList) {
        await this.BRAND.upsert(brand, { transaction });
      }
    } catch (error) {
      throw new HttpException(`Failed to seed brands: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async seedProducts(transaction: Transaction): Promise<void> {
    try {
      const brands: Brand[] = await this.BRAND.findAll({ transaction });

      const brandIds: number[] = brands.map(brand => brand.id);

      for (const product of productsList) {
        const randomBrandId: number = brandIds[Math.floor(Math.random() * brandIds.length)];

        product.brandId = randomBrandId;

        await this.PRODUCT.upsert(product, { conflictFields: ['name'], transaction });
      }
    } catch (error) {
      throw new HttpException(`Failed to seed products: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async seedProductVariations(transaction: Transaction): Promise<void> {
    try {
      const products: Product[] = await this.PRODUCT.findAll({ transaction });

      const productIds: number[] = products.map(product => product.id);

      for (const variation of productVariationsList) {
        const randomProductId: number = productIds[Math.floor(Math.random() * productIds.length)];

        variation.productId = randomProductId;

        const existingVariation: ProductVariation = await this.PRODUCT_VARIATION.findOne({
          where: {
            productId: variation.productId,
          },
          transaction,
        });

        if (!existingVariation) {
          await this.PRODUCT_VARIATION.upsert(variation, { transaction });
        }
      }
    } catch (error) {
      throw new HttpException(`Failed to seed product variations: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async seedBPV(): Promise<GeneralApiResponse> {
    const transaction: Transaction = await this.sequelize.transaction();

    try {
      await this.seedBrands(transaction);
      await this.seedProducts(transaction);
      await this.seedProductVariations(transaction);

      await transaction.commit();
      return { success: true, message: 'Brands, Products, and Product Variations seeded successfully' };
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(`Database seeding failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
