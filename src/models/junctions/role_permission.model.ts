import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Permission, Role } from '../index';

@Table({ tableName: 'role_permissions', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class RolePermission extends Model<RolePermission> {
  @ForeignKey(() => Role)
  @Column
  roleId: number;

  @ForeignKey(() => Permission)
  @Column
  permissionId: number;
}
