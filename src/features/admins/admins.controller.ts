import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { AfterQueryParamsInterface, GetAllApiResponse, CreateApiResponse } from 'src/utils/interfaces';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('get-all-admins')
  getAllAdmins(@Query(QueryParamsValidationPipe) query: AfterQueryParamsInterface): Promise<GetAllApiResponse> {
    return this.adminsService.getAllAdmins(query);
  }

  @Post('create-admin')
  createAdmin(@Body() adminData: CreateAdminDto): Promise<CreateApiResponse> {
    return this.adminsService.createAdmin(adminData);
  }

  @Patch('update-admin/:id')
  updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() adminData: UpdateAdminDto): Promise<CreateApiResponse> {
    return this.adminsService.updateAdmin(id, adminData);
  }

  @Patch('update-password/:id')
  updatePassword(@Param('id', ParseIntPipe) id: number, @Body() adminData: UpdateAdminDto): Promise<CreateApiResponse> {
    return this.adminsService.updatePassword(id, adminData);
  }

  @Delete('delete-admin/:id')
  deleteAdmin(@Param('id', ParseIntPipe) id: number): Promise<CreateApiResponse> {
    return this.adminsService.deleteAdmin(id);
  }
}
