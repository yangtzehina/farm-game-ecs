export enum AchievementType {
  COLLECTION = 'collection', // 收集类
  CHALLENGE = 'challenge', // 挑战类
  GAMEPLAY = 'gameplay', // 玩法类
}

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  rarity: AchievementRarity;
  target: number; // 完成需要的目标值
  icon: string;
  unlockReward?: {
    cards?: string[];
    relics?: string[];
    characters?: string[];
    difficulty?: string;
  };
}

// 收集类成就（20个）
export const COLLECTION_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'coll_001',
    name: '初入农庄',
    description: '收集10张不同的作物卡牌',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 10,
    icon: '🌱',
    unlockReward: { cards: ['golden_wheat'] }
  },
  {
    id: 'coll_002',
    name: '作物爱好者',
    description: '收集30张不同的作物卡牌',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 30,
    icon: '🌾',
    unlockReward: { relics: ['fertile_soil'] }
  },
  {
    id: 'coll_003',
    name: '作物收藏家',
    description: '收集所有作物卡牌',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.EPIC,
    target: 50,
    icon: '🌽',
    unlockReward: { characters: ['experienced_farmer'] }
  },
  {
    id: 'coll_004',
    name: '建筑新手',
    description: '解锁5种不同的建筑',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 5,
    icon: '🏠',
    unlockReward: { cards: ['wooden_house'] }
  },
  {
    id: 'coll_005',
    name: '建筑大师',
    description: '解锁所有建筑',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.RARE,
    target: 15,
    icon: '🏡',
    unlockReward: { relics: ['architect_dream'] }
  },
  {
    id: 'coll_006',
    name: '遗物新手',
    description: '收集10件不同的遗物',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 10,
    icon: '💎',
    unlockReward: { relics: ['lucky_coin'] }
  },
  {
    id: 'coll_007',
    name: '遗物收藏家',
    description: '收集30件不同的遗物',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.RARE,
    target: 30,
    icon: '🏆',
    unlockReward: { characters: ['archaeologist'] }
  },
  {
    id: 'coll_008',
    name: '遗物全收集',
    description: '收集所有遗物',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.LEGENDARY,
    target: 60,
    icon: '👑',
    unlockReward: { difficulty: 'hard' }
  },
  {
    id: 'coll_009',
    name: '动物饲养员',
    description: '收集8种不同的动物卡牌',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 8,
    icon: '🐄',
    unlockReward: { cards: ['cow'] }
  },
  {
    id: 'coll_010',
    name: '动物爱好者',
    description: '收集所有动物卡牌',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.RARE,
    target: 20,
    icon: '🐑',
    unlockReward: { relics: ['animal_whisperer'] }
  },
  {
    id: 'coll_011',
    name: '丰收入门',
    description: '累计收获100个作物',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 100,
    icon: '🍎',
    unlockReward: { cards: ['apple_tree'] }
  },
  {
    id: 'coll_012',
    name: '丰收达人',
    description: '累计收获1000个作物',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.RARE,
    target: 1000,
    icon: '🍇',
    unlockReward: { relics: ['endless_harvest'] }
  },
  {
    id: 'coll_013',
    name: '丰收之王',
    description: '累计收获10000个作物',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.EPIC,
    target: 10000,
    icon: '🍉',
    unlockReward: { characters: 'harvest_god' }
  },
  {
    id: 'coll_014',
    name: '垂钓新手',
    description: '收集5种不同的鱼类',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 5,
    icon: '🐟',
    unlockReward: { cards: ['fishing_rod'] }
  },
  {
    id: 'coll_015',
    name: '垂钓大师',
    description: '收集所有鱼类',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.RARE,
    target: 15,
    icon: '🎣',
    unlockReward: { relics: ['magnet_bait'] }
  },
  {
    id: 'coll_016',
    name: '昆虫收集者',
    description: '收集10种不同的昆虫',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 10,
    icon: '🐝',
    unlockReward: { cards: ['bee_hive'] }
  },
  {
    id: 'coll_017',
    name: '昆虫学家',
    description: '收集所有昆虫',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.RARE,
    target: 25,
    icon: '🦋',
    unlockReward: { relics: ['pollination_boost'] }
  },
  {
    id: 'coll_018',
    name: '菜谱新手',
    description: '解锁10种不同的菜谱',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.COMMON,
    target: 10,
    icon: '🍳',
    unlockReward: { cards: ['kitchen'] }
  },
  {
    id: 'coll_019',
    name: '大厨',
    description: '解锁所有菜谱',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.EPIC,
    target: 30,
    icon: '👨🍳',
    unlockReward: { relics: ['master_chef_hat'] }
  },
  {
    id: 'coll_020',
    name: '完美收集者',
    description: '收集所有卡牌、建筑、遗物',
    type: AchievementType.COLLECTION,
    rarity: AchievementRarity.LEGENDARY,
    target: 150,
    icon: '⭐',
    unlockReward: { difficulty: 'hell' }
  }
];

// 挑战类成就（20个）
export const CHALLENGE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'chal_001',
    name: '首次通关',
    description: '第一次通关普通难度',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.COMMON,
    target: 1,
    icon: '✅',
    unlockReward: { characters: ['beginner_farmer'] }
  },
  {
    id: 'chal_002',
    name: '速通新手',
    description: '30分钟内通关普通难度',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.RARE,
    target: 1,
    icon: '⏱️',
    unlockReward: { relics: ['speed_boots'] }
  },
  {
    id: 'chal_003',
    name: '速通大师',
    description: '15分钟内通关普通难度',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.EPIC,
    target: 1,
    icon: '⚡',
    unlockReward: { cards: ['teleport_scroll'] }
  },
  {
    id: 'chal_004',
    name: '困难通关',
    description: '通关困难难度',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.RARE,
    target: 1,
    icon: '🔥',
    unlockReward: { relics: ['tough_skin'] }
  },
  {
    id: 'chal_005',
    name: '地狱通关',
    description: '通关地狱难度',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.LEGENDARY,
    target: 1,
    icon: '👿',
    unlockReward: { characters: ['demon_farmer'] }
  },
  {
    id: 'chal_006',
    name: '无伤通关',
    description: '通关时没有受到任何伤害',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.EPIC,
    target: 1,
    icon: '🛡️',
    unlockReward: { relics: ['invincible_shield'] }
  },
  {
    id: 'chal_007',
    name: '零卡通关',
    description: '通关时没有使用任何卡牌',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.EPIC,
    target: 1,
    icon: '🚫',
    unlockReward: { cards: ['empty_hand'] }
  },
  {
    id: 'chal_008',
    name: '100连胜',
    description: '连续赢得100场战斗',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.EPIC,
    target: 100,
    icon: '🏅',
    unlockReward: { relics: ['victory_medal'] }
  },
  {
    id: 'chal_009',
    name: '金币大亨',
    description: '单局游戏中获得10000金币',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.RARE,
    target: 10000,
    icon: '💰',
    unlockReward: { relics: ['golden_pot'] }
  },
  {
    id: 'chal_010',
    name: '百万富翁',
    description: '累计获得100万金币',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.EPIC,
    target: 1000000,
    icon: '💸',
    unlockReward: { characters: 'rich_merchant' }
  },
  {
    id: 'chal_011',
    name: ' combo大师',
    description: '单回合打出20张卡牌',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.RARE,
    target: 20,
    icon: '🔗',
    unlockReward: { relics: ['combo_booster'] }
  },
  {
    id: 'chal_012',
    name: '极限 combo',
    description: '单回合打出50张卡牌',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.EPIC,
    target: 50,
    icon: '⛓️',
    unlockReward: { cards: ['infinite_draw'] }
  },
  {
    id: 'chal_013',
    name: '一回合击杀',
    description: '1回合内击杀最终BOSS',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.LEGENDARY,
    target: 1,
    icon: '💥',
    unlockReward: { relics: ['one_punch_glove'] }
  },
  {
    id: 'chal_014',
    name: '生存达人',
    description: '单局游戏存活50回合',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.RARE,
    target: 50,
    icon: '🧗',
    unlockReward: { relics: ['endurance_potion'] }
  },
  {
    id: 'chal_015',
    name: '生存大师',
    description: '单局游戏存活100回合',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.EPIC,
    target: 100,
    icon: '🏔️',
    unlockReward: { characters: 'survivor' }
  },
  {
    id: 'chal_016',
    name: '欧皇附体',
    description: '单次抽卡获得3张传说卡牌',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.LEGENDARY,
    target: 1,
    icon: '🍀',
    unlockReward: { relics: ['lucky_clover'] }
  },
  {
    id: 'chal_017',
    name: '非酋逆袭',
    description: '连续10次抽卡没有获得稀有以上卡牌后通关',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.RARE,
    target: 1,
    icon: '🤣',
    unlockReward: { relics: ['bad_luck_charm'] }
  },
  {
    id: 'chal_018',
    name: '硬核玩家',
    description: '不使用任何遗物通关普通难度',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.EPIC,
    target: 1,
    icon: '💪',
    unlockReward: { cards: ['relic_disabler'] }
  },
  {
    id: 'chal_019',
    name: '极简主义',
    description: '卡组只有10张卡牌时通关',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.RARE,
    target: 1,
    icon: '🤏',
    unlockReward: { relics: ['deck_reducer'] }
  },
  {
    id: 'chal_020',
    name: '无敌战神',
    description: '通关所有难度，且每个难度都达成无伤通关',
    type: AchievementType.CHALLENGE,
    rarity: AchievementRarity.LEGENDARY,
    target: 1,
    icon: '⚔️',
    unlockReward: { characters: 'warrior_farmer' }
  }
];

// 玩法类成就（15个）
export const GAMEPLAY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'game_001',
    name: '首次游戏',
    description: '完成第一局游戏',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.COMMON,
    target: 1,
    icon: '🎮',
    unlockReward: { cards: ['starter_hoe'] }
  },
  {
    id: 'game_002',
    name: '农场主',
    description: '累计进行10局游戏',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.COMMON,
    target: 10,
    icon: '🧑🌾',
    unlockReward: { relics: ['farmers_blessing'] }
  },
  {
    id: 'game_003',
    name: '资深农场主',
    description: '累计进行100局游戏',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.RARE,
    target: 100,
    icon: '👨🌾',
    unlockReward: { characters: 'veteran_farmer' }
  },
  {
    id: 'game_004',
    name: '农场大亨',
    description: '累计进行1000局游戏',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.EPIC,
    target: 1000,
    icon: '👴🌾',
    unlockReward: { relics: ['eternal_farm'] }
  },
  {
    id: 'game_005',
    name: '友谊第一',
    description: '和好友联机游玩10局',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.COMMON,
    target: 10,
    icon: '🤝',
    unlockReward: { cards: ['friendship_badge'] }
  },
  {
    id: 'game_006',
    name: '社交达人',
    description: '和5个不同的好友联机游玩',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.RARE,
    target: 5,
    icon: '👥',
    unlockReward: { relics: ['popularity_boost'] }
  },
  {
    id: 'game_007',
    name: '任务达人',
    description: '累计完成50个任务',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.COMMON,
    target: 50,
    icon: '📋',
    unlockReward: { relics: ['quest_master'] }
  },
  {
    id: 'game_008',
    name: '任务大师',
    description: '累计完成500个任务',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.RARE,
    target: 500,
    icon: '📜',
    unlockReward: { cards: ['quest_board'] }
  },
  {
    id: 'game_009',
    name: '交易爱好者',
    description: '累计进行100次交易',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.COMMON,
    target: 100,
    icon: '💱',
    unlockReward: { relics: ['merchant_friend'] }
  },
  {
    id: 'game_010',
    name: '贸易大亨',
    description: '累计进行1000次交易',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.RARE,
    target: 1000,
    icon: '📈',
    unlockReward: { characters: 'merchant_king' }
  },
  {
    id: 'game_011',
    name: '节日爱好者',
    description: '参加过所有节日活动',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.RARE,
    target: 8,
    icon: '🎉',
    unlockReward: { relics: ['festival_cheer'] }
  },
  {
    id: 'game_012',
    name: '装饰达人',
    description: '给农场换上10种不同的装饰',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.COMMON,
    target: 10,
    icon: '🎨',
    unlockReward: { cards: ['decorative_fence'] }
  },
  {
    id: 'game_013',
    name: '完美农场',
    description: '农场装饰评分达到100分',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.EPIC,
    target: 100,
    icon: '✨',
    unlockReward: { relics: ['beauty_blessing'] }
  },
  {
    id: 'game_014',
    name: '探索者',
    description: '解锁所有地图区域',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.RARE,
    target: 10,
    icon: '🗺️',
    unlockReward: { cards: ['treasure_map'] }
  },
  {
    id: 'game_015',
    name: '开拓者',
    description: '发现所有隐藏区域',
    type: AchievementType.GAMEPLAY,
    rarity: AchievementRarity.EPIC,
    target: 5,
    icon: '🧭',
    unlockReward: { relics: ['explorer_spirit'] }
  }
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  ...COLLECTION_ACHIEVEMENTS,
  ...CHALLENGE_ACHIEVEMENTS,
  ...GAMEPLAY_ACHIEVEMENTS
];

export const ACHIEVEMENT_MAP = new Map(ALL_ACHIEVEMENTS.map(ach => [ach.id, ach]));
