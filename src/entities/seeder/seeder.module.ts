import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, Brand, Role, Admin } from 'src/models';
import { Helpers } from 'src/utils/helpers';

@Module({
  imports: [SequelizeModule.forFeature([Permission, Role, Admin, Brand])],
  controllers: [SeederController],
  providers: [SeederService, Helpers],
})
export class SeederModule {}
