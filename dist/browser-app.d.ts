/**
 * 🏡 农庄卡牌：田园物语 - 包含绘图功能的浏览器应用入口
 */
declare class FarmGameEngine {
    debug: boolean;
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
        resources: {
            wheat: number;
            carrot: number;
            chicken: number;
            egg: number;
            milk: number;
        };
        handCards: {
            id: string;
            name: string;
            icon: string;
            cost: number;
            desc: string;
        }[];
        placedCards: any[];
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
    start(): void;
    dayLoop(): void;
    pause(): void;
    resetGame(): void;
    clearCache(): void;
    saveGameState(): void;
    loadGameState(): void;
    autoSave(): void;
}
