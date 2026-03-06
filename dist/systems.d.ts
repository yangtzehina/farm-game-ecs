/**
 * 🏡 农庄卡牌：田园物语 - ECS系统架构
 *
 * 资深ECS系统设计专家视角
 * 按照Data-Oriented Design原则设计
 * 重点在于数据处理和组件交互
 */
import { Position } from './components';
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
export declare function createDefaultSystems(): SystemManager;
export declare function debugSystemPerformance(systems: BaseSystem[]): void;
export declare function getSystemDependencies(): any[];
