/**
 * 🏡 农庄卡牌：田园物语 - 包含绘图功能的浏览器应用入口
 */
declare class FarmGameEngine {
    debug: boolean;
    gameRunning: boolean;
    canvas: HTMLElement;
    ctx: any;
    cardLibrary: {
        id: string;
        name: string;
        icon: string;
        cost: number;
        desc: string;
        rarity: string;
        type: string;
        sellPrice: number;
    }[];
    gameState: {
        energy: number;
        maxEnergy: number;
        day: number;
        money: number;
        level: number;
        exp: number;
        difficulty: string;
        freeRefreshUsed: boolean;
        resources: {
            wheat: number;
            carrot: number;
            potato: number;
            tomato: number;
            chicken: number;
            duck: number;
            sheep: number;
            pig: number;
            egg: number;
            duckEgg: number;
            milk: number;
            wool: number;
            pork: number;
            apple: number;
            flour: number;
        };
        handCards: any[];
        shopCards: any[];
        placedCards: any[];
        relics: any[];
        tasks: ({
            id: string;
            title: string;
            description: string;
            progress: number;
            target: number;
            reward: {
                money: number;
                exp: number;
                relic?: undefined;
            };
            completed: boolean;
        } | {
            id: string;
            title: string;
            description: string;
            progress: number;
            target: number;
            reward: {
                relic: {
                    id: string;
                    name: string;
                    icon: string;
                    description: string;
                    effect: string;
                };
                money?: undefined;
                exp?: undefined;
            };
            completed: boolean;
        })[];
        achievements: ({
            id: string;
            name: string;
            description: string;
            icon: string;
            unlocked: boolean;
            progress?: undefined;
            target?: undefined;
        } | {
            id: string;
            name: string;
            description: string;
            icon: string;
            unlocked: boolean;
            progress: number;
            target: number;
        })[];
        events: {
            id: string;
            name: string;
            icon: string;
            description: string;
            effect: () => void;
        }[];
    };
    draggedCard: {
        id: any;
        cost: number;
        element: EventTarget;
    };
    combos: {
        requires: string[];
        result: string;
        name: string;
        icon: string;
        desc: string;
    }[];
    log(...args: any[]): void;
    initialize(): void;
    drawInitialCards(): void;
    refreshShop(): void;
    refreshHandCards(): void;
    buyCard(cardId: any): void;
    updateHandCardsUI(): void;
    updateShopUI(): void;
    updateUI(): void;
    setupCanvas(): void;
    setupDragAndDrop(): void;
    playCard(card: any, x: any, y: any): void;
    checkLevelUp(): void;
    checkCombos(): void;
    makeCombo(comboResult: any): void;
    drawTestScreen(): void;
    drawGameScreen(): void;
    drawCloud(x: any, y: any): void;
    drawHouse(x: any, y: any): void;
    drawPlacedCard(card: any): void;
    showMessage(text: any, color: any): void;
    triggerRandomEvent(): void;
    showEventModal(event: any): void;
    confirmEvent(eventId: any): void;
    closeEventModal(): void;
    unlockRelic(relic: any): void;
    closeRelicModal(): void;
    showRelicsPage(): void;
    showTaskPanel(): void;
    closeTaskPanel(): void;
    submitTask(taskId: any): void;
    updateTaskProgress(taskId: any, addAmount: any): void;
    showAchievementsPage(): void;
    closeAchievementsPage(): void;
    unlockAchievement(achievementId: any): void;
    updateAchievementProgress(achievementId: any, addAmount: any): void;
    showDifficultySelect(): void;
    closeDifficultySelect(): void;
    selectDifficulty(difficulty: any): void;
    showCardUpgrade(): void;
    closeCardUpgrade(): void;
    upgradeCard(cardId: any): void;
    showDeckManage(): void;
    closeDeckManage(): void;
    deleteCard(cardId: any): void;
    start(): void;
    nextDay(): void;
    pause(): void;
    resetGame(): void;
    clearCache(): void;
    saveGameState(): void;
    loadGameState(): void;
    clearCacheAndReload(): void;
    autoSave(): void;
}
