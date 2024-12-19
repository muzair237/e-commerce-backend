import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, AdminJwt, Permission, Product, ProductVariation, Role } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { AuthAdminMiddleware } from 'src/utils/middlewares/auth.admin.middleware';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    NestjsFormDataModule,
    SequelizeModule.forFeature([Product, ProductVariation, Admin, AdminJwt, Role, Permission]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, Helpers],
})
export class ProductsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(ProductsController);
  }
}
