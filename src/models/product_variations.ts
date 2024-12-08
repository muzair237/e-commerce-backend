import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Product } from './product.entity';
import { RamSizes, ProcessorNames, ProcessorGenerations } from 'src/utils/enums';

@Table({
  tableName: 'product_variations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductVariation extends Model<ProductVariation> {
  @BelongsTo(() => Product)
  product: Product;

  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @Column({
    type: DataType.ENUM(...Object.values(RamSizes)),
    allowNull: false,
  })
  ram: RamSizes;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  processor: {
    name: ProcessorNames;
    generation: ProcessorGenerations;
  };

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;
}
