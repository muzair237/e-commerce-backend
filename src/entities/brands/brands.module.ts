import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, AdminJwt, Brand, Permission, Role } from '../../models';
import { Helpers } from 'src/utils/helpers';
import { AuthAdminMiddleware } from 'src/utils/middlewares/auth.admin.middleware';

@Module({
  imports: [SequelizeModule.forFeature([Brand, Admin, AdminJwt, Role, Permission])],
  controllers: [BrandsController],
  providers: [BrandsService, Helpers],
})
export class BrandsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(BrandsController);
  }
}
