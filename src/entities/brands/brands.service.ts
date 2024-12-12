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

  // Fetch all brands with pagination
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

      return this.helpers.pagination(brands, page, totalItems, itemsPerPage, getAll);
    } catch (err) {
      throw new HttpException(`Failed to fetch brands: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Create a new brand
  async createBrand(brand: CreateBrandDto, logo: Express.Multer.File) {
    try {
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
      throw new HttpException(`Failed to create brand: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
