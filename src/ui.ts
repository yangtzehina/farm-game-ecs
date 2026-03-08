/**
 * 🏡 农庄卡牌：田园物语 - 用户界面管理器
 *
 * 连接游戏引擎和用户交互的关键组件
 * 提供文本界面和系统交互
 */

import { FarmGameEngine } from './engine';
import { getComponent, addComponent, removeComponent } from './components';
import prompt from 'prompt-sync';
import chalk from 'chalk';

export class FarmGameUIManager {
  private engine: FarmGameEngine;
  private uiRunning: boolean = false;
  private uiInterval: NodeJS.Timeout | null = null;
  private input: any;
  private prompt: (text: string) => string;
  private commandMenu: any;

  // 全局提示系统
  private toastQueue: Array<{ message: string; type: 'success' | 'error' | 'info' | 'warning'; duration: number }> = [];
  private activeToast: { message: string; type: 'success' | 'error' | 'info' | 'warning'; duration: number; startTime: number } | null = null;

  // 动画状态
  private activeAnimations: Array<{
    id: string;
    type: 'quest-complete' | 'reward-get' | 'building-upgrade' | 'farm-change' | 'event-trigger' | 'relic-get';
    data: any;
    startTime: number;
    duration: number;
  }> = [];

  constructor(engine: FarmGameEngine) {
    this.engine = engine;
    this.input = {};
    this.prompt = prompt();
  }

  // ==========================================
  // 初始化UI
  // ==========================================

  initialize(): void {
    console.log(chalk.yellow('🎮 初始化用户界面'));
    
    // 绑定键盘事件
    this.bindKeyboardEvents();
    
    // 创建命令菜单
    this.createCommandMenu();

    // 注册游戏事件监听
    this.registerGameEventListeners();
    
    console.log(chalk.green('✅ UI初始化完成'));
  }

  // ==========================================
  // 注册游戏事件监听
  // ==========================================
  private registerGameEventListeners(): void {
    // 任务完成事件
    this.engine.on('quest:complete', (quest: any) => {
      this.playQuestCompleteAnimation(quest);
      this.showToast(`🎉 任务完成：${quest.title}`, 'success', 5000);
    });

    // 奖励获取事件
    this.engine.on('reward:get', (reward: any) => {
      this.playRewardGetAnimation(reward);
      this.showToast(`🎁 获得奖励：${reward.amount}${reward.target}`, 'success', 3000);
    });

    // 建筑升级事件
    this.engine.on('building:upgrade', (building: any, level: number) => {
      this.playBuildingUpgradeAnimation(building, level);
      this.showToast(`🏗️  建筑升级：${building.identity.name} 升到${level}级`, 'success', 4000);
    });

    // 农场变化事件
    this.engine.on('farm:change', (change: any) => {
      this.playFarmChangeAnimation(change);
      this.showToast(`🌱 农场变化：${change.description}`, 'info', 2500);
    });

    // 事件触发事件
    this.engine.on('event:trigger', (event: any) => {
      this.playEventTriggerAnimation(event);
      this.showToast(`⚠️  事件触发：${event.name}`, 'warning', 4000);
    });

    // 遗物获取事件
    this.engine.on('relic:get', (relic: any) => {
      this.playRelicGetAnimation(relic);
      this.showToast(`🏆 获得遗物：${relic.name}`, 'success', 5000);
    });
  }

  // ==========================================
  // 全局提示系统
  // ==========================================

  /**
   * 显示全局提示
   */
  public showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    this.toastQueue.push({ message, type, duration });
    this.processToastQueue();
  }

  /**
   * 处理提示队列
   */
  private processToastQueue(): void {
    if (this.activeToast || this.toastQueue.length === 0) return;
    
    const toast = this.toastQueue.shift()!;
    this.activeToast = {
      ...toast,
      startTime: Date.now()
    };
    
    // 自动移除提示
    setTimeout(() => {
      this.activeToast = null;
      this.processToastQueue();
    }, toast.duration);
  }

  /**
   * 渲染当前提示
   */
  private renderToast(): void {
    if (!this.activeToast) return;

    const colorMap = {
      success: chalk.green,
      error: chalk.red,
      info: chalk.blue,
      warning: chalk.yellow
    };

    const color = colorMap[this.activeToast.type];
    console.log(color(`\n💬 ${this.activeToast.message}`));
  }

  // ==========================================
  // 动画实现
  // ==========================================

  /**
   * 任务完成动画
   */
  private playQuestCompleteAnimation(quest: any): void {
    const animationId = `quest-${quest.id}-${Date.now()}`;
    this.activeAnimations.push({
      id: animationId,
      type: 'quest-complete',
      data: quest,
      startTime: Date.now(),
      duration: 3000
    });

    // 播放动画效果
    console.log(chalk.green('\n🎉🎉🎉 任务完成 🎉🎉🎉'));
    console.log(chalk.green(`📜 ${quest.title}`));
    console.log(chalk.green(`🎁 奖励：${quest.rewards.map((r: any) => `${r.amount}${r.target}`).join(', ')}`));
    console.log(chalk.green('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n'));

    // 动画结束后自动移除
    setTimeout(() => {
      this.activeAnimations = this.activeAnimations.filter(a => a.id !== animationId);
    }, 3000);
  }

  /**
   * 奖励获取动画
   */
  private playRewardGetAnimation(reward: any): void {
    const animationId = `reward-${Date.now()}`;
    this.activeAnimations.push({
      id: animationId,
      type: 'reward-get',
      data: reward,
      startTime: Date.now(),
      duration: 2000
    });

    const iconMap: any = {
      '金币': '💰',
      '木材': '🪵',
      '石头': '🪨',
      '作物': '🥬',
      '动物': '🐔',
      '经验': '✨',
      '卡牌': '🎴',
      '道具': '🎁'
    };

    const icon = iconMap[reward.target] || '🎁';
    console.log(chalk.yellow(`\n${icon} +${reward.amount} ${reward.target}\n`));

    setTimeout(() => {
      this.activeAnimations = this.activeAnimations.filter(a => a.id !== animationId);
    }, 2000);
  }

  /**
   * 建筑升级动画
   */
  private playBuildingUpgradeAnimation(building: any, level: number): void {
    const animationId = `building-${building.identity.uniqueId}-${Date.now()}`;
    this.activeAnimations.push({
      id: animationId,
      type: 'building-upgrade',
      data: { building, level },
      startTime: Date.now(),
      duration: 3500
    });

    console.log(chalk.cyan('\n🏗️  🏗️  🏗️  建筑升级 🏗️  🏗️  🏗️'));
    console.log(chalk.cyan(`🏡 ${building.identity.name} 升到 Lv.${level}`));
    console.log(chalk.cyan(`⚡ 效率提升：+${(building.production.productivity * 100).toFixed(0)}%\n`));

    setTimeout(() => {
      this.activeAnimations = this.activeAnimations.filter(a => a.id !== animationId);
    }, 3500);
  }

  /**
   * 农场变化动画
   */
  private playFarmChangeAnimation(change: any): void {
    const animationId = `farm-${Date.now()}`;
    this.activeAnimations.push({
      id: animationId,
      type: 'farm-change',
      data: change,
      startTime: Date.now(),
      duration: 1500
    });

    console.log(chalk.green(`\n🌱 ${change.description}\n`));

    setTimeout(() => {
      this.activeAnimations = this.activeAnimations.filter(a => a.id !== animationId);
    }, 1500);
  }

  /**
   * 事件触发动画
   */
  private playEventTriggerAnimation(event: any): void {
    const animationId = `event-${event.id}-${Date.now()}`;
    this.activeAnimations.push({
      id: animationId,
      type: 'event-trigger',
      data: event,
      startTime: Date.now(),
      duration: 4000
    });

    console.log(chalk.red('\n⚠️  ⚠️  ⚠️  事件触发 ⚠️  ⚠️  ⚠️'));
    console.log(chalk.red(`📢 ${event.name}`));
    console.log(chalk.red(`📝 ${event.description}`));
    console.log(chalk.red(`⏰ 持续时间：${event.duration / 1000}秒\n`));

    setTimeout(() => {
      this.activeAnimations = this.activeAnimations.filter(a => a.id !== animationId);
    }, 4000);
  }

  /**
   * 遗物获取动画
   */
  private playRelicGetAnimation(relic: any): void {
    const animationId = `relic-${relic.id}-${Date.now()}`;
    this.activeAnimations.push({
      id: animationId,
      type: 'relic-get',
      data: relic,
      startTime: Date.now(),
      duration: 5000
    });

    console.log(chalk.magenta('\n🏆 🏆 🏆 获得遗物 🏆 🏆 🏆'));
    console.log(chalk.magenta(`✨ ${relic.name}`));
    console.log(chalk.magenta(`📜 ${relic.description}`));
    console.log(chalk.magenta(`💡 效果：${relic.effect}\n`));

    setTimeout(() => {
      this.activeAnimations = this.activeAnimations.filter(a => a.id !== animationId);
    }, 5000);
  }

  // ==========================================
  // 绑定键盘事件
  // ==========================================

  private bindKeyboardEvents(): void {
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

  private handleKeyPress(str: string, key: any): void {
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

  startGameLoop(): void {
    if (this.uiRunning) return;
    
    this.uiRunning = true;
    
    // 定期更新UI
    this.uiInterval = setInterval(() => {
      this.update();
    }, 500);
  }

  stopGameLoop(): void {
    if (this.uiInterval) {
      clearInterval(this.uiInterval);
      this.uiInterval = null;
    }
    
    this.uiRunning = false;
  }

  // ==========================================
  // 更新UI
  // ==========================================

  update(): void {
    if (!this.uiRunning) return;
    
    // 检查游戏状态变化
    this.checkGameStateChanges();
    
    // 显示状态
    this.displayStatus();
  }

  // ==========================================
  // 创建命令菜单
  // ==========================================

  private createCommandMenu(): void {
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

  private displayStatus(): void {
    const world = this.engine.findEntity(entity => entity.identity?.entityType === '世界');
    
    if (!world) return;
    
    console.clear();
    console.log(chalk.blue('🏡 农庄卡牌：田园物语'));
    console.log(chalk.gray('=' . repeat(80)));
    
    // 显示游戏信息
    this.displayGameInfo();
    
    // 显示系统信息
    this.displaySystemInfo();
    
    // 显示菜单
    this.displayMenu();

    // 显示全局提示
    this.renderToast();
  }

  private displayGameInfo(): void {
    const world = this.engine.findEntity(entity => entity.identity?.entityType === '世界');
    
    if (!world) return;
    
    console.log(chalk.cyan('🌍 世界状态'));
    console.log(chalk.gray('-' . repeat(80)));
    
    console.log(chalk.yellow(`📅 天数: ${world.world?.currentDay}`));
    console.log(chalk.yellow(`⏰ 时间: ${world.world?.dayNightCycle}`));
    console.log(chalk.yellow(`🏆 分数: ${world.gameState?.score}`));
    console.log(chalk.yellow(`🔥 连击: ${world.gameState?.combo}`));
    console.log(chalk.yellow(`🎯 阶段: ${world.gameState?.gamePhase}`));
    
    if (world.world?.events?.length > 0) {
      const activeEvents = world.world.events.filter((e: any) => e.active);
      if (activeEvents.length > 0) {
        console.log(chalk.red(`🟥 事件: ${activeEvents[0].name}`));
      }
    }
    
    console.log();
  }

  private displaySystemInfo(): void {
    const stats = this.engine.getStats();
    
    console.log(chalk.cyan('🔧 系统信息'));
    console.log(chalk.gray('-' . repeat(80)));
    
    console.log(chalk.yellow(`⚡ FPS: ${stats.fps}`));
    console.log(chalk.yellow(`📦 实体: ${stats.entities}`));
    console.log(chalk.yellow(`🔧 系统: ${stats.systems}`));
    console.log(chalk.yellow(`📝 组件: ${stats.totalComponents}`));
    console.log(chalk.yellow(`💾 内存: ${stats.memory} MB`));
    
    console.log();
  }

  private displayMenu(): void {
    console.log(chalk.cyan('🎮 命令菜单'));
    console.log(chalk.gray('-' . repeat(80)));
    
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

  private showHelp(): void {
    console.clear();
    console.log(chalk.blue('❓ 游戏帮助'));
    console.log(chalk.gray('=' . repeat(80)));
    
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

  private showStats(): void {
    console.clear();
    console.log(chalk.blue('📊 统计信息'));
    console.log(chalk.gray('-' . repeat(80)));
    
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

  private manageFarm(): void {
    console.clear();
    console.log(chalk.blue('🏡 农场管理'));
    console.log(chalk.gray('-' . repeat(80)));
    
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
    } else {
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

  private manageCards(): void {
    console.clear();
    console.log(chalk.blue('🎴 卡牌管理'));
    console.log(chalk.gray('-' . repeat(80)));
    
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
    } else {
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

  private upgradeCards(): void {
    console.clear();
    console.log(chalk.blue('🔄 升级卡牌'));
    console.log(chalk.gray('-' . repeat(80)));
    
    const world = this.engine.findEntity(entity => entity.identity?.entityType === '世界');
    
    if (!world || !world.resource?.resources || !world.gameState) return;
    
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
        
        if (!upgradeTree) return;
        
        console.log(`  ${index + 1}. ${card.identity?.name}`);
        upgradeTree.upgrades?.forEach((upgrade, i) => {
          if (upgrade.level < upgrade.maxLevel) {
            console.log(`     🔹 升级${i + 1}: ${upgrade.level}/${upgrade.maxLevel}`);
          }
        });
      });
    } else {
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

  private saveGame(): void {
    try {
      console.clear();
      console.log(chalk.blue('💾 保存游戏'));
      console.log(chalk.gray('-' . repeat(80)));
      
      // 实现保存逻辑
      const saveData = JSON.stringify(this.engine.getEntities(), null, 2);
      const fs = require('fs');
      
      fs.writeFileSync('savegame.json', saveData);
      console.log(chalk.green('✅ 游戏保存成功'));
      
    } catch (error) {
      console.error(chalk.red('🚨 保存失败'), error);
    }
    this.prompt('按任意键返回...');
  }

  // ==========================================
  // 加载游戏
  // ==========================================

  private loadGame(): void {
    try {
      console.clear();
      console.log(chalk.blue('📥 加载游戏'));
      console.log(chalk.gray('-' . repeat(80)));
      
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
      
    } catch (error) {
      console.error(chalk.red('🚨 加载失败'), error);
    }
    this.prompt('按任意键返回...');
  }

  // ==========================================
  // 从数据创建实体
  // ==========================================

  private createEntityFromData(data: any): any {
    const entity = {};
    
    // 复制属性
    Object.keys(data).forEach(key => {
      if (data[key] && typeof data[key] === 'object') {
        entity[key] = { ...data[key] };
      } else {
        entity[key] = data[key];
      }
    });
    
    return entity;
  }

  // ==========================================
  // 检查游戏状态变化
  // ==========================================

  private checkGameStateChanges(): void {
    // 实现游戏状态变化的检查逻辑
    // 例如：事件、警告、升级提醒等
  }

  // ==========================================
  // 退出游戏
  // ==========================================

  quit(): void {
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

  restart(): void {
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

  private handleFarmChoice(choice: string): void {
    // 实现农场操作处理
    this.displayStatus();
  }

  private handleCardsChoice(choice: string): void {
    // 实现卡牌操作处理
    this.displayStatus();
  }

  private handleUpgradeChoice(choice: string): void {
    // 实现升级操作处理
    this.displayStatus();
  }

  // ==========================================
  // 获取用户输入
  // ==========================================

  getUserInput(text: string): string {
    return this.prompt(text);
  }
}
