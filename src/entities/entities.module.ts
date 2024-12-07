import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';

const entitiesModules = [BrandsModule];

@Module({
  imports: entitiesModules,
  exports: entitiesModules,
})
export class EntitiesModule {}
