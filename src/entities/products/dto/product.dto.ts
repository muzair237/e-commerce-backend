import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, IsNumber, ArrayMaxSize } from 'class-validator';
import { MemoryStoredFile, HasMimeType, IsFiles, MaxFileSize } from 'nestjs-form-data';
import { ScreenSizes } from 'src/utils/enums';

export class ProductDto {
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

  @IsFiles({ message: 'At least one file is required.' })
  @MaxFileSize(1e6, { message: 'Maximum file size is 1 MB.', each: true })
  @HasMimeType(['image/jpg', 'image/jpeg', 'image/png'], { each: true })
  @ArrayMaxSize(4, { message: 'A maximum of 4 images is allowed.' })
  images: MemoryStoredFile[];
}
