import { IsString, IsEnum, IsNumber, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import {
  GraphicsCardMemorySizes,
  GraphicsCardTypes,
  ProcessorGenerations,
  ProcessorNames,
  RamSizes,
  StorageSizes,
  StorageTypes,
  SortEnums,
} from 'src/utils/enums';

export class ProductsAdvancedSearchDTO {
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @IsNumber()
  @IsNotEmpty()
  itemsPerPage: number;

  @IsBoolean()
  @IsNotEmpty()
  getAll: boolean;

  @IsString()
  searchText: string;

  @IsNumber()
  @IsOptional()
  brand?: string;

  @IsEnum(RamSizes)
  @IsOptional()
  ram?: string;

  @IsEnum(StorageTypes)
  @IsOptional()
  storageType?: string;

  @IsEnum(StorageSizes)
  @IsOptional()
  storageSize?: string;

  @IsEnum(ProcessorNames)
  @IsOptional()
  processorName?: string;

  @IsEnum(ProcessorGenerations)
  @IsOptional()
  processorGeneration?: string;

  @IsEnum(GraphicsCardTypes)
  @IsOptional()
  graphicsCardType?: string;

  @IsEnum(GraphicsCardMemorySizes)
  @IsOptional()
  graphicsCardMemorySize?: string;

  @IsNumber()
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  maxPrice?: number;

  @IsEnum(SortEnums)
  @IsOptional()
  sort?: string;
}
