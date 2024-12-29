import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, IsNumber, IsArray, Validate, ArrayMaxSize } from 'class-validator';
import { MemoryStoredFile } from 'nestjs-form-data';
import { ScreenSizes } from 'src/utils/enums';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  brandId: number;

  @IsEnum(ScreenSizes)
  @IsNotEmpty()
  screenSize: ScreenSizes;

  @IsArray()
  @Validate(
    (value: (MemoryStoredFile | string)[]) => {
      return value.every(item => {
        if (item instanceof MemoryStoredFile) {
          const mimeType: string = item.mimetype;
          return mimeType === 'image/jpeg' || mimeType === 'image/jpg' || mimeType === 'image/png';
        }
        return typeof item === 'string';
      });
    },
    { message: 'Each image must be a file with a valid mime type (jpg, jpeg, png) or a valid URL.' },
  )
  @ArrayMaxSize(4, { message: 'A maximum of 4 images are allowed.' })
  images: (MemoryStoredFile | string)[];
}
