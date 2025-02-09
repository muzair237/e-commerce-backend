import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { Brand, Product, ProductVariation } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { AfterQueryParamsInterface, GeneralApiResponse, GetAllApiResponse } from 'src/utils/interfaces';
import { CreateProductDto, ProductVariationDto } from './dto/create-product.dto';
import { CloudinaryService } from 'src/utils/uploadFiles';
import { MemoryStoredFile } from 'nestjs-form-data';
import {
  GraphicsCardMemorySizes,
  GraphicsCardTypes,
  ProcessorGenerations,
  ProcessorNames,
  RamSizes,
  ScreenSizes,
  StorageSizes,
  StorageTypes,
} from 'src/utils/enums';
import { ProductsAdvancedSearchDTO } from './dto/products-advanced-search.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async getAllProducts(queryParams: AfterQueryParamsInterface): Promise<GetAllApiResponse> {
    try {
      const { page = 1, itemsPerPage = 10, getAll, searchText, startDate, endDate, sort } = queryParams;

      let query: Record<string, unknown> = {};

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
          include: [
            [Sequelize.col('brand.name'), 'brandName'],
            [
              Sequelize.literal(
                'COALESCE((SELECT SUM("quantity") FROM "product_variations" WHERE "product_variations"."productId" = "Product"."id"), 0)',
              ),
              'totalQuantity',
            ],
            [
              Sequelize.literal(
                '(SELECT COUNT(*) FROM "product_variations" WHERE "product_variations"."productId" = "Product"."id")',
              ),
              'noOfVariants',
            ],
          ],
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

  async advancedProductSearch(advancedSearchFilters: ProductsAdvancedSearchDTO): Promise<GetAllApiResponse> {
    try {
      const { page, itemsPerPage, getAll } = advancedSearchFilters;
      const {
        searchText,
        brand,
        ram,
        storageType,
        storageSize,
        processorName,
        processorGeneration,
        graphicsCardType,
        graphicsCardMemorySize,
        minPrice,
        maxPrice,
        sort,
      } = advancedSearchFilters;

      const productQuery: Record<string | symbol, unknown> = {};
      const variationQuery: Record<string, unknown> = {};

      if (searchText) {
        productQuery[Op.or] = [
          { name: { [Op.iLike]: `%${searchText}%` } },
          { model: { [Op.iLike]: `%${searchText}%` } },
          { description: { [Op.iLike]: `%${searchText}%` } },
          {
            brandId: {
              [Op.in]: await this.helpers.getBrandsById(searchText),
            },
          },
        ];
      }
      if (brand) productQuery.brandId = brand;

      if (ram) variationQuery.ram = ram;
      if (storageType) variationQuery['storage.type'] = storageType;
      if (storageSize) variationQuery['storage.size'] = storageSize;
      if (processorName) variationQuery['processor.name'] = processorName;
      if (processorGeneration) variationQuery['processor.generation'] = processorGeneration;
      if (graphicsCardType) variationQuery['graphicsCard.type'] = graphicsCardType;
      if (graphicsCardMemorySize) variationQuery['graphicsCard.memory'] = graphicsCardMemorySize;

      if (minPrice || maxPrice) {
        variationQuery.salePrice = {};
        if (minPrice) variationQuery.salePrice[Op.gte] = minPrice;
        if (maxPrice) variationQuery.salePrice[Op.lte] = maxPrice;
      }

      const sorting: [string, string][] = this.helpers.getSorting(sort, 'model');

      const { count: totalItems, rows: products } = await this.PRODUCT.findAndCountAll({
        where: productQuery,
        attributes: {
          include: [
            [
              Sequelize.literal(
                '(SELECT COUNT(*) FROM "product_variations" WHERE "product_variations"."productId" = "Product"."id")',
              ),
              'noOfVariants',
            ],
            [
              Sequelize.literal(
                'COALESCE((SELECT SUM("quantity") FROM "product_variations" WHERE "product_variations"."productId" = "Product"."id"), 0)',
              ),
              'totalQuantity',
            ],
          ],
        },
        include: [
          {
            model: ProductVariation,
            as: 'variations',
            where: variationQuery,
            attributes: [],
            required: false,
          },
          {
            model: Brand,
            as: 'brand',
            attributes: ['name'],
            required: false,
          },
        ],
        order: sorting,
        distinct: true,
        ...(!getAll && {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        }),
      });

      return {
        success: true,
        message: 'Advanced search products retrieved successfully',
        data: this.helpers.pagination(products, page, totalItems, itemsPerPage, getAll),
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async createProduct(productData: CreateProductDto): Promise<GeneralApiResponse> {
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

  async updateProduct(id: number, productData: UpdateProductDto): Promise<GeneralApiResponse> {
    try {
      const { name, model, description, brandId, images, screenSize } = productData;

      const findProduct: Product = await this.PRODUCT.findByPk(id);
      if (!findProduct) {
        throw new HttpException({ success: false, message: 'Product not found!' }, HttpStatus.NOT_FOUND);
      }

      const isProductExists: Product = await this.PRODUCT.findOne({
        where: {
          name,
          id: {
            [Op.ne]: id,
          },
        },
      });
      if (isProductExists) {
        throw new HttpException(
          { success: false, message: `Product with the name '${findProduct?.name}' already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      const findBrand: Brand = await this.BRAND.findByPk(brandId);
      if (!findBrand) {
        throw new HttpException({ success: false, message: 'Brand not found!' }, HttpStatus.NOT_FOUND);
      }

      const updatedImages: string[] = await this.cloudinary.handleImageUpdates(
        findProduct.images,
        images || findProduct.images,
      );

      await this.PRODUCT.update(
        { name, model, description, brandId, images: updatedImages, screenSize },
        { where: { id } },
      );

      return { success: true, message: 'Product updated successfully!' };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async createProductVariant(productId: number, productVariantData: ProductVariationDto): Promise<GeneralApiResponse> {
    try {
      const findProduct: Product = await this.PRODUCT.findByPk(productId);
      if (!findProduct) {
        throw new HttpException({ success: false, message: 'Product not found!' }, HttpStatus.NOT_FOUND);
      }

      const existingVariant: ProductVariation = await this.PRODUCT_VARIATION.findOne({
        where: {
          productId,
          storage: productVariantData.storage,
          ram: productVariantData.ram,
          processor: productVariantData.processor,
          graphicsCard: productVariantData.graphicsCard,
        },
      });

      if (existingVariant) {
        throw new HttpException(
          { success: false, message: 'Variant with the same values already exists for this product!' },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.PRODUCT_VARIATION.create({ productId, ...productVariantData });

      return {
        success: true,
        message: 'Product variant created successfully',
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async updateProductVariant(variantId: number, productVariantData: ProductVariationDto): Promise<GeneralApiResponse> {
    try {
      const findVariant: ProductVariation = await this.PRODUCT_VARIATION.findByPk(variantId);
      if (!findVariant) {
        throw new HttpException({ success: false, message: 'Product variant not found!' }, HttpStatus.NOT_FOUND);
      }
      const existingVariant: ProductVariation = await this.PRODUCT_VARIATION.findOne({
        where: {
          id: { [Op.ne]: variantId },
          productId: findVariant?.productId,
          storage: productVariantData.storage,
          ram: productVariantData.ram,
          processor: productVariantData.processor,
          graphicsCard: productVariantData.graphicsCard,
        },
      });

      if (existingVariant) {
        throw new HttpException(
          { success: false, message: 'Variant with the same values already exists for this product!' },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.PRODUCT_VARIATION.update(productVariantData, { where: { id: variantId } });

      return {
        success: true,
        message: 'Product variant updated successfully',
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async deleteProductVariant(id: number): Promise<GeneralApiResponse> {
    try {
      const findVariant: ProductVariation = await this.PRODUCT_VARIATION.findByPk(id);
      if (!findVariant) {
        throw new HttpException({ success: false, message: 'Product variant not found!' }, HttpStatus.NOT_FOUND);
      }

      await this.PRODUCT_VARIATION.destroy({ where: { id } });

      return {
        success: true,
        message: 'Product variant deleted successfully',
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async getProductVariations(id: number): Promise<GeneralApiResponse> {
    try {
      const findProduct: Product = await this.PRODUCT.findByPk(id);
      if (!findProduct) {
        throw new HttpException({ success: false, message: 'Product not found!' }, HttpStatus.NOT_FOUND);
      }

      const productVariations: ProductVariation[] = await this.PRODUCT_VARIATION.findAll({
        where: { productId: id },
        order: [['created_at', 'ASC']],
      });

      return {
        success: true,
        message: 'Product variations retrieved successfully',
        data: productVariations,
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async getProductFiltersOptions(): Promise<GeneralApiResponse> {
    try {
      const brands: Brand[] = await this.BRAND.findAll({ attributes: ['id', 'name'] });

      return {
        success: true,
        message: 'Product filters options retrieved successfully',
        data: {
          brandOptions: brands,
          screenSizes: ScreenSizes,
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

  async deleteProduct(id: number): Promise<GeneralApiResponse> {
    try {
      const findProduct: Product = await this.PRODUCT.findByPk(id);
      if (!findProduct) {
        throw new HttpException({ success: false, message: 'Product not found!' }, HttpStatus.NOT_FOUND);
      }

      const isproductAssociated: ProductVariation = await this.PRODUCT_VARIATION.findOne({ where: { productId: id } });

      if (isproductAssociated) {
        throw new HttpException(
          { success: false, message: 'Cannot delete product as it has associated product variants!' },
          HttpStatus.CONFLICT,
        );
      }

      await this.PRODUCT.destroy({ where: { id } });

      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }
}
