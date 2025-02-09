import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { getEnvVariables } from './configuration';

// eslint-disable-next-line @typescript-eslint/typedef
export const databaseConfig = (configService: ConfigService): SequelizeModuleOptions => {
  const { DATABASE_URI }: { DATABASE_URI: string } = getEnvVariables(configService);

  return {
    uri: DATABASE_URI,
    autoLoadModels: true,
    logging: false,
    synchronize: true,
  };
};
