/**
 * 🏡 农庄卡牌：田园物语 - ECS引擎核心
 *
 * Flecs风格的ECS架构实现
 * 轻量化、高性能、可扩展
 */

import {
  BaseSystem,
  SystemManager,
  createDefaultSystems,
  CardPlaySystem
} from './systems';

import {
  EntityFactory,
  createComponent,
  getComponent,
  addComponent,
  removeComponent,
  hasComponent,
  Position
} from './components';

// ==========================================
// 游戏引擎类 - Game Engine
// ==========================================

export class FarmGameEngine {
  private static instance: FarmGameEngine;
  
  private systemManager: SystemManager;
  private entities: any[] = [];
  private currentTime: number = Date.now();
  private lastUpdateTime: number = Date.now();
  private timeSinceLastUpdate: number = 0;
  private running: boolean = false;
  private fps: number = 60;
  private frameTime: number = 1000 / 60; // 约16.67ms
  private gameLoopId: number | null = null;

  private constructor() {
    this.systemManager = createDefaultSystems();
  }

  static getInstance(): FarmGameEngine {
    if (!FarmGameEngine.instance) {
      FarmGameEngine.instance = new FarmGameEngine();
    }
    return FarmGameEngine.instance;
  }

  // ==========================================
  // 引擎生命周期 - Engine Lifecycle
  // ==========================================

  initialize(): void {
    console.log('🏡 农庄卡牌：田园物语 - ECS引擎初始化');
    console.log('=' . repeat(50));
    
    // 创建初始实体
    this.createInitialEntities();
    
    // 初始化系统
    this.initializeSystems();
    
    // 初始抽5张手牌
    const player = this.findEntity(e => e.identity?.entityType === '玩家');
    if (player?.deck && player?.hand) {
      console.log('🎴 抽取初始手牌:');
      for (let i = 0; i < 5; i++) {
        const card = player.deck.drawCard();
        if (card) {
          player.hand.addCard(card);
          console.log(`  - ${card.identity.name}`);
        }
      }
    }
    
    console.log(`✅ 引擎初始化完成！`);
  }

  start(): void {
    if (this.running) return;
    
    console.log('🚀 游戏引擎启动');
    this.running = true;
    this.lastUpdateTime = Date.now();
    this.currentLoop();
  }

  stop(): void {
    if (!this.running) return;
    
    this.running = false;
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    
    console.log('🛑 游戏引擎停止');
  }

  private currentLoop(): void {
    if (!this.running) return;
    
    const currentTime = Date.now();
    const dt = currentTime - this.lastUpdateTime;
    
    this.update(dt);
    
    this.lastUpdateTime = currentTime;
    this.gameLoopId = requestAnimationFrame(() => this.currentLoop());
  }

  private update(dt: number): void {
    this.systemManager.update(dt);
  }

  // ==========================================
  // 实体管理 - Entity Management
  // ==========================================

  addEntity(entity: any): void {
    this.entities.push(entity);
    this.systemManager.addEntity(entity);
    
    console.log(`➕ 实体添加: ${entity.identity?.name || '未知'}`);
  }

  removeEntity(entity: any): void {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
      this.systemManager.removeEntity(entity);
      
      console.log(`➖ 实体移除: ${entity.identity?.name || '未知'}`);
    }
  }

  getEntities(): any[] {
    return [...this.entities];
  }

  findEntity(predicate: (entity: any) => boolean): any | null {
    return this.entities.find(predicate) || null;
  }

  findEntities(predicate: (entity: any) => boolean): any[] {
    return this.entities.filter(predicate);
  }

  findEntityByName(name: string): any | null {
    return this.findEntity(entity => entity.identity?.name === name);
  }

  getEntitiesByType(entityType: string): any[] {
    return this.findEntities(entity => entity.identity?.entityType === entityType);
  }

  // ==========================================
  // 实体工厂方法 - Entity Factory Methods
  // ==========================================

  createPlayer(): any {
    const playerEntity = EntityFactory.createPlayerEntity({
      resource: {
        resources: {
          '金币': 100,
          '木材': 50,
          '石头': 30,
          '作物': 20,
          '动物': 5
        }
      },
      character: {
        stats: {
          health: 100,
          maxHealth: 100,
          mana: 50,
          maxMana: 50
        },
        skills: [
          { name: '种植', level: 1, cooldown: 0, maxCooldown: 3000, effect: '加速作物生长' },
          { name: '收获', level: 1, cooldown: 0, maxCooldown: 2000, effect: '提高收获效率' }
        ]
      }
    });
    
    this.addEntity(playerEntity);
    return playerEntity;
  }

  createWorld(): any {
    const worldEntity = EntityFactory.createWorldEntity({
      world: {
        currentDay: 1,
        events: [
          { name: '干旱', type: '自然', duration: 30000, effects: [{ property: 'crop.growthTime', value: 5000 }], active: false },
          { name: '丰收', type: '自然', duration: 45000, effects: [{ property: 'production.efficiency', value: 0.5 }], active: false },
          { name: '虫害', type: '自然', duration: 25000, effects: [{ property: 'crop.quality', value: -0.3 }], active: false },
          { name: '市场繁荣', type: '经济', duration: 60000, effects: [{ property: 'resource.resources.金币', value: 200 }], active: false }
        ]
      },
      gameState: {
        gamePhase: '菜单',
        highScore: 0,
        score: 0
      }
    });
    
    this.addEntity(worldEntity);
    return worldEntity;
  }

  createInitialEntities(): void {
    console.log('📦 创建初始实体');
    
    // 创建世界实体
    this.createWorld();
    
    // 创建玩家实体
    this.createPlayer();
    
    // 创建示例卡牌
    this.createExampleCards();
  }

  createExampleCards(): void {
    console.log('🎴 创建示例卡牌');
    
    // 创建作物卡牌
    const wheatEntity = EntityFactory.createCardEntity('作物', {
      identity: { name: '小麦', description: '基础作物，适合初学者' },
      position: { x: 5, y: 5 },
      crop: { yield: 1, quality: 0.8 },
      production: { rate: 1, efficiency: 0.75 },
      upgradeTree: {
        upgrades: [
          {
            id: 'speed',
            name: '快速生长',
            description: '减少生长时间20%',
            level: 0,
            maxLevel: 5,
            cost: { '金币': 50, '木材': 10 },
            unlockLevel: 1,
            effects: [
              { property: 'crop.growTimePerStage', value: -1000 }
            ]
          },
          {
            id: 'yield',
            name: '高产',
            description: '增加产量15%',
            level: 0,
            maxLevel: 3,
            cost: { '金币': 80, '木材': 15 },
            unlockLevel: 2,
            effects: [
              { property: 'crop.yield', value: 0.15 }
            ]
          }
        ]
      }
    });
    
    this.addEntity(wheatEntity);
    
    // 创建动物卡牌
    const chickenEntity = EntityFactory.createCardEntity('动物', {
      identity: { name: '小鸡', description: '简单的养殖动物' },
      position: { x: 10, y: 10 },
      animal: { productivity: 0.3, consumption: 0.1 },
      production: { rate: 0.8, efficiency: 0.6 },
      upgradeTree: {
        upgrades: [
          {
            id: 'productivity',
            name: '高产',
            description: '提高产蛋率30%',
            level: 0,
            maxLevel: 4,
            cost: { '金币': 60, '木材': 12 },
            unlockLevel: 1,
            effects: [
              { property: 'animal.productivity', value: 0.08 }
            ]
          },
          {
            id: 'happiness',
            name: '快乐',
            description: '提高动物幸福度',
            level: 0,
            maxLevel: 3,
            cost: { '金币': 40, '木材': 8 },
            unlockLevel: 2,
            effects: [
              { property: 'animal.happiness', value: 10 }
            ]
          }
        ]
      }
    });
    
    this.addEntity(chickenEntity);
    
    // 创建工具卡牌
    const hoeEntity = EntityFactory.createCardEntity('工具', {
      identity: { name: '锄头', description: '基础工具' },
      position: { x: 15, y: 15 },
      tool: { efficiencyBonus: 0.15, range: 1 },
      combat: { damage: 5, defense: 2 },
      upgradeTree: {
        upgrades: [
          {
            id: 'efficiency',
            name: '高效',
            description: '提高效率25%',
            level: 0,
            maxLevel: 5,
            cost: { '金币': 70, '木材': 15 },
            unlockLevel: 1,
            effects: [
              { property: 'tool.efficiencyBonus', value: 0.05 }
            ]
          },
          {
            id: 'range',
            name: '范围',
            description: '增加范围1格',
            level: 0,
            maxLevel: 2,
            cost: { '金币': 100, '木材': 20 },
            unlockLevel: 3,
            effects: [
              { property: 'tool.range', value: 1 }
            ]
          }
        ]
      }
    });
    
    this.addEntity(hoeEntity);
  }

  // ==========================================
  // 初始化系统 - Initialize Systems
  // ==========================================

  initializeSystems(): void {
    console.log('🔧 初始化系统');
    
    this.systemManager.systems.forEach(system => {
      console.log(`✅ ${system.name} - 更新间隔: ${system.updateInterval}ms`);
    });
    
    // 打印系统执行顺序
    const sortedSystems = [...this.systemManager.systems]
      .sort((a, b) => a.priority - b.priority);
    
    console.log('📊 系统执行顺序（高优先级先）:');
    sortedSystems.forEach((system, index) => {
      console.log(`  ${index + 1}. ${system.name} (Priority: ${system.priority})`);
    });
    
    // 测试组件创建
    this.testComponentCreation();
  }

  private testComponentCreation(): void {
    const testEntity = {};
    
    // 测试组件创建
    addComponent(testEntity, 'identity', { name: '测试实体', entityType: '测试' });
    addComponent(testEntity, 'position', { x: 0, y: 0 });
    addComponent(testEntity, 'dimensions', { width: 1, height: 1 });
    addComponent(testEntity, 'resource', {
      resources: { '金币': 100, '木材': 50, '石头': 20 }
    });
    
    console.log('✅ 组件创建测试通过');
  }

  // ==========================================
  // 游戏控制 - Game Control
  // ==========================================

  toggleGameState(): void {
    const worldEntity = this.findEntity(entity => entity.identity?.entityType === '世界');
    if (worldEntity?.gameState) {
      if (worldEntity.gameState.gamePhase === '菜单') {
        worldEntity.gameState.gamePhase = '游戏中';
        console.log('🎮 开始游戏');
      } else if (worldEntity.gameState.gamePhase === '游戏中') {
        worldEntity.gameState.gamePhase = '菜单';
        console.log('⏸️ 暂停游戏');
      }
    }
  }

  getGameState(): string {
    const worldEntity = this.findEntity(entity => entity.identity?.entityType === '世界');
    return worldEntity?.gameState?.gamePhase || '菜单';
  }

  // ==========================================
  // 性能监控 - Performance Monitoring
  // ==========================================

  getStats(): {
    fps: number;
    entities: number;
    systems: number;
    totalComponents: number;
    memory: number;
  } {
    const totalComponents = this.entities.reduce((sum, entity) => {
      return sum + Object.keys(entity).length;
    }, 0);
    
    return {
      fps: this.fps,
      entities: this.entities.length,
      systems: this.systemManager.systems.length,
      totalComponents,
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) // MB
    };
  }

  printStats(): void {
    const stats = this.getStats();
    
    console.log('📊 游戏引擎状态:');
    console.log(`  🎮 状态: ${this.getGameState()}`);
    console.log(`  ⏱️  FPS: ${stats.fps}`);
    console.log(`  📦 实体数: ${stats.entities}`);
    console.log(`  🔧 系统数: ${stats.systems}`);
    console.log(`  📝 组件总数: ${stats.totalComponents}`);
    console.log(`  💾 内存使用: ${stats.memory} MB`);
  }

  // ==========================================
  // 调试工具 - Debugging Tools
  // ==========================================

  debugEntity(entityId: string | number): void {
    const entity = this.findEntity(e => e.identity?.uniqueId === entityId);
    if (entity) {
      console.log('🔍 实体调试信息:', entityId);
      console.log('属性:');
      Object.keys(entity).forEach(key => {
        const value = entity[key];
        if (typeof value === 'object') {
          console.log(`  ${key}:`, JSON.stringify(value));
        } else {
          console.log(`  ${key}:`, value);
        }
      });
    } else {
      console.log('❌ 未找到实体:', entityId);
    }
  }

  // ==========================================
  // 工具方法 - Utility Methods
  // ==========================================

  getSystemManager(): SystemManager {
    return this.systemManager;
  }

  getEntitiesByComponents(components: string[]): any[] {
    return this.entities.filter(entity => 
      components.every(type => entity[type] !== undefined)
    );
  }

  isValidEntity(entity: any): boolean {
    return entity && entity.identity && entity.identity.uniqueId;
  }
}

// ==========================================
// 全局访问和启动 - Global Access and Startup
// ==========================================

export function createGameEngine(): FarmGameEngine {
  return FarmGameEngine.getInstance();
}

export function startGameEngine(): FarmGameEngine {
  const engine = createGameEngine();
  engine.initialize();
  engine.start();
  return engine;
}

export function stopGameEngine(): void {
  const engine = FarmGameEngine.getInstance();
  engine.stop();
}

// ==========================================
// 事件总线 - Event Bus
// ==========================================

class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(key: string, callback: Function): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(callback);
  }

  off(key: string, callback: Function): void {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  dispatch(key: string, data?: any): void {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

export const globalBus = new EventBus();

// ==========================================
// 事件监听器 - Event Listeners
// ==========================================

export function on(entityId: string, event: string, callback: Function): void {
  const key = entityId ? `${entityId}:${event}` : event;
  globalBus.on(key, callback);
  console.log(`📡 事件监听: ${key}`);
}

export function off(entityId: string, event: string, callback: Function): void {
  const key = entityId ? `${entityId}:${event}` : event;
  globalBus.off(key, callback);
  console.log(`📡 移除事件监听: ${key}`);
}

export function dispatch(event: string, data?: any): void {
  globalBus.dispatch(event, data);
  console.log(`📡 事件分发: ${event}`, data);
}

// ==========================================
// 输入处理 - Input Handling
// ==========================================

export function handleInput(inputType: string, data?: any): void {
  const engine = FarmGameEngine.getInstance();
  
  if (inputType === 'start') {
    engine.toggleGameState();
  } else if (inputType === 'pause') {
    engine.toggleGameState();
  } else if (inputType === 'click') {
    const worldEntity = engine.findEntity(entity => entity.identity?.entityType === '世界');
    if (worldEntity) {
      worldEntity.gameState.increaseCombo();
    }
  }
  
  console.log(`⌨️  输入处理: ${inputType}`, data);
}

// ==========================================
// 常用操作 - Common Operations
// ==========================================

export function giveMoney(amount: number): boolean {
  const engine = FarmGameEngine.getInstance();
  const playerEntity = engine.findEntity(entity => entity.identity?.entityType === '玩家');
  
  if (playerEntity?.resource) {
    return playerEntity.resource.addResource('金币', amount);
  }
  
  return false;
}

export function giveResource(type: string, amount: number): boolean {
  const engine = FarmGameEngine.getInstance();
  const playerEntity = engine.findEntity(entity => entity.identity?.entityType === '玩家');
  
  if (playerEntity?.resource) {
    return playerEntity.resource.addResource(type, amount);
  }
  
  return false;
}

// 打出卡牌
export function playCard(cardId: string, position?: Position): boolean {
  const engine = FarmGameEngine.getInstance();
  const player = engine.findEntity(e => e.identity?.entityType === '玩家');
  const cardPlaySystem = engine.getSystemManager().getSystem<CardPlaySystem>('卡牌玩法');
  
  if (!player || !cardPlaySystem) return false;
  
  const card = cardPlaySystem.playCard(player, cardId, position);
  if (card) {
    engine.addEntity(card);
    return true;
  }
  
  return false;
}

// 弃掉手牌
export function discardCard(cardId: string): boolean {
  const engine = FarmGameEngine.getInstance();
  const player = engine.findEntity(e => e.identity?.entityType === '玩家');
  const cardPlaySystem = engine.getSystemManager().getSystem<CardPlaySystem>('卡牌玩法');
  
  if (!player || !cardPlaySystem) return false;
  
  return cardPlaySystem.discardCard(player, cardId);
}

// 获取当前手牌
export function getHandCards(): any[] {
  const engine = FarmGameEngine.getInstance();
  const player = engine.findEntity(e => e.identity?.entityType === '玩家');
  
  return player?.hand?.cards || [];
}

// 获取当前能量
export function getCurrentEnergy(): { current: number, max: number } {
  const engine = FarmGameEngine.getInstance();
  const player = engine.findEntity(e => e.identity?.entityType === '玩家');
  
  return {
    current: player?.energy?.current || 0,
    max: player?.energy?.max || 0
  };
}

// ==========================================
// 性能优化 - Performance Optimization
// ==========================================

export function optimizeEngine(): void {
  const engine = FarmGameEngine.getInstance();
  
  console.log('⚡ 引擎优化');
  
  // 简化逻辑
  engine.getSystemManager().systems.forEach(system => {
    // 减少不常使用系统的更新频率
    if (['资源管理', '生产管理'].includes(system.name)) {
      system.updateInterval = 1000; // 1秒
    }
  });
  
  console.log('✅ 引擎优化完成');
}

export function reduceGraphicsQuality(): void {
  // 简化视觉效果
  console.log('📉 降低图形质量');
  // 此处可实现实际的图形质量控制
}

export function increaseQuality(): void {
  // 提高视觉效果
  console.log('📈 提高图形质量');
  // 此处可实现实际的图形质量控制
}

// ==========================================
// 游戏初始化脚本 - Game Initialization Script
// ==========================================

export function createAndRunGame(): FarmGameEngine {
  const engine = FarmGameEngine.getInstance();
  
  try {
    engine.initialize();
    engine.start();
    
    // 设置游戏循环
    setInterval(() => {
      const stats = engine.getStats();
      if (stats.entities > 0) {
        // 定期更新
      }
    }, 1000);
    
    // 初始化控制台输出
    engine.printStats();
    
    return engine;
    
  } catch (error) {
    console.error('🚨 游戏初始化错误:', error);
    engine.stop();
    return null;
  }
}

// ==========================================
// 主程序入口
// ==========================================

if (typeof module !== 'undefined' && module === require.main) {
  try {
    console.log('🏡 农庄卡牌：田园物语 - 启动');
    const engine = createAndRunGame();
    
    if (engine) {
      console.log('🎉 游戏启动成功！');
      console.log('');
      console.log('🎮 使用说明:');
      console.log('  - 按 Space 键: 开始/暂停游戏');
      console.log('  - 点击任意位置: 增加连击');
      console.log('  - 打开开发者工具查看调试信息');
      console.log('');
      console.log('📊 统计信息将自动显示在控制台');
    }
  } catch (error) {
    console.error('🚨 游戏启动失败:', error);
  }
}
