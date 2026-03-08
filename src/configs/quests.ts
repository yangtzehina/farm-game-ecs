/**
 * 🏡 农庄卡牌：田园物语 - 任务配置表
 * 包含短期日常任务和中期阶段任务配置
 */

import { Quest, QuestType } from '../components';

// ==========================================
// 短期日常任务池（20+个，每回合随机抽取3个）
// ==========================================
export const DAILY_QUEST_POOL: Omit<Quest, 'unlocked' | 'completed' | 'claimed'>[] = [
  {
    id: 'daily_collect_5_crop',
    type: '日常',
    title: '作物丰收',
    description: '本回合收集5个作物资源',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '作物',
        requiredAmount: 5,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量', target: '', amount: 2 },
      { type: '资源', target: '金币', amount: 30 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_collect_3_animal',
    type: '日常',
    title: '畜牧丰收',
    description: '本回合收集3个动物资源',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '动物',
        requiredAmount: 3,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '抽卡', target: '', amount: 1 },
      { type: '资源', target: '金币', amount: 50 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_play_3_crop_cards',
    type: '日常',
    title: '勤恳耕作',
    description: '本回合打出3张作物卡牌',
    objectives: [
      {
        id: 'obj_1',
        type: '打出卡牌',
        target: '作物',
        requiredAmount: 3,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: 'buff', target: '作物增产', amount: 1 },
      { type: '资源', target: '木材', amount: 20 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_play_2_animal_cards',
    type: '日常',
    title: '畜牧养殖',
    description: '本回合打出2张动物卡牌',
    objectives: [
      {
        id: 'obj_1',
        type: '打出卡牌',
        target: '动物',
        requiredAmount: 2,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: 'buff', target: '动物增产', amount: 1 },
      { type: '资源', target: '石头', amount: 15 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_earn_100_gold',
    type: '日常',
    title: '小赚一笔',
    description: '本回合赚取100金币',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '金币',
        requiredAmount: 100,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量', target: '', amount: 3 },
      { type: '资源', target: '金币', amount: 50 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_upgrade_1_card',
    type: '日常',
    title: '精益求精',
    description: '本回合升级1张卡牌',
    objectives: [
      {
        id: 'obj_1',
        type: '升级卡牌',
        target: '任意',
        requiredAmount: 1,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '抽卡', target: '', amount: 1 },
      { type: '经验', target: '', amount: 100 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_use_2_tool_cards',
    type: '日常',
    title: '工具大师',
    description: '本回合使用2张工具卡牌',
    objectives: [
      {
        id: 'obj_1',
        type: '打出卡牌',
        target: '工具',
        requiredAmount: 2,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: 'buff', target: '工具耐久提升', amount: 1 },
      { type: '资源', target: '木材', amount: 30 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_play_1_building_card',
    type: '日常',
    title: '大兴土木',
    description: '本回合打出1张建筑卡牌',
    objectives: [
      {
        id: 'obj_1',
        type: '打出卡牌',
        target: '建筑',
        requiredAmount: 1,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: 'buff', target: '建筑生产加速', amount: 1 },
      { type: '资源', target: '石头', amount: 25 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_collect_10_wood',
    type: '日常',
    title: '伐木工人',
    description: '本回合收集10个木材',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '木材',
        requiredAmount: 10,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量', target: '', amount: 2 },
      { type: '资源', target: '木材', amount: 5 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_collect_8_stone',
    type: '日常',
    title: '采石工人',
    description: '本回合收集8个石头',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '石头',
        requiredAmount: 8,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量', target: '', amount: 2 },
      { type: '资源', target: '石头', amount: 4 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_combo_3',
    type: '日常',
    title: '组合大师',
    description: '本回合激活1个组合技',
    objectives: [
      {
        id: 'obj_1',
        type: '激活组合',
        target: '任意',
        requiredAmount: 1,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '抽卡', target: '', amount: 2 },
      { type: '经验', target: '', amount: 150 }
    ],
    priority: 2,
    dailyReset: true
  },
  {
    id: 'daily_discard_2_cards',
    type: '日常',
    title: '去芜存菁',
    description: '本回合弃掉2张卡牌',
    objectives: [
      {
        id: 'obj_1',
        type: '弃置卡牌',
        target: '任意',
        requiredAmount: 2,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量', target: '', amount: 1 },
      { type: '资源', target: '金币', amount: 40 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_gain_50_exp',
    type: '日常',
    title: '勤学苦练',
    description: '本回合获得50点经验值',
    objectives: [
      {
        id: 'obj_1',
        type: '获取经验',
        target: '',
        requiredAmount: 50,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: 'buff', target: '经验提升', amount: 1 },
      { type: '经验', target: '', amount: 30 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_play_4_cards',
    type: '日常',
    title: '牌局老手',
    description: '本回合打出4张卡牌',
    objectives: [
      {
        id: 'obj_1',
        type: '打出卡牌',
        target: '任意',
        requiredAmount: 4,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量', target: '', amount: 2 },
      { type: '资源', target: '金币', amount: 60 }
    ],
    priority: 1,
    dailyReset: true
  },
  {
    id: 'daily_survive_5_turns',
    type: '日常',
    title: '坚持就是胜利',
    description: '连续生存5个回合',
    objectives: [
      {
        id: 'obj_1',
        type: '存活回合',
        target: '',
        requiredAmount: 5,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '抽卡', target: '', amount: 1 },
      { type: 'buff', target: '全属性提升', amount: 1 }
    ],
    priority: 2,
    dailyReset: true
  },
  {
    id: 'daily_collect_2_both_resources',
    type: '日常',
    title: '农牧结合',
    description: '本回合同时收集3个作物和2个动物资源',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '作物',
        requiredAmount: 3,
        currentAmount: 0,
        completed: false
      },
      {
        id: 'obj_2',
        type: '收集资源',
        target: '动物',
        requiredAmount: 2,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量', target: '', amount: 3 },
      { type: '资源', target: '金币', amount: 80 }
    ],
    priority: 2,
    dailyReset: true
  },
  {
    id: 'daily_build_2_buildings',
    type: '日常',
    title: '建设达人',
    description: '本回合建造2个建筑',
    objectives: [
      {
        id: 'obj_1',
        type: '打出卡牌',
        target: '建筑',
        requiredAmount: 2,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: 'buff', target: '建筑成本降低', amount: 1 },
      { type: '资源', target: '石头', amount: 30 }
    ],
    priority: 2,
    dailyReset: true
  },
  {
    id: 'daily_use_3_tools',
    type: '日常',
    title: '工具达人',
    description: '本回合使用3次工具卡牌效果',
    objectives: [
      {
        id: 'obj_1',
        type: '使用工具',
        target: '',
        requiredAmount: 3,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: 'buff', target: '工具效率提升', amount: 1 },
      { type: '资源', target: '木材', amount: 30 }
    ],
    priority: 2,
    dailyReset: true
  },
  {
    id: 'daily_gain_1_buff',
    type: '日常',
    title: '增益收集者',
    description: '本回合获得1个buff效果',
    objectives: [
      {
        id: 'obj_1',
        type: '获得buff',
        target: '',
        requiredAmount: 1,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '抽卡', target: '', amount: 1 },
      { type: '资源', target: '金币', amount: 70 }
    ],
    priority: 2,
    dailyReset: true
  },
  {
    id: 'daily_sell_5_crops',
    type: '日常',
    title: '市场商人',
    description: '本回合出售5个作物资源',
    objectives: [
      {
        id: 'obj_1',
        type: '出售资源',
        target: '作物',
        requiredAmount: 5,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '金币', target: '', amount: 100 },
      { type: 'buff', target: '售价提升', amount: 1 }
    ],
    priority: 2,
    dailyReset: true
  },
  {
    id: 'daily_level_up_1',
    type: '日常',
    title: '等级提升',
    description: '本回合角色升级1次',
    objectives: [
      {
        id: 'obj_1',
        type: '等级提升',
        target: '',
        requiredAmount: 1,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量', target: '', amount: 4 },
      { type: '抽卡', target: '', amount: 2 }
    ],
    priority: 3,
    dailyReset: true
  }
];

// ==========================================
// 中期阶段任务（4个，局内主线任务）
// ==========================================
export const STAGE_QUESTS: Omit<Quest, 'unlocked' | 'completed' | 'claimed'>[] = [
  {
    id: 'stage_1_well',
    type: '主线',
    title: '阶段1：修复水井',
    description: '收集20木材和10石头，修复农庄的水井，解锁水源',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '木材',
        requiredAmount: 20,
        currentAmount: 0,
        completed: false
      },
      {
        id: 'obj_2',
        type: '收集资源',
        target: '石头',
        requiredAmount: 10,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量上限提升', target: '', amount: 2 },
      { type: '解锁卡牌池', target: '水井卡牌', amount: 1 },
      { type: 'buff', target: '作物生长速度+20%', amount: 1 }
    ],
    priority: 10,
    unlockCondition: {
      type: '存活回合',
      target: '',
      amount: 1
    }
  },
  {
    id: 'stage_2_animal_farm',
    type: '主线',
    title: '阶段2：解锁牲畜栏',
    description: '收集30作物和50金币，修建牲畜栏，开始养殖动物',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '作物',
        requiredAmount: 30,
        currentAmount: 0,
        completed: false
      },
      {
        id: 'obj_2',
        type: '收集资源',
        target: '金币',
        requiredAmount: 50,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '抽卡', target: '', amount: 3 },
      { type: '解锁卡牌池', target: '牲畜卡牌', amount: 1 },
      { type: 'buff', target: '动物产量+30%', amount: 1 }
    ],
    priority: 10,
    unlockCondition: {
      type: '完成任务',
      target: 'stage_1_well',
      amount: 1
    }
  },
  {
    id: 'stage_3_processing_workshop',
    type: '主线',
    title: '阶段3：修建加工坊',
    description: '收集20动物资源和100金币，修建农产品加工坊',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '动物',
        requiredAmount: 20,
        currentAmount: 0,
        completed: false
      },
      {
        id: 'obj_2',
        type: '收集资源',
        target: '金币',
        requiredAmount: 100,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '能量上限提升', target: '', amount: 3 },
      { type: '解锁卡牌池', target: '加工卡牌', amount: 1 },
      { type: 'buff', target: '产品售价+50%', amount: 1 }
    ],
    priority: 10,
    unlockCondition: {
      type: '完成任务',
      target: 'stage_2_animal_farm',
      amount: 1
    }
  },
  {
    id: 'stage_4_market',
    type: '主线',
    title: '阶段4：开通集市',
    description: '收集50木材、30石头和200金币，开通对外集市',
    objectives: [
      {
        id: 'obj_1',
        type: '收集资源',
        target: '木材',
        requiredAmount: 50,
        currentAmount: 0,
        completed: false
      },
      {
        id: 'obj_2',
        type: '收集资源',
        target: '石头',
        requiredAmount: 30,
        currentAmount: 0,
        completed: false
      },
      {
        id: 'obj_3',
        type: '收集资源',
        target: '金币',
        requiredAmount: 200,
        currentAmount: 0,
        completed: false
      }
    ],
    rewards: [
      { type: '抽卡', target: '', amount: 5 },
      { type: '解锁卡牌池', target: '集市卡牌', amount: 1 },
      { type: 'buff', target: '所有资源产量+25%', amount: 1 },
      { type: '解锁新玩法', target: '贸易系统', amount: 1 }
    ],
    priority: 10,
    unlockCondition: {
      type: '完成任务',
      target: 'stage_3_processing_workshop',
      amount: 1
    }
  }
];

// ==========================================
// 任务目标类型扩展定义
// ==========================================
export type ExtendedQuestObjectiveType = 
  | '收集资源'
  | '升级卡牌'
  | '生产物品'
  | '拥有卡牌'
  | '达到等级'
  | '完成任务'
  | '打出卡牌'
  | '弃置卡牌'
  | '激活组合'
  | '获取经验'
  | '存活回合'
  | '使用工具'
  | '获得buff'
  | '出售资源'
  | '等级提升';
