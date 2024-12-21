import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsBoolean,
  IsObject,
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  RamSizes,
  ProcessorNames,
  ProcessorGenerations,
  StorageTypes,
  StorageSizes,
  GraphicsCardTypes,
  GraphicsCardMemorySizes,
} from 'src/utils/enums';
import { ProductDto } from './product.dto';

export class StorageDto {
  @IsEnum(StorageTypes)
  @IsNotEmpty()
  type: StorageTypes;

  @IsEnum(StorageSizes)
  @IsNotEmpty()
  size: StorageSizes;
}

export class ProcessorDto {
  @IsEnum(ProcessorNames)
  @IsNotEmpty()
  name: ProcessorNames;

  @IsEnum(ProcessorGenerations)
  @IsNotEmpty()
  generation: ProcessorGenerations;
}

export class GraphicsCardDto {
  @IsBoolean()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : Boolean(value)))
  isGraphicsCard: boolean;

  @ValidateIf(obj => obj.isGraphicsCard === true)
  @IsEnum(GraphicsCardTypes)
  @IsOptional()
  type?: GraphicsCardTypes;

  @ValidateIf(obj => obj.isGraphicsCard === true)
  @IsEnum(GraphicsCardMemorySizes)
  @IsOptional()
  memory?: GraphicsCardMemorySizes;
}

export class ProductVariationDto {
  @IsOptional()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StorageDto)
  storage: StorageDto;

  @IsEnum(RamSizes)
  @IsNotEmpty()
  ram: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProcessorDto)
  processor: ProcessorDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GraphicsCardDto)
  graphicsCard: GraphicsCardDto;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  price: number;
}

export class CreateProductDto {
  @IsObject()
  @IsNotEmpty()
  @Type(() => ProductDto)
  @ValidateNested()
  product: ProductDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariationDto)
  variations: ProductVariationDto[];
}
