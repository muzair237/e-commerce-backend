import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsBoolean,
  IsObject,
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

class StorageDto {
  @IsEnum(StorageTypes)
  @IsNotEmpty()
  type: StorageTypes;

  @IsEnum(StorageSizes)
  @IsNotEmpty()
  size: StorageSizes;
}

class ProcessorDto {
  @IsEnum(ProcessorNames)
  @IsNotEmpty()
  name: ProcessorNames;

  @IsEnum(ProcessorGenerations)
  @IsNotEmpty()
  generation: ProcessorGenerations;
}

class GraphicsCardDto {
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : Boolean(value)))
  isGraphicsCard: boolean;

  @IsEnum(GraphicsCardTypes)
  @IsOptional()
  type?: GraphicsCardTypes;

  @IsEnum(GraphicsCardMemorySizes)
  @IsOptional()
  memory?: GraphicsCardMemorySizes;
}

class ProductVariationDto {
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
