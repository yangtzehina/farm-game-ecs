/**
 * 🏡 农庄卡牌：田园物语 - 用户界面管理器
 *
 * 连接游戏引擎和用户交互的关键组件
 * 提供文本界面和系统交互
 */
import { FarmGameEngine } from './engine';
export declare class FarmGameUIManager {
    private engine;
    private uiRunning;
    private uiInterval;
    private input;
    private prompt;
    constructor(engine: FarmGameEngine);
    initialize(): void;
    private bindKeyboardEvents;
    update(): void;
    private createCommandMenu;
    private displayStatus;
    private displayGameInfo;
    private displayMenu;
    private showHelp;
    private showStats;
    private manageFarm;
    private manageCards;
    private upgradeCards;
    private saveGame;
    private loadGame;
    private createEntityFromData;
    private checkGameStateChanges;
    quit(): void;
    restart(): void;
    private handleFarmChoice;
    private handleCardsChoice;
    private handleUpgradeChoice;
    getUserInput(text: string): string;
}
