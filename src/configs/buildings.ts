export enum BuildingType {
  WELL = 'well',
  FARMLAND = 'farmland',
  LIVESTOCK_PEN = 'livestock_pen',
  PROCESSING_WORKSHOP = 'processing_workshop',
  WAREHOUSE = 'warehouse',
  MARKET = 'market'
}

export interface BuildingLevelConfig {
  level: number;
  upgradeCost: {
    gold: number;
    wood: number;
    stone: number;
    crop?: number;
  };
  buff: {
    [key: string]: number; // 全局buff属性，如cropYield、waterSupply、storageCapacity等
  };
  description: string;
}

export interface BuildingConfig {
  id: BuildingType;
  name: string;
  icon: string;
  maxLevel: number;
  levels: BuildingLevelConfig[];
}

export const BUILDING_CONFIGS: Record<BuildingType, BuildingConfig> = {
  [BuildingType.WELL]: {
    id: BuildingType.WELL,
    name: '水井',
    icon: '💧',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        upgradeCost: { gold: 100, wood: 20, stone: 10 },
        buff: { waterSupply: 10, cropYield: 0.05 },
        description: '基础水井，提供少量水资源，作物产量小幅提升'
      },
      {
        level: 2,
        upgradeCost: { gold: 300, wood: 50, stone: 30 },
        buff: { waterSupply: 25, cropYield: 0.12 },
        description: '升级水井，水资源供应提升，作物产量中等提升'
      },
      {
        level: 3,
        upgradeCost: { gold: 800, wood: 100, stone: 70 },
        buff: { waterSupply: 50, cropYield: 0.2 },
        description: '高级水井，充足水资源供应，作物产量大幅提升'
      }
    ]
  },
  [BuildingType.FARMLAND]: {
    id: BuildingType.FARMLAND,
    name: '农田',
    icon: '🌾',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        upgradeCost: { gold: 150, wood: 30, stone: 15, crop: 10 },
        buff: { cropYield: 0.1, growthSpeed: 0.05 },
        description: '基础农田，作物产量小幅提升，生长速度小幅加快'
      },
      {
        level: 2,
        upgradeCost: { gold: 400, wood: 70, stone: 40, crop: 25 },
        buff: { cropYield: 0.22, growthSpeed: 0.12 },
        description: '升级农田，作物产量中等提升，生长速度中等加快'
      },
      {
        level: 3,
        upgradeCost: { gold: 1000, wood: 150, stone: 90, crop: 50 },
        buff: { cropYield: 0.35, growthSpeed: 0.2 },
        description: '高级农田，作物产量大幅提升，生长速度大幅加快'
      }
    ]
  },
  [BuildingType.LIVESTOCK_PEN]: {
    id: BuildingType.LIVESTOCK_PEN,
    name: '牲畜栏',
    icon: '🐄',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        upgradeCost: { gold: 200, wood: 40, stone: 20, crop: 20 },
        buff: { animalYield: 0.1, animalSpeed: 0.05 },
        description: '基础牲畜栏，动物产物产量小幅提升，生长速度小幅加快'
      },
      {
        level: 2,
        upgradeCost: { gold: 500, wood: 80, stone: 50, crop: 40 },
        buff: { animalYield: 0.2, animalSpeed: 0.1 },
        description: '升级牲畜栏，动物产物产量中等提升，生长速度中等加快'
      },
      {
        level: 3,
        upgradeCost: { gold: 1200, wood: 180, stone: 100, crop: 80 },
        buff: { animalYield: 0.3, animalSpeed: 0.18 },
        description: '高级牲畜栏，动物产物产量大幅提升，生长速度大幅加快'
      }
    ]
  },
  [BuildingType.PROCESSING_WORKSHOP]: {
    id: BuildingType.PROCESSING_WORKSHOP,
    name: '加工坊',
    icon: '⚙️',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        upgradeCost: { gold: 250, wood: 50, stone: 30, crop: 30 },
        buff: { processingEfficiency: 0.1, processedValue: 0.1 },
        description: '基础加工坊，加工效率小幅提升，加工产物价值小幅提升'
      },
      {
        level: 2,
        upgradeCost: { gold: 600, wood: 100, stone: 60, crop: 60 },
        buff: { processingEfficiency: 0.22, processedValue: 0.2 },
        description: '升级加工坊，加工效率中等提升，加工产物价值中等提升'
      },
      {
        level: 3,
        upgradeCost: { gold: 1500, wood: 200, stone: 120, crop: 100 },
        buff: { processingEfficiency: 0.35, processedValue: 0.3 },
        description: '高级加工坊，加工效率大幅提升，加工产物价值大幅提升'
      }
    ]
  },
  [BuildingType.WAREHOUSE]: {
    id: BuildingType.WAREHOUSE,
    name: '仓库',
    icon: '📦',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        upgradeCost: { gold: 180, wood: 35, stone: 25 },
        buff: { storageCapacity: 500, resourceTax: -0.03 },
        description: '基础仓库，提升存储容量，降低资源税费'
      },
      {
        level: 2,
        upgradeCost: { gold: 450, wood: 75, stone: 45 },
        buff: { storageCapacity: 1500, resourceTax: -0.08 },
        description: '升级仓库，大幅提升存储容量，大幅降低资源税费'
      },
      {
        level: 3,
        upgradeCost: { gold: 900, wood: 140, stone: 80 },
        buff: { storageCapacity: 3000, resourceTax: -0.15 },
        description: '高级仓库，海量存储容量，资源税费大幅减免'
      }
    ]
  },
  [BuildingType.MARKET]: {
    id: BuildingType.MARKET,
    name: '集市',
    icon: '🏪',
    maxLevel: 3,
    levels: [
      {
        level: 1,
        upgradeCost: { gold: 300, wood: 60, stone: 40, crop: 40 },
        buff: { sellPrice: 0.08, buyDiscount: 0.05 },
        description: '基础集市，出售价格小幅提升，购买价格小幅折扣'
      },
      {
        level: 2,
        upgradeCost: { gold: 700, wood: 120, stone: 70, crop: 70 },
        buff: { sellPrice: 0.18, buyDiscount: 0.12 },
        description: '升级集市，出售价格中等提升，购买价格中等折扣'
      },
      {
        level: 3,
        upgradeCost: { gold: 1800, wood: 220, stone: 130, crop: 120 },
        buff: { sellPrice: 0.3, buyDiscount: 0.2 },
        description: '高级集市，出售价格大幅提升，购买价格大幅折扣'
      }
    ]
  }
};

// 获取建筑指定等级的配置
export function getBuildingLevelConfig(type: BuildingType, level: number): BuildingLevelConfig | undefined {
  const config = BUILDING_CONFIGS[type];
  if (!config) return undefined;
  return config.levels.find(l => l.level === level);
}

// 获取建筑升级到下一级的消耗
export function getBuildingUpgradeCost(type: BuildingType, currentLevel: number): BuildingLevelConfig['upgradeCost'] | undefined {
  const nextLevel = currentLevel + 1;
  const config = getBuildingLevelConfig(type, nextLevel);
  return config?.upgradeCost;
}
