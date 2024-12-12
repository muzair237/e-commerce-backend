import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Brand } from '../../models';
import { Helpers } from 'src/utils/helpers';

@Module({
  imports: [SequelizeModule.forFeature([Brand])],
  controllers: [BrandsController],
  providers: [BrandsService, Helpers],
})
export class BrandsModule {}
