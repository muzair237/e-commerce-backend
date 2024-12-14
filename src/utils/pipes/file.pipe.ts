import { Express } from 'express';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes?.includes(file?.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
    }

    const maxSize = 1 * 1024 * 1024;
    if (file?.size > maxSize) {
      throw new BadRequestException('File size exceeds the 2MB limit');
    }

    return file;
  }
}
