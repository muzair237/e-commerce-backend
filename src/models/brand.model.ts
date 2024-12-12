import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'brands',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Brand extends Model<Brand> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo: string;
}
