import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { Brand, Product, ProductVariation } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from 'src/utils/uploadFiles';
import { MemoryStoredFile } from 'nestjs-form-data';
import {
  GraphicsCardMemorySizes,
  GraphicsCardTypes,
  ProcessorGenerations,
  ProcessorNames,
  RamSizes,
  StorageSizes,
  StorageTypes,
} from 'src/utils/enums';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Brand) private readonly BRAND: typeof Brand,
    @InjectModel(Product) private readonly PRODUCT: typeof Product,
    @InjectModel(ProductVariation) private readonly PRODUCT_VARIATION: typeof ProductVariation,
    private readonly helpers: Helpers,
    private readonly cloudinary: CloudinaryService,
    private readonly sequelize: Sequelize,
  ) {}

  async getAllProducts(queryParams: AfterQueryParamsInterface) {
    try {
      const { page = 1, itemsPerPage = 10, getAll, searchText, startDate, endDate, sort } = queryParams;

      let query: any = {};

      if (searchText) {
        query = {
          [Op.or]: [
            {
              model: {
                [Op.iLike]: `%${searchText}%`,
              },
            },
            {
              description: {
                [Op.iLike]: `%${searchText}%`,
              },
            },
            {
              brandId: {
                [Op.in]: await this.helpers.getBrandsById(searchText),
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
      const sorting: [string, string][] = this.helpers.getSorting(sort, 'model');

      const { count: totalItems, rows: products } = await this.PRODUCT.findAndCountAll({
        where: query,
        attributes: {
          include: [[Sequelize.col('brand.name'), 'brandName']],
        },
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: [],
            required: false,
          },
        ],
        order: sorting,
        ...(!getAll && {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        }),
        raw: true,
      });

      return {
        success: true,
        message: 'Products retrieved successfully',
        data: { ...this.helpers.pagination(products, page, totalItems, itemsPerPage, getAll) },
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async createProduct(productData: CreateProductDto) {
    const transaction: Transaction = await this.sequelize.transaction();
    try {
      const { product, variations } = productData;

      const findBrand: Brand = await this.BRAND.findByPk(product?.brandId, { transaction });
      if (!findBrand) {
        throw new HttpException({ success: false, message: 'Brand not found!' }, HttpStatus.NOT_FOUND);
      }

      const findProduct: Product = await this.PRODUCT.findOne({ where: { name: product?.name }, transaction });
      if (findProduct) {
        throw new HttpException(
          { success: false, message: `Product with the name '${findProduct?.name}' already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      const { images }: { images: MemoryStoredFile[] } = product;

      const uploadedImages: string[] = await this.cloudinary.uploadMultipleImages(images);

      const createdProduct: Product = await this.PRODUCT.create(
        { ...product, images: uploadedImages },
        { transaction },
      );

      if (variations?.length > 0) {
        await this.PRODUCT_VARIATION.bulkCreate(
          variations?.map(variation => ({ productId: createdProduct?.id, ...variation })),
          { transaction },
        );
      }

      await transaction.commit();

      return {
        success: true,
        message: 'Product created successfully!',
      };
    } catch (err) {
      await transaction.rollback();
      this.helpers.handleException(err);
    }
  }

  async getProductVariations(id: number) {
    try {
      const findProduct: Product = await this.PRODUCT.findByPk(id);
      if (!findProduct) {
        throw new HttpException({ success: false, message: 'Product not found!' }, HttpStatus.NOT_FOUND);
      }

      const productVariations = await this.PRODUCT_VARIATION.findAll({ where: { productId: id } });
      return {
        success: true,
        message: 'Product Variations retrieved successfully',
        data: productVariations,
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async getProductFiltersOptions() {
    try {
      const brands = await this.BRAND.findAll({ attributes: ['id', 'name'] });

      return {
        success: true,
        message: 'Product filters options retrieved successfully',
        data: {
          brandOptions: brands,
          ramOptions: RamSizes,
          storageTypeOptions: StorageTypes,
          storageSizeOptions: StorageSizes,
          processorNameoptions: ProcessorNames,
          processorGenOptions: ProcessorGenerations,
          graphicsCardTypeOptions: GraphicsCardTypes,
          graphicsCardMemorySizes: GraphicsCardMemorySizes,
        },
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }
}
