import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
