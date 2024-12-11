import { Controller, Get, HttpException, HttpStatus, Res } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { Response } from 'express';
import { Sequelize } from 'sequelize-typescript';

@Controller('seeder')
export class SeederController {
  constructor(
    private readonly seederService: SeederService,
    private readonly sequelize: Sequelize,
  ) {}
  @Get('')
  async seedPRA(@Res() res: Response) {
    const transaction = await this.sequelize.transaction();

    try {
      await this.seederService.seedPermissionsAndRoles(transaction);
      await this.seederService.createFirstAdmin(transaction);

      await transaction.commit();

      return res.status(HttpStatus.CREATED).json({ message: 'Permissons, Roles and Admin seeded successfully' });
    } catch (err) {
      await transaction.rollback();
      throw new HttpException(`Seeding failed: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
