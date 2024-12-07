import { Injectable } from '@nestjs/common';
import { Brand } from 'src/models/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uploadFileToCloudinary } from 'src/utils/uploadFIle';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    private readonly configService: ConfigService,
  ) {}

  findAll() {
    return this.brandRepository.find();
  }

  async createBrand(brand: any, logoBuffer: Buffer): Promise<Record<string, any>> {
    try {
      const logoUrl = await uploadFileToCloudinary(this.configService, logoBuffer);

      const newBrand = this.brandRepository.create({
        ...brand,
        logo: logoUrl,
      });

      await this.brandRepository.save(newBrand);

      return { success: true, message: 'Brand created successfully!' };
    } catch {
      throw new Error('Failed to create brand');
    }
  }
}
