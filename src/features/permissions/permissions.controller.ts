import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { AfterQueryParamsInterface, GeneralApiResponse, GetAllApiResponse } from 'src/utils/interfaces';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('get-all-permissions')
  async getAllPermissions(
    @Query(QueryParamsValidationPipe) query: AfterQueryParamsInterface,
  ): Promise<GetAllApiResponse> {
    return await this.permissionsService.getAllPermissions(query);
  }

  @Post('create-permission')
  async createPermission(@Body() permissionData: CreatePermissionDto): Promise<GeneralApiResponse> {
    return await this.permissionsService.createPermission(permissionData);
  }

  @Get('get-unique-parents')
  async getUnqiueParents(): Promise<GeneralApiResponse> {
    return await this.permissionsService.getUnqiueParents();
  }

  @Put('update-permission/:id')
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() permissionData: CreatePermissionDto,
  ): Promise<GeneralApiResponse> {
    return await this.permissionsService.updatePermission(id, permissionData);
  }

  @Delete('delete-permission/:id')
  async deletePermission(@Param('id', ParseIntPipe) id: number): Promise<GeneralApiResponse> {
    return await this.permissionsService.deletePermission(id);
  }
}
