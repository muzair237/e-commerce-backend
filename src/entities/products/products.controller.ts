import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { CreateProductDto } from './dto/create-product.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('get-all-products')
  async getAllProducts(@Query(QueryParamsValidationPipe) query: AfterQueryParamsInterface) {
    return await this.productsService.getAllProducts(query);
  }

  @Post('create-product')
  @FormDataRequest()
  async createProduct(@Body() productData: CreateProductDto) {
    console.log('productData: ', productData);
  }

  @Get('get-product-variations/:id')
  async getProductVariations(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.getProductVariations(id);
  }
}
