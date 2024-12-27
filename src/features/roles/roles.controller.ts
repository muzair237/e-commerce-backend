import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { QueryParamsValidationPipe } from 'src/utils/pipes/queryParams.pipe';
import { AfterQueryParamsInterface } from 'src/utils/interfaces';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('get-all-roles')
  async getAllRoles(@Query(QueryParamsValidationPipe) query: AfterQueryParamsInterface) {
    return await this.rolesService.getAllRoles(query);
  }

  @Post('create-role')
  async createRole(@Body() roleData: CreateRoleDto) {
    return await this.rolesService.createRole(roleData);
  }

  @Put('update-role/:id')
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() roleData: CreateRoleDto) {
    return await this.rolesService.updateRole(id, roleData);
  }

  @Delete('delete-role/:id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.deleteRole(id);
  }
}
