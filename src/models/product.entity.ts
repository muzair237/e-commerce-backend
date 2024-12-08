import { Column, Model, Table, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ProductVariation } from './product_variations';
import { Brand } from './brand.entity';
import { ScreenSizes } from 'src/utils/enums';

@Table({
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Product extends Model<Product> {
  @HasMany(() => ProductVariation)
  variations: ProductVariation[];

  @BelongsTo(() => Brand)
  brand: Brand;

  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

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
    type: DataType.STRING,
    allowNull: false,
  })
  screenSize: {
    size: ScreenSizes;
  };
}
