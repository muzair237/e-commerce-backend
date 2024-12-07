import { ConfigService } from '@nestjs/config';

export const getEnvVariables = (
  configService: ConfigService,
): {
  PORT: number;

  DATABASE_URI: string;

  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
} => ({
  PORT: configService.get<number>('PORT'),

  // DATABASE
  DATABASE_URI: configService.get<string>('DATABASE_URI'),

  //CLOUDINARY
  CLOUD_NAME: configService.get<string>('CLOUD_NAME'),
  API_KEY: configService.get<string>('API_KEY'),
  API_SECRET: configService.get<string>('API_SECRET'),
});
