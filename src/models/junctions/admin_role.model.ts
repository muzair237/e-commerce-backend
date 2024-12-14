import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Admin, Role } from '../index';

@Table({ tableName: 'admin_roles', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class AdminRole extends Model<AdminRole> {
  @ForeignKey(() => Admin)
  @Column
  adminId: number;

  @ForeignKey(() => Role)
  @Column
  roleId: number;
}
