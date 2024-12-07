import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';

@Injectable()
export class CustomFileInterceptor {
  static imageUpload() {
    return FileInterceptor('logo', {
      fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
        if (!/\/(jpg|jpeg|png)$/.exec(file.mimetype)) {
          return cb(new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1 * 1024 * 1024,
      },
    });
  }
}
