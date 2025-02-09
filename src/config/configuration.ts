import { ConfigService } from '@nestjs/config';

interface EnvVariables {
  PORT: number;
  DATABASE_URI: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
  JWT_SECRET: string;
}

// eslint-disable-next-line @typescript-eslint/typedef
export const getEnvVariables = (configService: ConfigService): EnvVariables => {
  return {
    PORT: configService.get<number>('PORT') || 3000,

    // DATABASE
    DATABASE_URI: configService.get<string>('DATABASE_URI') || '',

    // ADMIN
    ADMIN_EMAIL: configService.get<string>('ADMIN_EMAIL') || '',
    ADMIN_PASSWORD: configService.get<string>('ADMIN_PASSWORD') || '',

    // CLOUDINARY
    CLOUD_NAME: configService.get<string>('CLOUD_NAME') || '',
    API_KEY: configService.get<string>('API_KEY') || '',
    API_SECRET: configService.get<string>('API_SECRET') || '',

    // JWT_SECRET
    JWT_SECRET: configService.get<string>('JWT_SECRET') || '',
  };
};
