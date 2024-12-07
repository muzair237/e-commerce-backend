import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { getEnvVariables } from './configuration';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const { HOST_NAME, DATABASE_NAME, PASSWORD } = getEnvVariables(configService);

  return {
    type: 'postgres',
    host: HOST_NAME,
    port: 5432,
    username: 'postgres',
    password: PASSWORD,
    database: DATABASE_NAME,
    autoLoadEntities: true,
    synchronize: true,
  };
};
