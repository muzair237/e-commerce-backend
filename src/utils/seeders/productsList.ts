import {
  GraphicsCardMemorySizes,
  GraphicsCardTypes,
  ProcessorGenerations,
  ProcessorNames,
  RamSizes,
  StorageSizes,
  StorageTypes,
} from '../enums';

export const productsList = [
  {
    name: 'Dell XPS 13',
    model: 'XPS9300',
    description: 'The Dell XPS 13 is a high-performance laptop designed for productivity and portability.',
    brandId: 1,
    images: ['https://example.com/images/dell-xps-13-1.jpg', 'https://example.com/images/dell-xps-13-2.jpg'],
    screenSize: '11 inches',
    created_at: '2024-12-01T12:00:00Z',
    updated_at: '2024-12-10T12:00:00Z',
  },
  {
    name: 'MacBook Pro 16',
    model: 'MBP16-2023',
    description: 'Apple MacBook Pro 16 features the M2 Pro chip for unprecedented power and efficiency.',
    brandId: 2,
    images: ['https://example.com/images/macbook-pro-16-1.jpg', 'https://example.com/images/macbook-pro-16-2.jpg'],
    screenSize: '13 inches',
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-12-08T10:00:00Z',
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
    price: 1399.99,
  },
  {
    productId: 1,
    storage: {
      type: StorageTypes.SSD,
      size: StorageSizes.TB_1,
    },
    ram: RamSizes.RAM_16GB,
    processor: {
      name: ProcessorNames.INTEL_CORE_I9,
      generation: ProcessorGenerations.GEN_12,
    },
    graphicsCard: {
      isGraphicsCard: true,
      type: GraphicsCardTypes.QUADRO,
      memory: GraphicsCardMemorySizes.GB_16,
    },
    price: 1899.99,
  },
];
