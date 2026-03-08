export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect: (gameState: any, isFirstAdd: boolean) => void;
  stackable: boolean;
  maxStack: number;
}

export const ALL_RELICS: Relic[] = [
  {
    id: 'rel_001',
    name: '肥沃之土',
    description: '所有作物生长速度提升10%，可叠加。',
    rarity: 'common',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.cropGrowthMultiplier = (state.cropGrowthMultiplier || 1) * 1.1;
      else state.cropGrowthMultiplier *= 1.1;
    },
    stackable: true,
    maxStack: 5
  },
  {
    id: 'rel_002',
    name: '黄金锄头',
    description: '耕作时额外获得10%的金币，可叠加。',
    rarity: 'common',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.farmingGoldBonus = (state.farmingGoldBonus || 0) + 0.1;
      else state.farmingGoldBonus += 0.1;
    },
    stackable: true,
    maxStack: 3
  },
  {
    id: 'rel_003',
    name: '永不干涸的水壶',
    description: '所有作物无需浇水，不可叠加。',
    rarity: 'rare',
    effect: (state) => {
      state.waterNeedMultiplier = 0;
    },
    stackable: false,
    maxStack: 1
  },
  {
    id: 'rel_004',
    name: '丰收号角',
    description: '作物收获时产量提升20%，可叠加。',
    rarity: 'common',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.harvestYieldMultiplier = (state.harvestYieldMultiplier || 1) * 1.2;
      else state.harvestYieldMultiplier *= 1.2;
    },
    stackable: true,
    maxStack: 3
  },
  {
    id: 'rel_005',
    name: '太阳护符',
    description: '干旱天气对作物无影响，不可叠加。',
    rarity: 'rare',
    effect: (state) => {
      state.droughtImmunity = true;
    },
    stackable: false,
    maxStack: 1
  },
  {
    id: 'rel_006',
    name: '蜜蜂徽章',
    description: '所有开花作物产量提升30%，可叠加。',
    rarity: 'rare',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.flowerCropBonus = (state.flowerCropBonus || 0) + 0.3;
      else state.flowerCropBonus += 0.3;
    },
    stackable: true,
    maxStack: 2
  },
  {
    id: 'rel_007',
    name: '聚宝盆',
    description: '每回合额外获得10金币，可叠加。',
    rarity: 'common',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.passiveGoldPerTurn = (state.passiveGoldPerTurn || 0) + 10;
      else state.passiveGoldPerTurn += 10;
    },
    stackable: true,
    maxStack: 10
  },
  {
    id: 'rel_008',
    name: '牲畜铃铛',
    description: '所有动物产品产量提升25%，可叠加。',
    rarity: 'common',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.animalProductMultiplier = (state.animalProductMultiplier || 1) * 1.25;
      else state.animalProductMultiplier *= 1.25;
    },
    stackable: true,
    maxStack: 4
  },
  {
    id: 'rel_009',
    name: '免罪金牌',
    description: '免疫一次负面事件效果，使用后消失，不可叠加。',
    rarity: 'epic',
    effect: (state) => {
      state.negativeEventImmunity = 1;
    },
    stackable: false,
    maxStack: 1
  },
  {
    id: 'rel_010',
    name: '科技核心',
    description: '所有科技研发速度提升50%，可叠加。',
    rarity: 'rare',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.researchSpeedMultiplier = (state.researchSpeedMultiplier || 1) * 1.5;
      else state.researchSpeedMultiplier *= 1.5;
    },
    stackable: true,
    maxStack: 2
  },
  {
    id: 'rel_011',
    name: '仓库扩容石',
    description: '仓库容量提升50%，可叠加。',
    rarity: 'common',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.storageCapacityMultiplier = (state.storageCapacityMultiplier || 1) * 1.5;
      else state.storageCapacityMultiplier *= 1.5;
    },
    stackable: true,
    maxStack: 3
  },
  {
    id: 'rel_012',
    name: '天气预报球',
    description: '可以看到未来10回合的天气，不可叠加。',
    rarity: 'rare',
    effect: (state) => {
      state.weatherForecastLength = 10;
    },
    stackable: false,
    maxStack: 1
  },
  {
    id: 'rel_013',
    name: '商人的友谊',
    description: '所有商店商品价格降低20%，可叠加。',
    rarity: 'rare',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.shopPriceDiscount = (state.shopPriceDiscount || 0) + 0.2;
      else state.shopPriceDiscount += 0.2;
    },
    stackable: true,
    maxStack: 2
  },
  {
    id: 'rel_014',
    name: '生命之泉',
    description: '所有受损的作物每回合自动恢复10%的生命值，不可叠加。',
    rarity: 'epic',
    effect: (state) => {
      state.cropAutoHealPerTurn = 0.1;
    },
    stackable: false,
    maxStack: 1
  },
  {
    id: 'rel_015',
    name: '稻草人勋章',
    description: '完全免疫虫害事件，不可叠加。',
    rarity: 'epic',
    effect: (state) => {
      state.pestImmunity = true;
    },
    stackable: false,
    maxStack: 1
  },
  {
    id: 'rel_016',
    name: '双倍好运符',
    description: '正面事件触发概率提升20%，可叠加。',
    rarity: 'epic',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.positiveEventBonus = (state.positiveEventBonus || 0) + 0.2;
      else state.positiveEventBonus += 0.2;
    },
    stackable: true,
    maxStack: 2
  },
  {
    id: 'rel_017',
    name: '建筑大师的手套',
    description: '所有建筑建造速度提升100%，可叠加。',
    rarity: 'rare',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.buildingSpeedMultiplier = (state.buildingSpeedMultiplier || 1) * 2;
      else state.buildingSpeedMultiplier *= 2;
    },
    stackable: true,
    maxStack: 2
  },
  {
    id: 'rel_018',
    name: '时光沙漏',
    description: '每10回合额外获得1个额外行动回合，不可叠加。',
    rarity: 'legendary',
    effect: (state) => {
      state.extraTurnEveryNTurns = 10;
    },
    stackable: false,
    maxStack: 1
  },
  {
    id: 'rel_019',
    name: '贤者之石',
    description: '所有效果叠加层数上限+1，可叠加。',
    rarity: 'legendary',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.globalStackLimitBonus = (state.globalStackLimitBonus || 0) + 1;
      else state.globalStackLimitBonus += 1;
    },
    stackable: true,
    maxStack: 3
  },
  {
    id: 'rel_020',
    name: '自然之心',
    description: '所有正面效果持续时间翻倍，不可叠加。',
    rarity: 'legendary',
    effect: (state) => {
      state.buffDurationMultiplier = 2;
    },
    stackable: false,
    maxStack: 1
  },
  {
    id: 'rel_021',
    name: '丰收神像',
    description: '所有作物产量提升50%，可叠加。',
    rarity: 'epic',
    effect: (state, isFirstAdd) => {
      if (isFirstAdd) state.globalCropYieldMultiplier = (state.globalCropYieldMultiplier || 1) * 1.5;
      else state.globalCropYieldMultiplier *= 1.5;
    },
    stackable: true,
    maxStack: 2
  }
];

// 添加遗物到玩家背包，最多6个，处理叠加逻辑
export function addRelic(state: any, relicId: string): boolean {
  if (state.relics.length >= 6) return false;
  
  const relic = ALL_RELICS.find(r => r.id === relicId);
  if (!relic) return false;

  // 检查是否已有同类型遗物
  const existing = state.relics.find((r: Relic) => r.id === relicId);
  if (existing) {
    if (!relic.stackable) return false;
    const currentStack = state.relics.filter((r: Relic) => r.id === relicId).length;
    if (currentStack >= relic.maxStack + (state.globalStackLimitBonus || 0)) return false;
  }

  // 添加遗物并触发效果
  state.relics.push(relic);
  relic.effect(state, !existing);
  return true;
}
