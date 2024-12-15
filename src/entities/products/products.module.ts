import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product, ProductVariation } from 'src/models';
import { Helpers } from 'src/utils/helpers';

@Module({
  imports: [SequelizeModule.forFeature([Product, ProductVariation])],
  controllers: [ProductsController],
  providers: [ProductsService, Helpers],
})
export class ProductsModule {}
