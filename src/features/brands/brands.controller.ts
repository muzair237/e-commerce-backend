import { Controller, Get, Post, Body, Query, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { FormDataRequest } from 'nestjs-form-data';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get('get-all-brands')
  async getAllBrands(@Query(QueryParamsValidationPipe) query: AfterQueryParamsInterface) {
    return await this.brandsService.getAllBrands(query);
  }

  @Post('create-brand')
  @FormDataRequest()
  async createBrand(@Body() brand: CreateBrandDto) {
    return await this.brandsService.createBrand(brand);
  }

  @Put('update-brand/:id')
  @FormDataRequest()
  async updateBrand(@Param('id', ParseIntPipe) id: number, @Body() brand: UpdateBrandDto) {
    return await this.brandsService.updateBrand(id, brand);
  }

  @Delete('delete-brand/:id')
  async deleteBrand(@Param('id', ParseIntPipe) id: number) {
    return await this.brandsService.deleteBrand(id);
  }
}
