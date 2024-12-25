import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, AdminJwt, Brand, Permission, Role, RolePermission } from 'src/models';
import { Helpers } from 'src/utils/helpers';
import { AuthAdminMiddleware } from 'src/utils/middlewares/auth.admin.middleware';

@Module({
  imports: [SequelizeModule.forFeature([Admin, AdminJwt, Role, Brand, Permission, RolePermission])],

  controllers: [PermissionsController],
  providers: [PermissionsService, Helpers],
})
export class PermissionsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes(PermissionsController);
  }
}
