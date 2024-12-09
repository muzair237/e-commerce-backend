import { Controller, Get, Post, Body, UseInterceptors, Res } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestDecorator } from 'src/utils/decorators/requestDecorator';
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}
  @Get('get-all-brands')
  async(@RequestDecorator() req: Request, @Res() res: Response) {
    return this.brandsService.getAllBrands(req, res);
  }

  @Post('create-brand')
  @UseInterceptors(FileInterceptor('logo'))
  async createBrand(@RequestDecorator(CreateBrandDto) req: Request, @Res() res: Response) {
    return this.brandsService.createBrand(req, res);
  }
}
