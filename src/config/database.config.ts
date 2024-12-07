import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { getEnvVariables } from './configuration';

export const databaseConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const { DATABASE_URI } = getEnvVariables(configService);

  return {
    uri: DATABASE_URI,
    autoLoadModels: true,
    logging: false,
    synchronize: true,
  };
};
