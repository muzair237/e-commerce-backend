import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, AdminJwt, Brand, Permission, Product, Role } from '../../models';
import { Helpers } from 'src/utils/helpers';
import { AuthAdminMiddleware } from 'src/utils/middlewares/auth.admin.middleware';
import { CloudinaryService } from 'src/utils/uploadFiles';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [NestjsFormDataModule, SequelizeModule.forFeature([Brand, Product, Admin, AdminJwt, Role, Permission])],
  controllers: [BrandsController],
  providers: [BrandsService, Helpers, CloudinaryService],
})
export class BrandsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(BrandsController);
  }
}
