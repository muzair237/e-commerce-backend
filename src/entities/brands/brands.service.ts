import { HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Brand } from 'src/models/brand.entity';
import { InjectModel } from '@nestjs/sequelize';
import { uploadFileToCloudinary } from 'src/utils/uploadFIle';
import { ConfigService } from '@nestjs/config';
import { pagination } from 'src/utils/helpers';
import { CreateBrandDto } from './dto/create-brand.dto';
import { QueryParamsInterface } from 'src/utils/interfaces';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand) private readonly BRAND: typeof Brand,
    private readonly configService: ConfigService,
  ) {}

  async getAllBrands(req: Request, res: Response) {
    const { page, itemsPerPage, getAll } = req.query as unknown as QueryParamsInterface;
    const { count: totalItems, rows: brands } = await this.BRAND.findAndCountAll({
      ...(!getAll && {
        offset: (page - 1) * itemsPerPage,
        limit: itemsPerPage,
      }),
      raw: true,
    });

    const record = pagination(brands, page, totalItems, itemsPerPage, getAll);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Brands retrieved successfully!',
      data: record,
    });
  }

  async createBrand(req: Request, res: Response) {
    const brand: CreateBrandDto = req.body;
    const logo = req.file;

    const logoUrl = await uploadFileToCloudinary(this.configService, logo);

    await this.BRAND.create({
      ...brand,
      logo: logoUrl,
    });

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Brand created successfully!',
    });
  }
}
