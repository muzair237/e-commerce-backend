import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsArray()
  @IsNotEmpty()
  roles: number[];
}
