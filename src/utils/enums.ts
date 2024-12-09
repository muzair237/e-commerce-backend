export enum ScreenSizes {
  INCH_11 = '11 inches',
  INCH_12 = '12 inches',
  INCH_13 = '13 inches',
  INCH_14 = '14 inches',
  INCH_15 = '15 inches',
  INCH_16 = '16 inches',
  INCH_17 = '17 inches',
}

export enum StorageTypes {
  HDD = 'HDD',
  SSD = 'SSD',
}

export enum StorageSizes {
  GB_128 = '128GB',
  GB_256 = '256GB',
  GB_512 = '512GB',
  TB_1 = '1TB',
  TB_2 = '2TB',
  TB_4 = '4TB',
}

export enum RamSizes {
  RAM_4GB = '4GB',
  RAM_8GB = '8GB',
  RAM_16GB = '16GB',
  RAM_32GB = '32GB',
  RAM_64GB = '64GB',
}

export enum ProcessorNames {
  // Intel Processor Names
  INTEL_CORE_I3 = 'Intel Core i3',
  INTEL_CORE_I5 = 'Intel Core i5',
  INTEL_CORE_I7 = 'Intel Core i7',
  INTEL_CORE_I9 = 'Intel Core i9',
  INTEL_PENTIUM = 'Intel Pentium',
  INTEL_CELERON = 'Intel Celeron',
  INTEL_XEON = 'Intel Xeon',

  // AMD Processor Names
  AMD_RYZEN_3 = 'AMD Ryzen 3',
  AMD_RYZEN_5 = 'AMD Ryzen 5',
  AMD_RYZEN_7 = 'AMD Ryzen 7',
  AMD_RYZEN_9 = 'AMD Ryzen 9',
  AMD_ATLON = 'AMD Athlon',
  AMD_EPYC = 'AMD EPYC',

  // Apple Silicon (M1, M2)
  APPLE_M1 = 'Apple M1',
  APPLE_M1_PRO = 'Apple M1 Pro',
  APPLE_M1_MAX = 'Apple M1 Max',
  APPLE_M2 = 'Apple M2',
  APPLE_M2_PRO = 'Apple M2 Pro',
  APPLE_M2_MAX = 'Apple M2 Max',
}

export enum ProcessorGenerations {
  GEN_5 = '5th Gen',
  GEN_6 = '6th Gen',
  GEN_7 = '7th Gen',
  GEN_8 = '8th Gen',
  GEN_9 = '9th Gen',
  GEN_10 = '10th Gen',
  GEN_11 = '11th Gen',
  GEN_12 = '12th Gen',
  GEN_13 = '13th Gen',
  GEN_14 = '14th Gen',
  // No generations for Apple M1/M2
  APPLE_M1_M2 = 'Apple M1/M2 Series',
}

export enum GraphicsCardTypes {
  RTX = 'RTX',
  GTX = 'GTX',
  QUADRO = 'Quadro',
  RADEON = 'Radeon',
}

export enum GraphicsCardMemorySizes {
  GB_1 = '1GB',
  GB_2 = '2GB',
  GB_4 = '4GB',
  GB_8 = '8GB',
  GB_12 = '12GB',
  GB_16 = '16GB',
}
