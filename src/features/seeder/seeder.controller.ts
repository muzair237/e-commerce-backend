import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { GeneralApiResponse } from 'src/utils/interfaces';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}
  @Post('seed-pra')
  async seedPRA(): Promise<GeneralApiResponse> {
    return await this.seederService.seedRPA();
  }

  @Post('seed-bpv')
  async seedBPV(): Promise<GeneralApiResponse> {
    return await this.seederService.seedBPV();
  }
}
