/**
 * 🎲 随机事件配置 - 共30种
 */
import { GameEvent } from './components';

export const EVENTS_CONFIG: GameEvent[] = [
  // 正面事件 (10种)
  {
    id: 'rain_fall',
    name: '及时雨',
    description: '天降甘霖，所有作物生长速度提升50%，持续2回合',
    type: '正面',
    trigger: '回合开始',
    weight: 10,
    levelRequirement: 1,
    effects: [
      { type: '生产效率变更', target: '作物', value: 0.5, duration: 2 }
    ],
    cooldown: 5,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'sunny_day',
    name: '大晴天',
    description: '阳光明媚，所有资源产量提升20%，持续3回合',
    type: '正面',
    trigger: '回合开始',
    weight: 12,
    levelRequirement: 1,
    effects: [
      { type: '生产效率变更', target: '所有', value: 0.2, duration: 3 }
    ],
    cooldown: 4,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'market_boom',
    name: '市场繁荣',
    description: '农产品价格暴涨，出售作物额外获得50%金币，持续2回合',
    type: '正面',
    trigger: '回合开始',
    weight: 8,
    levelRequirement: 3,
    effects: [
      { type: '资源变更', target: '金币加成', value: 0.5, duration: 2 }
    ],
    cooldown: 6,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'gift_from_villager',
    name: '村民馈赠',
    description: '热心村民送了你3个小麦种子和2个木材',
    type: '正面',
    trigger: '回合开始',
    weight: 9,
    levelRequirement: 2,
    effects: [
      { type: '资源变更', target: '作物', value: 3 },
      { type: '资源变更', target: '木材', value: 2 }
    ],
    cooldown: 5,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'lucky_find',
    name: '意外收获',
    description: '你在地里挖到了50金币！',
    type: '正面',
    trigger: '使用卡牌',
    weight: 7,
    levelRequirement: 1,
    effects: [
      { type: '资源变更', target: '金币', value: 50 }
    ],
    cooldown: 7,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'traveling_merchant',
    name: '行商到访',
    description: '行商低价出售物资，所有商品价格降低30%，持续1回合',
    type: '正面',
    trigger: '回合开始',
    weight: 6,
    levelRequirement: 4,
    effects: [
      { type: '资源变更', target: '商店折扣', value: 0.3, duration: 1 }
    ],
    cooldown: 8,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'fertile_soil',
    name: '土地肥沃',
    description: '土地变得格外肥沃，下一次种植的作物产量翻倍',
    type: '正面',
    trigger: '回合开始',
    weight: 8,
    levelRequirement: 3,
    effects: [
      { type: '生产效率变更', target: '作物产量', value: 1, duration: 1 }
    ],
    cooldown: 6,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'animal_birth',
    name: '动物繁殖',
    description: '你的动物繁殖了，额外获得2只小鸡',
    type: '正面',
    trigger: '回合结束',
    weight: 7,
    levelRequirement: 3,
    effects: [
      { type: '资源变更', target: '动物', value: 2 }
    ],
    cooldown: 7,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'skill_improve',
    name: '技能提升',
    description: '你突然领悟了新的耕作技巧，所有工具效率提升25%，持续3回合',
    type: '正面',
    trigger: '升级卡牌',
    weight: 5,
    levelRequirement: 5,
    effects: [
      { type: '生产效率变更', target: '工具', value: 0.25, duration: 3 }
    ],
    cooldown: 10,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'treasure_chest',
    name: '宝箱',
    description: '你发现了一个隐藏的宝箱！获得100金币和1件随机遗物',
    type: '正面',
    trigger: '随机',
    weight: 3,
    levelRequirement: 5,
    effects: [
      { type: '资源变更', target: '金币', value: 100 },
      { type: '获得遗物', target: '随机', value: 1 }
    ],
    cooldown: 15,
    active: false,
    remainingDuration: 0
  },

  // 负面事件 (10种)
  {
    id: 'drought',
    name: '旱灾',
    description: '连日干旱，作物生长速度降低50%，持续2回合',
    type: '负面',
    trigger: '回合开始',
    weight: 8,
    levelRequirement: 2,
    effects: [
      { type: '生产效率变更', target: '作物', value: -0.5, duration: 2 }
    ],
    cooldown: 6,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'storm',
    name: '暴风雨',
    description: '暴风雨来袭，损失10个作物和5个木材',
    type: '负面',
    trigger: '回合开始',
    weight: 7,
    levelRequirement: 3,
    effects: [
      { type: '资源变更', target: '作物', value: -10 },
      { type: '资源变更', target: '木材', value: -5 }
    ],
    cooldown: 8,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'pest_infestation',
    name: '虫害',
    description: '作物生虫了，产量降低30%，持续2回合',
    type: '负面',
    trigger: '回合开始',
    weight: 9,
    levelRequirement: 2,
    effects: [
      { type: '生产效率变更', target: '作物产量', value: -0.3, duration: 2 }
    ],
    cooldown: 5,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'market_crash',
    name: '市场低迷',
    description: '农产品价格暴跌，出售作物只能获得70%的金币，持续2回合',
    type: '负面',
    trigger: '回合开始',
    weight: 6,
    levelRequirement: 4,
    effects: [
      { type: '资源变更', target: '金币加成', value: -0.3, duration: 2 }
    ],
    cooldown: 7,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'animal_sick',
    name: '动物生病',
    description: '你的动物生病了，动物产量降低40%，持续2回合',
    type: '负面',
    trigger: '回合结束',
    weight: 7,
    levelRequirement: 3,
    effects: [
      { type: '生产效率变更', target: '动物', value: -0.4, duration: 2 }
    ],
    cooldown: 6,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'theft',
    name: '小偷',
    description: '小偷光顾了你的农场，偷走了30金币',
    type: '负面',
    trigger: '回合开始',
    weight: 8,
    levelRequirement: 2,
    effects: [
      { type: '资源变更', target: '金币', value: -30 }
    ],
    cooldown: 7,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'tool_break',
    name: '工具损坏',
    description: '你的工具损坏了，工具效率降低50%，持续1回合',
    type: '负面',
    trigger: '使用卡牌',
    weight: 6,
    levelRequirement: 2,
    effects: [
      { type: '生产效率变更', target: '工具', value: -0.5, duration: 1 }
    ],
    cooldown: 8,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'cold_wave',
    name: '寒潮',
    description: '寒潮来袭，所有生产活动暂停1回合',
    type: '负面',
    trigger: '回合开始',
    weight: 4,
    levelRequirement: 5,
    effects: [
      { type: '生产效率变更', target: '所有', value: -1, duration: 1 }
    ],
    cooldown: 12,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'price_hike',
    name: '物价上涨',
    description: '商店物价上涨，所有商品价格提升50%，持续1回合',
    type: '负面',
    trigger: '回合开始',
    weight: 5,
    levelRequirement: 4,
    effects: [
      { type: '资源变更', target: '商店折扣', value: -0.5, duration: 1 }
    ],
    cooldown: 9,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'fire',
    name: '火灾',
    description: '农舍失火，损失20木材和15石头',
    type: '负面',
    trigger: '随机',
    weight: 3,
    levelRequirement: 6,
    effects: [
      { type: '资源变更', target: '木材', value: -20 },
      { type: '资源变更', target: '石头', value: -15 }
    ],
    cooldown: 15,
    active: false,
    remainingDuration: 0
  },

  // 中性事件 (7种)
  {
    id: 'visitor',
    name: '访客',
    description: '有访客来参观你的农场，获得20金币',
    type: '中性',
    trigger: '回合开始',
    weight: 10,
    levelRequirement: 1,
    effects: [
      { type: '资源变更', target: '金币', value: 20 }
    ],
    cooldown: 3,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'trade_offer',
    name: '交易请求',
    description: '有人想用5个木材换3个石头，是否接受？',
    type: '中性',
    trigger: '回合开始',
    weight: 8,
    levelRequirement: 2,
    effects: [
      { type: '资源变更', target: '木材', value: -5 },
      { type: '资源变更', target: '石头', value: 3 }
    ],
    cooldown: 4,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'weather_change',
    name: '天气变化',
    description: '天气阴晴不定，未来3回合产量波动±15%',
    type: '中性',
    trigger: '回合开始',
    weight: 9,
    levelRequirement: 2,
    effects: [
      { type: '生产效率变更', target: '波动', value: 0.15, duration: 3 }
    ],
    cooldown: 5,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'flea_market',
    name: '跳蚤市场',
    description: '跳蚤市场开放，可以出售一张不需要的卡牌换取50金币',
    type: '中性',
    trigger: '回合开始',
    weight: 7,
    levelRequirement: 3,
    effects: [
      { type: '失去卡牌', target: '任意', value: 1 },
      { type: '资源变更', target: '金币', value: 50 }
    ],
    cooldown: 6,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'training_course',
    name: '培训课程',
    description: '村里组织农业培训，花费30金币可以随机升级一张卡牌',
    type: '中性',
    trigger: '回合开始',
    weight: 6,
    levelRequirement: 4,
    effects: [
      { type: '资源变更', target: '金币', value: -30 },
      { type: '获得卡牌', target: '升级随机', value: 1 }
    ],
    cooldown: 8,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'festival',
    name: '丰收节',
    description: '村里举办丰收节，你可以选择参加活动获得随机奖励或者继续工作',
    type: '中性',
    trigger: '回合开始',
    weight: 5,
    levelRequirement: 5,
    effects: [
      { type: '触发其他事件', target: '随机正面', value: 1 }
    ],
    cooldown: 10,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'mysterious_stranger',
    name: '神秘人',
    description: '一个神秘人给了你一个包裹，里面可能有惊喜也可能有惊吓',
    type: '中性',
    trigger: '随机',
    weight: 4,
    levelRequirement: 3,
    effects: [
      { type: '触发其他事件', target: '随机', value: 1 }
    ],
    cooldown: 12,
    active: false,
    remainingDuration: 0
  },

  // 灾害事件 (3种)
  {
    id: 'locust_plague',
    name: '蝗灾',
    description: '大规模蝗灾来袭，损失50%的作物库存，持续3回合作物产量降低70%',
    type: '灾害',
    trigger: '回合开始',
    weight: 2,
    levelRequirement: 8,
    effects: [
      { type: '资源变更', target: '作物', value: -0.5 },
      { type: '生产效率变更', target: '作物', value: -0.7, duration: 3 }
    ],
    cooldown: 20,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'flood',
    name: '洪水',
    description: '洪水泛滥，损失30%的所有资源，持续2回合无法进行生产活动',
    type: '灾害',
    trigger: '回合开始',
    weight: 1.5,
    levelRequirement: 10,
    effects: [
      { type: '资源变更', target: '所有', value: -0.3 },
      { type: '生产效率变更', target: '所有', value: -1, duration: 2 }
    ],
    cooldown: 25,
    active: false,
    remainingDuration: 0
  },
  {
    id: 'earthquake',
    name: '地震',
    description: '地震摧毁了部分建筑，损失40%的木材和石头，所有建筑效率降低50%，持续5回合',
    type: '灾害',
    trigger: '回合开始',
    weight: 1,
    levelRequirement: 12,
    effects: [
      { type: '资源变更', target: '木材', value: -0.4 },
      { type: '资源变更', target: '石头', value: -0.4 },
      { type: '生产效率变更', target: '建筑', value: -0.5, duration: 5 }
    ],
    cooldown: 30,
    active: false,
    remainingDuration: 0
  }
];
