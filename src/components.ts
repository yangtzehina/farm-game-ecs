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
    if (!this.resources[type]) return false;
    if (this.resources[type] + amount > this.maxStorage[type]) return false;
    
    this.resources[type] += amount;
    return true;
  }

  removeResource(type: string, amount: number): boolean {
    if (!this.resources[type]) return false;
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

export type QuestType = '主线' | '日常' | '周常' | '活动';
export type QuestObjectiveType = '收集资源' | '升级卡牌' | '生产物品' | '拥有卡牌' | '达到等级' | '完成任务';

export interface QuestObjective {
  id: string;
  type: QuestObjectiveType;
  target: string; // 目标类型，比如资源类型、卡牌类型等
  requiredAmount: number;
  currentAmount: number;
  completed: boolean;
}

export interface QuestReward {
  type: '资源' | '卡牌' | '道具' | '经验' | '金币';
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
  'quest': QuestComponent
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
      'combo': new ComboComponent(config.combo)
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
