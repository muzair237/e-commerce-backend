import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Permission extends Model<Permission> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  route: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  can: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  parents: string[];
}
