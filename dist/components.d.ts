/**
 * 🏡 农庄卡牌：田园物语 - ECS系统设计
 *
 * 资深ECS系统设计专家视角
 * 遵循Data-Oriented Design原则
 * 优先设计数据Component，再设计System
 */
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
/**
 * IdentityComponent - 身份标识组件
 * 所有实体都应包含
 */
export declare class IdentityComponent {
    static readonly TYPE = "identity";
    name: string;
    description: string;
    entityType: string;
    tier: number;
    level: number;
    exp: number;
    maxExp: number;
    uniqueId: string;
    constructor(config?: Partial<IdentityComponent>);
}
/**
 * PositionComponent - 位置组件
 * 用于布局和空间计算
 */
export declare class PositionComponent {
    static readonly TYPE = "position";
    x: number;
    y: number;
    rotation: number;
    constructor(x?: number, y?: number, rotation?: number);
}
/**
 * DimensionsComponent - 尺寸组件
 * 用于渲染和碰撞检测
 */
export declare class DimensionsComponent {
    static readonly TYPE = "dimensions";
    width: number;
    height: number;
    constructor(width?: number, height?: number);
}
/**
 * ResourceComponent - 资源组件
 * 实体的资源存储和生产
 */
export declare class ResourceComponent {
    static readonly TYPE = "resource";
    resources: {
        [key: string]: number;
    };
    production: {
        [key: string]: number;
    };
    maxStorage: {
        [key: string]: number;
    };
    addResource(type: string, amount: number): boolean;
    removeResource(type: string, amount: number): boolean;
}
/**
 * ProductionComponent - 生产组件
 * 实体的生产能力
 */
export declare class ProductionComponent {
    static readonly TYPE = "production";
    rate: number;
    productionTime: number;
    nextProduction: number;
    efficiency: number;
    quality: number;
    automation: boolean;
    calculateProduction(baseAmount: number, efficiency: number, quality: number): number;
}
/**
 * CardComponent - 卡牌基础组件
 * 所有卡牌实体的基类
 */
export declare class CardComponent {
    static readonly TYPE = "card";
    cardType: '作物' | '动物' | '工具' | '建筑' | '人物';
    energyCost: number;
    cooldown: number;
    maxCooldown: number;
    constructor(config?: Partial<CardComponent>);
}
/**
 * CropComponent - 作物卡牌组件
 */
export declare class CropComponent {
    static readonly TYPE = "crop";
    growthStage: number;
    maxGrowthStage: number;
    growthTime: number;
    growTimePerStage: number;
    yield: number;
    quality: number;
    fertilityBonus: number;
    calculateYield(): number;
}
/**
 * AnimalComponent - 动物卡牌组件
 */
export declare class AnimalComponent {
    static readonly TYPE = "animal";
    productivity: number;
    consumption: number;
    happiness: number;
    maxHappiness: number;
    age: number;
    maxAge: number;
    health: number;
    getProductionBonus(): number;
}
/**
 * ToolComponent - 工具卡牌组件
 */
export declare class ToolComponent {
    static readonly TYPE = "tool";
    efficiencyBonus: number;
    range: number;
    durability: number;
    maxDurability: number;
    toolType: '收获' | '耕作' | '建造' | '战斗';
    use(): boolean;
    repair(amount: number): boolean;
}
/**
 * BuildingComponent - 建筑卡牌组件
 */
export declare class BuildingComponent {
    static readonly TYPE = "building";
    buildTime: number;
    buildTimeRemaining: number;
    workers: number;
    maxWorkers: number;
    productivity: number;
    maintenanceCost: number;
    calculateProductionBonus(): number;
}
/**
 * CharacterComponent - 人物卡牌组件
 */
export declare class CharacterComponent {
    static readonly TYPE = "character";
    stats: Stats;
    skills: Array<{
        name: string;
        level: number;
        cooldown: number;
        maxCooldown: number;
        effect: string;
    }>;
    experience: number;
    level: number;
    job: string;
    addExperience(amount: number): boolean;
}
/**
 * UpgradeTreeComponent - 升级树组件
 * 卡牌的升级路径
 */
export declare class UpgradeTreeComponent {
    static readonly TYPE = "upgradeTree";
    upgrades: Array<{
        id: string;
        name: string;
        description: string;
        level: number;
        maxLevel: number;
        cost: {
            [key: string]: number;
        };
        unlockLevel: number;
        effects: Array<{
            property: string;
            value: number;
        }>;
    }>;
    getAvailableUpgrades(currentLevel: number): any[];
}
/**
 * UpgradeComponent - 升级组件
 * 当前实体的升级状态
 */
export declare class UpgradeComponent {
    static readonly TYPE = "upgrade";
    points: number;
    currentUpgrades: Array<{
        id: string;
        level: number;
        effects: Array<{
            property: string;
            value: number;
        }>;
    }>;
    upgradeCost: {
        [key: string]: number;
    };
    canUpgrade(upgradeCost: {
        [key: string]: number;
    }, currentResources: {
        [key: string]: number;
    }): boolean;
}
/**
 * CombatComponent - 战斗基础组件
 */
export declare class CombatComponent {
    static readonly TYPE = "combat";
    damage: number;
    defense: number;
    attackSpeed: number;
    range: number;
    accuracy: number;
    criticalChance: number;
    criticalMultiplier: number;
    attackPattern: '近战' | '远程' | '范围';
    calculateDamage(): number;
}
/**
 * EffectComponent - 效果组件
 * 应用于实体的状态效果
 */
export declare class EffectComponent {
    static readonly TYPE = "effect";
    effects: Array<{
        name: string;
        type: 'buff' | 'debuff';
        duration: number;
        maxDuration: number;
        strength: number;
        stacking: number;
        source: string;
    }>;
    addEffect(name: string, type: 'buff' | 'debuff', duration: number, strength: number, source: string): void;
    removeEffect(name: string, source?: string): void;
    updateEffects(dt: number): void;
}
/**
 * DeckComponent - 牌组组件
 * 玩家的卡牌库、抽牌堆、弃牌堆
 */
export declare class DeckComponent {
    static readonly TYPE = "deck";
    library: any[];
    drawPile: any[];
    discardPile: any[];
    shuffleDrawPile(): void;
    drawCard(): any | null;
    discardCard(card: any): void;
}
/**
 * HandComponent - 手牌组件
 * 玩家当前持有的手牌
 */
export declare class HandComponent {
    static readonly TYPE = "hand";
    cards: any[];
    maxHandSize: number;
    addCard(card: any): boolean;
    removeCard(cardId: string): any | null;
}
/**
 * EnergyComponent - 能量组件
 * 打牌消耗的能量
 */
export declare class EnergyComponent {
    static readonly TYPE = "energy";
    current: number;
    max: number;
    regenPerTurn: number;
    spend(amount: number): boolean;
    regen(): void;
}
/**
 * WorldComponent - 世界状态组件
 */
export declare class WorldComponent {
    static readonly TYPE = "world";
    dayNightCycle: number;
    currentDay: number;
    difficulty: '简单' | '中等' | '困难' | '极限';
    events: Array<{
        name: string;
        type: string;
        duration: number;
        effects: Array<{
            property: string;
            value: number;
        }>;
        active: boolean;
    }>;
    getWeatherEffect(): number;
}
/**
 * GameStateComponent - 游戏状态组件
 */
export declare class GameStateComponent {
    static readonly TYPE = "gameState";
    gamePhase: '菜单' | '游戏中' | '战斗' | '升级' | '结束';
    score: number;
    combo: number;
    streak: number;
    highScore: number;
    playTime: number;
    increaseCombo(): void;
    resetCombo(): void;
}
export declare const COMPONENT_REGISTRY: {
    identity: typeof IdentityComponent;
    position: typeof PositionComponent;
    dimensions: typeof DimensionsComponent;
    resource: typeof ResourceComponent;
    production: typeof ProductionComponent;
    card: typeof CardComponent;
    crop: typeof CropComponent;
    animal: typeof AnimalComponent;
    tool: typeof ToolComponent;
    building: typeof BuildingComponent;
    character: typeof CharacterComponent;
    upgradeTree: typeof UpgradeTreeComponent;
    upgrade: typeof UpgradeComponent;
    combat: typeof CombatComponent;
    effect: typeof EffectComponent;
    world: typeof WorldComponent;
    gameState: typeof GameStateComponent;
    deck: typeof DeckComponent;
    hand: typeof HandComponent;
    energy: typeof EnergyComponent;
};
export declare class EntityFactory {
    static createCardEntity(type: '作物' | '动物' | '工具' | '建筑' | '人物', config?: any): any;
    static createPlayerEntity(config?: any): any;
    static createWorldEntity(config?: any): any;
}
export declare function createComponent(type: string, config?: any): any;
export declare function getComponent(entity: any, type: string): any;
export declare function addComponent(entity: any, type: string, config?: any): boolean;
export declare function removeComponent(entity: any, type: string): boolean;
export declare function hasComponent(entity: any, type: string): boolean;
