declare class FarmGameEngine {
    gameRunning: boolean;
    canvas: HTMLElement;
    ctx: any;
    gameState: {
        energy: number;
        maxEnergy: number;
        day: number;
        money: number;
        level: number;
        exp: number;
        difficulty: string;
        resources: {
            wheat: number;
            carrot: number;
            chicken: number;
            egg: number;
            milk: number;
        };
        handCards: ({
            id: string;
            name: string;
            icon: string;
            cost: number;
            desc: string;
            level: number;
            upgradeCost: {
                money: number;
                wheat: number;
                carrot?: undefined;
                egg?: undefined;
                milk?: undefined;
            };
        } | {
            id: string;
            name: string;
            icon: string;
            cost: number;
            desc: string;
            level: number;
            upgradeCost: {
                money: number;
                carrot: number;
                wheat?: undefined;
                egg?: undefined;
                milk?: undefined;
            };
        } | {
            id: string;
            name: string;
            icon: string;
            cost: number;
            desc: string;
            level: number;
            upgradeCost: {
                money: number;
                egg: number;
                wheat?: undefined;
                carrot?: undefined;
                milk?: undefined;
            };
        } | {
            id: string;
            name: string;
            icon: string;
            cost: number;
            desc: string;
            level: number;
            upgradeCost: {
                money: number;
                milk: number;
                wheat?: undefined;
                carrot?: undefined;
                egg?: undefined;
            };
        })[];
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
    initialize(): void;
    setupCanvas(): void;
    setupDragAndDrop(): void;
    playCard(card: any, x: any, y: any): void;
    checkLevelUp(): void;
    checkCombos(): void;
    makeCombo(comboResult: any): void;
    updateUI(): void;
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
    autoSave(): void;
}
