import { IsString, IsNotEmpty } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsFile({ message: 'File is required.' })
  @MaxFileSize(1e6, { message: 'Maximum file size is 1 MB.' })
  @HasMimeType(['image/jpg', 'image/jpeg', 'image/png'])
  logo: MemoryStoredFile;
}
