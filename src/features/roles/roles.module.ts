import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { AuthAdminMiddleware } from 'src/utils/middlewares/auth.admin.middleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin, AdminJwt, AdminRole, Brand, Permission, Role, RolePermission } from 'src/models';
import { Helpers } from 'src/utils/helpers';

@Module({
  imports: [SequelizeModule.forFeature([Admin, AdminJwt, Brand, Role, Permission, RolePermission, AdminRole])],
  controllers: [RolesController],
  providers: [RolesService, Helpers],
})
export class RolesModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthAdminMiddleware).forRoutes(RolesController);
  }
}
