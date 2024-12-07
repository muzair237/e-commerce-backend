import { ConfigService } from '@nestjs/config';

export const getEnvVariables = (
  configService: ConfigService,
): {
  PORT: number;

  HOST_NAME: string;
  DATABASE_NAME: string;
  PASSWORD: string;

  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
} => ({
  PORT: configService.get<number>('PORT'),

  // DATABASE
  HOST_NAME: configService.get<string>('HOST_NAME'),
  DATABASE_NAME: configService.get<string>('DATABASE_NAME'),
  PASSWORD: configService.get<string>('PASSWORD'),

  //CLOUDINARY
  CLOUD_NAME: configService.get<string>('CLOUD_NAME'),
  API_KEY: configService.get<string>('API_KEY'),
  API_SECRET: configService.get<string>('API_SECRET'),
});
