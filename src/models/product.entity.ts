import { Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Brand } from './brand.entity';
import { ScreenSizes } from 'src/utils/enums';
import { ProductVariation } from './product_variations';

@Table({
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Product extends Model<Product> {
  @BelongsTo(() => Brand)
  brand: Brand;

  @HasMany(() => ProductVariation)
  variations: ProductVariation[];

  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  brandId: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  images: string[];

  @Column({
    type: DataType.ENUM(...Object.values(ScreenSizes)),
    allowNull: false,
  })
  screenSize: ScreenSizes;
}
