/**
 * 🏡 农庄卡牌：田园物语 - ECS系统架构
 *
 * 资深ECS系统设计专家视角
 * 按照Data-Oriented Design原则设计
 * 重点在于数据处理和组件交互
 */
import { Position, AchievementComponent, AchievementConditionType, QuestObjectiveType, GameEvent, EventTrigger, FutureIntent } from './components';
export declare abstract class BaseSystem {
    readonly name: string;
    readonly priority: number;
    enabled: boolean;
    lastUpdateTime: number;
    updateInterval: number;
    constructor(name: string, priority?: number);
    abstract update(entities: any[], dt: number): void;
    abstract getRequiredComponents(): string[];
    abstract filterEntities(entities: any[]): any[];
    isReadyToUpdate(currentTime: number): boolean;
    shouldProcessEntity(entity: any): boolean;
}
export declare class ResourceSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
}
export declare class ProductionSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    private performProduction;
    private processCropGrowth;
    private harvestCrop;
    private processAnimalProduction;
    private processBuildingProduction;
}
export declare class CardSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
}
export declare class CardPlaySystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    private processTurn;
    playCard(player: any, cardId: string, position?: Position): any | false;
    discardCard(player: any, cardId: string): boolean;
}
export declare class UpgradeSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    private checkUpgradeAvailable;
    private performUpgrade;
    private applyUpgradeEffect;
}
export declare class CombatSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    private processCombat;
    private dealDamage;
}
export declare class EffectSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    private applyEffect;
    private applyBuff;
    private applyDebuff;
}
export declare class WorldSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    private newDay;
    private checkWorldEvents;
    private triggerEvent;
    private endEvent;
}
export declare class GameStateSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    private checkGameState;
    private handleMenuState;
    private handleGameplayState;
    private levelComplete;
    private gameOver;
}
export declare class ComboSystem extends BaseSystem {
    private readonly COMBO_CONFIG;
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    private checkComboCondition;
    private activateCombo;
    private deactivateCombo;
    private applyComboEffects;
    getAllComboConfigs(): ({
        id: string;
        name: string;
        description: string;
        requiredCards: string[];
        effect: string;
        strength: number;
        type: string;
        duration?: undefined;
        requiredCondition?: undefined;
    } | {
        id: string;
        name: string;
        description: string;
        requiredCards: string[];
        effect: string;
        strength: number;
        type: string;
        duration: number;
        requiredCondition?: undefined;
    } | {
        id: string;
        name: string;
        description: string;
        requiredCondition: (entities: any[]) => boolean;
        effect: string;
        strength: number;
        type: string;
        requiredCards?: undefined;
        duration?: undefined;
    })[];
}
export declare class SystemManager {
    static instance: SystemManager;
    systems: BaseSystem[];
    entities: any[];
    private currentTime;
    private timeSinceLastUpdate;
    static getInstance(): SystemManager;
    registerSystem(system: BaseSystem): SystemManager;
    addEntity(entity: any): void;
    removeEntity(entity: any): void;
    update(dt: number): void;
    getSystem<T extends BaseSystem>(name: string): T | undefined;
    getEntitiesWithComponents(components: string[]): any[];
    getSystemStats(): Array<{
        name: string;
        entitiesProcessed: number;
        lastUpdate: number;
        averageUpdateTime: number;
    }>;
}
export declare class QuestSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 检查任务解锁条件
     */
    private checkQuestUnlocks;
    /**
     * 自动发放已完成任务的奖励
     */
    private autoClaimRewards;
    /**
     * 发放奖励
     */
    private giveRewards;
    /**
     * 外部调用：更新任务进度
     */
    updateQuestProgress(entity: any, objectiveType: QuestObjectiveType, target: string, amount?: number): void;
    /**
     * 添加预设的初始任务，包含三层目标体系
     */
    addDefaultQuests(entity: any): void;
}
export declare class AchievementSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 添加50个默认成就配置
     */
    addDefaultAchievements(achievementComp: AchievementComponent): void;
    /**
     * 获取成就图标
     */
    private getAchievementIcon;
    /**
     * 生成成就奖励
     */
    private generateAchievementRewards;
    /**
     * 外部调用：更新成就进度
     */
    updateAchievementProgress(entity: any, conditionType: AchievementConditionType, target: string, amount?: number): void;
    /**
     * 发放成就奖励
     */
    private giveAchievementRewards;
}
export declare class DifficultySystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 检查难度解锁条件
     */
    private checkDifficultyUnlock;
    /**
     * 切换难度
     */
    setDifficultyLevel(entity: any, level: number): boolean;
    /**
     * 难度结算
     */
    difficultySettlement(entity: any): void;
}
export declare class NotificationSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 发送任务进度通知
     */
    sendQuestProgressNotification(entity: any, questTitle: string, objective: string, current: number, total: number): void;
    /**
     * 发送任务完成通知
     */
    sendQuestCompleteNotification(entity: any, questTitle: string, rewards: any[]): void;
}
export declare class EventSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 在指定触发点触发随机事件
     */
    triggerEvent(triggerType: EventTrigger, playerEntity: any, worldEntity: any): GameEvent | null;
    /**
     * 应用事件效果
     */
    private applyEventEffects;
    /**
     * 回合结束时更新事件状态
     */
    endOfRoundUpdate(worldEntity: any): void;
}
export declare class RelicSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 玩家获得遗物
     */
    addRelic(playerEntity: any, relicId: string): boolean;
    /**
     * 应用所有遗物的效果
     */
    applyRelicEffects(playerEntity: any): void;
    /**
     * 获取所有生产加成
     */
    getProductionBonus(playerEntity: any, targetType: string): number;
    /**
     * 获取事件概率调整
     */
    getEventProbabilityModifier(playerEntity: any, eventType: string): number;
}
export declare class DeckManagementSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 删除卡牌
     */
    deleteCard(playerEntity: any, cardId: string): boolean;
    /**
     * 升级卡牌
     */
    upgradeCard(playerEntity: any, cardId: string): boolean;
    /**
     * 获取所有可升级的卡牌
     */
    getUpgradableCards(playerEntity: any): any[];
}
export declare class IntentPreviewSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 添加未来事件提示
     */
    addFutureIntent(worldEntity: any, intent: FutureIntent): void;
    /**
     * 获取当前需要显示的意图
     */
    getCurrentIntents(worldEntity: any, currentRound: number): FutureIntent[];
    /**
     * 回合结束时更新意图状态
     */
    endOfRoundUpdate(worldEntity: any, currentRound: number): void;
    /**
     * 生成未来事件提示
     */
    private generateFutureIntents;
}
export declare class GoldTargetSystem extends BaseSystem {
    constructor();
    getRequiredComponents(): string[];
    filterEntities(entities: any[]): any[];
    update(entities: any[], dt: number): void;
    /**
     * 自动发放已完成目标的奖励
     */
    private autoClaimRewards;
    /**
     * 发放奖励
     */
    private giveRewards;
    /**
     * 外部调用：更新金币目标进度
     * @param entity 玩家实体
     * @param goldAmount 新增金币数量
     */
    updateGoldProgress(entity: any, goldAmount: number): void;
    /**
     * 获取当前进度信息，用于UI显示
     */
    getProgressInfo(entity: any): any;
    /**
     * 获取异常记录
     */
    getAbnormalRecords(entity: any, limit?: number): any;
}
export declare function createDefaultSystems(): SystemManager;
export declare function debugSystemPerformance(systems: BaseSystem[]): void;
export declare function getSystemDependencies(): any[];
