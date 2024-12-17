import { Express } from 'express';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly isRequired: boolean;

  constructor(isRequired: boolean = true) {
    this.isRequired = isRequired;
  }

  transform(file: Express.Multer.File) {
    if (!file && this.isRequired) {
      throw new BadRequestException('File is required.');
    }

    if (!file && !this.isRequired) {
      return file;
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes?.includes(file?.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and JPG are allowed.');
    }

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file?.size > maxSize) {
      throw new BadRequestException('File size exceeds the 1MB limit.');
    }

    return file;
  }
}
