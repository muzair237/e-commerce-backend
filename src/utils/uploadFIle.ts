import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';
import { cloudinaryConfig } from '../config/cloudinary.config';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    const config = cloudinaryConfig(this.configService);
    cloudinary.config(config);
  }

  /**
   * Upload file to Cloudinary
   * @param file - The file object from Multer
   * @returns Secure URL of uploaded image
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${file.buffer.toString('base64')}`);
      return result.secure_url;
    } catch (error) {
      throw new HttpException(`Error in uploading image: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Delete an image from Cloudinary using its public ID
   * @param publicId - The public ID of the image
   */
  async deleteImage(url: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(url);
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        throw new Error(`Failed to delete image with public ID: ${publicId}`);
      }
    } catch (error) {
      throw new HttpException(`Error in deleting image: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param url - Full Cloudinary URL of the image
   * @returns Public ID of the image
   */
  extractPublicId(url: string): string | null {
    try {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      return filename.split('.')[0];
    } catch {
      return null;
    }
  }
}
