import { Injectable } from '@nestjs/common';
import { Brand } from 'src/models/brand.entity';
import { InjectModel } from '@nestjs/sequelize';
import { uploadFileToCloudinary } from 'src/utils/uploadFIle';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand) private readonly BRAND: typeof Brand,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Record<string, any>> {
    const brands = await this.BRAND.findAll();
    return { success: true, message: 'Brand retrieved successfully!', brands };
  }

  async createBrand(brand: any, logoBuffer: Buffer): Promise<Record<string, any>> {
    try {
      const logoUrl = await uploadFileToCloudinary(this.configService, logoBuffer);

      await this.BRAND.create({
        ...brand,
        logo: logoUrl,
      });

      return { success: true, message: 'Brand created successfully!' };
    } catch (error) {
      throw new Error(`Failed to create brand: ${error.message}`);
    }
  }
}
