import {
  GraphicsCardMemorySizes,
  GraphicsCardTypes,
  ProcessorGenerations,
  ProcessorNames,
  RamSizes,
  StorageSizes,
  StorageTypes,
  ScreenSizes,
} from '../enums';

export const productsList: {
  name: string;
  model: string;
  description: string;
  brandId: number;
  images: string[];
  screenSize: ScreenSizes;
}[] = [
  {
    name: 'Dell XPS 13',
    model: 'XPS9300',
    description: 'The Dell XPS 13 is a high-performance laptop designed for productivity and portability.',
    brandId: 1,
    images: ['https://example.com/images/dell-xps-13-1.jpg', 'https://example.com/images/dell-xps-13-2.jpg'],
    screenSize: ScreenSizes.INCH_12,
  },
  {
    name: 'MacBook Pro 16',
    model: 'MBP16-2023',
    description: 'Apple MacBook Pro 16 features the M2 Pro chip for unprecedented power and efficiency.',
    brandId: 2,
    images: ['https://example.com/images/macbook-pro-16-1.jpg', 'https://example.com/images/macbook-pro-16-2.jpg'],
    screenSize: ScreenSizes.INCH_13,
  },
  {
    name: 'HP Spectre x360',
    model: 'SpectreX360',
    description: 'The HP Spectre x360 combines sleek design with powerful performance in a convertible laptop.',
    brandId: 3,
    images: ['https://example.com/images/hp-spectre-x360-1.jpg', 'https://example.com/images/hp-spectre-x360-2.jpg'],
    screenSize: ScreenSizes.INCH_12,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    model: 'X1C10',
    description: 'Lenovo ThinkPad X1 Carbon is a premium business laptop with exceptional build quality.',
    brandId: 4,
    images: ['https://example.com/images/lenovo-x1-carbon-1.jpg', 'https://example.com/images/lenovo-x1-carbon-2.jpg'],
    screenSize: ScreenSizes.INCH_15,
  },
  {
    name: 'Asus ROG Zephyrus G14',
    model: 'G14-2024',
    description: 'The Asus ROG Zephyrus G14 is a gaming powerhouse with portability and excellent performance.',
    brandId: 5,
    images: ['https://example.com/images/asus-g14-1.jpg', 'https://example.com/images/asus-g14-2.jpg'],
    screenSize: ScreenSizes.INCH_11,
  },
  {
    name: 'Acer Predator Helios 300',
    model: 'PH315-54',
    description: 'Acer Predator Helios 300 delivers a smooth gaming experience with its robust GPU.',
    brandId: 6,
    images: ['https://example.com/images/acer-predator-1.jpg', 'https://example.com/images/acer-predator-2.jpg'],
    screenSize: ScreenSizes.INCH_13,
  },
  {
    name: 'Microsoft Surface Laptop 5',
    model: 'SL5-2024',
    description: 'Microsoft Surface Laptop 5 combines elegance and efficiency for all-day productivity.',
    brandId: 7,
    images: ['https://example.com/images/surface-laptop-5-1.jpg', 'https://example.com/images/surface-laptop-5-2.jpg'],
    screenSize: ScreenSizes.INCH_11,
  },
];

export const productVariationsList = [
  {
    productId: 1,
    storage: {
      type: StorageTypes.SSD,
      size: StorageSizes.GB_128,
    },
    ram: RamSizes.RAM_8GB,
    processor: {
      name: ProcessorNames.INTEL_CORE_I7,
      generation: ProcessorGenerations.GEN_9,
    },
    graphicsCard: {
      isGraphicsCard: true,
      type: GraphicsCardTypes.RTX,
      memory: GraphicsCardMemorySizes.GB_4,
    },
    quantity: 30,
    costPrice: 1299.99,
    salePrice: 1599.99,
  },
  {
    productId: 2,
    storage: {
      type: StorageTypes.SSD,
      size: StorageSizes.GB_512,
    },
    ram: RamSizes.RAM_16GB,
    processor: {
      name: ProcessorNames.APPLE_M2,
      generation: ProcessorGenerations.GEN_5,
    },
    graphicsCard: {
      isGraphicsCard: false,
    },
    quantity: 10,
    costPrice: 1599.99,
    salePrice: 1899.99,
  },
  {
    productId: 5,
    storage: {
      type: StorageTypes.SSD,
      size: StorageSizes.TB_1,
    },
    ram: RamSizes.RAM_32GB,
    processor: {
      name: ProcessorNames.AMD_RYZEN_9,
      generation: ProcessorGenerations.GEN_5,
    },
    graphicsCard: {
      isGraphicsCard: true,
      type: GraphicsCardTypes.RTX,
      memory: GraphicsCardMemorySizes.GB_8,
    },
    quantity: 60,
    costPrice: 799.99,
    salePrice: 899.99,
  },
  {
    productId: 6,
    storage: {
      type: StorageTypes.SSD,
      size: StorageSizes.TB_2,
    },
    ram: RamSizes.RAM_32GB,
    processor: {
      name: ProcessorNames.INTEL_CORE_I9,
      generation: ProcessorGenerations.GEN_12,
    },
    graphicsCard: {
      isGraphicsCard: true,
      type: GraphicsCardTypes.RTX,
      memory: GraphicsCardMemorySizes.GB_16,
    },
    quantity: 30,
    costPrice: 899.99,
    salePrice: 1099.99,
  },
  {
    productId: 7,
    storage: {
      type: StorageTypes.SSD,
      size: StorageSizes.GB_256,
    },
    ram: RamSizes.RAM_8GB,
    processor: {
      name: ProcessorNames.INTEL_CORE_I5,
      generation: ProcessorGenerations.GEN_11,
    },
    graphicsCard: {
      isGraphicsCard: false,
    },
    quantity: 60,
    costPrice: 499.99,
    salePrice: 699.99,
  },
];
