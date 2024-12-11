import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { SeederModule } from './seeder/seeder.module';

const entitiesModules = [BrandsModule, ProductsModule, SeederModule];

@Module({
  imports: entitiesModules,
  exports: entitiesModules,
})
export class EntitiesModule {}
