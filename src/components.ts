/**
 * 🏡 农庄卡牌：田园物语 - ECS系统设计
 *
 * 资深ECS系统设计专家视角
 * 遵循Data-Oriented Design原则
 * 优先设计数据Component，再设计System
 */

// ==========================================
// 核心数据类型定义
// ==========================================

export type ResourceType = '金币' | '木材' | '石头' | '作物' | '动物';

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Stats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
}

// ==========================================
// 基础组件 - Core Components
// ==========================================

/**
 * IdentityComponent - 身份标识组件
 * 所有实体都应包含
 */
export class IdentityComponent {
  public static readonly TYPE = 'identity';
  
  public name: string = '';
  public description: string = '';
  public entityType: string = '';
  public tier: number = 1;
  public level: number = 1;
  public exp: number = 0;
  public maxExp: number = 100;
  public uniqueId: string = '';

  constructor(config: Partial<IdentityComponent> = {}) {
    Object.assign(this, config);
  }
}

/**
 * PositionComponent - 位置组件
 * 用于布局和空间计算
 */
export class PositionComponent {
  public static readonly TYPE = 'position';
  
  public x: number = 0;
  public y: number = 0;
  public rotation: number = 0;

  constructor(x: number = 0, y: number = 0, rotation: number = 0) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
  }
}

/**
 * DimensionsComponent - 尺寸组件
 * 用于渲染和碰撞检测
 */
export class DimensionsComponent {
  public static readonly TYPE = 'dimensions';
  
  public width: number = 1;
  public height: number = 1;

  constructor(width: number = 1, height: number = 1) {
    this.width = width;
    this.height = height;
  }
}

// ==========================================
// 资源和经济组件 - Resource Components
// ==========================================

/**
 * ResourceComponent - 资源组件
 * 实体的资源存储和生产
 */
export class ResourceComponent {
  public static readonly TYPE = 'resource';
  
  public resources: { [key: string]: number } = {
    '金币': 0,
    '木材': 0,
    '石头': 0,
    '作物': 0,
    '动物': 0
  };

  public production: { [key: string]: number } = {
    '金币': 0,
    '木材': 0,
    '石头': 0,
    '作物': 0,
    '动物': 0
  };

  public maxStorage: { [key: string]: number } = {
    '金币': 10000,
    '木材': 2000,
    '石头': 1500,
    '作物': 1000,
    '动物': 500
  };

  constructor(config: Partial<ResourceComponent> = {}) {
    Object.assign(this, config);
  }

  addResource(type: string, amount: number): boolean {
    if (this.resources[type] === undefined) return false;
    if (this.resources[type] + amount > this.maxStorage[type]) return false;
    
    this.resources[type] += amount;
    return true;
  }

  removeResource(type: string, amount: number): boolean {
    if (this.resources[type] === undefined) return false;
    if (this.resources[type] - amount < 0) return false;
    
    this.resources[type] -= amount;
    return true;
  }
}

/**
 * ProductionComponent - 生产组件
 * 实体的生产能力
 */
export class ProductionComponent {
  public static readonly TYPE = 'production';
  
  public rate: number = 1;
  public productionTime: number = 0;
  public nextProduction: number = 1000; // 毫秒
  public efficiency: number = 1.0;
  public quality: number = 1.0;
  public automation: boolean = false;

  constructor(config: Partial<ProductionComponent> = {}) {
    Object.assign(this, config);
  }

  calculateProduction(
    baseAmount: number,
    efficiency: number,
    quality: number
  ): number {
    return baseAmount * this.rate * efficiency * quality;
  }
}

// ==========================================
// 卡牌组件 - Card Components
// ==========================================

/**
 * CardComponent - 卡牌基础组件
 * 所有卡牌实体的基类
 */
export class CardComponent {
  public static readonly TYPE = 'card';
  
  public cardType: '作物' | '动物' | '工具' | '建筑' | '人物' = '作物';
  public energyCost: number = 1;
  public cooldown: number = 0;
  public maxCooldown: number = 0;

  constructor(config: Partial<CardComponent> = {}) {
    Object.assign(this, config);
  }
}

/**
 * CropComponent - 作物卡牌组件
 */
export class CropComponent {
  public static readonly TYPE = 'crop';
  
  public growthStage: number = 0;
  public maxGrowthStage: number = 4;
  public growthTime: number = 0;
  public growTimePerStage: number = 2500; // 2.5秒每阶段，4阶段总共10秒对应小麦生长周期
  public yield: number = 2;
  public quality: number = 1.0;
  public fertilityBonus: number = 0;

  constructor(config: Partial<CropComponent> = {}) {
    Object.assign(this, config);
  }

  calculateYield(): number {
    return this.yield * this.quality * (1 + this.fertilityBonus);
  }
}

/**
 * AnimalComponent - 动物卡牌组件
 */
export class AnimalComponent {
  public static readonly TYPE = 'animal';
  
  public productivity: number = 0.5;
  public consumption: number = 0.2;
  public happiness: number = 80;
  public maxHappiness: number = 100;
  public age: number = 0;
  public maxAge: number = 100;
  public health: number = 100;

  constructor(config: Partial<AnimalComponent> = {}) {
    Object.assign(this, config);
  }

  getProductionBonus(): number {
    return Math.min(1.5, Math.max(0.5, this.happiness / 100));
  }
}

/**
 * ToolComponent - 工具卡牌组件
 */
export class ToolComponent {
  public static readonly TYPE = 'tool';
  
  public efficiencyBonus: number = 0.1;
  public range: number = 1;
  public durability: number = 100;
  public maxDurability: number = 100;
  public toolType: '收获' | '耕作' | '建造' | '战斗' = '收获';

  constructor(config: Partial<ToolComponent> = {}) {
    Object.assign(this, config);
  }

  use(): boolean {
    if (this.durability > 0) {
      this.durability--;
      return true;
    }
    return false;
  }

  repair(amount: number): boolean {
    if (this.durability + amount > this.maxDurability) {
      this.durability = this.maxDurability;
    } else {
      this.durability += amount;
    }
    return true;
  }
}

/**
 * BuildingComponent - 建筑卡牌组件
 */
export class BuildingComponent {
  public static readonly TYPE = 'building';
  
  public buildTime: number = 0;
  public buildTimeRemaining: number = 0;
  public workers: number = 0;
  public maxWorkers: number = 10;
  public productivity: number = 1.0;
  public maintenanceCost: number = 5;

  constructor(config: Partial<BuildingComponent> = {}) {
    Object.assign(this, config);
  }

  calculateProductionBonus(): number {
    return this.workers / this.maxWorkers * this.productivity;
  }
}

/**
 * CharacterComponent - 人物卡牌组件
 */
export class CharacterComponent {
  public static readonly TYPE = 'character';
  
  public stats: Stats = {
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50
  };
  
  public skills: Array<{
    name: string;
    level: number;
    cooldown: number;
    maxCooldown: number;
    effect: string;
  }> = [];
  
  public experience: number = 0;
  public level: number = 1;
  public job: string = '农民';

  constructor(config: Partial<CharacterComponent> = {}) {
    Object.assign(this, config);
  }

  addExperience(amount: number): boolean {
    const requiredExp = this.level * 100;
    if (this.experience + amount >= requiredExp) {
      this.level++;
      this.experience = (this.experience + amount) - requiredExp;
      this.stats.maxHealth += 10;
      this.stats.maxMana += 5;
      return true;
    }
    
    this.experience += amount;
    return false;
  }
}

// ==========================================
// 卡牌升级组件 - Card Upgrade Components
// ==========================================

/**
 * UpgradeTreeComponent - 升级树组件
 * 卡牌的升级路径
 */
export class UpgradeTreeComponent {
  public static readonly TYPE = 'upgradeTree';
  
  public upgrades: Array<{
    id: string;
    name: string;
    description: string;
    level: number;
    maxLevel: number;
    cost: { [key: string]: number };
    unlockLevel: number;
    effects: Array<{ property: string; value: number }>;
  }> = [];

  constructor(config: Partial<UpgradeTreeComponent> = {}) {
    Object.assign(this, config);
  }

  getAvailableUpgrades(currentLevel: number): any[] {
    return this.upgrades.filter(
      u => u.level < u.maxLevel && 
           (!u.unlockLevel || currentLevel >= u.unlockLevel)
    );
  }
}

/**
 * UpgradeComponent - 升级组件
 * 当前实体的升级状态
 */
export class UpgradeComponent {
  public static readonly TYPE = 'upgrade';
  
  public points: number = 0;
  public currentUpgrades: Array<{
    id: string;
    level: number;
    effects: Array<{ property: string; value: number }>;
  }> = [];
  public upgradeCost: { [key: string]: number } = {
    '金币': 100,
    '木材': 10,
    '作物':5
  };

  constructor(config: Partial<UpgradeComponent> = {}) {
    Object.assign(this, config);
  }

  canUpgrade(
    upgradeCost: { [key: string]: number },
    currentResources: { [key: string]: number }
  ): boolean {
    return Object.entries(upgradeCost).every(
      ([type, cost]) => currentResources[type] >= cost
    );
  }
}

// ==========================================
// 战斗组件 - Combat Components
// ==========================================

/**
 * CombatComponent - 战斗基础组件
 */
export class CombatComponent {
  public static readonly TYPE = 'combat';
  
  public damage: number = 10;
  public defense: number = 5;
  public attackSpeed: number = 1.0;
  public range: number = 1.0;
  public accuracy: number = 0.9;
  public criticalChance: number = 0.1;
  public criticalMultiplier: number = 2.0;
  public attackPattern: '近战' | '远程' | '范围' = '近战';

  constructor(config: Partial<CombatComponent> = {}) {
    Object.assign(this, config);
  }

  calculateDamage(): number {
    const baseDamage = this.damage;
    const crit = Math.random() < this.criticalChance;
    return crit ? baseDamage * this.criticalMultiplier : baseDamage;
  }
}

/**
 * EffectComponent - 效果组件
 * 应用于实体的状态效果
 */
export class EffectComponent {
  public static readonly TYPE = 'effect';
  
  public effects: Array<{
    name: string;
    type: 'buff' | 'debuff';
    duration: number;
    maxDuration: number;
    strength: number;
    stacking: number;
    source: string;
  }> = [];

  constructor(config: Partial<EffectComponent> = {}) {
    Object.assign(this, config);
  }

  addEffect(
    name: string,
    type: 'buff' | 'debuff',
    duration: number,
    strength: number,
    source: string
  ) {
    const existing = this.effects.find(e => e.name === name && e.source === source);
    if (existing) {
      existing.stacking++;
      existing.duration = duration;
    } else {
      this.effects.push({
        name, type, duration, maxDuration: duration,
        strength, stacking: 1, source
      });
    }
  }

  removeEffect(name: string, source?: string) {
    const index = this.effects.findIndex(
      e => e.name === name && (!source || e.source === source)
    );
    if (index !== -1) {
      this.effects.splice(index, 1);
    }
  }

  updateEffects(dt: number) {
    this.effects = this.effects.filter(e => {
      e.duration -= dt;
      return e.duration > 0;
    });
  }
}

// ==========================================
// 卡牌玩法核心组件 - Card Gameplay Core Components
// ==========================================

/**
 * DeckComponent - 牌组组件
 * 玩家的卡牌库、抽牌堆、弃牌堆
 */
export class DeckComponent {
  public static readonly TYPE = 'deck';
  
  public library: any[] = []; // 牌库：所有拥有的卡牌
  public drawPile: any[] = []; // 抽牌堆：待抽的卡牌
  public discardPile: any[] = []; // 弃牌堆：打出/弃掉的卡牌

  constructor(config: Partial<DeckComponent> = {}) {
    Object.assign(this, config);
  }

  shuffleDrawPile(): void {
    for (let i = this.drawPile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
    }
  }

  drawCard(): any | null {
    if (this.drawPile.length === 0) {
      // 抽牌堆空了，洗弃牌堆到抽牌堆
      if (this.discardPile.length === 0) return null;
      this.drawPile = [...this.discardPile];
      this.discardPile = [];
      this.shuffleDrawPile();
    }
    return this.drawPile.pop();
  }

  discardCard(card: any): void {
    this.discardPile.push(card);
  }
}

/**
 * HandComponent - 手牌组件
 * 玩家当前持有的手牌
 */
export class HandComponent {
  public static readonly TYPE = 'hand';
  
  public cards: any[] = [];
  public maxHandSize: number = 8; // 手牌上限

  constructor(config: Partial<HandComponent> = {}) {
    Object.assign(this, config);
  }

  addCard(card: any): boolean {
    if (this.cards.length >= this.maxHandSize) return false;
    this.cards.push(card);
    return true;
  }

  removeCard(cardId: string): any | null {
    const index = this.cards.findIndex(c => c.identity?.uniqueId === cardId);
    if (index > -1) {
      return this.cards.splice(index, 1)[0];
    }
    return null;
  }
}

/**
 * EnergyComponent - 能量组件
 * 打牌消耗的能量
 */
export class EnergyComponent {
  public static readonly TYPE = 'energy';
  
  public current: number = 3;
  public max: number = 10;
  public regenPerTurn: number = 2; // 每回合恢复量

  constructor(config: Partial<EnergyComponent> = {}) {
    Object.assign(this, config);
  }

  spend(amount: number): boolean {
    if (amount < 0) return false;
    if (this.current >= amount) {
      this.current -= amount;
      return true;
    }
    return false;
  }

  regen(): void {
    this.current = Math.min(this.max, this.current + this.regenPerTurn);
  }
}

// ==========================================
// 任务组件 - Quest Components
// ==========================================

export type QuestType = '主线' | '日常' | '周常' | '活动' | '短期回合' | '中期阶段' | '长期通关';
export type QuestObjectiveType = '收集资源' | '升级卡牌' | '生产物品' | '拥有卡牌' | '达到等级' | '完成任务' | '卡牌满级' | '建筑满级' | '难度通关' | '组合技激活';

export interface QuestObjective {
  id: string;
  type: QuestObjectiveType;
  target: string; // 目标类型，比如资源类型、卡牌类型等
  requiredAmount: number;
  currentAmount: number;
  completed: boolean;
}

export interface QuestReward {
  type: '资源' | '卡牌' | '道具' | '经验' | '金币' | '称号' | '头像框';
  target: string;
  amount: number;
}

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  unlocked: boolean;
  completed: boolean;
  claimed: boolean;
  unlockCondition?: {
    type: QuestObjectiveType;
    target: string;
    amount: number;
  };
  dailyReset?: boolean;
  priority: number;
}

/**
 * QuestComponent - 任务组件
 * 玩家的任务列表和进度
 */
export class QuestComponent {
  public static readonly TYPE = 'quest';
  
  public quests: Quest[] = [];
  public completedQuests: string[] = [];
  public dailyResetTime: number = 86400000; // 24小时
  public lastDailyReset: number = Date.now();

  constructor(config: Partial<QuestComponent> = {}) {
    Object.assign(this, config);
  }
  
  /**
   * 添加新任务
   */
  addQuest(quest: Quest): boolean {
    if (this.quests.find(q => q.id === quest.id)) return false;
    this.quests.push(quest);
    return true;
  }
  
  /**
   * 更新任务进度
   */
  updateProgress(
    objectiveType: QuestObjectiveType,
    target: string,
    amount: number = 1
  ): void {
    this.quests.forEach(quest => {
      if (!quest.unlocked || quest.completed) return;
      
      quest.objectives.forEach(objective => {
        if (objective.type === objectiveType && 
            objective.target === target && 
            !objective.completed) {
          objective.currentAmount = Math.min(
            objective.requiredAmount,
            objective.currentAmount + amount
          );
          
          if (objective.currentAmount >= objective.requiredAmount) {
            objective.completed = true;
          }
          
          this.checkQuestCompletion(quest);
        }
      });
    });
  }
  
  /**
   * 检查任务是否完成
   */
  private checkQuestCompletion(quest: Quest): boolean {
    const allCompleted = quest.objectives.every(o => o.completed);
    if (allCompleted && !quest.completed) {
      quest.completed = true;
      this.completedQuests.push(quest.id);
      console.log(`✅ 任务完成: ${quest.title}`);
      return true;
    }
    return false;
  }
  
  /**
   * 领取任务奖励
   */
  claimRewards(questId: string): QuestReward[] | false {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return false;
    
    quest.claimed = true;
    return quest.rewards;
  }
  
  /**
   * 重置日常任务
   */
  resetDailyQuests(): void {
    const now = Date.now();
    if (now - this.lastDailyReset >= this.dailyResetTime) {
      this.quests = this.quests.filter(q => q.type !== '日常');
      this.lastDailyReset = now;
      console.log('🔄 日常任务已重置');
    }
  }
  
  /**
   * 获取可领取奖励的任务
   */
  getClaimableQuests(): Quest[] {
    return this.quests.filter(q => q.completed && !q.claimed);
  }
  
  /**
   * 获取进行中的任务
   */
  getActiveQuests(): Quest[] {
    return this.quests.filter(q => q.unlocked && !q.completed);
  }
}

// ==========================================
// 成就组件 - Achievement Components
// ==========================================

export type AchievementRarity = '普通' | '稀有' | '史诗' | '传说' | '隐藏';
export type AchievementConditionType = 
  '收集资源' | '升级卡牌' | '生产物品' | '拥有卡牌' | '达到等级' | 
  '完成任务' | '存活天数' | '获得成就' | '组合技激活' | '难度通关' |
  '无失败通关' | '收集所有卡牌' | '卡牌满级' | '建筑满级';

export interface AchievementCondition {
  type: AchievementConditionType;
  target: string;
  requiredAmount: number;
  currentAmount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: AchievementRarity;
  icon: string;
  points: number; // 成就点数
  hidden: boolean; // 是否是隐藏成就
  conditions: AchievementCondition[];
  unlocked: boolean;
  unlockedAt?: number; // 解锁时间戳
  rewards: Array<{
    type: '资源' | '卡牌' | '道具' | '头像框' | '称号';
    target: string;
    amount: number;
  }>;
}

/**
 * AchievementComponent - 成就组件
 * 玩家的成就列表和进度
 */
export class AchievementComponent {
  public static readonly TYPE = 'achievement';
  
  public achievements: Achievement[] = [];
  public totalPoints: number = 0;
  public unlockedCount: number = 0;
  public totalCount: number = 0;

  constructor(config: Partial<AchievementComponent> = {}) {
    Object.assign(this, config);
    this.totalCount = this.achievements.length;
  }
  
  /**
   * 添加成就
   */
  addAchievement(achievement: Achievement): boolean {
    if (this.achievements.find(a => a.id === achievement.id)) return false;
    this.achievements.push(achievement);
    this.totalCount = this.achievements.length;
    return true;
  }
  
  /**
   * 更新成就进度
   */
  updateProgress(
    conditionType: AchievementConditionType,
    target: string,
    amount: number = 1
  ): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    
    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;
      
      achievement.conditions.forEach(condition => {
        if (condition.type === conditionType && 
            condition.target === target) {
          condition.currentAmount = Math.min(
            condition.requiredAmount,
            condition.currentAmount + amount
          );
          
          // 检查是否解锁
          if (this.checkAchievementUnlocked(achievement)) {
            achievement.unlocked = true;
            achievement.unlockedAt = Date.now();
            this.unlockedCount++;
            this.totalPoints += achievement.points;
            newlyUnlocked.push(achievement);
            console.log(`🏆 成就解锁: [${achievement.rarity}] ${achievement.name}`);
          }
        }
      });
    });
    
    return newlyUnlocked;
  }
  
  /**
   * 检查成就是否解锁
   */
  private checkAchievementUnlocked(achievement: Achievement): boolean {
    return achievement.conditions.every(c => c.currentAmount >= c.requiredAmount);
  }
  
  /**
   * 获取已解锁成就
   */
  getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlocked);
  }
  
  /**
   * 获取未解锁成就（隐藏成就仅在解锁后显示）
   */
  getVisibleAchievements(): Achievement[] {
    return this.achievements.filter(a => !a.hidden || a.unlocked);
  }
  
  /**
   * 获取成就完成率
   */
  getCompletionRate(): number {
    return Math.round((this.unlockedCount / this.totalCount) * 100);
  }
}

// ==========================================
// 难度系统组件 - Difficulty Components
// ==========================================

export interface DifficultyLevelConfig {
  level: number;
  name: string;
  description: string;
  resourceMultiplier: number; // 资源获取倍数
  productionMultiplier: number; // 生产效率倍数
  enemyHealthMultiplier: number; // 敌人生命值倍数
  enemyDamageMultiplier: number; // 敌人伤害倍数
  rewardMultiplier: number; // 奖励倍数
  unlockCondition: {
    type: AchievementConditionType;
    target: string;
    amount: number;
  };
  unlocked: boolean;
}

/**
 * DifficultyComponent - 难度组件
 * 游戏的难度等级配置和当前难度
 */
export class DifficultyComponent {
  public static readonly TYPE = 'difficulty';
  
  public currentLevel: number = 1;
  public maxLevel: number = 20;
  public levels: DifficultyLevelConfig[] = [];
  public difficultyBonus: number = 0; // 当前难度额外加成

  constructor(config: Partial<DifficultyComponent> = {}) {
    Object.assign(this, config);
    this.initializeDefaultLevels();
  }
  
  /**
   * 初始化默认20级难度配置
   */
  private initializeDefaultLevels(): void {
    for (let i = 1; i <= 20; i++) {
      const levelConfig: DifficultyLevelConfig = {
        level: i,
        name: this.getDifficultyName(i),
        description: this.getDifficultyDescription(i),
        resourceMultiplier: 1 - (i - 1) * 0.05, // 每级减少5%资源获取
        productionMultiplier: 1 - (i - 1) * 0.03, // 每级减少3%生产效率
        enemyHealthMultiplier: 1 + (i - 1) * 0.1, // 每级增加10%敌人生命
        enemyDamageMultiplier: 1 + (i - 1) * 0.08, // 每级增加8%敌人伤害
        rewardMultiplier: 1 + (i - 1) * 0.15, // 每级增加15%奖励
        unlockCondition: i === 1 ? {
          type: '达到等级',
          target: '玩家',
          amount: 1
        } : {
          type: '难度通关',
          target: `${i - 1}`,
          amount: 1
        },
        unlocked: i === 1
      };
      
      this.levels.push(levelConfig);
    }
  }
  
  /**
   * 获取难度名称
   */
  private getDifficultyName(level: number): string {
    if (level <= 5) return '新手';
    if (level <= 10) return '普通';
    if (level <= 15) return '困难';
    if (level <= 18) return '专家';
    return '极限';
  }
  
  /**
   * 获取难度描述
   */
  private getDifficultyDescription(level: number): string {
    const resourceReduction = (level - 1) * 5;
    const enemyBuff = (level - 1) * 10;
    const rewardBonus = (level - 1) * 15;
    return `难度 ${level}: 资源获取-${resourceReduction}%，敌人属性+${enemyBuff}%，奖励+${rewardBonus}%`;
  }
  
  /**
   * 获取当前难度配置
   */
  getCurrentDifficulty(): DifficultyLevelConfig {
    return this.levels.find(l => l.level === this.currentLevel) || this.levels[0];
  }
  
  /**
   * 提升难度
   */
  increaseLevel(): boolean {
    if (this.currentLevel >= this.maxLevel) return false;
    const nextLevel = this.levels.find(l => l.level === this.currentLevel + 1);
    if (!nextLevel || !nextLevel.unlocked) return false;
    
    this.currentLevel++;
    this.difficultyBonus = (this.currentLevel - 1) * 0.1;
    console.log(`🔼 难度提升至 ${this.currentLevel} 级: ${nextLevel.name}`);
    return true;
  }
  
  /**
   * 解锁难度等级
   */
  unlockLevel(level: number): boolean {
    const levelConfig = this.levels.find(l => l.level === level);
    if (!levelConfig || levelConfig.unlocked) return false;
    
    levelConfig.unlocked = true;
    console.log(`🔓 难度解锁: ${level}级 ${levelConfig.name}`);
    return true;
  }
  
  /**
   * 获取已解锁的难度列表
   */
  getUnlockedLevels(): DifficultyLevelConfig[] {
    return this.levels.filter(l => l.unlocked);
  }
}

// ==========================================
// UI通知组件 - UI Notification Components
// ==========================================

export type NotificationType = '任务进度' | '任务完成' | '成就解锁' | '难度提升' | '奖励获得' | '系统提示';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  duration: number; // 显示时长，毫秒
  createdAt: number;
  read: boolean;
  priority: number; // 优先级，越高越先显示
  animation?: string; // 动画类型：fade-in, slide-up, bounce, etc.
}

/**
 * NotificationComponent - 通知组件
 * 管理游戏中的UI提示和通知
 */
export class NotificationComponent {
  public static readonly TYPE = 'notification';
  
  public notifications: Notification[] = [];
  public maxNotifications: number = 5; // 最大同时显示的通知数

  constructor(config: Partial<NotificationComponent> = {}) {
    Object.assign(this, config);
  }
  
  /**
   * 发送通知
   */
  sendNotification(
    type: NotificationType,
    title: string,
    message: string,
    options: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message' | 'createdAt'>> = {}
  ): string {
    const id = `notify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: options.duration || 3000,
      createdAt: Date.now(),
      read: false,
      priority: options.priority || 0,
      icon: options.icon,
      animation: options.animation || 'slide-up'
    };
    
    // 插入并按优先级排序
    this.notifications.push(notification);
    this.notifications.sort((a, b) => b.priority - a.priority);
    
    // 超过最大数量时删除最旧的低优先级通知
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }
    
    return id;
  }
  
  /**
   * 获取需要显示的通知
   */
  getActiveNotifications(): Notification[] {
    const now = Date.now();
    return this.notifications.filter(n => !n.read && now - n.createdAt < n.duration);
  }
  
  /**
   * 标记通知为已读
   */
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }
  
  /**
   * 清理过期通知
   */
  cleanupExpired(): void {
    const now = Date.now();
    this.notifications = this.notifications.filter(n => 
      !n.read && now - n.createdAt < n.duration
    );
  }
}

// ==========================================
// 世界组件 - World Components
// ==========================================

/**
 * WorldComponent - 世界状态组件
 */
export class WorldComponent {
  public static readonly TYPE = 'world';
  
  public dayNightCycle: number = 0;
  public currentDay: number = 1;
  public difficulty: '简单' | '中等' | '困难' | '极限' = '中等';
  public events: Array<{
    name: string;
    type: string;
    duration: number;
    effects: Array<{ property: string; value: number }>;
    active: boolean;
  }> = [];

  constructor(config: Partial<WorldComponent> = {}) {
    Object.assign(this, config);
  }

  getWeatherEffect(): number {
    // 根据昼夜周期计算天气效果
    return Math.sin(this.dayNightCycle / 10000) * 0.5 + 0.5;
  }
}

/**
 * GameStateComponent - 游戏状态组件
 */
export class GameStateComponent {
  public static readonly TYPE = 'gameState';
  
  public gamePhase: '菜单' | '游戏中' | '战斗' | '升级' | '结束' = '菜单';
  public score: number = 0;
  public combo: number = 0;
  public streak: number = 0;
  public highScore: number = 0;
  public playTime: number = 0;

  constructor(config: Partial<GameStateComponent> = {}) {
    Object.assign(this, config);
  }

  increaseCombo() {
    this.combo++;
    this.score += Math.floor(this.combo * 1.5);
  }

  resetCombo() {
    if (this.combo > 5) {
      this.streak++;
    }
    this.combo = 0;
  }
}

/**
 * ComboComponent - 组合技组件
 * 跟踪激活的组合技和效果
 */
export class ComboComponent {
  public static readonly TYPE = 'combo';
  
  public activeCombos: Array<{
    id: string;
    name: string;
    description: string;
    effect: string;
    activatedAt: number;
    duration?: number; // 持续时间，undefined表示永久生效直到条件不满足
    strength: number;
    active: boolean;
  }> = [];

  constructor(config: Partial<ComboComponent> = {}) {
    Object.assign(this, config);
  }

  // 激活组合技
  activateCombo(
    id: string,
    name: string,
    description: string,
    effect: string,
    strength: number,
    duration?: number
  ): boolean {
    const existing = this.activeCombos.find(c => c.id === id);
    if (existing) {
      existing.active = true;
      existing.activatedAt = Date.now();
      existing.strength = strength;
      if (duration) existing.duration = duration;
      return false; // 已存在，更新状态
    }

    this.activeCombos.push({
      id, name, description, effect, strength,
      activatedAt: Date.now(), duration, active: true
    });
    return true; // 新激活
  }

  // 失效组合技
  deactivateCombo(id: string): boolean {
    const combo = this.activeCombos.find(c => c.id === id);
    if (combo) {
      combo.active = false;
      return true;
    }
    return false;
  }

  // 检查组合是否激活
  isComboActive(id: string): boolean {
    return this.activeCombos.some(c => c.id === id && c.active);
  }

  // 获取所有激活的组合
  getActiveCombos() {
    return this.activeCombos.filter(c => c.active);
  }

  // 更新组合状态
  update(dt: number) {
    this.activeCombos.forEach(combo => {
      if (combo.duration && combo.active) {
        combo.duration -= dt;
        if (combo.duration <= 0) {
          combo.active = false;
        }
      }
    });
  }
}

// ==========================================
// 组件注册表 - Component Registry
// ==========================================

// ==========================================
// 随机事件系统组件 - Random Event Components
// ==========================================

export type EventType = '正面' | '负面' | '中性' | '灾害';
export type EventTrigger = '回合开始' | '回合结束' | '使用卡牌' | '收获资源' | '升级卡牌' | '随机';

export interface EventEffect {
  type: '资源变更' | '卡牌效果变更' | '生产效率变更' | '天气变更' | '获得卡牌' | '失去卡牌' | '获得遗物' | '触发其他事件';
  target: string;
  value: number | string | any;
  duration?: number; // 持续回合数，undefined表示立即生效
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;
  trigger: EventTrigger;
  weight: number; // 触发权重，数值越大越容易触发
  levelRequirement: number; // 最低等级要求
  effects: EventEffect[];
  cooldown: number; // 触发后冷却回合数
  duration?: number; // 事件持续回合数
  active: boolean;
  remainingDuration: number; // 剩余持续回合数
}

/**
 * EventSystemComponent - 随机事件系统组件
 * 管理所有事件的配置、触发和效果
 */
export class EventSystemComponent {
  public static readonly TYPE = 'eventSystem';
  
  public eventConfig: GameEvent[] = []; // 所有事件配置
  public activeEvents: GameEvent[] = []; // 当前激活的事件
  public eventCooldowns: { [eventId: string]: number } = {}; // 事件冷却计数
  public eventTriggerChance: number = 0.3; // 每回合基础触发概率30%

  constructor(config: Partial<EventSystemComponent> = {}) {
    Object.assign(this, config);
  }

  /**
   * 注册新事件配置
   */
  registerEvent(event: GameEvent): void {
    if (!this.eventConfig.find(e => e.id === event.id)) {
      this.eventConfig.push(event);
    }
  }

  /**
   * 获取可触发的事件列表
   */
  getAvailableEvents(triggerType: EventTrigger, playerLevel: number): GameEvent[] {
    return this.eventConfig.filter(event => 
      event.trigger === triggerType && 
      playerLevel >= event.levelRequirement && 
      (!this.eventCooldowns[event.id] || this.eventCooldowns[event.id] <= 0)
    );
  }

  /**
   * 触发随机事件
   */
  triggerRandomEvent(triggerType: EventTrigger, playerLevel: number): GameEvent | null {
    const availableEvents = this.getAvailableEvents(triggerType, playerLevel);
    if (availableEvents.length === 0) return null;

    // 按权重随机选择
    const totalWeight = availableEvents.reduce((sum, e) => sum + e.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const event of availableEvents) {
      random -= event.weight;
      if (random <= 0) {
        // 激活事件
        const activatedEvent = { ...event };
        activatedEvent.active = true;
        activatedEvent.remainingDuration = event.duration ?? 1;
        this.activeEvents.push(activatedEvent);
        
        // 设置冷却
        this.eventCooldowns[event.id] = event.cooldown;
        
        return activatedEvent;
      }
    }

    return null;
  }

  /**
   * 更新事件状态，回合结束时调用
   */
  updateEvents(): void {
    // 减少冷却
    Object.keys(this.eventCooldowns).forEach(eventId => {
      if (this.eventCooldowns[eventId] > 0) {
        this.eventCooldowns[eventId]--;
      }
    });

    // 更新激活事件的持续时间
    this.activeEvents = this.activeEvents.filter(event => {
      event.remainingDuration--;
      return event.remainingDuration > 0;
    });
  }
}

// ==========================================
// 遗物系统组件 - Relic Components
// ==========================================

export type RelicRarity = '普通' | '稀有' | '史诗' | '传说';
export type RelicAcquisition = '事件奖励' | '任务奖励' | '商店购买' | '隐藏宝箱' | '成就奖励' | '动物繁殖';

export interface RelicEffect {
  type: '资源加成' | '生产加成' | '卡牌效果增强' | '事件概率调整' | '能量上限提升' | '手牌上限提升' | '特殊效果';
  target: string;
  value: number;
  condition?: string; // 生效条件
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: RelicRarity;
  acquisition: RelicAcquisition[];
  effects: RelicEffect[];
  levelRequirement: number;
  unique: boolean; // 是否唯一，只能拥有一个
  active: boolean;
  stackable: boolean; // 是否可叠加
  stackCount: number; // 当前叠加层数
}

/**
 * RelicComponent - 遗物组件
 * 玩家拥有的遗物和效果
 */
export class RelicComponent {
  public static readonly TYPE = 'relic';
  
  public relics: Relic[] = []; // 拥有的所有遗物
  public relicConfig: Relic[] = []; // 所有遗物配置

  constructor(config: Partial<RelicComponent> = {}) {
    Object.assign(this, config);
  }

  /**
   * 注册遗物配置
   */
  registerRelic(relic: Relic): void {
    if (!this.relicConfig.find(r => r.id === relic.id)) {
      this.relicConfig.push(relic);
    }
  }

  /**
   * 获得遗物
   */
  addRelic(relicId: string): boolean {
    const relicConfig = this.relicConfig.find(r => r.id === relicId);
    if (!relicConfig) return false;

    // 检查是否唯一且已拥有
    if (relicConfig.unique && this.relics.find(r => r.id === relicId)) {
      return false;
    }

    // 检查是否可叠加
    if (relicConfig.stackable) {
      const existing = this.relics.find(r => r.id === relicId);
      if (existing) {
        existing.stackCount++;
        return true;
      }
    }

    // 添加新遗物
    const newRelic = { ...relicConfig };
    newRelic.active = true;
    newRelic.stackCount = 1;
    this.relics.push(newRelic);
    
    return true;
  }

  /**
   * 移除遗物
   */
  removeRelic(relicId: string): boolean {
    const index = this.relics.findIndex(r => r.id === relicId);
    if (index !== -1) {
      this.relics.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 获取所有激活的遗物效果
   */
  getActiveEffects(): RelicEffect[] {
    const effects: RelicEffect[] = [];
    this.relics.filter(r => r.active).forEach(relic => {
      relic.effects.forEach(effect => {
        effects.push({
          ...effect,
          value: effect.value * relic.stackCount
        });
      });
    });
    return effects;
  }

  /**
   * 按类型获取遗物效果总和
   */
  getEffectSum(type: string, target: string): number {
    return this.getActiveEffects()
      .filter(e => e.type === type && e.target === target)
      .reduce((sum, e) => sum + e.value, 0);
  }
}

// ==========================================
// 意图提示系统组件 - Intent Preview Component
// ==========================================

export type IntentType = '灾害预警' | '价格波动' | '特殊事件' | '天气变化';

export interface FutureIntent {
  type: IntentType;
  name: string;
  description: string;
  round: number; // 会在第几回合发生
  severity: '低' | '中' | '高';
}

/**
 * IntentPreviewComponent - 意图提示组件
 * 提前显示未来会发生的事件
 */
export class IntentPreviewComponent {
  public static readonly TYPE = 'intentPreview';
  
  public futureIntents: FutureIntent[] = []; // 未来的事件列表
  public previewRounds: number = 2; // 提前显示多少回合的事件

  constructor(config: Partial<IntentPreviewComponent> = {}) {
    Object.assign(this, config);
  }

  /**
   * 添加未来事件提示
   */
  addIntent(intent: FutureIntent): void {
    this.futureIntents.push(intent);
    // 按回合排序
    this.futureIntents.sort((a, b) => a.round - b.round);
  }

  /**
   * 获取当前需要显示的意图
   */
  getCurrentIntents(currentRound: number): FutureIntent[] {
    return this.futureIntents.filter(intent => 
      intent.round >= currentRound && 
      intent.round <= currentRound + this.previewRounds
    );
  }

  /**
   * 回合结束时更新意图状态
   */
  updateIntents(currentRound: number): void {
    // 移除已经发生的事件
    this.futureIntents = this.futureIntents.filter(intent => intent.round > currentRound);
  }
}

// ==========================================
// 卡组管理扩展 - Deck Management Extension
// ==========================================

// 扩展DeckComponent，添加删除卡牌和升级卡牌功能
declare module './components' {
  interface DeckComponent {
    removeCardFromLibrary(cardId: string): boolean;
    upgradeCard(cardId: string): boolean;
    getUpgradableCards(): any[];
  }
}

DeckComponent.prototype.removeCardFromLibrary = function(cardId: string): boolean {
  const index = this.library.findIndex(c => c.identity?.uniqueId === cardId);
  if (index !== -1) {
    this.library.splice(index, 1);
    // 同时从抽牌堆和弃牌堆移除
    this.drawPile = this.drawPile.filter(c => c.identity?.uniqueId !== cardId);
    this.discardPile = this.discardPile.filter(c => c.identity?.uniqueId !== cardId);
    return true;
  }
  return false;
};

DeckComponent.prototype.upgradeCard = function(cardId: string): boolean {
  const card = this.library.find(c => c.identity?.uniqueId === cardId);
  if (!card || !card.upgrade) return false;
  
  // 提升卡牌等级
  card.identity.level = (card.identity.level || 1) + 1;
  
  // 应用升级效果
  if (card.upgrade.currentUpgrades) {
    card.upgrade.currentUpgrades.forEach(upgrade => {
      upgrade.effects.forEach(effect => {
        if (card[effect.property] !== undefined) {
          if (typeof card[effect.property] === 'number') {
            card[effect.property] += effect.value;
          } else if (typeof card[effect.property] === 'object') {
            Object.assign(card[effect.property], effect.value);
          }
        }
      });
    });
  }
  
  return true;
};

DeckComponent.prototype.getUpgradableCards = function(): any[] {
  return this.library.filter(card => 
    card.upgrade && 
    card.identity && 
    card.identity.level < 10 // 最高等级10
  );
};

// ==========================================
// 金币目标系统组件 - Gold Target System Components
// ==========================================

export interface GoldTargetReward {
  type: '资源' | '卡牌' | '道具' | '遗物' | '经验';
  target: string;
  amount: number;
  rarity?: string;
}

export interface GoldTargetPhase {
  id: string;
  name: string;
  startDay: number;
  endDay: number;
  baseTarget: number;
  rewards: GoldTargetReward[];
  completed: boolean;
  claimed: boolean;
}

export interface DailyGoldTarget {
  day: number;
  target: number;
  current: number;
  completed: boolean;
  claimed: boolean;
  rewards: GoldTargetReward[];
}

/**
 * GoldTargetComponent - 长线金币目标系统组件
 * 实现对数成长曲线的每日/阶段金币目标
 */
export class GoldTargetComponent {
  public static readonly TYPE = 'goldTarget';
  
  // 配置参数
  public baseDailyTarget: number = 100; // 第1天基础目标
  public logBase: number = Math.E; // 对数基数
  public growthMultiplier: number = 150; // 成长系数
  public phaseLength: number = 7; // 阶段长度（天）
  public phaseRewardMultiplier: number = 2.5; // 阶段奖励倍数
  
  // 状态数据
  public dailyTargets: DailyGoldTarget[] = [];
  public phases: GoldTargetPhase[] = [];
  public totalGoldEarned: number = 0; // 历史总金币获得
  public currentStreak: number = 0; // 连续完成天数
  public maxStreak: number = 0; // 最高连续完成天数
  public lastClaimedDay: number = 0; // 上次领取奖励的天数
  
  // 异常检测参数
  public abnormalThreshold: number = 3.0; // 异常阈值：超过目标3倍视为异常
  public abnormalRecords: Array<{
    day: number;
    goldAmount: number;
    target: number;
    timestamp: number;
    reason: string;
  }> = [];

  constructor(config: Partial<GoldTargetComponent> = {}) {
    Object.assign(this, config);
    this.initializePhases();
  }
  
  /**
   * 初始化阶段目标
   */
  private initializePhases(): void {
    // 预创建12个阶段（12周）
    for (let i = 1; i <= 12; i++) {
      const startDay = (i - 1) * this.phaseLength + 1;
      const endDay = i * this.phaseLength;
      const baseTarget = this.calculatePhaseBaseTarget(i);
      
      this.phases.push({
        id: `phase_${i}`,
        name: `第${i}周目标`,
        startDay,
        endDay,
        baseTarget,
        rewards: this.generatePhaseRewards(i),
        completed: false,
        claimed: false
      });
    }
  }
  
  /**
   * 计算指定天数的每日金币目标（对数成长曲线）
   * 公式：target = baseDailyTarget + growthMultiplier * ln(day)
   */
  calculateDailyTarget(day: number): number {
    if (day <= 0) day = 1;
    const target = this.baseDailyTarget + this.growthMultiplier * Math.log(day + 1) / Math.log(this.logBase);
    return Math.round(target);
  }
  
  /**
   * 计算阶段基础目标
   */
  private calculatePhaseBaseTarget(phaseIndex: number): number {
    let total = 0;
    const startDay = (phaseIndex - 1) * this.phaseLength + 1;
    const endDay = phaseIndex * this.phaseLength;
    
    for (let day = startDay; day <= endDay; day++) {
      total += this.calculateDailyTarget(day);
    }
    
    return Math.round(total * 0.9); // 阶段目标比每日总和略低，降低难度
  }
  
  /**
   * 生成阶段奖励
   */
  private generatePhaseRewards(phaseIndex: number): GoldTargetReward[] {
    const rarity = phaseIndex <= 4 ? '普通' : phaseIndex <= 8 ? '稀有' : '史诗';
    return [
      {
        type: '资源',
        target: '金币',
        amount: Math.round(100 * phaseIndex * this.phaseRewardMultiplier)
      },
      {
        type: '道具',
        target: '高级肥料',
        amount: phaseIndex,
        rarity
      }
    ];
  }
  
  /**
   * 生成每日奖励
   */
  private generateDailyRewards(day: number): GoldTargetReward[] {
    return [
      {
        type: '资源',
        target: '金币',
        amount: Math.round(this.calculateDailyTarget(day) * 0.1)
      },
      {
        type: '资源',
        target: '木材',
        amount: Math.round(10 + day * 2)
      }
    ];
  }
  
  /**
   * 获取或创建指定天数的每日目标
   */
  getDailyTarget(day: number): DailyGoldTarget {
    let target = this.dailyTargets.find(t => t.day === day);
    if (!target) {
      target = {
        day,
        target: this.calculateDailyTarget(day),
        current: 0,
        completed: false,
        claimed: false,
        rewards: this.generateDailyRewards(day)
      };
      this.dailyTargets.push(target);
    }
    return target;
  }
  
  /**
   * 更新每日目标进度
   * @param goldAmount 新增金币数量
   * @param currentDay 当前游戏天数
   */
  updateProgress(goldAmount: number, currentDay: number): {
    dailyCompleted: boolean,
    phaseCompleted: GoldTargetPhase | null,
    isAbnormal: boolean
  } {
    // 累计总金币
    this.totalGoldEarned += goldAmount;
    
    // 获取当前日目标
    const dailyTarget = this.getDailyTarget(currentDay);
    let dailyCompleted = false;
    let phaseCompleted: GoldTargetPhase | null = null;
    let isAbnormal = false;
    
    // 异常检测
    if (goldAmount > dailyTarget.target * this.abnormalThreshold) {
      isAbnormal = true;
      this.abnormalRecords.push({
        day: currentDay,
        goldAmount,
        target: dailyTarget.target,
        timestamp: Date.now(),
        reason: `单次日获得金币${goldAmount}超过当日目标${dailyTarget.target}的${this.abnormalThreshold}倍`
      });
      // 异常情况下只计入目标金额的10%，防止作弊
      goldAmount = Math.round(dailyTarget.target * 0.1);
    }
    
    if (!dailyTarget.completed) {
      dailyTarget.current = Math.min(dailyTarget.current + goldAmount, dailyTarget.target * 2);
      
      // 检查是否完成每日目标
      if (dailyTarget.current >= dailyTarget.target && !dailyTarget.completed) {
        dailyTarget.completed = true;
        dailyCompleted = true;
        this.currentStreak++;
        this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
      }
    }
    
    // 检查阶段目标完成情况
    const currentPhase = this.getCurrentPhase(currentDay);
    if (currentPhase && !currentPhase.completed) {
      const phaseTotal = this.calculatePhaseProgress(currentPhase);
      if (phaseTotal >= currentPhase.baseTarget) {
        currentPhase.completed = true;
        phaseCompleted = currentPhase;
      }
    }
    
    return { dailyCompleted, phaseCompleted, isAbnormal };
  }
  
  /**
   * 获取当前所属阶段
   */
  getCurrentPhase(currentDay: number): GoldTargetPhase | null {
    return this.phases.find(phase => 
      currentDay >= phase.startDay && currentDay <= phase.endDay
    ) || null;
  }
  
  /**
   * 计算阶段目标进度
   */
  calculatePhaseProgress(phase: GoldTargetPhase): number {
    let total = 0;
    for (let day = phase.startDay; day <= phase.endDay; day++) {
      const daily = this.getDailyTarget(day);
      total += Math.min(daily.current, daily.target);
    }
    return total;
  }
  
  /**
   * 领取每日奖励
   */
  claimDailyReward(day: number): GoldTargetReward[] | false {
    const target = this.getDailyTarget(day);
    if (!target.completed || target.claimed) return false;
    
    target.claimed = true;
    this.lastClaimedDay = day;
    return target.rewards;
  }
  
  /**
   * 领取阶段奖励
   */
  claimPhaseReward(phaseId: string): GoldTargetReward[] | false {
    const phase = this.phases.find(p => p.id === phaseId);
    if (!phase || !phase.completed || phase.claimed) return false;
    
    phase.claimed = true;
    return phase.rewards;
  }
  
  /**
   * 检查连续天数是否中断（新的一天开始时调用）
   */
  checkStreakBreak(currentDay: number): boolean {
    if (currentDay <= 1) return false;
    
    const previousDay = currentDay - 1;
    const prevTarget = this.getDailyTarget(previousDay);
    
    if (!prevTarget.completed) {
      const oldStreak = this.currentStreak;
      this.currentStreak = 0;
      console.log(`🔥 连续完成天数中断，之前连续${oldStreak}天`);
      return true;
    }
    
    return false;
  }
  
  /**
   * 获取当前进度统计
   */
  getStats() {
    const completedDaily = this.dailyTargets.filter(t => t.completed).length;
    const completedPhases = this.phases.filter(p => p.completed).length;
    
    return {
      totalGoldEarned: this.totalGoldEarned,
      currentStreak: this.currentStreak,
      maxStreak: this.maxStreak,
      completedDailyCount: completedDaily,
      totalDays: this.dailyTargets.length,
      completedPhaseCount: completedPhases,
      totalPhases: this.phases.length,
      completionRate: this.dailyTargets.length > 0 
        ? Math.round((completedDaily / this.dailyTargets.length) * 100)
        : 0
    };
  }
  
  /**
   * 获取异常记录
   */
  getAbnormalRecords(limit: number = 10) {
    return [...this.abnormalRecords].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  }
}

export const COMPONENT_REGISTRY = {
  'identity': IdentityComponent,
  'position': PositionComponent,
  'dimensions': DimensionsComponent,
  'resource': ResourceComponent,
  'production': ProductionComponent,
  'card': CardComponent,
  'crop': CropComponent,
  'animal': AnimalComponent,
  'tool': ToolComponent,
  'building': BuildingComponent,
  'character': CharacterComponent,
  'upgradeTree': UpgradeTreeComponent,
  'upgrade': UpgradeComponent,
  'combat': CombatComponent,
  'effect': EffectComponent,
  'world': WorldComponent,
  'gameState': GameStateComponent,
  'deck': DeckComponent,
  'hand': HandComponent,
  'energy': EnergyComponent,
  'combo': ComboComponent,
  'quest': QuestComponent,
  'achievement': AchievementComponent,
  'difficulty': DifficultyComponent,
  'notification': NotificationComponent,
  'eventSystem': EventSystemComponent,
  'relic': RelicComponent,
  'intentPreview': IntentPreviewComponent,
  'goldTarget': GoldTargetComponent
};

// ==========================================
// 实体工厂 - Entity Factory
// ==========================================

export class EntityFactory {
  static createCardEntity(
    type: '作物' | '动物' | '工具' | '建筑' | '人物',
    config: any = {}
  ): any {
    const entity = {};
    
    // 添加基础组件
    entity['identity'] = new IdentityComponent({
      entityType: type,
      ...config.identity
    });
    
    entity['position'] = new PositionComponent(
      config.position?.x ?? 0,
      config.position?.y ?? 0
    );
    
    entity['dimensions'] = new DimensionsComponent(
      config.dimensions?.width ?? 1,
      config.dimensions?.height ?? 1
    );
    
    // 添加卡牌特定组件
    entity['card'] = new CardComponent({
      cardType: type,
      ...config.card
    });
    
    // 根据类型添加特定组件
    switch (type) {
      case '作物':
        entity['crop'] = new CropComponent(config.crop);
        entity['production'] = new ProductionComponent(config.production);
        break;
      case '动物':
        entity['animal'] = new AnimalComponent(config.animal);
        entity['production'] = new ProductionComponent(config.production);
        break;
      case '工具':
        entity['tool'] = new ToolComponent(config.tool);
        entity['combat'] = new CombatComponent(config.combat);
        break;
      case '建筑':
        entity['building'] = new BuildingComponent(config.building);
        entity['production'] = new ProductionComponent(config.production);
        entity['resource'] = new ResourceComponent(config.resource);
        break;
      case '人物':
        entity['character'] = new CharacterComponent(config.character);
        entity['combat'] = new CombatComponent(config.combat);
        break;
    }
    
    // 添加升级组件
    entity['upgrade'] = new UpgradeComponent(config.upgrade);
    entity['upgradeTree'] = new UpgradeTreeComponent(config.upgradeTree);
    
    return entity;
  }

  static createPlayerEntity(config: any = {}): any {
    // 创建初始牌组
    const initialDeck = new DeckComponent();
    
    // 初始卡牌：6张小麦、2张小鸡、1张锄头、1张农舍
    for (let i = 0; i < 6; i++) {
      initialDeck.library.push(EntityFactory.createCardEntity('作物', {
        identity: { name: '小麦', description: '基础作物，种植后生产作物资源' }
      }));
    }
    for (let i = 0; i < 2; i++) {
      initialDeck.library.push(EntityFactory.createCardEntity('动物', {
        identity: { name: '小鸡', description: '养殖后生产动物资源' }
      }));
    }
    initialDeck.library.push(EntityFactory.createCardEntity('工具', {
      identity: { name: '锄头', description: '提升耕作效率' }
    }));
    initialDeck.library.push(EntityFactory.createCardEntity('建筑', {
      identity: { name: '小型农舍', description: '提升资源存储上限' }
    }));
    
    // 初始化抽牌堆
    initialDeck.drawPile = [...initialDeck.library];
    initialDeck.shuffleDrawPile();
    
    const entity = {
      'identity': new IdentityComponent({
        name: '玩家',
        entityType: '玩家',
        ...config.identity
      }),
      'resource': new ResourceComponent(config.resource),
      'combat': new CombatComponent(config.combat),
      'character': new CharacterComponent(config.character),
      'upgrade': new UpgradeComponent(config.upgrade),
      'gameState': new GameStateComponent(config.gameState),
      'deck': initialDeck,
      'hand': new HandComponent(config.hand),
      'energy': new EnergyComponent(config.energy),
      'quest': new QuestComponent(config.quest),
      'combo': new ComboComponent(config.combo),
      'achievement': new AchievementComponent(config.achievement),
      'difficulty': new DifficultyComponent(config.difficulty),
      'notification': new NotificationComponent(config.notification),
      'goldTarget': new GoldTargetComponent(config.goldTarget)
    };
    
    return entity;
  }

  static createWorldEntity(config: any = {}): any {
    const entity = {
      'identity': new IdentityComponent({
        name: '世界',
        entityType: '世界',
        ...config.identity
      }),
      'world': new WorldComponent(config.world),
      'resource': new ResourceComponent(config.resource),
      'gameState': new GameStateComponent(config.gameState)
    };
    
    return entity;
  }
}

// ==========================================
// 组件创建和管理工具
// ==========================================

export function createComponent(type: string, config?: any) {
  const ComponentClass = COMPONENT_REGISTRY[type];
  if (!ComponentClass) return null;
  
  return new ComponentClass(config);
}

export function getComponent(entity: any, type: string): any {
  return entity[type];
}

export function addComponent(entity: any, type: string, config?: any) {
  if (entity[type]) return false;
  
  const component = createComponent(type, config);
  if (component) {
    entity[type] = component;
    return true;
  }
  
  return false;
}

export function removeComponent(entity: any, type: string): boolean {
  if (!entity[type]) return false;
  
  delete entity[type];
  return true;
}

export function hasComponent(entity: any, type: string): boolean {
  return !!entity[type];
}
