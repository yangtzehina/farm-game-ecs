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
    private commandMenu;
    private toastQueue;
    private activeToast;
    private activeAnimations;
    constructor(engine: FarmGameEngine);
    initialize(): void;
    private registerGameEventListeners;
    /**
     * 显示全局提示
     */
    showToast(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number): void;
    /**
     * 处理提示队列
     */
    private processToastQueue;
    /**
     * 渲染当前提示
     */
    private renderToast;
    /**
     * 任务完成动画
     */
    private playQuestCompleteAnimation;
    /**
     * 奖励获取动画
     */
    private playRewardGetAnimation;
    /**
     * 建筑升级动画
     */
    private playBuildingUpgradeAnimation;
    /**
     * 农场变化动画
     */
    private playFarmChangeAnimation;
    /**
     * 事件触发动画
     */
    private playEventTriggerAnimation;
    /**
     * 遗物获取动画
     */
    private playRelicGetAnimation;
    private bindKeyboardEvents;
    private handleKeyPress;
    startGameLoop(): void;
    stopGameLoop(): void;
    update(): void;
    private createCommandMenu;
    private displayStatus;
    private displayGameInfo;
    private displaySystemInfo;
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
