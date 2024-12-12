import { Column, Model, Table, DataType, ForeignKey } from 'sequelize-typescript';
import {
  RamSizes,
  ProcessorNames,
  ProcessorGenerations,
  StorageTypes,
  StorageSizes,
  GraphicsCardTypes,
  GraphicsCardMemorySizes,
} from 'src/utils/enums';
import { Product } from './product.model';

@Table({
  tableName: 'product_variations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductVariation extends Model<ProductVariation> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  storage: {
    type: StorageTypes;
    size: StorageSizes;
  };

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
    type: DataType.JSONB,
    allowNull: false,
  })
  graphicsCard: {
    isGraphicsCard: boolean;
    type: GraphicsCardTypes;
    memory: GraphicsCardMemorySizes;
  };

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;
}
