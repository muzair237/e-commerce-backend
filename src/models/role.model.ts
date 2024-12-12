import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Role extends Model<Role> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.INTEGER),
    allowNull: false,
  })
  permissions: number[];
}
