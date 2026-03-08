export enum UnlockType {
  CARD = 'card',
  RELIC = 'relic',
  CHARACTER = 'character',
  DIFFICULTY = 'difficulty',
  BUILDING = 'building',
}

export interface UnlockItem {
  id: string;
  type: UnlockType;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  unlockCondition: {
    achievementId?: string;
    clearDifficulty?: string;
    totalPlayTime?: number;
    customCondition?: string;
  };
  isHidden?: boolean; // 未解锁时是否隐藏
}

// 可解锁卡牌
export const UNLOCKABLE_CARDS: UnlockItem[] = [
  {
    id: 'golden_wheat',
    type: UnlockType.CARD,
    name: '金色小麦',
    description: '种植后获得3倍收益，价值极高',
    icon: '🌾',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_001' }
  },
  {
    id: 'wooden_house',
    type: UnlockType.CARD,
    name: '木屋',
    description: '增加5点最大生命值',
    icon: '🏠',
    rarity: 'common',
    unlockCondition: { achievementId: 'coll_004' }
  },
  {
    id: 'apple_tree',
    type: UnlockType.CARD,
    name: '苹果树',
    description: '每回合产出1个苹果，回复1点生命值',
    icon: '🍎',
    rarity: 'common',
    unlockCondition: { achievementId: 'coll_011' }
  },
  {
    id: 'fishing_rod',
    type: UnlockType.CARD,
    name: '鱼竿',
    description: '随机获得1张鱼类卡牌',
    icon: '🎣',
    rarity: 'common',
    unlockCondition: { achievementId: 'coll_014' }
  },
  {
    id: 'bee_hive',
    type: UnlockType.CARD,
    name: '蜂箱',
    description: '所有作物卡牌效果提升20%',
    icon: '🐝',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_016' }
  },
  {
    id: 'kitchen',
    type: UnlockType.CARD,
    name: '厨房',
    description: '可以将3个作物合成1份食物，获得额外效果',
    icon: '🍳',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_018' }
  },
  {
    id: 'teleport_scroll',
    type: UnlockType.CARD,
    name: '传送卷轴',
    description: '立即传送到任意已解锁区域',
    icon: '🧻',
    rarity: 'epic',
    unlockCondition: { achievementId: 'chal_003' }
  },
  {
    id: 'empty_hand',
    type: UnlockType.CARD,
    name: '空手',
    description: '没有卡牌时，攻击力提升100%',
    icon: '🤲',
    rarity: 'epic',
    unlockCondition: { achievementId: 'chal_007' }
  },
  {
    id: 'infinite_draw',
    type: UnlockType.CARD,
    name: '无限抽卡',
    description: '本回合每打出1张卡，抽1张卡',
    icon: '♾️',
    rarity: 'epic',
    unlockCondition: { achievementId: 'chal_012' }
  },
  {
    id: 'relic_disabler',
    type: UnlockType.CARD,
    name: '遗物禁用器',
    description: '禁用所有遗物效果，攻击力提升200%',
    icon: '🚫',
    rarity: 'epic',
    unlockCondition: { achievementId: 'chal_018' }
  },
  {
    id: 'starter_hoe',
    type: UnlockType.CARD,
    name: '新手锄头',
    description: '立即成熟1块土地上的作物',
    icon: '⛏️',
    rarity: 'common',
    unlockCondition: { achievementId: 'game_001' }
  },
  {
    id: 'friendship_badge',
    type: UnlockType.CARD,
    name: '友谊徽章',
    description: '联机时所有队友属性提升10%',
    icon: '🏅',
    rarity: 'common',
    unlockCondition: { achievementId: 'game_005' }
  },
  {
    id: 'quest_board',
    type: UnlockType.CARD,
    name: '任务板',
    description: '立即刷新3个新任务',
    icon: '📋',
    rarity: 'rare',
    unlockCondition: { achievementId: 'game_008' }
  },
  {
    id: 'decorative_fence',
    type: UnlockType.CARD,
    name: '装饰围栏',
    description: '农场美观度+5，所有作物收益提升5%',
    icon: '🪜',
    rarity: 'common',
    unlockCondition: { achievementId: 'game_012' }
  },
  {
    id: 'treasure_map',
    type: UnlockType.CARD,
    name: '藏宝图',
    description: '立即发现1个隐藏区域',
    icon: '🗺️',
    rarity: 'rare',
    unlockCondition: { achievementId: 'game_014' }
  }
];

// 可解锁遗物
export const UNLOCKABLE_RELICS: UnlockItem[] = [
  {
    id: 'fertile_soil',
    type: UnlockType.RELIC,
    name: '肥沃土壤',
    description: '所有作物生长时间减少20%',
    icon: '🪨',
    rarity: 'common',
    unlockCondition: { achievementId: 'coll_002' }
  },
  {
    id: 'architect_dream',
    type: UnlockType.RELIC,
    name: '建筑师之梦',
    description: '所有建筑建造费用减少50%',
    icon: '🏗️',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_005' }
  },
  {
    id: 'lucky_coin',
    type: UnlockType.RELIC,
    name: '幸运硬币',
    description: '抽卡获得稀有卡牌的概率提升10%',
    icon: '🪙',
    rarity: 'common',
    unlockCondition: { achievementId: 'coll_006' }
  },
  {
    id: 'animal_whisperer',
    type: UnlockType.RELIC,
    name: '动物低语者',
    description: '所有动物产出提升30%',
    icon: '🐾',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_010' }
  },
  {
    id: 'endless_harvest',
    type: UnlockType.RELIC,
    name: '无尽丰收',
    description: '收获时有20%概率获得双倍产出',
    icon: '🌾',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_012' }
  },
  {
    id: 'magnet_bait',
    type: UnlockType.RELIC,
    name: '磁铁鱼饵',
    description: '钓鱼时必定获得稀有以上鱼类',
    icon: '🧲',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_015' }
  },
  {
    id: 'pollination_boost',
    type: UnlockType.RELIC,
    name: '授粉强化',
    description: '所有花类作物收益提升50%',
    icon: '🌸',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_017' }
  },
  {
    id: 'master_chef_hat',
    type: UnlockType.RELIC,
    name: '主厨帽',
    description: '制作食物时有30%概率获得双倍效果',
    icon: '👒',
    rarity: 'epic',
    unlockCondition: { achievementId: 'coll_019' }
  },
  {
    id: 'speed_boots',
    type: UnlockType.RELIC,
    name: '速度之靴',
    description: '所有行动消耗的时间减少20%',
    icon: '👢',
    rarity: 'rare',
    unlockCondition: { achievementId: 'chal_002' }
  },
  {
    id: 'tough_skin',
    type: UnlockType.RELIC,
    name: '坚韧皮肤',
    description: '受到的所有伤害减少30%',
    icon: '🫓',
    rarity: 'rare',
    unlockCondition: { achievementId: 'chal_004' }
  },
  {
    id: 'invincible_shield',
    type: UnlockType.RELIC,
    name: '无敌盾牌',
    description: '每局游戏可以免疫1次致命伤害',
    icon: '🛡️',
    rarity: 'epic',
    unlockCondition: { achievementId: 'chal_006' }
  },
  {
    id: 'victory_medal',
    type: UnlockType.RELIC,
    name: '胜利奖章',
    description: '每场战斗胜利后额外获得1个遗物',
    icon: '🏅',
    rarity: 'epic',
    unlockCondition: { achievementId: 'chal_008' }
  },
  {
    id: 'golden_pot',
    type: UnlockType.RELIC,
    name: '金罐子',
    description: '所有金币收益提升50%',
    icon: '🏺',
    rarity: 'rare',
    unlockCondition: { achievementId: 'chal_009' }
  },
  {
    id: 'combo_booster',
    type: UnlockType.RELIC,
    name: '连击强化器',
    description: '每打出1张卡，下张卡伤害提升5%',
    icon: '⚡',
    rarity: 'rare',
    unlockCondition: { achievementId: 'chal_011' }
  },
  {
    id: 'one_punch_glove',
    type: UnlockType.RELIC,
    name: '一拳手套',
    description: '生命值低于10%时，攻击力提升1000%',
    icon: '🧤',
    rarity: 'legendary',
    unlockCondition: { achievementId: 'chal_013' }
  },
  {
    id: 'endurance_potion',
    type: UnlockType.RELIC,
    name: '耐力药水',
    description: '每回合额外获得1点能量',
    icon: '🧪',
    rarity: 'rare',
    unlockCondition: { achievementId: 'chal_014' }
  },
  {
    id: 'lucky_clover',
    type: UnlockType.RELIC,
    name: '幸运四叶草',
    description: '所有概率触发效果的触发概率翻倍',
    icon: '🍀',
    rarity: 'legendary',
    unlockCondition: { achievementId: 'chal_016' }
  },
  {
    id: 'bad_luck_charm',
    type: UnlockType.RELIC,
    name: '厄运符咒',
    description: '运气越差，攻击力越高，最高提升200%',
    icon: '👻',
    rarity: 'rare',
    unlockCondition: { achievementId: 'chal_017' }
  },
  {
    id: 'deck_reducer',
    type: UnlockType.RELIC,
    name: '卡组缩减器',
    description: '卡组每少1张卡，攻击力提升2%',
    icon: '📉',
    rarity: 'rare',
    unlockCondition: { achievementId: 'chal_019' }
  },
  {
    id: 'farmers_blessing',
    type: UnlockType.RELIC,
    name: '农夫的祝福',
    description: '所有初始作物卡牌等级+1',
    icon: '✨',
    rarity: 'common',
    unlockCondition: { achievementId: 'game_002' }
  },
  {
    id: 'eternal_farm',
    type: UnlockType.RELIC,
    name: '永恒农场',
    description: '作物不会枯萎，即使长时间不收获也不会损失',
    icon: '🌌',
    rarity: 'epic',
    unlockCondition: { achievementId: 'game_004' }
  },
  {
    id: 'popularity_boost',
    type: UnlockType.RELIC,
    name: '人气提升',
    description: '交易时所有物品售价提升20%',
    icon: '📣',
    rarity: 'rare',
    unlockCondition: { achievementId: 'game_006' }
  },
  {
    id: 'quest_master',
    type: UnlockType.RELIC,
    name: '任务大师',
    description: '所有任务奖励提升30%',
    icon: '🏆',
    rarity: 'common',
    unlockCondition: { achievementId: 'game_007' }
  },
  {
    id: 'merchant_friend',
    type: UnlockType.RELIC,
    name: '商人的朋友',
    description: '商店所有物品售价降低20%',
    icon: '🤝',
    rarity: 'common',
    unlockCondition: { achievementId: 'game_009' }
  },
  {
    id: 'festival_cheer',
    type: UnlockType.RELIC,
    name: '节日欢呼',
    description: '节日活动期间所有收益翻倍',
    icon: '🎉',
    rarity: 'rare',
    unlockCondition: { achievementId: 'game_011' }
  },
  {
    id: 'beauty_blessing',
    type: UnlockType.RELIC,
    name: '美丽的祝福',
    description: '农场美观度每+1，所有收益提升1%',
    icon: '💎',
    rarity: 'epic',
    unlockCondition: { achievementId: 'game_013' }
  },
  {
    id: 'explorer_spirit',
    type: UnlockType.RELIC,
    name: '探索者精神',
    description: '探索隐藏区域时必定获得传说品质物品',
    icon: '🧭',
    rarity: 'epic',
    unlockCondition: { achievementId: 'game_015' }
  }
];

// 可解锁角色
export const UNLOCKABLE_CHARACTERS: UnlockItem[] = [
  {
    id: 'experienced_farmer',
    type: UnlockType.CHARACTER,
    name: '经验丰富的农夫',
    description: '初始作物卡牌等级+2，初始金币+100',
    icon: '👨🌾',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_003' }
  },
  {
    id: 'archaeologist',
    type: UnlockType.CHARACTER,
    name: '考古学家',
    description: '发现遗物的概率提升50%，遗物效果提升20%',
    icon: '🤠',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_007' }
  },
  {
    id: 'harvest_god',
    type: UnlockType.CHARACTER,
    name: '丰收之神',
    description: '所有作物收益翻倍，生长时间减半',
    icon: '🧙',
    rarity: 'epic',
    unlockCondition: { achievementId: 'coll_013' }
  },
  {
    id: 'beginner_farmer',
    type: UnlockType.CHARACTER,
    name: '新手农夫',
    description: '初始生命值+10，受到伤害减少20%',
    icon: '🧑🌾',
    rarity: 'common',
    unlockCondition: { achievementId: 'chal_001' }
  },
  {
    id: 'demon_farmer',
    type: UnlockType.CHARACTER,
    name: '恶魔农夫',
    description: '攻击力提升100%，生命值减少50%',
    icon: '👿',
    rarity: 'legendary',
    unlockCondition: { achievementId: 'chal_005' }
  },
  {
    id: 'rich_merchant',
    type: UnlockType.CHARACTER,
    name: '富商',
    description: '初始金币+500，交易时获得30%额外收益',
    icon: '🧔',
    rarity: 'epic',
    unlockCondition: { achievementId: 'chal_010' }
  },
  {
    id: 'survivor',
    type: UnlockType.CHARACTER,
    name: '幸存者',
    description: '生命值越低，回复能力越强，最高回复10%/回合',
    icon: '🧗',
    rarity: 'epic',
    unlockCondition: { achievementId: 'chal_015' }
  },
  {
    id: 'warrior_farmer',
    type: UnlockType.CHARACTER,
    name: '战士农夫',
    description: '攻击力提升50%，所有战斗获得的奖励提升50%',
    icon: '⚔️',
    rarity: 'legendary',
    unlockCondition: { achievementId: 'chal_020' }
  },
  {
    id: 'veteran_farmer',
    type: UnlockType.CHARACTER,
    name: '资深农夫',
    description: '所有属性提升10%，初始遗物+1',
    icon: '👴🌾',
    rarity: 'rare',
    unlockCondition: { achievementId: 'game_003' }
  },
  {
    id: 'merchant_king',
    type: UnlockType.CHARACTER,
    name: '商业大亨',
    description: '交易时所有售价翻倍，购买价格减半',
    icon: '👑',
    rarity: 'epic',
    unlockCondition: { achievementId: 'game_010' }
  }
];

// 可解锁难度
export const UNLOCKABLE_DIFFICULTIES: UnlockItem[] = [
  {
    id: 'hard',
    type: UnlockType.DIFFICULTY,
    name: '困难难度',
    description: '敌人生命值提升100%，攻击力提升50%，奖励提升100%',
    icon: '🔥',
    rarity: 'rare',
    unlockCondition: { achievementId: 'coll_008' }
  },
  {
    id: 'hell',
    type: UnlockType.DIFFICULTY,
    name: '地狱难度',
    description: '敌人生命值提升300%，攻击力提升200%，奖励提升300%，只有1条命',
    icon: '👿',
    rarity: 'legendary',
    unlockCondition: { achievementId: 'coll_020' }
  }
];

export const ALL_UNLOCKS: UnlockItem[] = [
  ...UNLOCKABLE_CARDS,
  ...UNLOCKABLE_RELICS,
  ...UNLOCKABLE_CHARACTERS,
  ...UNLOCKABLE_DIFFICULTIES
];

export const UNLOCK_MAP = new Map(ALL_UNLOCKS.map(unlock => [unlock.id, unlock]));
