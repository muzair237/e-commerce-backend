import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}
  @Post('seed-pra')
  async seedPRA() {
    return await this.seederService.seedRPA();
  }

  @Post('seed-bpv')
  async seedBPV() {
    return await this.seederService.seedBPV();
  }
}
