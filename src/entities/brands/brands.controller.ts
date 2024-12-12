import { Controller, Get, Post, UseInterceptors, Body, Query, UploadedFile, UsePipes } from '@nestjs/common';
import { Express } from 'express';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryParamsInterface } from 'src/utils/interfaces';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { FileValidationPipe } from 'src/utils/pipes/file.pipe';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get('get-all-brands')
  async getAllBrands(@Query(QueryParamsValidationPipe) query: QueryParamsInterface) {
    return await this.brandsService.getAllBrands(query);
  }

  // Create a new brand with file validation
  @Post('create-brand')
  @UseInterceptors(FileInterceptor('logo'))
  @UsePipes(FileValidationPipe)
  async createBrand(@Body() brand: CreateBrandDto, @UploadedFile() logo: Express.Multer.File) {
    return await this.brandsService.createBrand(brand, logo);
  }
}
