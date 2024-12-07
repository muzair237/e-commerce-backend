import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { cloudinaryConfig } from '../config/cloudinary.config';

export const configureCloudinary = (configService: ConfigService) => {
  const config = cloudinaryConfig(configService);
  cloudinary.config(config);
};

export const uploadFileToCloudinary = async (configService: ConfigService, fileBuffer: Buffer): Promise<string> => {
  try {
    configureCloudinary(configService);

    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileBuffer.toString('base64')}`);
    return result.secure_url;
  } catch (error) {
    throw new Error(`Error in uploading image: ${error.message}`);
  }
};
