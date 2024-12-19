import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product, ProductVariation } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { Helpers } from 'src/utils/helpers';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { Op } from 'sequelize';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly PRODUCT: typeof Product,
    @InjectModel(ProductVariation) private readonly PRODUCT_VARIATION: typeof ProductVariation,
    private readonly configService: ConfigService,
    private readonly helpers: Helpers,
  ) {}

  async getAllProducts(queryParams: AfterQueryParamsInterface) {
    try {
      const { page = 1, itemsPerPage = 10, getAll, searchText, startDate, endDate, sort } = queryParams;

      const query: any = {};

      if (searchText) {
        query.name = {
          [Op.iLike]: `%${searchText}%`,
        };
      }

      if (startDate && endDate) {
        query.created_at = {
          [Op.gte]: new Date(startDate),
          [Op.lt]: new Date(endDate),
        };
      }
      const sorting: [string, string][] = this.helpers.getSorting(sort, 'name');

      const { count: totalItems, rows: products } = await this.PRODUCT.findAndCountAll({
        where: query,
        // include: [
        //   {
        //     model: ProductVariation,
        //     as: 'variations',
        //     required: false,
        //   },
        // ],
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
    try {
      const { product, variations } = productData;
      console.log('product: ', product);
      console.log('variations: ', variations);
      const findProduct = await this.PRODUCT.findOne({ where: { name: product?.name } });
      if (findProduct) {
        throw new HttpException(
          { success: false, message: `Product with the name ${findProduct?.name} already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      // const logoUrl = await this.cloudinary.uploadFile(logo);

      // await this.BRAND.create({
      //   ...brand,
      //   logo: logoUrl,
      // });

      return {
        success: true,
        message: 'Product created successfully!',
      };
    } catch (err) {
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
}
