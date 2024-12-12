import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}
  @Get('')
  @HttpCode(HttpStatus.CREATED)
  async seedPRA() {
    return await this.seederService.seedRPA();
  }
}
