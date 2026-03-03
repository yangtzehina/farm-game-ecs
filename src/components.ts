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
    '金币': 1000,
    '木材': 500,
    '石头': 300,
    '作物': 200,
    '动物': 100
  };

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
  public growTimePerStage: number = 5000; // 5秒每阶段
  public yield: number = 1;
  public quality: number = 1.0;
  public fertilityBonus: number = 0;

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
    '木材': 50
  };

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
  'gameState': GameStateComponent
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
      'gameState': new GameStateComponent(config.gameState)
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
