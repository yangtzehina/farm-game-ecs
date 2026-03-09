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
    constructor(config?: Partial<ResourceComponent>);
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
    constructor(config?: Partial<ProductionComponent>);
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
    constructor(config?: Partial<CropComponent>);
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
    constructor(config?: Partial<AnimalComponent>);
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
    constructor(config?: Partial<ToolComponent>);
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
    constructor(config?: Partial<BuildingComponent>);
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
    constructor(config?: Partial<CharacterComponent>);
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
    constructor(config?: Partial<UpgradeTreeComponent>);
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
    constructor(config?: Partial<UpgradeComponent>);
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
    constructor(config?: Partial<CombatComponent>);
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
    constructor(config?: Partial<EffectComponent>);
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
    constructor(config?: Partial<DeckComponent>);
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
    constructor(config?: Partial<HandComponent>);
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
    constructor(config?: Partial<EnergyComponent>);
    spend(amount: number): boolean;
    regen(): void;
}
export type QuestType = '主线' | '日常' | '周常' | '活动' | '短期回合' | '中期阶段' | '长期通关';
export type QuestObjectiveType = '收集资源' | '升级卡牌' | '生产物品' | '拥有卡牌' | '达到等级' | '完成任务' | '卡牌满级' | '建筑满级' | '难度通关' | '组合技激活';
export interface QuestObjective {
    id: string;
    type: QuestObjectiveType;
    target: string;
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
export declare class QuestComponent {
    static readonly TYPE = "quest";
    quests: Quest[];
    completedQuests: string[];
    dailyResetTime: number;
    lastDailyReset: number;
    constructor(config?: Partial<QuestComponent>);
    /**
     * 添加新任务
     */
    addQuest(quest: Quest): boolean;
    /**
     * 更新任务进度
     */
    updateProgress(objectiveType: QuestObjectiveType, target: string, amount?: number): void;
    /**
     * 检查任务是否完成
     */
    private checkQuestCompletion;
    /**
     * 领取任务奖励
     */
    claimRewards(questId: string): QuestReward[] | false;
    /**
     * 重置日常任务
     */
    resetDailyQuests(): void;
    /**
     * 获取可领取奖励的任务
     */
    getClaimableQuests(): Quest[];
    /**
     * 获取进行中的任务
     */
    getActiveQuests(): Quest[];
}
export type AchievementRarity = '普通' | '稀有' | '史诗' | '传说' | '隐藏';
export type AchievementConditionType = '收集资源' | '升级卡牌' | '生产物品' | '拥有卡牌' | '达到等级' | '完成任务' | '存活天数' | '获得成就' | '组合技激活' | '难度通关' | '无失败通关' | '收集所有卡牌' | '卡牌满级' | '建筑满级';
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
    points: number;
    hidden: boolean;
    conditions: AchievementCondition[];
    unlocked: boolean;
    unlockedAt?: number;
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
export declare class AchievementComponent {
    static readonly TYPE = "achievement";
    achievements: Achievement[];
    totalPoints: number;
    unlockedCount: number;
    totalCount: number;
    constructor(config?: Partial<AchievementComponent>);
    /**
     * 添加成就
     */
    addAchievement(achievement: Achievement): boolean;
    /**
     * 更新成就进度
     */
    updateProgress(conditionType: AchievementConditionType, target: string, amount?: number): Achievement[];
    /**
     * 检查成就是否解锁
     */
    private checkAchievementUnlocked;
    /**
     * 获取已解锁成就
     */
    getUnlockedAchievements(): Achievement[];
    /**
     * 获取未解锁成就（隐藏成就仅在解锁后显示）
     */
    getVisibleAchievements(): Achievement[];
    /**
     * 获取成就完成率
     */
    getCompletionRate(): number;
}
export interface DifficultyLevelConfig {
    level: number;
    name: string;
    description: string;
    resourceMultiplier: number;
    productionMultiplier: number;
    enemyHealthMultiplier: number;
    enemyDamageMultiplier: number;
    rewardMultiplier: number;
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
export declare class DifficultyComponent {
    static readonly TYPE = "difficulty";
    currentLevel: number;
    maxLevel: number;
    levels: DifficultyLevelConfig[];
    difficultyBonus: number;
    constructor(config?: Partial<DifficultyComponent>);
    /**
     * 初始化默认20级难度配置
     */
    private initializeDefaultLevels;
    /**
     * 获取难度名称
     */
    private getDifficultyName;
    /**
     * 获取难度描述
     */
    private getDifficultyDescription;
    /**
     * 获取当前难度配置
     */
    getCurrentDifficulty(): DifficultyLevelConfig;
    /**
     * 提升难度
     */
    increaseLevel(): boolean;
    /**
     * 解锁难度等级
     */
    unlockLevel(level: number): boolean;
    /**
     * 获取已解锁的难度列表
     */
    getUnlockedLevels(): DifficultyLevelConfig[];
}
export type NotificationType = '任务进度' | '任务完成' | '成就解锁' | '难度提升' | '奖励获得' | '系统提示';
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    duration: number;
    createdAt: number;
    read: boolean;
    priority: number;
    animation?: string;
}
/**
 * NotificationComponent - 通知组件
 * 管理游戏中的UI提示和通知
 */
export declare class NotificationComponent {
    static readonly TYPE = "notification";
    notifications: Notification[];
    maxNotifications: number;
    constructor(config?: Partial<NotificationComponent>);
    /**
     * 发送通知
     */
    sendNotification(type: NotificationType, title: string, message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message' | 'createdAt'>>): string;
    /**
     * 获取需要显示的通知
     */
    getActiveNotifications(): Notification[];
    /**
     * 标记通知为已读
     */
    markAsRead(notificationId: string): boolean;
    /**
     * 清理过期通知
     */
    cleanupExpired(): void;
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
    constructor(config?: Partial<WorldComponent>);
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
    constructor(config?: Partial<GameStateComponent>);
    increaseCombo(): void;
    resetCombo(): void;
}
/**
 * ComboComponent - 组合技组件
 * 跟踪激活的组合技和效果
 */
export declare class ComboComponent {
    static readonly TYPE = "combo";
    activeCombos: Array<{
        id: string;
        name: string;
        description: string;
        effect: string;
        activatedAt: number;
        duration?: number;
        strength: number;
        active: boolean;
    }>;
    constructor(config?: Partial<ComboComponent>);
    activateCombo(id: string, name: string, description: string, effect: string, strength: number, duration?: number): boolean;
    deactivateCombo(id: string): boolean;
    isComboActive(id: string): boolean;
    getActiveCombos(): {
        id: string;
        name: string;
        description: string;
        effect: string;
        activatedAt: number;
        duration?: number;
        strength: number;
        active: boolean;
    }[];
    update(dt: number): void;
}
export type EventType = '正面' | '负面' | '中性' | '灾害';
export type EventTrigger = '回合开始' | '回合结束' | '使用卡牌' | '收获资源' | '升级卡牌' | '随机';
export interface EventEffect {
    type: '资源变更' | '卡牌效果变更' | '生产效率变更' | '天气变更' | '获得卡牌' | '失去卡牌' | '获得遗物' | '触发其他事件';
    target: string;
    value: number | string | any;
    duration?: number;
}
export interface GameEvent {
    id: string;
    name: string;
    description: string;
    type: EventType;
    trigger: EventTrigger;
    weight: number;
    levelRequirement: number;
    effects: EventEffect[];
    cooldown: number;
    duration?: number;
    active: boolean;
    remainingDuration: number;
}
/**
 * EventSystemComponent - 随机事件系统组件
 * 管理所有事件的配置、触发和效果
 */
export declare class EventSystemComponent {
    static readonly TYPE = "eventSystem";
    eventConfig: GameEvent[];
    activeEvents: GameEvent[];
    eventCooldowns: {
        [eventId: string]: number;
    };
    eventTriggerChance: number;
    constructor(config?: Partial<EventSystemComponent>);
    /**
     * 注册新事件配置
     */
    registerEvent(event: GameEvent): void;
    /**
     * 获取可触发的事件列表
     */
    getAvailableEvents(triggerType: EventTrigger, playerLevel: number): GameEvent[];
    /**
     * 触发随机事件
     */
    triggerRandomEvent(triggerType: EventTrigger, playerLevel: number): GameEvent | null;
    /**
     * 更新事件状态，回合结束时调用
     */
    updateEvents(): void;
}
export type RelicRarity = '普通' | '稀有' | '史诗' | '传说';
export type RelicAcquisition = '事件奖励' | '任务奖励' | '商店购买' | '隐藏宝箱' | '成就奖励' | '动物繁殖';
export interface RelicEffect {
    type: '资源加成' | '生产加成' | '卡牌效果增强' | '事件概率调整' | '能量上限提升' | '手牌上限提升' | '特殊效果';
    target: string;
    value: number;
    condition?: string;
}
export interface Relic {
    id: string;
    name: string;
    description: string;
    rarity: RelicRarity;
    acquisition: RelicAcquisition[];
    effects: RelicEffect[];
    levelRequirement: number;
    unique: boolean;
    active: boolean;
    stackable: boolean;
    stackCount: number;
}
/**
 * RelicComponent - 遗物组件
 * 玩家拥有的遗物和效果
 */
export declare class RelicComponent {
    static readonly TYPE = "relic";
    relics: Relic[];
    relicConfig: Relic[];
    constructor(config?: Partial<RelicComponent>);
    /**
     * 注册遗物配置
     */
    registerRelic(relic: Relic): void;
    /**
     * 获得遗物
     */
    addRelic(relicId: string): boolean;
    /**
     * 移除遗物
     */
    removeRelic(relicId: string): boolean;
    /**
     * 获取所有激活的遗物效果
     */
    getActiveEffects(): RelicEffect[];
    /**
     * 按类型获取遗物效果总和
     */
    getEffectSum(type: string, target: string): number;
}
export type IntentType = '灾害预警' | '价格波动' | '特殊事件' | '天气变化';
export interface FutureIntent {
    type: IntentType;
    name: string;
    description: string;
    round: number;
    severity: '低' | '中' | '高';
}
/**
 * IntentPreviewComponent - 意图提示组件
 * 提前显示未来会发生的事件
 */
export declare class IntentPreviewComponent {
    static readonly TYPE = "intentPreview";
    futureIntents: FutureIntent[];
    previewRounds: number;
    constructor(config?: Partial<IntentPreviewComponent>);
    /**
     * 添加未来事件提示
     */
    addIntent(intent: FutureIntent): void;
    /**
     * 获取当前需要显示的意图
     */
    getCurrentIntents(currentRound: number): FutureIntent[];
    /**
     * 回合结束时更新意图状态
     */
    updateIntents(currentRound: number): void;
}
declare module './components' {
    interface DeckComponent {
        removeCardFromLibrary(cardId: string): boolean;
        upgradeCard(cardId: string): boolean;
        getUpgradableCards(): any[];
    }
}
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
export declare class GoldTargetComponent {
    static readonly TYPE = "goldTarget";
    baseDailyTarget: number;
    logBase: number;
    growthMultiplier: number;
    phaseLength: number;
    phaseRewardMultiplier: number;
    dailyTargets: DailyGoldTarget[];
    phases: GoldTargetPhase[];
    totalGoldEarned: number;
    currentStreak: number;
    maxStreak: number;
    lastClaimedDay: number;
    abnormalThreshold: number;
    abnormalRecords: Array<{
        day: number;
        goldAmount: number;
        target: number;
        timestamp: number;
        reason: string;
    }>;
    constructor(config?: Partial<GoldTargetComponent>);
    /**
     * 初始化阶段目标
     */
    private initializePhases;
    /**
     * 计算指定天数的每日金币目标（对数成长曲线）
     * 公式：target = baseDailyTarget + growthMultiplier * ln(day)
     */
    calculateDailyTarget(day: number): number;
    /**
     * 计算阶段基础目标
     */
    private calculatePhaseBaseTarget;
    /**
     * 生成阶段奖励
     */
    private generatePhaseRewards;
    /**
     * 生成每日奖励
     */
    private generateDailyRewards;
    /**
     * 获取或创建指定天数的每日目标
     */
    getDailyTarget(day: number): DailyGoldTarget;
    /**
     * 更新每日目标进度
     * @param goldAmount 新增金币数量
     * @param currentDay 当前游戏天数
     */
    updateProgress(goldAmount: number, currentDay: number): {
        dailyCompleted: boolean;
        phaseCompleted: GoldTargetPhase | null;
        isAbnormal: boolean;
    };
    /**
     * 获取当前所属阶段
     */
    getCurrentPhase(currentDay: number): GoldTargetPhase | null;
    /**
     * 计算阶段目标进度
     */
    calculatePhaseProgress(phase: GoldTargetPhase): number;
    /**
     * 领取每日奖励
     */
    claimDailyReward(day: number): GoldTargetReward[] | false;
    /**
     * 领取阶段奖励
     */
    claimPhaseReward(phaseId: string): GoldTargetReward[] | false;
    /**
     * 检查连续天数是否中断（新的一天开始时调用）
     */
    checkStreakBreak(currentDay: number): boolean;
    /**
     * 获取当前进度统计
     */
    getStats(): {
        totalGoldEarned: number;
        currentStreak: number;
        maxStreak: number;
        completedDailyCount: number;
        totalDays: number;
        completedPhaseCount: number;
        totalPhases: number;
        completionRate: number;
    };
    /**
     * 获取异常记录
     */
    getAbnormalRecords(limit?: number): {
        day: number;
        goldAmount: number;
        target: number;
        timestamp: number;
        reason: string;
    }[];
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
    combo: typeof ComboComponent;
    quest: typeof QuestComponent;
    achievement: typeof AchievementComponent;
    difficulty: typeof DifficultyComponent;
    notification: typeof NotificationComponent;
    eventSystem: typeof EventSystemComponent;
    relic: typeof RelicComponent;
    intentPreview: typeof IntentPreviewComponent;
    goldTarget: typeof GoldTargetComponent;
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
