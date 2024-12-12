import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Admin } from './admin.model';

@Table({
  tableName: 'admin_jwts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class AdminJwt extends Model<AdminJwt> {
  @BelongsTo(() => Admin)
  admin: Admin;

  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Admin)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  admin_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  token: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  iat: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  exp: Date;
}
