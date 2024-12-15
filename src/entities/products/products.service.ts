import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product, ProductVariation } from 'src/models';
import { ConfigService } from '@nestjs/config';
import { Helpers } from 'src/utils/helpers';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private readonly PRODUCT: typeof Product,
    @InjectModel(ProductVariation) private readonly PRODUCT_VARIATION: typeof ProductVariation,
    private readonly configService: ConfigService,
    private readonly helpers: Helpers,
  ) {}

  async getAllProducts() {
    try {
      const productWithVariations = await this.PRODUCT.findOne({
        where: {
          id: 1,
        },
        include: [
          {
            model: ProductVariation,
            as: 'variations',
            required: false,
          },
        ],
      });

      //   return this.helpers.pagination(brands, page, totalItems, itemsPerPage, getAll);
      return productWithVariations;
    } catch (err) {
      this.helpers.handleException(err);
    }
  }
}
