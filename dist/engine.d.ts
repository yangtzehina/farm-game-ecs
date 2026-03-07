/**
 * 🏡 农庄卡牌：田园物语 - ECS引擎核心
 *
 * Flecs风格的ECS架构实现
 * 轻量化、高性能、可扩展
 */
import { SystemManager } from './systems';
import { Position } from './components';
export declare class FarmGameEngine {
    private static instance;
    private systemManager;
    private entities;
    private currentTime;
    private lastUpdateTime;
    private timeSinceLastUpdate;
    private running;
    private fps;
    private frameTime;
    private gameLoopId;
    private constructor();
    static getInstance(): FarmGameEngine;
    initialize(): void;
    start(): void;
    stop(): void;
    private currentLoop;
    private update;
    addEntity(entity: any): void;
    removeEntity(entity: any): void;
    getEntities(): any[];
    findEntity(predicate: (entity: any) => boolean): any | null;
    findEntities(predicate: (entity: any) => boolean): any[];
    findEntityByName(name: string): any | null;
    getEntitiesByType(entityType: string): any[];
    createPlayer(): any;
    createWorld(): any;
    createInitialEntities(): void;
    createExampleCards(): void;
    initializeSystems(): void;
    private testComponentCreation;
    toggleGameState(): void;
    getGameState(): string;
    getStats(): {
        fps: number;
        entities: number;
        systems: number;
        totalComponents: number;
        memory: number;
    };
    printStats(): void;
    debugEntity(entityId: string | number): void;
    getSystemManager(): SystemManager;
    getEntitiesByComponents(components: string[]): any[];
    isValidEntity(entity: any): boolean;
}
export declare function createGameEngine(): FarmGameEngine;
export declare function startGameEngine(): FarmGameEngine;
export declare function stopGameEngine(): void;
export declare function on(entityId: string, event: string, callback: Function): void;
export declare function dispatch(event: string, data?: any): void;
export declare function handleInput(inputType: string, data?: any): void;
export declare function giveMoney(amount: number): boolean;
export declare function giveResource(type: string, amount: number): boolean;
export declare function playCard(cardId: string, position?: Position): boolean;
export declare function discardCard(cardId: string): boolean;
export declare function getHandCards(): any[];
export declare function getCurrentEnergy(): {
    current: number;
    max: number;
};
export declare function optimizeEngine(): void;
export declare function reduceGraphicsQuality(): void;
export declare function increaseQuality(): void;
export declare function createAndRunGame(): FarmGameEngine;
