import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { SeederModule } from './seeder/seeder.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { AdminsModule } from './admins/admins.module';

const featuresModules = [
  AuthModule,
  BrandsModule,
  ProductsModule,
  SeederModule,
  PermissionsModule,
  RolesModule,
  AdminsModule,
];

@Module({
  imports: featuresModules,
  exports: featuresModules,
})
export class FeaturesModule {}
