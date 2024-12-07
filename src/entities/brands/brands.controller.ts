import { Controller, Get, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { CustomFileInterceptor } from 'src/utils/file.interceptor';
import { Express } from 'express';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async getAllBrands() {
    return this.brandsService.findAll();
  }

  @Post()
  @UseInterceptors(CustomFileInterceptor.imageUpload())
  async createBrand(@Body() brand: CreateBrandDto, @UploadedFile() logo: Express.Multer.File) {
    return this.brandsService.createBrand(brand, logo.buffer);
  }
}
