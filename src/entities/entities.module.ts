import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';

const entitiesModules = [BrandsModule, ProductsModule];

@Module({
  imports: entitiesModules,
  exports: entitiesModules,
})
export class EntitiesModule {}
