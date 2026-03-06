/**
 * 🏡 农庄卡牌：田园物语 - 包含绘图功能的浏览器应用入口
 */
console.log('🏡 农庄卡牌：田园物语 - 浏览器应用入口加载');
// FarmGameEngine 类
class FarmGameEngine {
    constructor() {
        console.log('🏡 FarmGameEngine 构造函数');
        this.gameRunning = false;
        this.canvas = null;
        this.ctx = null;
    }
    initialize() {
        console.log('🏡 FarmGameEngine 初始化');
        this.setupCanvas();
        this.drawTestScreen();
    }
    setupCanvas() {
        // 获取 Canvas 元素
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('❌ Canvas 元素未找到');
            return;
        }
        // 获取 2D 绘图上下文
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('❌ Canvas 上下文获取失败');
            return;
        }
        console.log('🎨 Canvas 初始化完成');
    }
    drawTestScreen() {
        if (!this.ctx || !this.canvas) {
            console.error('❌ Canvas 未初始化');
            return;
        }
        // 清除画布
        this.ctx.fillStyle = '#f0f8ff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // 绘制测试内容
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏡 农庄卡牌：田园物语', this.canvas.width / 2, 50);
        this.ctx.fillStyle = '#3498db';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('🎮 点击"开始游戏"按钮', this.canvas.width / 2, 100);
        this.ctx.fillStyle = '#7f8c8d';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('ECS架构的肉鸽种地游戏', this.canvas.width / 2, 140);
        // 绘制简单的建筑图示
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(this.canvas.width / 2 - 30, 180, 60, 80);
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(this.canvas.width / 2 - 25, 260, 50, 20);
        // 绘制农夫图示
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, 160, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fill();
        console.log('🎨 测试界面绘制完成');
    }
    start() {
        if (this.gameRunning) {
            console.log('🎮 游戏已在运行');
            return;
        }
        console.log('🎮 游戏开始');
        this.gameRunning = true;
        // 绘制游戏界面
        this.drawGameScreen();
    }
    drawGameScreen() {
        if (!this.ctx || !this.canvas) {
            console.error('❌ Canvas 未初始化');
            return;
        }
        // 清除画布
        this.ctx.fillStyle = '#f0f8ff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // 绘制游戏标题
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏡 农庄卡牌：田园物语', this.canvas.width / 2, 50);
        // 绘制游戏状态
        this.ctx.fillStyle = '#27ae60';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText('✅ 游戏运行中', this.canvas.width / 2, 100);
        // 绘制游戏内容
        this.ctx.fillStyle = '#34495e';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('🌾 种植作物  |  🐔 养殖动物', this.canvas.width / 2, 150);
        this.ctx.fillText('🏗️ 建造建筑  |  💰 管理经济', this.canvas.width / 2, 180);
        // 绘制进度条
        const progress = 30;
        this.ctx.fillStyle = '#bdc3c7';
        this.ctx.fillRect(50, 220, this.canvas.width - 100, 20);
        this.ctx.fillStyle = '#f39c12';
        this.ctx.fillRect(50, 220, (this.canvas.width - 100) * (progress / 100), 20);
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`进度: ${progress}%`, this.canvas.width / 2, 255);
        console.log('🎨 游戏界面绘制完成');
    }
    pause() {
        if (!this.gameRunning) {
            console.log('⏸️ 游戏已暂停');
            return;
        }
        this.gameRunning = false;
        console.log('⏸️ 游戏暂停');
        // 绘制暂停界面
        this.drawPauseScreen();
    }
    drawPauseScreen() {
        if (!this.ctx || !this.canvas) {
            console.error('❌ Canvas 未初始化');
            return;
        }
        // 绘制半透明覆盖层
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // 绘制暂停文字
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⏸️ 游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
    }
    resetGame() {
        console.log('🔄 游戏重置');
        this.gameRunning = false;
        this.drawTestScreen();
    }
    clearCache() {
        console.log('🔄 清除缓存');
    }
}
// 立即暴露和初始化
window.FarmGameEngine = FarmGameEngine;
// 立即创建并暴露实例
const engine = new FarmGameEngine();
engine.initialize();
window.FarmGameApp = engine;
console.log('✅ 游戏引擎初始化完成');
console.log('🚀 window.FarmGameApp:', window.FarmGameApp);
//# sourceMappingURL=browser-app.js.map