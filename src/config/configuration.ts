import { ConfigService } from '@nestjs/config';

export const getEnvVariables = (
  configService: ConfigService,
): {
  PORT: number;

  DATABASE_URI: string;

  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;

  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
} => ({
  PORT: configService.get<number>('PORT'),

  // DATABASE
  DATABASE_URI: configService.get<string>('DATABASE_URI'),

  // ADMIN
  ADMIN_EMAIL: configService.get<string>('ADMIN_EMAIL'),
  ADMIN_PASSWORD: configService.get<string>('ADMIN_PASSWORD'),

  //CLOUDINARY
  CLOUD_NAME: configService.get<string>('CLOUD_NAME'),
  API_KEY: configService.get<string>('API_KEY'),
  API_SECRET: configService.get<string>('API_SECRET'),
});
