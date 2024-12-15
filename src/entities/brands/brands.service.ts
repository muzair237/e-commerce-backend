import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand } from 'src/models';
import { uploadFileToCloudinary } from 'src/utils/uploadFIle';
import { ConfigService } from '@nestjs/config';
import { Helpers } from 'src/utils/helpers';
import { CreateBrandDto } from './dto/create-brand.dto';
import { QueryParamsInterface } from 'src/utils/interfaces';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand) private readonly BRAND: typeof Brand,
    private readonly configService: ConfigService,
    private readonly helpers: Helpers,
  ) {}

  async getAllBrands(query: QueryParamsInterface) {
    const { page = 1, itemsPerPage = 10, getAll } = query;

    try {
      const { count: totalItems, rows: brands } = await this.BRAND.findAndCountAll({
        ...(!getAll && {
          offset: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        }),
        raw: true,
      });

      return {
        success: true,
        message: 'Brands retrieved successfully',
        data: { ...this.helpers.pagination(brands, page, totalItems, itemsPerPage, getAll) },
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async createBrand(brand: CreateBrandDto, logo: Express.Multer.File) {
    try {
      const findBrand = await this.BRAND.findOne({ where: { name: brand?.name } });
      if (findBrand) {
        throw new HttpException(
          { success: false, message: `Brand with the name ${brand?.name} already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      const logoUrl = await uploadFileToCloudinary(this.configService, logo);

      await this.BRAND.create({
        ...brand,
        logo: logoUrl,
      });

      return {
        success: true,
        message: 'Brand created successfully!',
      };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }
}
