declare class FarmGameEngine {
    gameRunning: boolean;
    canvas: HTMLElement;
    ctx: any;
    initialize(): void;
    setupCanvas(): void;
    drawTestScreen(): void;
    start(): void;
    drawGameScreen(): void;
    pause(): void;
    drawPauseScreen(): void;
    resetGame(): void;
    clearCache(): void;
}
declare const engine: FarmGameEngine;
