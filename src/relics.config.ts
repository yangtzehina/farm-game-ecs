/**
 * 💎 遗物配置 - 共30种
 */
import { Relic } from './components';

export const RELICS_CONFIG: Relic[] = [
  // 普通遗物 (10种)
  {
    id: 'golden_hoe',
    name: '黄金锄头',
    description: '所有耕作工具效率提升10%',
    rarity: '普通',
    acquisition: ['事件奖励', '商店购买'],
    effects: [
      { type: '生产加成', target: '工具', value: 0.1 }
    ],
    levelRequirement: 1,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'fertile_amulet',
    name: '肥沃护符',
    description: '作物产量提升10%',
    rarity: '普通',
    acquisition: ['事件奖励', '任务奖励'],
    effects: [
      { type: '生产加成', target: '作物产量', value: 0.1 }
    ],
    levelRequirement: 1,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'wooden_bucket',
    name: '木桶',
    description: '旱灾时作物产量损失减少20%',
    rarity: '普通',
    acquisition: ['商店购买', '事件奖励'],
    effects: [
      { type: '生产加成', target: '旱灾抗性', value: 0.2 }
    ],
    levelRequirement: 2,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'lucky_coin',
    name: '幸运币',
    description: '金币获得量提升5%',
    rarity: '普通',
    acquisition: ['事件奖励', '隐藏宝箱'],
    effects: [
      { type: '资源加成', target: '金币', value: 0.05 }
    ],
    levelRequirement: 1,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'straw_hat',
    name: '草帽',
    description: '大晴天时额外获得10%产量加成',
    rarity: '普通',
    acquisition: ['商店购买', '任务奖励'],
    effects: [
      { type: '生产加成', target: '大晴天加成', value: 0.1 }
    ],
    levelRequirement: 2,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'animal_whistle',
    name: '动物哨子',
    description: '动物产量提升8%',
    rarity: '普通',
    acquisition: ['事件奖励', '商店购买'],
    effects: [
      { type: '生产加成', target: '动物', value: 0.08 }
    ],
    levelRequirement: 2,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'stone_hammer',
    name: '石锤',
    description: '建筑建造速度提升15%',
    rarity: '普通',
    acquisition: ['商店购买', '任务奖励'],
    effects: [
      { type: '生产加成', target: '建筑速度', value: 0.15 }
    ],
    levelRequirement: 3,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'small_sack',
    name: '小布袋',
    description: '资源存储上限提升10%',
    rarity: '普通',
    acquisition: ['商店购买', '事件奖励'],
    effects: [
      { type: '资源加成', target: '存储上限', value: 0.1 }
    ],
    levelRequirement: 1,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'weather_vane',
    name: '风向标',
    description: '可以提前1回合看到天气变化',
    rarity: '普通',
    acquisition: ['商店购买', '任务奖励'],
    effects: [
      { type: '特殊效果', target: '提前预警', value: 1 }
    ],
    levelRequirement: 3,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'farming_book',
    name: '农书',
    description: '卡牌升级消耗减少10%',
    rarity: '普通',
    acquisition: ['任务奖励', '事件奖励'],
    effects: [
      { type: '特殊效果', target: '升级消耗减少', value: 0.1 }
    ],
    levelRequirement: 4,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },

  // 稀有遗物 (10种)
  {
    id: 'rain_charm',
    name: '雨之护符',
    description: '旱灾触发概率降低30%',
    rarity: '稀有',
    acquisition: ['事件奖励', '隐藏宝箱'],
    effects: [
      { type: '事件概率调整', target: '旱灾', value: -0.3 }
    ],
    levelRequirement: 4,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'golden_egg',
    name: '金蛋',
    description: '每回合额外获得5金币',
    rarity: '稀有',
    acquisition: ['事件奖励', '动物繁殖'],
    effects: [
      { type: '资源加成', target: '金币', value: 5 }
    ],
    levelRequirement: 3,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'magic_seed',
    name: '魔法种子',
    description: '所有作物生长时间减少20%',
    rarity: '稀有',
    acquisition: ['隐藏宝箱', '事件奖励'],
    effects: [
      { type: '生产加成', target: '作物生长速度', value: 0.2 }
    ],
    levelRequirement: 5,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'protective_ring',
    name: '保护戒指',
    description: '负面事件触发概率降低20%',
    rarity: '稀有',
    acquisition: ['事件奖励', '成就奖励'],
    effects: [
      { type: '事件概率调整', target: '负面事件', value: -0.2 }
    ],
    levelRequirement: 5,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'large_sack',
    name: '大布袋',
    description: '资源存储上限提升25%',
    rarity: '稀有',
    acquisition: ['商店购买', '任务奖励'],
    effects: [
      { type: '资源加成', target: '存储上限', value: 0.25 }
    ],
    levelRequirement: 4,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'animal_bell',
    name: '动物铃铛',
    description: '动物产量提升20%，不会生病',
    rarity: '稀有',
    acquisition: ['事件奖励', '成就奖励'],
    effects: [
      { type: '生产加成', target: '动物', value: 0.2 },
      { type: '特殊效果', target: '动物免疫疾病', value: 1 }
    ],
    levelRequirement: 6,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'iron_hoe',
    name: '铁锄头',
    description: '所有耕作工具效率提升25%',
    rarity: '稀有',
    acquisition: ['商店购买', '任务奖励'],
    effects: [
      { type: '生产加成', target: '工具', value: 0.25 }
    ],
    levelRequirement: 5,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'market_coupon',
    name: '市场优惠券',
    description: '商店所有商品价格降低15%',
    rarity: '稀有',
    acquisition: ['事件奖励', '任务奖励'],
    effects: [
      { type: '特殊效果', target: '商店折扣', value: 0.15 }
    ],
    levelRequirement: 4,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'energy_crystal',
    name: '能量水晶',
    description: '能量上限+1',
    rarity: '稀有',
    acquisition: ['隐藏宝箱', '成就奖励'],
    effects: [
      { type: '特殊效果', target: '能量上限提升', value: 1 }
    ],
    levelRequirement: 6,
    unique: false,
    active: true,
    stackable: true,
    stackCount: 1
  },
  {
    id: 'card_binder',
    name: '卡册',
    description: '手牌上限+2',
    rarity: '稀有',
    acquisition: ['商店购买', '任务奖励'],
    effects: [
      { type: '特殊效果', target: '手牌上限提升', value: 2 }
    ],
    levelRequirement: 5,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },

  // 史诗遗物 (7种)
  {
    id: 'sun_stone',
    name: '太阳石',
    description: '大晴天概率提升30%，所有资源产量永久提升15%',
    rarity: '史诗',
    acquisition: ['隐藏宝箱', '成就奖励'],
    effects: [
      { type: '事件概率调整', target: '大晴天', value: 0.3 },
      { type: '生产加成', target: '所有', value: 0.15 }
    ],
    levelRequirement: 7,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'rain_stone',
    name: '雨石',
    description: '及时雨概率提升25%，旱灾概率降低50%',
    rarity: '史诗',
    acquisition: ['隐藏宝箱', '事件奖励'],
    effects: [
      { type: '事件概率调整', target: '及时雨', value: 0.25 },
      { type: '事件概率调整', target: '旱灾', value: -0.5 }
    ],
    levelRequirement: 7,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'golden_egg_laying_hen',
    name: '下金蛋的母鸡',
    description: '每回合额外获得20金币，动物产量提升30%',
    rarity: '史诗',
    acquisition: ['事件奖励', '成就奖励'],
    effects: [
      { type: '资源加成', target: '金币', value: 20 },
      { type: '生产加成', target: '动物', value: 0.3 }
    ],
    levelRequirement: 8,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'immortal_hoes',
    name: '不朽锄头',
    description: '工具永不损坏，效率提升50%',
    rarity: '史诗',
    acquisition: ['成就奖励', '隐藏宝箱'],
    effects: [
      { type: '生产加成', target: '工具', value: 0.5 },
      { type: '特殊效果', target: '工具免疫损坏', value: 1 }
    ],
    levelRequirement: 8,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'endless_sack',
    name: '无尽口袋',
    description: '资源存储无上限',
    rarity: '史诗',
    acquisition: ['成就奖励', '隐藏宝箱'],
    effects: [
      { type: '特殊效果', target: '无限存储', value: 1 }
    ],
    levelRequirement: 9,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'luck_charm',
    name: '幸运护符',
    description: '正面事件触发概率提升40%，负面事件降低40%',
    rarity: '史诗',
    acquisition: ['成就奖励', '隐藏宝箱'],
    effects: [
      { type: '事件概率调整', target: '正面事件', value: 0.4 },
      { type: '事件概率调整', target: '负面事件', value: -0.4 }
    ],
    levelRequirement: 9,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'wisdom_book',
    name: '智慧之书',
    description: '卡牌升级消耗减少50%，升级效果提升25%',
    rarity: '史诗',
    acquisition: ['成就奖励', '任务奖励'],
    effects: [
      { type: '特殊效果', target: '升级消耗减少', value: 0.5 },
      { type: '特殊效果', target: '升级效果提升', value: 0.25 }
    ],
    levelRequirement: 10,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },

  // 传说遗物 (3种)
  {
    id: 'harvest_goddess_statue',
    name: '丰收女神像',
    description: '所有资源产量提升50%，灾害事件免疫',
    rarity: '传说',
    acquisition: ['成就奖励', '隐藏宝箱'],
    effects: [
      { type: '生产加成', target: '所有', value: 0.5 },
      { type: '特殊效果', target: '灾害免疫', value: 1 }
    ],
    levelRequirement: 15,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'philosophers_stone',
    name: '贤者之石',
    description: '所有资源可以互相转换，转换比例1:1',
    rarity: '传说',
    acquisition: ['成就奖励', '隐藏宝箱'],
    effects: [
      { type: '特殊效果', target: '资源转换', value: 1 }
    ],
    levelRequirement: 20,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  },
  {
    id: 'creation_orb',
    name: '创造宝珠',
    description: '每回合可以免费复制一张手牌，能量上限+3，手牌上限+5',
    rarity: '传说',
    acquisition: ['成就奖励', '隐藏宝箱'],
    effects: [
      { type: '特殊效果', target: '免费复制卡牌', value: 1 },
      { type: '特殊效果', target: '能量上限提升', value: 3 },
      { type: '特殊效果', target: '手牌上限提升', value: 5 }
    ],
    levelRequirement: 25,
    unique: true,
    active: true,
    stackable: false,
    stackCount: 1
  }
];
