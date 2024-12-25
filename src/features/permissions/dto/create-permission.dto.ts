import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  can: string;

  @IsString()
  @IsNotEmpty()
  route: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  parents: string[];
}
