import {
  Injectable,
  PipeTransform,
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const parseFilePipe = new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png)/ }),
      ],
    });

    return parseFilePipe.transform(file);
  }
}
