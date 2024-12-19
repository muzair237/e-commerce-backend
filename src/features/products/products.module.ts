import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, AdminJwt, Brand, Permission, Product, ProductVariation, Role } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { AuthAdminMiddleware } from 'src/utils/middlewares/auth.admin.middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { CloudinaryService } from 'src/utils/uploadFiles';

@Module({
  imports: [
    NestjsFormDataModule,
    SequelizeModule.forFeature([Brand, Product, ProductVariation, Admin, AdminJwt, Role, Permission]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, Helpers, CloudinaryService],
})
export class ProductsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(ProductsController);
  }
}
