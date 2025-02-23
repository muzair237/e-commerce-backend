import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Brand, Product } from 'src/models';
import { CloudinaryService } from 'src/utils/uploadFiles';
import { Helpers } from 'src/utils/helpers';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand) private readonly BRAND: typeof Brand,
    @InjectModel(Product) private readonly PRODUCT: typeof Product,
    private readonly helpers: Helpers,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async getAllBrands(queryParams: AfterQueryParamsInterface) {
    const { page = 1, itemsPerPage = 10, getAll, searchText, startDate, endDate, sort } = queryParams;

    const query: any = {};

    if (searchText) {
      query.name = {
        [Op.iLike]: `%${searchText}%`,
      };
    }

    if (startDate && endDate) {
      query.created_at = {
        [Op.gte]: new Date(startDate),
        [Op.lt]: new Date(endDate),
      };
    }

    const sorting: [string, string][] = this.helpers.getSorting(sort, 'name');

    try {
      const { count: totalItems, rows: brands } = await this.BRAND.findAndCountAll({
        where: query,
        order: sorting,
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

  async createBrand(brand: CreateBrandDto) {
    try {
      const { name, logo } = brand;

      const findBrand = await this.BRAND.findOne({ where: { name } });
      if (findBrand) {
        throw new HttpException(
          { success: false, message: `Brand with the name ${name} already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      const logoUrl = await this.cloudinary.uploadSingleFile(logo);

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

  async updateBrand(id: number, brand: UpdateBrandDto) {
    try {
      const { logo } = brand;
      const findBrand = await this.BRAND.findByPk(id);
      if (!findBrand) {
        throw new HttpException({ success: false, message: 'Brand not found!' }, HttpStatus.NOT_FOUND);
      }

      const isBrandExists = await this.BRAND.findOne({
        where: {
          name: brand?.name,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (isBrandExists) {
        throw new HttpException(
          { success: false, message: `Brand with the name ${brand?.name} already exists!` },
          HttpStatus.CONFLICT,
        );
      }

      let logoUrl: string = findBrand.logo;

      if (logo) {
        await this.cloudinary.deleteImage(findBrand.logo);

        logoUrl = await this.cloudinary.uploadSingleFile(logo);
      }

      await findBrand.update({ ...brand, logo: logoUrl });

      return { success: true, message: 'Brand updated successfully' };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }

  async deleteBrand(id: number) {
    try {
      const findBrand: Brand = await this.BRAND.findByPk(id);
      if (!findBrand) {
        throw new HttpException({ success: false, message: 'Brand not found!' }, HttpStatus.NOT_FOUND);
      }

      const isProductAssociated: Product = await this.PRODUCT.findOne({ where: { brandId: id } });

      if (isProductAssociated) {
        throw new HttpException(
          { success: false, message: 'This brand is associated with a product. Clear it from the product first.' },
          HttpStatus.CONFLICT,
        );
      }

      await this.BRAND.destroy({ where: { id } });

      return { success: true, message: 'Brand deleted successfully' };
    } catch (err) {
      this.helpers.handleException(err);
    }
  }
}
