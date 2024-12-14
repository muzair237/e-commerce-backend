import { Column, Model, Table, DataType, BelongsToMany } from 'sequelize-typescript';
import { Role } from './index';
import { AdminRole } from './junctions/admin_role.model';

@Table({
  tableName: 'admins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Admin extends Model<Admin> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  password: string;
  @BelongsToMany(() => Role, () => AdminRole)
  roles: Role[];
}
