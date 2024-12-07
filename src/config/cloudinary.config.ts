import { ConfigService } from '@nestjs/config';
import { getEnvVariables } from './configuration';

export const cloudinaryConfig = (
  configService: ConfigService,
): {
  cloud_name: string;
  api_key: string;
  api_secret: string;
} => {
  const { CLOUD_NAME, API_KEY, API_SECRET } = getEnvVariables(configService);

  return {
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  };
};
