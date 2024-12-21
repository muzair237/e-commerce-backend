import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { CreateProductDto, ProductVariationDto } from './dto/create-product.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { ProductsAdvancedSearchDTO } from './dto/products-advanced-search.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('get-all-products')
  async getAllProducts(@Query(QueryParamsValidationPipe) query: AfterQueryParamsInterface) {
    return await this.productsService.getAllProducts(query);
  }

  @Post('advanced-product-search')
  @HttpCode(200)
  async advancedProductSearch(@Body() advancedSearchFilters: ProductsAdvancedSearchDTO) {
    return await this.productsService.advancedProductSearch(advancedSearchFilters);
  }

  @Post('create-product')
  @FormDataRequest()
  async createProduct(@Body() productData: CreateProductDto) {
    return await this.productsService.createProduct(productData);
  }

  @Post('create-product-variant/:id')
  async createProductVariant(
    @Param('id', ParseIntPipe) productId: number,
    @Body() productVariantData: ProductVariationDto,
  ) {
    return await this.productsService.createProductVariant(productId, productVariantData);
  }

  @Put('update-product-variant/:id')
  async updateProductVariant(
    @Param('id', ParseIntPipe) variantId: number,
    @Body() productVariantData: ProductVariationDto,
  ) {
    return await this.productsService.updateProductVariant(variantId, productVariantData);
  }

  @Get('get-product-variants/:id')
  async getProductVariations(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.getProductVariations(id);
  }

  @Get('get-product-filter-options')
  async getProductFiltersOptions() {
    return await this.productsService.getProductFiltersOptions();
  }
}
