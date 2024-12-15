import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('get-all-products')
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }
}
