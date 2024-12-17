import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Body,
  Query,
  UploadedFile,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Express } from 'express';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { FileValidationPipe } from 'src/utils/pipes/file.pipe';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get('get-all-brands')
  async getAllBrands(@Query(QueryParamsValidationPipe) query: AfterQueryParamsInterface) {
    return await this.brandsService.getAllBrands(query);
  }

  @Post('create-brand')
  @UseInterceptors(FileInterceptor('logo'))
  async createBrand(
    @Body() brand: CreateBrandDto,
    @UploadedFile(new FileValidationPipe(true)) logo: Express.Multer.File,
  ) {
    return await this.brandsService.createBrand(brand, logo);
  }

  @Put('update-brand/:id')
  @UseInterceptors(FileInterceptor('logo'))
  async updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() brand: CreateBrandDto,
    @UploadedFile(new FileValidationPipe(false)) logo: Express.Multer.File,
  ) {
    return await this.brandsService.updateBrand(id, brand, logo);
  }
}
