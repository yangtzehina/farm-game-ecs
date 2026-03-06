/**
 * 🏡 农庄卡牌：田园物语 - 用户界面管理器
 *
 * 连接游戏引擎和用户交互的关键组件
 * 提供文本界面和系统交互
 */
import { getComponent } from './components';
import prompt from 'prompt-sync';
import chalk from 'chalk';
export class FarmGameUIManager {
    constructor(engine) {
        this.uiRunning = false;
        this.uiInterval = null;
        this.engine = engine;
        this.input = {};
        this.prompt = prompt();
    }
    // ==========================================
    // 初始化UI
    // ==========================================
    initialize() {
        console.log(chalk.yellow('🎮 初始化用户界面'));
        // 绑定键盘事件
        this.bindKeyboardEvents();
        // 创建命令菜单
        this.createCommandMenu();
        console.log(chalk.green('✅ UI初始化完成'));
    }
    // ==========================================
    // 绑定键盘事件
    // ==========================================
    bindKeyboardEvents() {
        process.stdin.on('keypress', (str, key) => {
            this.handleKeyPress(str, key);
        });
        // 启用原始模式
        if (typeof process.stdin.setRawMode === 'function') {
            process.stdin.setRawMode(true);
            process.stdin.resume();
        }
    }
    // ==========================================
    // 处理按键
    // ==========================================
    handleKeyPress(str, key) {
        switch (key?.name) {
            case 'space':
                this.engine.toggleGameState();
                break;
            case 'q':
                this.quit();
                break;
            case 'r':
                this.restart();
                break;
            case 't':
                this.showStats();
                break;
            case 'h':
                this.showHelp();
                break;
            case 's':
                this.saveGame();
                break;
            case 'l':
                this.loadGame();
                break;
            case 'u':
                this.upgradeCards();
                break;
            default:
                if (key?.ctrl && key?.name === 'c') {
                    this.quit();
                }
                break;
        }
    }
    // ==========================================
    // 游戏循环
    // ==========================================
    startGameLoop() {
        if (this.uiRunning)
            return;
        this.uiRunning = true;
        // 定期更新UI
        this.uiInterval = setInterval(() => {
            this.update();
        }, 500);
    }
    stopGameLoop() {
        if (this.uiInterval) {
            clearInterval(this.uiInterval);
            this.uiInterval = null;
        }
        this.uiRunning = false;
    }
    // ==========================================
    // 更新UI
    // ==========================================
    update() {
        if (!this.uiRunning)
            return;
        // 检查游戏状态变化
        this.checkGameStateChanges();
        // 显示状态
        this.displayStatus();
    }
    // ==========================================
    // 创建命令菜单
    // ==========================================
    createCommandMenu() {
        this.commandMenu = {
            options: [
                '📊 查看状态',
                '🏡 管理农场',
                '🎴 管理卡牌',
                '🔄 升级建筑',
                '💾 保存',
                '📥 加载',
                '❓ 帮助',
                '🛑 退出'
            ],
            selected: 0
        };
    }
    // ==========================================
    // 显示状态
    // ==========================================
    displayStatus() {
        const world = this.engine.findEntity(entity => entity.identity?.entityType === '世界');
        if (!world)
            return;
        console.clear();
        console.log(chalk.blue('🏡 农庄卡牌：田园物语'));
        console.log(chalk.gray('='.repeat(80)));
        // 显示游戏信息
        this.displayGameInfo();
        // 显示系统信息
        this.displaySystemInfo();
        // 显示菜单
        this.displayMenu();
    }
    displayGameInfo() {
        const world = this.engine.findEntity(entity => entity.identity?.entityType === '世界');
        if (!world)
            return;
        console.log(chalk.cyan('🌍 世界状态'));
        console.log(chalk.gray('-'.repeat(80)));
        console.log(chalk.yellow(`📅 天数: ${world.world?.currentDay}`));
        console.log(chalk.yellow(`⏰ 时间: ${world.world?.dayNightCycle}`));
        console.log(chalk.yellow(`🏆 分数: ${world.gameState?.score}`));
        console.log(chalk.yellow(`🔥 连击: ${world.gameState?.combo}`));
        console.log(chalk.yellow(`🎯 阶段: ${world.gameState?.gamePhase}`));
        if (world.world?.events?.length > 0) {
            const activeEvents = world.world.events.filter((e) => e.active);
            if (activeEvents.length > 0) {
                console.log(chalk.red(`🟥 事件: ${activeEvents[0].name}`));
            }
        }
        console.log();
    }
    displaySystemInfo() {
        const stats = this.engine.getStats();
        console.log(chalk.cyan('🔧 系统信息'));
        console.log(chalk.gray('-'.repeat(80)));
        console.log(chalk.yellow(`⚡ FPS: ${stats.fps}`));
        console.log(chalk.yellow(`📦 实体: ${stats.entities}`));
        console.log(chalk.yellow(`🔧 系统: ${stats.systems}`));
        console.log(chalk.yellow(`📝 组件: ${stats.totalComponents}`));
        console.log(chalk.yellow(`💾 内存: ${stats.memory} MB`));
        console.log();
    }
    displayMenu() {
        console.log(chalk.cyan('🎮 命令菜单'));
        console.log(chalk.gray('-'.repeat(80)));
        console.log('❓ h - 显示帮助信息');
        console.log('📊 t - 显示统计信息');
        console.log('📦 q - 退出游戏');
        console.log('🔄 r - 重启游戏');
        console.log('💾 s - 保存游戏');
        console.log('📥 l - 加载游戏');
        console.log('🏡 c - 管理农场');
        console.log('🎴 m - 管理卡牌');
        console.log('🔄 u - 升级建筑');
        console.log();
        console.log('⌨️  按 h 查看帮助，按 q 退出');
    }
    // ==========================================
    // 显示帮助
    // ==========================================
    showHelp() {
        console.clear();
        console.log(chalk.blue('❓ 游戏帮助'));
        console.log(chalk.gray('='.repeat(80)));
        console.log(chalk.cyan('基本控制:'));
        console.log('  Space - 开始/暂停');
        console.log('  q - 退出');
        console.log('  r - 重启');
        console.log('');
        console.log(chalk.cyan('显示:'));
        console.log('  h - 显示帮助');
        console.log('  t - 显示系统信息');
        console.log('');
        console.log(chalk.cyan('管理:'));
        console.log('  c - 管理农场');
        console.log('  m - 管理卡牌');
        console.log('  u - 升级建筑');
        console.log('');
        console.log(chalk.cyan('保存/加载:'));
        console.log('  s - 保存游戏');
        console.log('  l - 加载游戏');
        console.log('');
        console.log('Press any key to return...');
        this.prompt('按任意键返回...');
    }
    // ==========================================
    // 显示统计信息
    // ==========================================
    showStats() {
        console.clear();
        console.log(chalk.blue('📊 统计信息'));
        console.log(chalk.gray('-'.repeat(80)));
        const stats = this.engine.getStats();
        console.log(chalk.cyan('系统信息:'));
        console.log(`  ⚡ FPS: ${stats.fps}`);
        console.log(`  📦 实体: ${stats.entities}`);
        console.log(`  🔧 系统: ${stats.systems}`);
        console.log(`  📝 组件: ${stats.totalComponents}`);
        console.log(`  💾 内存: ${stats.memory} MB`);
        console.log('');
        console.log(chalk.cyan('游戏信息:'));
        const world = this.engine.findEntity(entity => entity.identity?.entityType === '世界');
        if (world) {
            console.log(`  📅 天数: ${world.world?.currentDay}`);
            console.log(`  🎯 分数: ${world.gameState?.score}`);
            console.log(`  🔥 连击: ${world.gameState?.combo}`);
            console.log(`  📝 阶段: ${world.gameState?.gamePhase}`);
        }
        console.log('');
        this.prompt('按任意键返回...');
    }
    // ==========================================
    // 管理农场
    // ==========================================
    manageFarm() {
        console.clear();
        console.log(chalk.blue('🏡 农场管理'));
        console.log(chalk.gray('-'.repeat(80)));
        // 显示地块状态
        const entities = this.engine.getEntitiesByType('地块');
        if (entities.length > 0) {
            console.log(chalk.cyan('地块状态:'));
            entities.forEach((entity, index) => {
                const resourceComp = getComponent(entity, 'resource');
                const cropComp = getComponent(entity, 'crop');
                console.log(`  ${index + 1}. ${entity.identity?.name}`);
                if (cropComp) {
                    console.log(`     作物状态: ${cropComp.growthStage}`);
                }
                if (resourceComp) {
                    console.log(`     资源: ${JSON.stringify(resourceComp.resources)}`);
                }
            });
        }
        else {
            console.log(chalk.yellow('⚠️  还没有地块'));
        }
        console.log('');
        console.log('1. 添加地块');
        console.log('2. 删除地块');
        console.log('3. 种植作物');
        console.log('4. 收获作物');
        console.log('0. 返回');
        const choice = this.prompt('请选择操作: ');
        this.handleFarmChoice(choice);
    }
    // ==========================================
    // 管理卡牌
    // ==========================================
    manageCards() {
        console.clear();
        console.log(chalk.blue('🎴 卡牌管理'));
        console.log(chalk.gray('-'.repeat(80)));
        // 显示卡牌状态
        const cards = this.engine.getEntitiesByType('卡牌');
        if (cards.length > 0) {
            console.log(chalk.cyan('卡牌状态:'));
            cards.forEach((entity, index) => {
                const cardComp = getComponent(entity, 'card');
                const cropComp = getComponent(entity, 'crop');
                console.log(`  ${index + 1}. ${entity.identity?.name}`);
                if (cardComp) {
                    console.log(`     类型: ${cardComp.cardType}`);
                }
                if (cropComp) {
                    console.log(`     产量: ${cropComp.yield}`);
                }
            });
        }
        else {
            console.log(chalk.yellow('⚠️  还没有卡牌'));
        }
        console.log('');
        console.log('1. 添加卡牌');
        console.log('2. 删除卡牌');
        console.log('3. 升级卡牌');
        console.log('4. 查看升级树');
        console.log('0. 返回');
        const choice = this.prompt('请选择操作: ');
        this.handleCardsChoice(choice);
    }
    // ==========================================
    // 升级建筑
    // ==========================================
    upgradeCards() {
        console.clear();
        console.log(chalk.blue('🔄 升级卡牌'));
        console.log(chalk.gray('-'.repeat(80)));
        const world = this.engine.findEntity(entity => entity.identity?.entityType === '世界');
        if (!world || !world.resource?.resources || !world.gameState)
            return;
        console.log(chalk.cyan('资源:'));
        console.log(`  💰 金币: ${world.resource?.resources['金币']}`);
        console.log(`  🪵 木材: ${world.resource?.resources['木材']}`);
        console.log(`  🪨 石头: ${world.resource?.resources['石头']}`);
        console.log(`  🥬 作物: ${world.resource?.resources['作物']}`);
        console.log(`  🐔 动物: ${world.resource?.resources['动物']}`);
        console.log('');
        const availableCards = this.engine.getEntitiesByComponents(['upgradeTree']);
        if (availableCards.length > 0) {
            console.log(chalk.cyan('可升级卡牌:'));
            availableCards.forEach((card, index) => {
                const upgradeTree = getComponent(card, 'upgradeTree');
                if (!upgradeTree)
                    return;
                console.log(`  ${index + 1}. ${card.identity?.name}`);
                upgradeTree.upgrades?.forEach((upgrade, i) => {
                    if (upgrade.level < upgrade.maxLevel) {
                        console.log(`     🔹 升级${i + 1}: ${upgrade.level}/${upgrade.maxLevel}`);
                    }
                });
            });
        }
        else {
            console.log(chalk.yellow('⚠️  没有可升级的卡牌'));
        }
        console.log('');
        console.log('0. 返回');
        const choice = this.prompt('请选择操作: ');
        this.handleUpgradeChoice(choice);
    }
    // ==========================================
    // 保存游戏
    // ==========================================
    saveGame() {
        try {
            console.clear();
            console.log(chalk.blue('💾 保存游戏'));
            console.log(chalk.gray('-'.repeat(80)));
            // 实现保存逻辑
            const saveData = JSON.stringify(this.engine.getEntities(), null, 2);
            const fs = require('fs');
            fs.writeFileSync('savegame.json', saveData);
            console.log(chalk.green('✅ 游戏保存成功'));
        }
        catch (error) {
            console.error(chalk.red('🚨 保存失败'), error);
        }
        this.prompt('按任意键返回...');
    }
    // ==========================================
    // 加载游戏
    // ==========================================
    loadGame() {
        try {
            console.clear();
            console.log(chalk.blue('📥 加载游戏'));
            console.log(chalk.gray('-'.repeat(80)));
            // 实现加载逻辑
            const fs = require('fs');
            const saveData = fs.readFileSync('savegame.json', 'utf8');
            const entities = JSON.parse(saveData);
            // 清除现有实体
            this.engine.getEntities().forEach(entity => {
                this.engine.removeEntity(entity);
            });
            // 加载实体
            entities.forEach(entityData => {
                const newEntity = this.createEntityFromData(entityData);
                this.engine.addEntity(newEntity);
            });
            console.log(chalk.green('✅ 游戏加载成功'));
        }
        catch (error) {
            console.error(chalk.red('🚨 加载失败'), error);
        }
        this.prompt('按任意键返回...');
    }
    // ==========================================
    // 从数据创建实体
    // ==========================================
    createEntityFromData(data) {
        const entity = {};
        // 复制属性
        Object.keys(data).forEach(key => {
            if (data[key] && typeof data[key] === 'object') {
                entity[key] = { ...data[key] };
            }
            else {
                entity[key] = data[key];
            }
        });
        return entity;
    }
    // ==========================================
    // 检查游戏状态变化
    // ==========================================
    checkGameStateChanges() {
        // 实现游戏状态变化的检查逻辑
        // 例如：事件、警告、升级提醒等
    }
    // ==========================================
    // 退出游戏
    // ==========================================
    quit() {
        console.clear();
        console.log(chalk.yellow('🛑 游戏退出'));
        this.stopGameLoop();
        if (this.uiInterval) {
            clearInterval(this.uiInterval);
            this.uiInterval = null;
        }
        process.exit();
    }
    // ==========================================
    // 重启游戏
    // ==========================================
    restart() {
        console.clear();
        console.log(chalk.yellow('🔄 游戏重启'));
        this.stopGameLoop();
        // 清除所有实体
        this.engine.getEntities().forEach(entity => {
            this.engine.removeEntity(entity);
        });
        // 重新初始化
        this.engine.initialize();
        this.engine.createInitialEntities();
        this.initialize();
        this.startGameLoop();
        console.log(chalk.green('✅ 游戏重启完成'));
    }
    // ==========================================
    // 处理输入
    // ==========================================
    handleFarmChoice(choice) {
        // 实现农场操作处理
        this.displayStatus();
    }
    handleCardsChoice(choice) {
        // 实现卡牌操作处理
        this.displayStatus();
    }
    handleUpgradeChoice(choice) {
        // 实现升级操作处理
        this.displayStatus();
    }
    handleKeyPress(str, key) {
        switch (key?.name) {
            case 'space':
                this.engine.toggleGameState();
                break;
            case 'q':
                this.quit();
                break;
            case 'r':
                this.restart();
                break;
            case 't':
                this.showStats();
                break;
            case 'h':
                this.showHelp();
                break;
            case 's':
                this.saveGame();
                break;
            case 'l':
                this.loadGame();
                break;
            case 'u':
                this.upgradeCards();
                break;
            default:
                if (key?.ctrl && key?.name === 'c') {
                    this.quit();
                }
                break;
        }
    }
    // ==========================================
    // 启动游戏循环
    // ==========================================
    startGameLoop() {
        if (this.uiRunning)
            return;
        this.uiRunning = true;
        this.uiInterval = setInterval(() => {
            this.update();
        }, 500);
    }
    stopGameLoop() {
        if (!this.uiInterval)
            return;
        clearInterval(this.uiInterval);
        this.uiInterval = null;
        this.uiRunning = false;
    }
    // ==========================================
    // 获取用户输入
    // ==========================================
    getUserInput(text) {
        return this.prompt(text);
    }
    // ==========================================
    // 显示系统信息
    // ==========================================
    displaySystemInfo() {
        const stats = this.engine.getStats();
        console.log(chalk.cyan('⚡ 系统信息'));
        console.log(chalk.gray('-'.repeat(80)));
        console.log(`  ⚡ FPS: ${stats.fps}`);
        console.log(`  📦 实体: ${stats.entities}`);
        console.log(`  🔧 系统: ${stats.systems}`);
        console.log(`  📝 组件: ${stats.totalComponents}`);
        console.log(`  💾 内存: ${stats.memory} MB`);
    }
}
//# sourceMappingURL=ui.js.map