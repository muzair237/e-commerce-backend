import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { AfterQueryParamsInterface, GetAllApiResponse, GeneralApiResponse } from 'src/utils/interfaces';
import { CreateProductDto, ProductVariationDto } from './dto/create-product.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { ProductsAdvancedSearchDTO } from './dto/products-advanced-search.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('get-all-products')
  async getAllProducts(@Query(QueryParamsValidationPipe) query: AfterQueryParamsInterface): Promise<GetAllApiResponse> {
    return await this.productsService.getAllProducts(query);
  }

  @Post('advanced-product-search')
  @HttpCode(200)
  async advancedProductSearch(@Body() advancedSearchFilters: ProductsAdvancedSearchDTO): Promise<GetAllApiResponse> {
    return await this.productsService.advancedProductSearch(advancedSearchFilters);
  }

  @Post('create-product')
  @FormDataRequest()
  async createProduct(@Body() productData: CreateProductDto): Promise<GeneralApiResponse> {
    return await this.productsService.createProduct(productData);
  }

  @Put('update-product/:id')
  @FormDataRequest()
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: UpdateProductDto,
  ): Promise<GeneralApiResponse> {
    return await this.productsService.updateProduct(id, productData);
  }

  @Post('create-product-variant/:id')
  async createProductVariant(
    @Param('id', ParseIntPipe) productId: number,
    @Body() productVariantData: ProductVariationDto,
  ): Promise<GeneralApiResponse> {
    return await this.productsService.createProductVariant(productId, productVariantData);
  }

  @Put('update-product-variant/:id')
  async updateProductVariant(
    @Param('id', ParseIntPipe) variantId: number,
    @Body() productVariantData: ProductVariationDto,
  ): Promise<GeneralApiResponse> {
    return await this.productsService.updateProductVariant(variantId, productVariantData);
  }

  @Delete('delete-product-variant/:id')
  async deleteProductVariant(@Param('id', ParseIntPipe) id: number): Promise<GeneralApiResponse> {
    return await this.productsService.deleteProductVariant(id);
  }

  @Get('get-product-variants/:id')
  async getProductVariations(@Param('id', ParseIntPipe) id: number): Promise<GeneralApiResponse> {
    return await this.productsService.getProductVariations(id);
  }

  @Get('get-product-filter-options')
  async getProductFiltersOptions(): Promise<GeneralApiResponse> {
    return await this.productsService.getProductFiltersOptions();
  }

  @Delete('delete-product/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<GeneralApiResponse> {
    return await this.productsService.deleteProduct(id);
  }
}
