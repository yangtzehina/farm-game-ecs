/**
 * 🏡 农庄卡牌：田园物语 - ECS系统架构
 *
 * 资深ECS系统设计专家视角
 * 按照Data-Oriented Design原则设计
 * 重点在于数据处理和组件交互
 */

import {
  ResourceComponent,
  ProductionComponent,
  CropComponent,
  AnimalComponent,
  ToolComponent,
  BuildingComponent,
  CharacterComponent,
  CardComponent,
  GameStateComponent,
  WorldComponent,
  UpgradeComponent,
  UpgradeTreeComponent,
  EffectComponent,
  CombatComponent,
  COMPONENT_REGISTRY
} from './components';

// ==========================================
// 系统基类 - System Base Class
// ==========================================

export abstract class BaseSystem {
  public readonly name: string;
  public readonly priority: number;
  public enabled: boolean = true;
  public lastUpdateTime: number = 0;
  public updateInterval: number = 1000; // 默认1秒更新

  constructor(name: string, priority: number = 100) {
    this.name = name;
    this.priority = priority;
  }

  abstract update(entities: any[], dt: number): void;
  
  abstract getRequiredComponents(): string[];
  
  abstract filterEntities(entities: any[]): any[];

  isReadyToUpdate(currentTime: number): boolean {
    return currentTime - this.lastUpdateTime >= this.updateInterval;
  }

  shouldProcessEntity(entity: any): boolean {
    return this.getRequiredComponents().every(type => entity[type] !== undefined);
  }
}

// ==========================================
// 资源管理系统 - Resource Management
// ==========================================

export class ResourceSystem extends BaseSystem {
  constructor() {
    super('资源管理', 80);
    this.updateInterval = 500;
  }

  getRequiredComponents(): string[] {
    return ['resource'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const resourceComp = entity['resource'] as ResourceComponent;
      
      // 资源自然恢复
      Object.keys(resourceComp.resources).forEach(type => {
        if (resourceComp.resources[type] < resourceComp.maxStorage[type]) {
          const recoveryRate = 0.05; // 每分钟5%恢复
          const recoveryAmount = Math.floor(resourceComp.maxStorage[type] * recoveryRate);
          
          if (Math.random() < 0.05) { // 5%概率触发恢复
            resourceComp.addResource(type, recoveryAmount);
          }
        }
      });
    });
  }
}

// ==========================================
// 生产系统 - Production System
// ==========================================

export class ProductionSystem extends BaseSystem {
  constructor() {
    super('生产管理', 70);
    this.updateInterval = 1000;
  }

  getRequiredComponents(): string[] {
    return ['production', 'resource'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const production = entity['production'] as ProductionComponent;
      const resource = entity['resource'] as ResourceComponent;
      
      // 更新生产时间
      production.productionTime += dt;
      
      // 检查是否应该生产
      if (production.productionTime >= production.nextProduction) {
        this.performProduction(entity, production, resource);
        production.productionTime = 0;
      }
    });
  }

  private performProduction(
    entity: any,
    production: ProductionComponent,
    resource: ResourceComponent
  ): void {
    // 作物生产
    if (entity['crop']) {
      const crop = entity['crop'] as CropComponent;
      if (crop.growthStage < crop.maxGrowthStage) {
        this.processCropGrowth(entity, crop);
      } else {
        this.harvestCrop(entity, crop, resource, production);
      }
    }
    
    // 动物生产
    if (entity['animal']) {
      const animal = entity['animal'] as AnimalComponent;
      this.processAnimalProduction(entity, animal, resource, production);
    }
    
    // 建筑生产
    if (entity['building']) {
      this.processBuildingProduction(entity, resource, production);
    }
  }

  private processCropGrowth(entity: any, crop: CropComponent): void {
    crop.growthTime += this.updateInterval;
    
    if (crop.growthTime >= crop.growTimePerStage) {
      crop.growthStage++;
      crop.growthTime = 0;
      
      // 生长阶段奖励
      if (entity['resource'] && Math.random() < 0.3) {
        entity['resource'].addResource('作物', 1);
      }
    }
  }

  private harvestCrop(
    entity: any,
    crop: CropComponent,
    resource: ResourceComponent,
    production: ProductionComponent
  ): void {
    const yieldAmount = Math.floor(crop.calculateYield() * production.efficiency);
    
    resource.addResource('作物', yieldAmount);
    crop.growthStage = 0;
    crop.growthTime = 0;
    
    // 重置生长时间
    crop.growTimePerStage = 5000 + Math.random() * 2000;
  }

  private processAnimalProduction(
    entity: any,
    animal: AnimalComponent,
    resource: ResourceComponent,
    production: ProductionComponent
  ): void {
    const productionAmount = Math.floor(
      animal.productivity * production.efficiency * animal.getProductionBonus()
    );
    
    resource.addResource('动物', productionAmount);
    
    // 动物消耗
    const consumptionAmount = Math.floor(animal.consumption * 0.5);
    if (resource.removeResource('作物', consumptionAmount)) {
      // 消耗成功，动物快乐度增加
      if (animal.happiness < animal.maxHappiness) {
        animal.happiness = Math.min(animal.maxHappiness, animal.happiness + 1);
      }
    } else {
      // 消耗失败，动物快乐度降低
      if (animal.happiness > 0) {
        animal.happiness = Math.max(0, animal.happiness - 2);
      }
    }
  }

  private processBuildingProduction(
    entity: any,
    resource: ResourceComponent,
    production: ProductionComponent
  ): void {
    const building = entity['building'] as BuildingComponent;
    const productionBonus = building.calculateProductionBonus();
    
    const productionAmount = Math.floor(10 * production.efficiency * productionBonus);
    resource.addResource('金币', productionAmount);
  }
}

// ==========================================
// 卡牌管理系统 - Card Management
// ==========================================

export class CardSystem extends BaseSystem {
  constructor() {
    super('卡牌管理', 60);
    this.updateInterval = 200;
  }

  getRequiredComponents(): string[] {
    return ['card'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const card = entity['card'] as CardComponent;
      
      // 更新卡牌冷却
      if (card.cooldown > 0) {
        card.cooldown = Math.max(0, card.cooldown - dt);
      }
    });
  }
}

// ==========================================
// 升级管理系统 - Upgrade Management
// ==========================================

export class UpgradeSystem extends BaseSystem {
  constructor() {
    super('升级管理', 50);
    this.updateInterval = 1000;
  }

  getRequiredComponents(): string[] {
    return ['upgrade', 'upgradeTree'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const upgrade = entity['upgrade'] as UpgradeComponent;
      const upgradeTree = entity['upgradeTree'] as UpgradeTreeComponent;
      
      // 检查升级是否就绪
      upgradeTree.upgrades.forEach(upgradeData => {
        if (upgradeData.level < upgradeData.maxLevel) {
          this.checkUpgradeAvailable(entity, upgradeData, upgrade);
        }
      });
    });
  }

  private checkUpgradeAvailable(
    entity: any,
    upgradeData: any,
    upgrade: UpgradeComponent
  ): void {
    // 检查资源是否满足
    const canAfford = Object.entries(upgradeData.cost).every(([type, cost]) => {
      if (!entity['resource'] || !entity['resource']['resources']) {
        return false;
      }
      
      return entity['resource']['resources'][type] >= cost;
    });

    if (canAfford && upgradeData.level < upgradeData.maxLevel) {
      this.performUpgrade(entity, upgradeData, upgrade);
    }
  }

  private performUpgrade(
    entity: any,
    upgradeData: any,
    upgrade: UpgradeComponent
  ): void {
    // 消耗资源
    Object.entries(upgradeData.cost).forEach(([type, cost]) => {
      entity['resource']['removeResource'](type, cost);
    });

    // 应用升级效果
    upgradeData.effects.forEach(effect => {
      this.applyUpgradeEffect(entity, effect);
    });

    // 更新升级状态
    upgradeData.level++;
    
    // 增加升级点数
    upgrade.points++;
  }

  private applyUpgradeEffect(entity: any, effect: any): void {
    const [component, property] = effect.property.split('.');
    
    if (entity[component] && entity[component][property] !== undefined) {
      const currentValue = entity[component][property];
      entity[component][property] = currentValue + effect.value;
    }
  }
}

// ==========================================
// 战斗系统 - Combat System
// ==========================================

export class CombatSystem extends BaseSystem {
  constructor() {
    super('战斗系统', 90);
    this.updateInterval = 100;
  }

  getRequiredComponents(): string[] {
    return ['combat'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    // 简单的战斗逻辑
    filteredEntities.forEach(entity => {
      const combat = entity['combat'] as CombatComponent;
      
      if (entity['gameState'] && entity['gameState']['gamePhase'] === '战斗') {
        // 战斗逻辑处理
        this.processCombat(entity, combat);
      }
    });
  }

  private processCombat(entity: any, combat: CombatComponent): void {
    // 简单的攻击逻辑
    const damage = combat.calculateDamage();
    const accuracy = combat.accuracy * (Math.random() * 0.2 + 0.9); // 90-110%精度波动
    
    if (Math.random() < accuracy) {
      this.dealDamage(entity, damage);
    }
  }

  private dealDamage(entity: any, damage: number): void {
    if (entity['character']) {
      entity['character']['stats']['health'] = 
        Math.max(0, entity['character']['stats']['health'] - damage);
    }
    
    // 记录战斗统计
    if (entity['gameState']) {
      entity['gameState']['combo']++;
    }
  }
}

// ==========================================
// 效果管理系统 - Effect Management
// ==========================================

export class EffectSystem extends BaseSystem {
  constructor() {
    super('效果管理', 40);
    this.updateInterval = 300;
  }

  getRequiredComponents(): string[] {
    return ['effect'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const effectComp = entity['effect'] as EffectComponent;
      
      // 更新效果持续时间
      effectComp.updateEffects(dt);
      
      // 应用效果
      effectComp.effects.forEach(effect => {
        this.applyEffect(entity, effect);
      });
    });
  }

  private applyEffect(entity: any, effect: any): void {
    // 根据效果类型应用
    if (effect.type === 'buff') {
      this.applyBuff(entity, effect);
    } else if (effect.type === 'debuff') {
      this.applyDebuff(entity, effect);
    }
  }

  private applyBuff(entity: any, effect: any): void {
    switch (effect.name) {
      case '生产加速':
        if (entity['production']) {
          entity['production']['rate'] = Math.min(2.0, entity['production']['rate'] + effect.strength);
        }
        break;
      case '资源增产':
        if (entity['production']) {
          entity['production']['efficiency'] = Math.min(1.5, entity['production']['efficiency'] + effect.strength);
        }
        break;
    }
  }

  private applyDebuff(entity: any, effect: any): void {
    switch (effect.name) {
      case '干旱':
        if (entity['crop']) {
          entity['crop']['growthTime'] += 2000;
        }
        break;
      case '虫害':
        if (entity['crop']) {
          entity['crop']['quality'] = Math.max(0.5, entity['crop']['quality'] - effect.strength);
        }
        break;
    }
  }
}

// ==========================================
// 世界系统 - World Management
// ==========================================

export class WorldSystem extends BaseSystem {
  constructor() {
    super('世界管理', 70);
    this.updateInterval = 1000;
  }

  getRequiredComponents(): string[] {
    return ['world'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const world = entity['world'] as WorldComponent;
      
      // 更新昼夜周期
      world.dayNightCycle += dt;
      if (world.dayNightCycle >= 24000) { // 24小时 = 24000 ms
        world.dayNightCycle = 0;
        world.currentDay++;
        this.newDay(world);
      }
      
      // 触发事件
      this.checkWorldEvents(entity, world);
    });
  }

  private newDay(world: WorldComponent): void {
    // 每日重置
    world.events.forEach(event => {
      if (!event.active) {
        const shouldTrigger = Math.random() < 0.1; // 10%概率触发新事件
        if (shouldTrigger) {
          this.triggerEvent(event);
        }
      }
    });
  }

  private checkWorldEvents(entity: any, world: WorldComponent): void {
    world.events.forEach(event => {
      if (event.active) {
        event.duration -= this.updateInterval;
        
        if (event.duration <= 0) {
          this.endEvent(event);
        }
      }
    });
  }

  private triggerEvent(event: any): void {
    event.active = true;
    event.duration = event.maxDuration;
    
    console.log(`🌍 事件触发: ${event.name} (${event.type})`);
  }

  private endEvent(event: any): void {
    event.active = false;
    
    console.log(`🌍 事件结束: ${event.name}`);
  }
}

// ==========================================
// 游戏状态系统 - Game State Management
// ==========================================

export class GameStateSystem extends BaseSystem {
  constructor() {
    super('状态管理', 50);
    this.updateInterval = 500;
  }

  getRequiredComponents(): string[] {
    return ['gameState'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const gameState = entity['gameState'] as GameStateComponent;
      
      // 更新游戏时间
      gameState.playTime += dt;
      
      // 检查游戏状态转换
      this.checkGameState(entity, gameState);
    });
  }

  private checkGameState(entity: any, gameState: GameStateComponent): void {
    // 简单的状态检查
    if (gameState.gamePhase === '菜单') {
      this.handleMenuState(entity, gameState);
    } else if (gameState.gamePhase === '游戏中') {
      this.handleGameplayState(entity, gameState);
    }
  }

  private handleMenuState(entity: any, gameState: GameStateComponent): void {
    // 等待开始游戏
    if (entity['input'] && entity['input']['startGame']) {
      gameState.gamePhase = '游戏中';
      console.log('🎮 游戏开始！');
    }
  }

  private handleGameplayState(entity: any, gameState: GameStateComponent): void {
    // 游戏进行中的逻辑
    if (entity['resource'] && entity['resource']['resources']['金币'] >= 1000) {
      this.levelComplete(entity, gameState);
    }
    
    if (entity['resource'] && entity['resource']['resources']['金币'] <= 0) {
      this.gameOver(entity, gameState);
    }
  }

  private levelComplete(entity: any, gameState: GameStateComponent): void {
    gameState.gamePhase = '升级';
    console.log('🎉 关卡完成！可以升级了！');
  }

  private gameOver(entity: any, gameState: GameStateComponent): void {
    gameState.gamePhase = '结束';
    console.log('💀 游戏结束！');
  }
}

// ==========================================
// 系统管理器 - System Manager
// ==========================================

export class SystemManager {
  public static instance: SystemManager;
  
  private systems: BaseSystem[] = [];
  private entities: any[] = [];
  private currentTime: number = Date.now();
  private timeSinceLastUpdate: number = 0;

  static getInstance(): SystemManager {
    if (!SystemManager.instance) {
      SystemManager.instance = new SystemManager();
    }
    return SystemManager.instance;
  }

  registerSystem(system: BaseSystem): SystemManager {
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
    return this;
  }

  addEntity(entity: any): void {
    this.entities.push(entity);
  }

  removeEntity(entity: any): void {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }

  update(dt: number): void {
    this.currentTime = Date.now();
    this.timeSinceLastUpdate += dt;

    // 排序系统（高优先级先执行）
    this.systems.sort((a, b) => a.priority - b.priority);

    // 更新所有系统
    this.systems.forEach(system => {
      if (system.enabled && system.isReadyToUpdate(this.currentTime)) {
        system.update(this.entities, dt);
        system.lastUpdateTime = this.currentTime;
      }
    });
  }

  getSystem<T extends BaseSystem>(name: string): T | undefined {
    return this.systems.find(system => system.name === name) as T;
  }

  getEntitiesWithComponents(components: string[]): any[] {
    return this.entities.filter(entity => 
      components.every(type => entity[type] !== undefined)
    );
  }

  getSystemStats(): Array<{
    name: string;
    entitiesProcessed: number;
    lastUpdate: number;
    averageUpdateTime: number;
  }> {
    return this.systems.map(system => ({
      name: system.name,
      entitiesProcessed: system.filterEntities(this.entities).length,
      lastUpdate: system.lastUpdateTime,
      averageUpdateTime: system.updateInterval
    }));
  }
}

// ==========================================
// 默认系统配置
// ==========================================

export function createDefaultSystems(): SystemManager {
  const systemManager = SystemManager.getInstance();
  
  systemManager
    .registerSystem(new ResourceSystem())
    .registerSystem(new ProductionSystem())
    .registerSystem(new CardSystem())
    .registerSystem(new UpgradeSystem())
    .registerSystem(new CombatSystem())
    .registerSystem(new EffectSystem())
    .registerSystem(new WorldSystem())
    .registerSystem(new GameStateSystem());

  return systemManager;
}

// ==========================================
// 调试工具
// ==========================================

export function debugSystemPerformance(systems: BaseSystem[]): void {
  const sorted = [...systems].sort((a, b) => b.priority - a.priority);
  
  console.log('🔥 系统性能分析:');
  sorted.forEach(system => {
    const entitiesProcessed = system.filterEntities([]).length;
    console.log(`[${system.priority}] ${system.name}: ${entitiesProcessed}实体`);
  });
}

export function getSystemDependencies(): any[] {
  return [
    { name: '资源管理', depends: [] },
    { name: '生产管理', depends: ['资源管理'] },
    { name: '卡牌管理', depends: ['资源管理', '生产管理'] },
    { name: '升级管理', depends: ['资源管理', '生产管理'] },
    { name: '战斗系统', depends: ['资源管理'] },
    { name: '效果管理', depends: ['战斗系统', '生产管理'] },
    { name: '世界管理', depends: ['资源管理'] },
    { name: '状态管理', depends: ['资源管理', '生产管理', '战斗系统'] }
  ];
}
