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
  DeckComponent,
  HandComponent,
  EnergyComponent,
  Position,
  COMPONENT_REGISTRY,
  ComboComponent,
  QuestComponent,
  AchievementComponent,
  NotificationComponent,
  DifficultyComponent,
  AchievementConditionType,
  NotificationType,
  AchievementRarity,
  Achievement,
  Quest,
  QuestObjectiveType,
  QuestReward,
  EventSystemComponent,
  GameEvent,
  EventTrigger,
  RelicComponent,
  Relic,
  IntentPreviewComponent,
  FutureIntent
} from './components';
import { EVENTS_CONFIG } from './events.config';
import { RELICS_CONFIG } from './relics.config';

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
// 卡牌玩法系统 - Card Play System
// ==========================================

export class CardPlaySystem extends BaseSystem {
  constructor() {
    super('卡牌玩法', 55);
    this.updateInterval = 1000; // 每回合1秒
  }

  getRequiredComponents(): string[] {
    return ['deck', 'hand', 'energy', 'gameState'];
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
      
      // 只有游戏进行中才处理回合逻辑
      if (gameState.gamePhase !== '游戏中') return;
      
      this.processTurn(entity);
    });
  }

  private processTurn(player: any): void {
    const deck = player['deck'] as DeckComponent;
    const hand = player['hand'] as HandComponent;
    const energy = player['energy'] as EnergyComponent;
    
    // 1. 恢复能量
    energy.regen();
    console.log(`⚡ 能量恢复: ${energy.current}/${energy.max}`);
    
    // 2. 抽2张牌
    for (let i = 0; i < 2; i++) {
      const card = deck.drawCard();
      if (card && hand.addCard(card)) {
        console.log(`🎴 抽到卡牌: ${card.identity.name}`);
      }
    }
    
    console.log(`🤲 当前手牌: ${hand.cards.map(c => c.identity.name).join(', ')}`);
  }

  // 打出卡牌（仅做校验和抽离，添加实体逻辑在外层处理）
  playCard(player: any, cardId: string, position?: Position): any | false {
    const hand = player['hand'] as HandComponent;
    const energy = player['energy'] as EnergyComponent;

    // 找到要打出的卡牌
    const card = hand.removeCard(cardId);
    if (!card) {
      console.log('❌ 手牌中没有这张卡');
      return false;
    }

    // 检查能量是否足够
    const cardCost = card['card']?.energyCost || 1;
    if (!energy.spend(cardCost)) {
      // 能量不足，放回手牌
      hand.addCard(card);
      console.log(`❌ 能量不足，需要${cardCost}点，当前${energy.current}点`);
      return false;
    }

    // 设置卡牌位置
    if (position && card['position']) {
      card['position'].x = position.x;
      card['position'].y = position.y;
    }

    // 卡牌效果触发
    console.log(`✅ 打出卡牌: ${card.identity.name}，消耗${cardCost}点能量`);
    return card;
  }

  // 弃牌
  discardCard(player: any, cardId: string): boolean {
    const hand = player['hand'] as HandComponent;
    const deck = player['deck'] as DeckComponent;

    const card = hand.removeCard(cardId);
    if (!card) return false;

    deck.discardCard(card);
    console.log(`🗑️ 弃掉卡牌: ${card.identity.name}`);
    return true;
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
// 组合技系统 - Combo System
// ==========================================
export class ComboSystem extends BaseSystem {
  // 预设组合配置
  private readonly COMBO_CONFIG = [
    {
      id: 'green_garden',
      name: '绿色田园',
      description: '小麦+蔬菜+水果 → 所有作物产量×1.5',
      requiredCards: ['小麦', '蔬菜', '水果'],
      effect: 'crop_yield_multiplier',
      strength: 1.5,
      type: 'permanent' // 永久生效直到条件不满足
    },
    {
      id: 'animal_paradise',
      name: '动物天堂',
      description: '鸡+牛+羊 → 动物自动收集',
      requiredCards: ['鸡', '牛', '羊'],
      effect: 'animal_auto_collect',
      strength: 1,
      type: 'permanent'
    },
    {
      id: 'industrial_revolution',
      name: '工业革命',
      description: '磨坊+工厂+市场 → 生产额外金币',
      requiredCards: ['磨坊', '工厂', '市场'],
      effect: 'extra_gold_production',
      strength: 50, // 每秒额外生产50金币
      type: 'permanent'
    },
    {
      id: 'nature_force',
      name: '自然之力',
      description: '雨水+阳光+肥料 → 所有作物产量×2',
      requiredCards: ['雨水', '阳光', '肥料'],
      effect: 'crop_yield_multiplier',
      strength: 2.0,
      type: 'temporary',
      duration: 30000 // 持续30秒
    },
    {
      id: 'harvest_goddess',
      name: '丰收女神',
      description: '所有作物升级3次 → 全区域效果',
      requiredCondition: (entities: any[]) => {
        // 检查所有作物卡牌是否都升级到至少3级
        const cropCards = entities.filter(e => e['crop']);
        return cropCards.length > 0 && cropCards.every(crop => crop['identity']?.level >= 3);
      },
      effect: 'global_yield_bonus',
      strength: 1.8, // 所有资源产量×1.8
      type: 'permanent'
    }
  ];

  constructor() {
    super('组合技管理', 45);
    this.updateInterval = 1000;
  }

  getRequiredComponents(): string[] {
    return ['combo', 'resource'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    if (filteredEntities.length === 0) return;

    // 获取所有已打出的卡牌（场上的实体）
    // 将过滤操作移出循环，避免对每个玩家重复执行
    const fieldCards = entities.filter(e => e['card'] && e['position']);

    filteredEntities.forEach(player => {
      const comboComp = player['combo'] as ComboComponent;
      
      // 更新组合持续时间
      comboComp.update(dt);
      
      // 检查所有组合条件
      this.COMBO_CONFIG.forEach(comboConfig => {
        const isConditionMet = this.checkComboCondition(comboConfig, fieldCards);
        const isCurrentlyActive = comboComp.isComboActive(comboConfig.id);
        
        if (isConditionMet && !isCurrentlyActive) {
          // 组合激活
          this.activateCombo(player, comboConfig, comboComp);
        } else if (!isConditionMet && isCurrentlyActive && comboConfig.type === 'permanent') {
          // 永久组合条件不再满足，失效
          this.deactivateCombo(player, comboConfig, comboComp);
        }
      });

      // 应用激活的组合效果
      this.applyComboEffects(player, comboComp, entities);
    });
  }

  private checkComboCondition(comboConfig: any, fieldCards: any[]): boolean {
    // 特殊条件组合（丰收女神）
    if (comboConfig.requiredCondition) {
      return comboConfig.requiredCondition(fieldCards);
    }

    // 卡牌组合检查：是否所有需要的卡牌都在场上
    const fieldCardNames = fieldCards.map(c => c['identity']?.name);
    return comboConfig.requiredCards.every((cardName: string) => 
      fieldCardNames.includes(cardName)
    );
  }

  private activateCombo(player: any, comboConfig: any, comboComp: ComboComponent): void {
    const newlyActivated = comboComp.activateCombo(
      comboConfig.id,
      comboConfig.name,
      comboConfig.description,
      comboConfig.effect,
      comboConfig.strength,
      comboConfig.duration
    );

    if (newlyActivated) {
      // 显示激活提示
      console.log(`🎉 组合技激活! [${comboConfig.name}] ${comboConfig.description}`);
      
      // 增加分数奖励
      if (player['gameState']) {
        player['gameState'].score += 500;
      }
    }
  }

  private deactivateCombo(player: any, comboConfig: any, comboComp: ComboComponent): void {
    comboComp.deactivateCombo(comboConfig.id);
    console.log(`⚠️ 组合技失效! [${comboConfig.name}] 条件不再满足`);
  }

  private applyComboEffects(player: any, comboComp: ComboComponent, entities: any[]): void {
    const activeCombos = comboComp.getActiveCombos();
    
    // 先恢复所有实体的原始状态，清除之前的组合效果
    entities.forEach(entity => {
      if (entity['production']) {
        // 恢复原始效率
        if (entity['production']['originalEfficiency']) {
          entity['production']['efficiency'] = entity['production']['originalEfficiency'];
          delete entity['production']['originalEfficiency'];
        }
        // 关闭自动收集
        if (entity['animal'] && entity['production']['automation']) {
          entity['production']['automation'] = false;
        }
      }
    });
    
    // 应用当前激活的组合效果
    activeCombos.forEach(combo => {
      switch (combo.effect) {
        case 'crop_yield_multiplier':
          // 所有作物产量乘以 strength
          entities.filter(e => e['crop'] && e['production']).forEach(crop => {
            // 保存原始效率，避免重复叠加
            if (!crop['production']['originalEfficiency']) {
              crop['production']['originalEfficiency'] = crop['production']['efficiency'];
            }
            crop['production']['efficiency'] = crop['production']['originalEfficiency'] * combo.strength;
          });
          break;

        case 'animal_auto_collect':
          // 所有动物开启自动收集
          entities.filter(e => e['animal'] && e['production']).forEach(animal => {
            animal['production']['automation'] = true;
          });
          break;

        case 'extra_gold_production':
          // 额外生产金币
          if (player['resource']) {
            player['resource'].addResource('金币', combo.strength);
          }
          break;

        case 'global_yield_bonus':
          // 所有资源产量乘以 strength
          entities.filter(e => e['production']).forEach(entity => {
            if (!entity['production']['originalEfficiency']) {
              entity['production']['originalEfficiency'] = entity['production']['efficiency'];
            }
            entity['production']['efficiency'] = entity['production']['originalEfficiency'] * combo.strength;
          });
          break;
      }
    });

    // 移除失效组合的效果
    const inactiveCombos = comboComp.activeCombos.filter(c => !c.active);
    inactiveCombos.forEach(combo => {
      switch (combo.effect) {
        case 'crop_yield_multiplier':
        case 'global_yield_bonus':
          entities.filter(e => e['production']?.originalEfficiency).forEach(entity => {
            entity['production']['efficiency'] = entity['production']['originalEfficiency'];
            delete entity['production']['originalEfficiency'];
          });
          break;

        case 'animal_auto_collect':
          entities.filter(e => e['animal'] && e['production']).forEach(animal => {
            animal['production']['automation'] = false;
          });
          break;
      }
    });
  }

  // 公共方法：获取所有可用组合
  getAllComboConfigs() {
    return [...this.COMBO_CONFIG];
  }
}

// ==========================================
// 系统管理器 - System Manager
// ==========================================

export class SystemManager {
  public static instance: SystemManager;
  
  public systems: BaseSystem[] = [];
  public entities: any[] = [];
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
// 任务系统 - Quest System
// ==========================================

export class QuestSystem extends BaseSystem {
  constructor() {
    super('任务管理', 45);
    this.updateInterval = 1000;
  }

  getRequiredComponents(): string[] {
    return ['quest', 'resource'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const questComp = entity['quest'] as QuestComponent;
      
      // 重置日常任务
      questComp.resetDailyQuests();
      
      // 检查任务解锁条件
      this.checkQuestUnlocks(entity, questComp);
      
      // 自动发放已完成任务的奖励
      this.autoClaimRewards(entity, questComp);
    });
  }

  /**
   * 检查任务解锁条件
   */
  private checkQuestUnlocks(entity: any, questComp: QuestComponent): void {
    questComp.quests.forEach(quest => {
      if (quest.unlocked || !quest.unlockCondition) return;
      
      const condition = quest.unlockCondition;
      let conditionMet = false;
      
      switch (condition.type) {
        case '收集资源':
          conditionMet = entity['resource']?.resources[condition.target] >= condition.amount;
          break;
        case '达到等级':
          conditionMet = entity['character']?.level >= condition.amount;
          break;
        case '完成任务':
          conditionMet = questComp.completedQuests.includes(condition.target);
          break;
        case '拥有卡牌':
          conditionMet = entity['deck']?.library.some(
            (card: any) => card.identity?.name === condition.target
          ) ?? false;
          break;
      }
      
      if (conditionMet) {
        quest.unlocked = true;
        console.log(`🔓 任务解锁: ${quest.title}`);
      }
    });
  }

  /**
   * 自动发放已完成任务的奖励
   */
  private autoClaimRewards(entity: any, questComp: QuestComponent): void {
    const claimable = questComp.getClaimableQuests();
    
    claimable.forEach(quest => {
      const rewards = questComp.claimRewards(quest.id);
      if (rewards) {
        this.giveRewards(entity, rewards);
        console.log(`🎁 领取任务奖励: ${quest.title}`);
      }
    });
  }

  /**
   * 发放奖励
   */
  private giveRewards(entity: any, rewards: QuestReward[]): void {
    rewards.forEach(reward => {
      switch (reward.type) {
        case '资源':
          if (entity['resource']) {
            entity['resource'].addResource(reward.target, reward.amount);
            console.log(`   获得 ${reward.amount} ${reward.target}`);
          }
          break;
        case '金币':
          if (entity['resource']) {
            entity['resource'].addResource('金币', reward.amount);
            console.log(`   获得 ${reward.amount} 金币`);
          }
          break;
        case '经验':
          if (entity['character']) {
            entity['character'].addExperience(reward.amount);
            console.log(`   获得 ${reward.amount} 经验值`);
          }
          break;
        case '卡牌':
          if (entity['deck']) {
            const cardName = reward.target;

            // 简单推断卡牌类型
            let cardType: '作物' | '动物' | '工具' | '建筑' | '人物' = '作物';
            if (['小鸡', '奶牛', '羊', '猪'].includes(cardName)) {
              cardType = '动物';
            } else if (['锄头', '水桶', '镰刀', '斧头'].includes(cardName)) {
              cardType = '工具';
            } else if (['农舍', '仓库', '风车', '小型农舍'].includes(cardName)) {
              cardType = '建筑';
            } else if (['工人', '助手'].includes(cardName)) {
              cardType = '人物';
            }

            const newCard = EntityFactory.createCardEntity(cardType, {
              identity: { name: cardName, description: `任务奖励卡牌：${cardName}` }
            });

            // 添加到牌库记录，并在弃牌堆放置可被抽到的实际卡牌实例
            // 为了防止同一个对象引用导致的潜在问题，我们深拷贝或者重新创建一个实例用于战斗循环
            const playableCard = EntityFactory.createCardEntity(cardType, {
              identity: { name: cardName, description: `任务奖励卡牌：${cardName}` }
            });

            entity['deck'].library.push(newCard);
            entity['deck'].discardPile.push(playableCard);

            console.log(`   获得卡牌: ${reward.target}`);
          }
          break;
      }
    });
  }

  /**
   * 外部调用：更新任务进度
   */
  updateQuestProgress(
    entity: any,
    objectiveType: QuestObjectiveType,
    target: string,
    amount: number = 1
  ): void {
    if (!entity['quest']) return;
    
    const questComp = entity['quest'] as QuestComponent;
    const notificationSystem = SystemManager.getInstance().getSystem<NotificationSystem>('通知管理');
    const achievementSystem = SystemManager.getInstance().getSystem<AchievementSystem>('成就管理');
    
    // 保存更新前的进度
    const beforeProgress = new Map<string, { current: number, total: number }>();
    questComp.quests.forEach(quest => {
      quest.objectives.forEach(obj => {
        beforeProgress.set(`${quest.id}_${obj.id}`, {
          current: obj.currentAmount,
          total: obj.requiredAmount
        });
      });
    });
    
    // 更新进度
    questComp.updateProgress(objectiveType, target, amount);
    
    // 检查进度变化，发送通知
    questComp.quests.forEach(quest => {
      if (!quest.unlocked || quest.completed) return;
      
      quest.objectives.forEach(obj => {
        const key = `${quest.id}_${obj.id}`;
        const before = beforeProgress.get(key);
        if (before && before.current !== obj.currentAmount) {
          // 进度发生变化
          if (notificationSystem) {
            notificationSystem.sendQuestProgressNotification(
              entity,
              quest.title,
              obj.target,
              obj.currentAmount,
              obj.requiredAmount
            );
          }

          // 如果任务完成，发送完成通知
          if (obj.currentAmount >= obj.requiredAmount && quest.completed) {
            const rewards = questComp.claimRewards(quest.id);
            if (rewards && notificationSystem) {
              notificationSystem.sendQuestCompleteNotification(entity, quest.title, rewards);
            }
          }
        }
      });
    });

    // 更新成就进度
    if (achievementSystem) {
      achievementSystem.updateAchievementProgress(entity, objectiveType as any, target, amount);
    }
  }

  /**
   * 添加预设的初始任务，包含三层目标体系
   */
  addDefaultQuests(entity: any): void {
    if (!entity['quest']) return;
    
    const questComp = entity['quest'] as QuestComponent;
    
    // ==========================================
    // 长期通关目标 - 最高优先级，最终目标
    // ==========================================
    questComp.addQuest({
      id: 'longterm_1',
      type: '长期通关',
      title: '农庄大亨',
      description: '建设顶级农庄，所有设施满级，所有卡牌满级，通关所有难度',
      objectives: [
        { id: 'lt_obj_1', type: '卡牌满级', target: '全部', requiredAmount: 52, currentAmount: 0, completed: false },
        { id: 'lt_obj_2', type: '建筑满级', target: '全部', requiredAmount: 10, currentAmount: 0, completed: false },
        { id: 'lt_obj_3', type: '难度通关', target: '20', requiredAmount: 1, currentAmount: 0, completed: false }
      ],
      rewards: [
        { type: '金币', target: '', amount: 100000 },
        { type: '经验', target: '', amount: 10000 },
        { type: '称号', target: '农庄之神', amount: 1 }
      ],
      unlocked: true,
      completed: false,
      claimed: false,
      priority: 100
    });

    // ==========================================
    // 中期阶段任务 - 分阶段目标，每完成一个阶段解锁新内容
    // ==========================================
    // 阶段1：新手阶段
    questComp.addQuest({
      id: 'mid_1',
      type: '中期阶段',
      title: '阶段1：新手入门',
      description: '完成基础操作，熟悉游戏玩法',
      objectives: [
        { id: 'mid_obj_1', type: '收集资源', target: '作物', requiredAmount: 50, currentAmount: 0, completed: false },
        { id: 'mid_obj_2', type: '升级卡牌', target: '任意', requiredAmount: 3, currentAmount: 0, completed: false },
        { id: 'mid_obj_3', type: '完成任务', target: 'main_3', requiredAmount: 1, currentAmount: 0, completed: false }
      ],
      rewards: [
        { type: '金币', target: '', amount: 500 },
        { type: '资源', target: '木材', amount: 200 },
        { type: '经验', target: '', amount: 500 }
      ],
      unlocked: true,
      completed: false,
      claimed: false,
      priority: 50
    });

    // 阶段2：发展阶段
    questComp.addQuest({
      id: 'mid_2',
      type: '中期阶段',
      title: '阶段2：农庄发展',
      description: '扩大农庄规模，解锁更多卡牌',
      objectives: [
        { id: 'mid_obj_4', type: '收集资源', target: '金币', requiredAmount: 1000, currentAmount: 0, completed: false },
        { id: 'mid_obj_5', type: '拥有卡牌', target: '动物', requiredAmount: 5, currentAmount: 0, completed: false },
        { id: 'mid_obj_6', type: '完成任务', target: 'mid_1', requiredAmount: 1, currentAmount: 0, completed: false }
      ],
      rewards: [
        { type: '金币', target: '', amount: 1500 },
        { type: '资源', target: '石头', amount: 300 },
        { type: '经验', target: '', amount: 1000 }
      ],
      unlocked: false,
      completed: false,
      claimed: false,
      unlockCondition: { type: '完成任务', target: 'mid_1', amount: 1 },
      priority: 50
    });

    // 阶段3：扩张阶段
    questComp.addQuest({
      id: 'mid_3',
      type: '中期阶段',
      title: '阶段3：农庄扩张',
      description: '建设更多设施，提升生产效率',
      objectives: [
        { id: 'mid_obj_7', type: '建筑满级', target: '任意', requiredAmount: 3, currentAmount: 0, completed: false },
        { id: 'mid_obj_8', type: '组合技激活', target: '任意', requiredAmount: 3, currentAmount: 0, completed: false },
        { id: 'mid_obj_9', type: '完成任务', target: 'mid_2', requiredAmount: 1, currentAmount: 0, completed: false }
      ],
      rewards: [
        { type: '金币', target: '', amount: 3000 },
        { type: '经验', target: '', amount: 2000 },
        { type: '卡牌', target: '高级卡牌包', amount: 1 }
      ],
      unlocked: false,
      completed: false,
      claimed: false,
      unlockCondition: { type: '完成任务', target: 'mid_2', amount: 1 },
      priority: 50
    });

    // ==========================================
    // 短期回合目标 - 每回合/每日的即时目标，提供即时反馈
    // ==========================================
    // 当前回合目标
    questComp.addQuest({
      id: 'short_1',
      type: '短期回合',
      title: '本回合目标',
      description: '本回合内生产3个作物资源',
      objectives: [
        { id: 'short_obj_1', type: '生产物品', target: '作物', requiredAmount: 3, currentAmount: 0, completed: false }
      ],
      rewards: [
        { type: '金币', target: '', amount: 50 },
        { type: '经验', target: '', amount: 50 }
      ],
      unlocked: true,
      completed: false,
      claimed: false,
      priority: 10
    });

    // ==========================================
    // 传统主线任务
    // ==========================================
    // 主线任务1
    questComp.addQuest({
      id: 'main_1',
      type: '主线',
      title: '初入农庄',
      description: '收集10个作物资源',
      objectives: [
        {
          id: 'obj_1',
          type: '收集资源',
          target: '作物',
          requiredAmount: 10,
          currentAmount: 0,
          completed: false
        }
      ],
      rewards: [
        { type: '金币', target: '', amount: 100 },
        { type: '资源', target: '木材', amount: 50 }
      ],
      unlocked: true,
      completed: false,
      claimed: false,
      priority: 1
    });
    
    // 主线任务2
    questComp.addQuest({
      id: 'main_2',
      type: '主线',
      title: '积累财富',
      description: '收集50个金币',
      objectives: [
        {
          id: 'obj_2',
          type: '收集资源',
          target: '金币',
          requiredAmount: 50,
          currentAmount: 0,
          completed: false
        }
      ],
      rewards: [
        { type: '经验', target: '', amount: 200 },
        { type: '资源', target: '石头', amount: 30 }
      ],
      unlocked: false,
      completed: false,
      claimed: false,
      unlockCondition: {
        type: '完成任务',
        target: 'main_1',
        amount: 1
      },
      priority: 2
    });

    // 主线任务3
    questComp.addQuest({
      id: 'main_3',
      type: '主线',
      title: '升级卡牌',
      description: '升级3张卡牌',
      objectives: [
        {
          id: 'obj_3',
          type: '升级卡牌',
          target: '任意',
          requiredAmount: 3,
          currentAmount: 0,
          completed: false
        }
      ],
      rewards: [
        { type: '金币', target: '', amount: 300 },
        { type: '经验', target: '', amount: 300 }
      ],
      unlocked: false,
      completed: false,
      claimed: false,
      unlockCondition: {
        type: '完成任务',
        target: 'main_2',
        amount: 1
      },
      priority: 3
    });
    
    // 日常任务
    questComp.addQuest({
      id: 'daily_1',
      type: '日常',
      title: '每日劳作',
      description: '生产5个作物资源',
      objectives: [
        {
          id: 'obj_daily_1',
          type: '生产物品',
          target: '作物',
          requiredAmount: 5,
          currentAmount: 0,
          completed: false
        }
      ],
      rewards: [
        { type: '金币', target: '', amount: 50 },
        { type: '资源', target: '作物', amount: 10 }
      ],
      unlocked: true,
      completed: false,
      claimed: false,
      dailyReset: true,
      priority: 10
    });
    
    console.log('📋 初始任务已添加，包含三层目标体系');
  }
}

// ==========================================
// 成就系统 - Achievement System
// ==========================================

export class AchievementSystem extends BaseSystem {
  constructor() {
    super('成就管理', 40);
    this.updateInterval = 1000;
  }

  getRequiredComponents(): string[] {
    return ['achievement', 'resource', 'notification'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const achievementComp = entity['achievement'] as AchievementComponent;
      const notificationComp = entity['notification'] as NotificationComponent;
      
      // 初始化默认成就（如果还没有添加）
      if (achievementComp.achievements.length === 0) {
        this.addDefaultAchievements(achievementComp);
      }
    });
  }

  /**
   * 添加50个默认成就配置
   */
  addDefaultAchievements(achievementComp: AchievementComponent): void {
    // 普通成就 - 资源收集类 10个
    const resourceAchievements = [
      { id: 'res_1', name: '初次收获', description: '收集10个作物', rarity: '普通', points: 10, conditions: [{ type: '收集资源', target: '作物', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'res_2', name: '农场新手', description: '收集100个作物', rarity: '普通', points: 20, conditions: [{ type: '收集资源', target: '作物', requiredAmount: 100, currentAmount: 0 }] },
      { id: 'res_3', name: '种植大师', description: '收集1000个作物', rarity: '稀有', points: 50, conditions: [{ type: '收集资源', target: '作物', requiredAmount: 1000, currentAmount: 0 }] },
      { id: 'res_4', name: '养殖新手', description: '收集10个动物资源', rarity: '普通', points: 10, conditions: [{ type: '收集资源', target: '动物', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'res_5', name: '养殖达人', description: '收集100个动物资源', rarity: '普通', points: 20, conditions: [{ type: '收集资源', target: '动物', requiredAmount: 100, currentAmount: 0 }] },
      { id: 'res_6', name: '畜牧业大亨', description: '收集1000个动物资源', rarity: '稀有', points: 50, conditions: [{ type: '收集资源', target: '动物', requiredAmount: 1000, currentAmount: 0 }] },
      { id: 'res_7', name: '第一桶金', description: '收集100金币', rarity: '普通', points: 10, conditions: [{ type: '收集资源', target: '金币', requiredAmount: 100, currentAmount: 0 }] },
      { id: 'res_8', name: '小康之家', description: '收集1000金币', rarity: '普通', points: 20, conditions: [{ type: '收集资源', target: '金币', requiredAmount: 1000, currentAmount: 0 }] },
      { id: 'res_9', name: '百万富翁', description: '收集10000金币', rarity: '史诗', points: 100, conditions: [{ type: '收集资源', target: '金币', requiredAmount: 10000, currentAmount: 0 }] },
      { id: 'res_10', name: '资源大亨', description: '所有资源各收集1000个', rarity: '史诗', points: 150, conditions: [
        { type: '收集资源', target: '金币', requiredAmount: 1000, currentAmount: 0 },
        { type: '收集资源', target: '木材', requiredAmount: 1000, currentAmount: 0 },
        { type: '收集资源', target: '石头', requiredAmount: 1000, currentAmount: 0 },
        { type: '收集资源', target: '作物', requiredAmount: 1000, currentAmount: 0 },
        { type: '收集资源', target: '动物', requiredAmount: 1000, currentAmount: 0 }
      ]},
    ];

    // 卡牌升级类 10个
    const upgradeAchievements = [
      { id: 'upgrade_1', name: '初次升级', description: '升级1张卡牌', rarity: '普通', points: 10, conditions: [{ type: '升级卡牌', target: '任意', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'upgrade_2', name: '升级爱好者', description: '升级10张卡牌', rarity: '普通', points: 20, conditions: [{ type: '升级卡牌', target: '任意', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'upgrade_3', name: '升级大师', description: '升级50张卡牌', rarity: '稀有', points: 50, conditions: [{ type: '升级卡牌', target: '任意', requiredAmount: 50, currentAmount: 0 }] },
      { id: 'upgrade_4', name: '卡牌满级', description: '1张卡牌达到最高级', rarity: '稀有', points: 50, conditions: [{ type: '卡牌满级', target: '任意', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'upgrade_5', name: '满级收藏家', description: '10张卡牌达到最高级', rarity: '史诗', points: 100, conditions: [{ type: '卡牌满级', target: '任意', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'upgrade_6', name: '作物专家', description: '所有作物卡牌满级', rarity: '史诗', points: 150, conditions: [{ type: '卡牌满级', target: '作物', requiredAmount: 16, currentAmount: 0 }] },
      { id: 'upgrade_7', name: '动物专家', description: '所有动物卡牌满级', rarity: '史诗', points: 150, conditions: [{ type: '卡牌满级', target: '动物', requiredAmount: 8, currentAmount: 0 }] },
      { id: 'upgrade_8', name: '工具专家', description: '所有工具卡牌满级', rarity: '史诗', points: 150, conditions: [{ type: '卡牌满级', target: '工具', requiredAmount: 12, currentAmount: 0 }] },
      { id: 'upgrade_9', name: '建筑专家', description: '所有建筑卡牌满级', rarity: '史诗', points: 150, conditions: [{ type: '卡牌满级', target: '建筑', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'upgrade_10', name: '全满级大师', description: '所有卡牌满级', rarity: '传说', points: 500, conditions: [{ type: '卡牌满级', target: '全部', requiredAmount: 52, currentAmount: 0 }] },
    ];

    // 游戏进度类 10个
    const progressAchievements = [
      { id: 'progress_1', name: '初入农庄', description: '存活10天', rarity: '普通', points: 10, conditions: [{ type: '存活天数', target: '任意', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'progress_2', name: '农庄经营者', description: '存活30天', rarity: '普通', points: 20, conditions: [{ type: '存活天数', target: '任意', requiredAmount: 30, currentAmount: 0 }] },
      { id: 'progress_3', name: '农庄主人', description: '存活100天', rarity: '稀有', points: 50, conditions: [{ type: '存活天数', target: '任意', requiredAmount: 100, currentAmount: 0 }] },
      { id: 'progress_4', name: '百年农庄', description: '存活365天', rarity: '史诗', points: 100, conditions: [{ type: '存活天数', target: '任意', requiredAmount: 365, currentAmount: 0 }] },
      { id: 'progress_5', name: '千年世家', description: '存活1000天', rarity: '传说', points: 300, conditions: [{ type: '存活天数', target: '任意', requiredAmount: 1000, currentAmount: 0 }] },
      { id: 'progress_6', name: '任务达人', description: '完成10个任务', rarity: '普通', points: 10, conditions: [{ type: '完成任务', target: '任意', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'progress_7', name: '任务大师', description: '完成100个任务', rarity: '普通', points: 20, conditions: [{ type: '完成任务', target: '任意', requiredAmount: 100, currentAmount: 0 }] },
      { id: 'progress_8', name: '组合技新手', description: '激活1个组合技', rarity: '普通', points: 10, conditions: [{ type: '组合技激活', target: '任意', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'progress_9', name: '组合技大师', description: '激活所有组合技', rarity: '稀有', points: 50, conditions: [{ type: '组合技激活', target: '全部', requiredAmount: 5, currentAmount: 0 }] },
      { id: 'progress_10', name: '成就收藏家', description: '获得25个成就', rarity: '史诗', points: 100, conditions: [{ type: '获得成就', target: '任意', requiredAmount: 25, currentAmount: 0 }] },
    ];

    // 难度挑战类 10个
    const difficultyAchievements = [
      { id: 'diff_1', name: '难度入门', description: '通关难度1', rarity: '普通', points: 10, conditions: [{ type: '难度通关', target: '1', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_2', name: '难度进阶', description: '通关难度5', rarity: '普通', points: 20, conditions: [{ type: '难度通关', target: '5', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_3', name: '难度挑战', description: '通关难度10', rarity: '稀有', points: 50, conditions: [{ type: '难度通关', target: '10', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_4', name: '难度专家', description: '通关难度15', rarity: '史诗', points: 100, conditions: [{ type: '难度通关', target: '15', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_5', name: '极限挑战者', description: '通关难度20', rarity: '传说', points: 300, conditions: [{ type: '难度通关', target: '20', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_6', name: '无败新手', description: '难度1无失败通关', rarity: '普通', points: 20, conditions: [{ type: '无失败通关', target: '1', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_7', name: '无败达人', description: '难度5无失败通关', rarity: '稀有', points: 50, conditions: [{ type: '无失败通关', target: '5', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_8', name: '无败大师', description: '难度10无失败通关', rarity: '史诗', points: 100, conditions: [{ type: '无失败通关', target: '10', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_9', name: '不败传说', description: '难度15无失败通关', rarity: '传说', points: 200, conditions: [{ type: '无失败通关', target: '15', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'diff_10', name: '神级玩家', description: '难度20无失败通关', rarity: '传说', points: 500, conditions: [{ type: '无失败通关', target: '20', requiredAmount: 1, currentAmount: 0 }] },
    ];

    // 隐藏成就 10个
    const hiddenAchievements = [
      { id: 'hidden_1', name: '速通大师', description: '10天内完成主线任务10', rarity: '稀有', points: 50, hidden: true, conditions: [{ type: '完成任务', target: 'main_10', requiredAmount: 1, currentAmount: 0 }] },
      { id: 'hidden_2', name: '天胡开局', description: '第一天抽到3张金色卡牌', rarity: '稀有', points: 50, hidden: true, conditions: [{ type: '拥有卡牌', target: '金色', requiredAmount: 3, currentAmount: 0 }] },
      { id: 'hidden_3', name: '非酋附体', description: '连续10次抽卡都是普通卡牌', rarity: '普通', points: 10, hidden: true, conditions: [{ type: '拥有卡牌', target: '普通', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'hidden_4', name: '环保主义者', description: '30天不砍伐树木', rarity: '稀有', points: 50, hidden: true, conditions: [{ type: '收集资源', target: '木材', requiredAmount: 0, currentAmount: 0 }] },
      { id: 'hidden_5', name: '素食主义者', description: '30天不养殖动物', rarity: '稀有', points: 50, hidden: true, conditions: [{ type: '收集资源', target: '动物', requiredAmount: 0, currentAmount: 0 }] },
      { id: 'hidden_6', name: '守财奴', description: '100天不花一分金币', rarity: '史诗', points: 100, hidden: true, conditions: [{ type: '收集资源', target: '金币', requiredAmount: 1000, currentAmount: 0 }] },
      { id: 'hidden_7', name: '建筑大师', description: '所有建筑满级', rarity: '史诗', points: 150, hidden: true, conditions: [{ type: '建筑满级', target: '全部', requiredAmount: 10, currentAmount: 0 }] },
      { id: 'hidden_8', name: '卡牌收藏家', description: '收集所有卡牌', rarity: '史诗', points: 150, hidden: true, conditions: [{ type: '收集所有卡牌', target: '全部', requiredAmount: 52, currentAmount: 0 }] },
      { id: 'hidden_9', name: '完美主义者', description: '所有成就达成', rarity: '传说', points: 1000, hidden: true, conditions: [{ type: '获得成就', target: '全部', requiredAmount: 49, currentAmount: 0 }] },
      { id: 'hidden_10', name: '农庄之神', description: '所有条件全部满级', rarity: '传说', points: 2000, hidden: true, conditions: [
        { type: '卡牌满级', target: '全部', requiredAmount: 52, currentAmount: 0 },
        { type: '建筑满级', target: '全部', requiredAmount: 10, currentAmount: 0 },
        { type: '难度通关', target: '20', requiredAmount: 1, currentAmount: 0 },
        { type: '获得成就', target: '全部', requiredAmount: 49, currentAmount: 0 }
      ]},
    ];

    // 添加所有成就
    [...resourceAchievements, ...upgradeAchievements, ...progressAchievements, ...difficultyAchievements, ...hiddenAchievements].forEach(ach => {
      achievementComp.addAchievement({
        ...ach,
        icon: this.getAchievementIcon(ach.rarity as AchievementRarity),
        rewards: this.generateAchievementRewards(ach.rarity as AchievementRarity, ach.points),
        unlocked: false,
        hidden: (ach as any).hidden ?? false
      } as Achievement);
    });

    console.log(`🏆 已加载 ${achievementComp.achievements.length} 个成就`);
  }

  /**
   * 获取成就图标
   */
  private getAchievementIcon(rarity: string): string {
    switch (rarity) {
      case '普通': return '🥉';
      case '稀有': return '🥈';
      case '史诗': return '🥇';
      case '传说': return '🏆';
      case '隐藏': return '⭐';
      default: return '🎖️';
    }
  }

  /**
   * 生成成就奖励
   */
  private generateAchievementRewards(rarity: string, points: number): any[] {
    const rewards: any[] = [];
    const multiplier = points / 10;

    switch (rarity) {
      case '普通':
        rewards.push({ type: '金币', target: '', amount: 100 * multiplier });
        rewards.push({ type: '资源', target: '木材', amount: 50 * multiplier });
        break;
      case '稀有':
        rewards.push({ type: '金币', target: '', amount: 300 * multiplier });
        rewards.push({ type: '资源', target: '石头', amount: 100 * multiplier });
        break;
      case '史诗':
        rewards.push({ type: '金币', target: '', amount: 1000 * multiplier });
        rewards.push({ type: '经验', target: '', amount: 500 * multiplier });
        break;
      case '传说':
        rewards.push({ type: '金币', target: '', amount: 5000 * multiplier });
        rewards.push({ type: '经验', target: '', amount: 2000 * multiplier });
        rewards.push({ type: '头像框', target: rarity, amount: 1 });
        break;
      case '隐藏':
        rewards.push({ type: '金币', target: '', amount: 200 * multiplier });
        rewards.push({ type: '称号', target: '隐藏成就', amount: 1 });
        break;
    }

    return rewards;
  }

  /**
   * 外部调用：更新成就进度
   */
  updateAchievementProgress(
    entity: any,
    conditionType: AchievementConditionType,
    target: string,
    amount: number = 1
  ): void {
    if (!entity['achievement'] || !entity['notification']) return;
    
    const achievementComp = entity['achievement'] as AchievementComponent;
    const notificationComp = entity['notification'] as NotificationComponent;
    
    // 更新进度，获取新解锁的成就
    const newlyUnlocked = achievementComp.updateProgress(conditionType, target, amount);
    
    // 发送解锁通知
    newlyUnlocked.forEach(achievement => {
      notificationComp.sendNotification(
        '成就解锁',
        `🏆 成就解锁! [${achievement.rarity}] ${achievement.name}`,
        achievement.description,
        {
          icon: achievement.icon,
          duration: 5000,
          priority: 10,
          animation: 'bounce'
        }
      );

      // 发放成就奖励
      this.giveAchievementRewards(entity, achievement.rewards);
    });
  }

  /**
   * 发放成就奖励
   */
  private giveAchievementRewards(entity: any, rewards: any[]): void {
    rewards.forEach(reward => {
      switch (reward.type) {
        case '资源':
        case '金币':
          if (entity['resource']) {
            entity['resource'].addResource(reward.target || reward.type, reward.amount);
            console.log(`   获得 ${reward.amount} ${reward.target || reward.type}`);
          }
          break;
        case '经验':
          if (entity['character']) {
            entity['character'].addExperience(reward.amount);
            console.log(`   获得 ${reward.amount} 经验值`);
          }
          break;
        case '卡牌':
          if (entity['deck']) {
            console.log(`   获得卡牌: ${reward.target}`);
          }
          break;
        case '头像框':
        case '称号':
          console.log(`   获得${reward.type}: ${reward.target}`);
          break;
      }
    });
  }
}

// ==========================================
// 难度系统 - Difficulty System
// ==========================================

export class DifficultySystem extends BaseSystem {
  constructor() {
    super('难度管理', 35);
    this.updateInterval = 2000;
  }

  getRequiredComponents(): string[] {
    return ['difficulty', 'world', 'resource', 'notification'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const difficultyComp = entity['difficulty'] as DifficultyComponent;
      const worldComp = entity['world'] as WorldComponent;
      const notificationComp = entity['notification'] as NotificationComponent;
      
      // 应用难度加成到世界属性
      const currentDifficulty = difficultyComp.getCurrentDifficulty();
      worldComp.events.forEach(event => {
        if (event.type === '难度加成') {
          event.effects = [
            { property: 'resourceMultiplier', value: currentDifficulty.resourceMultiplier },
            { property: 'productionMultiplier', value: currentDifficulty.productionMultiplier },
            { property: 'enemyHealthMultiplier', value: currentDifficulty.enemyHealthMultiplier },
            { property: 'enemyDamageMultiplier', value: currentDifficulty.enemyDamageMultiplier }
          ];
        }
      });

      // 检查是否可以提升难度
      this.checkDifficultyUnlock(entity, difficultyComp, notificationComp);
    });
  }

  /**
   * 检查难度解锁条件
   */
  private checkDifficultyUnlock(entity: any, difficultyComp: DifficultyComponent, notificationComp: NotificationComponent): void {
    difficultyComp.levels.forEach(level => {
      if (level.unlocked) return;
      
      const condition = level.unlockCondition;
      let conditionMet = false;
      
      switch (condition.type) {
        case '难度通关':
          // 检查是否通关了前一个难度
          const prevLevel = parseInt(condition.target);
          conditionMet = entity['gameState']?.highScore >= prevLevel * 1000;
          break;
        case '达到等级':
          conditionMet = entity['character']?.level >= condition.amount;
          break;
        case '完成任务':
          conditionMet = entity['quest']?.completedQuests.includes(condition.target) ?? false;
          break;
      }
      
      if (conditionMet) {
        difficultyComp.unlockLevel(level.level);
        notificationComp.sendNotification(
          '系统提示',
          `🔓 新难度解锁!`,
          `难度 ${level.level} - ${level.name} 已解锁，奖励提升 ${Math.round((level.rewardMultiplier - 1) * 100)}%`,
          {
            icon: '🔼',
            duration: 3000,
            priority: 5
          }
        );
      }
    });
  }

  /**
   * 切换难度
   */
  setDifficultyLevel(entity: any, level: number): boolean {
    if (!entity['difficulty'] || !entity['notification']) return false;
    
    const difficultyComp = entity['difficulty'] as DifficultyComponent;
    const notificationComp = entity['notification'] as NotificationComponent;
    const levelConfig = difficultyComp.levels.find(l => l.level === level);
    
    if (!levelConfig || !levelConfig.unlocked) {
      notificationComp.sendNotification(
        '系统提示',
        '❌ 难度未解锁',
        `难度 ${level} 还未解锁，请先通关前置难度`,
        { duration: 2000, priority: 2 }
      );
      return false;
    }
    
    difficultyComp.currentLevel = level;
    notificationComp.sendNotification(
      '系统提示',
      `🔼 难度已切换`,
      `当前难度: ${level}级 ${levelConfig.name}，奖励提升 ${Math.round((levelConfig.rewardMultiplier - 1) * 100)}%`,
      { duration: 3000, priority: 5 }
    );
    
    return true;
  }

  /**
   * 难度结算
   */
  difficultySettlement(entity: any): void {
    if (!entity['difficulty'] || !entity['resource'] || !entity['notification']) return;
    
    const difficultyComp = entity['difficulty'] as DifficultyComponent;
    const resourceComp = entity['resource'] as ResourceComponent;
    const notificationComp = entity['notification'] as NotificationComponent;
    const currentDifficulty = difficultyComp.getCurrentDifficulty();
    
    // 应用难度奖励倍数
    const baseReward = 100 * currentDifficulty.rewardMultiplier;
    resourceComp.addResource('金币', Math.floor(baseReward));
    
    notificationComp.sendNotification(
      '奖励获得',
      `🎉 难度结算奖励`,
      `难度 ${currentDifficulty.level} 奖励: ${Math.floor(baseReward)} 金币`,
      { duration: 3000, priority: 8 }
    );

    // 更新成就进度
    const achievementSystem = SystemManager.getInstance().getSystem<AchievementSystem>('成就管理');
    if (achievementSystem) {
      achievementSystem.updateAchievementProgress(entity, '难度通关', currentDifficulty.level.toString(), 1);
    }
  }
}

// ==========================================
// 通知系统 - Notification System
// ==========================================

export class NotificationSystem extends BaseSystem {
  constructor() {
    super('通知管理', 30);
    this.updateInterval = 500;
  }

  getRequiredComponents(): string[] {
    return ['notification'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(entity => 
      this.getRequiredComponents().every(type => entity[type])
    );
  }

  update(entities: any[], dt: number): void {
    const filteredEntities = this.filterEntities(entities);
    
    filteredEntities.forEach(entity => {
      const notificationComp = entity['notification'] as NotificationComponent;
      
      // 清理过期通知
      notificationComp.cleanupExpired();
      
      // 输出调试信息
      const activeNotifications = notificationComp.getActiveNotifications();
      if (activeNotifications.length > 0) {
        activeNotifications.forEach(notify => {
          console.log(`[${notify.type}] ${notify.title}: ${notify.message}`);
        });
      }
    });
  }

  /**
   * 发送任务进度通知
   */
  sendQuestProgressNotification(entity: any, questTitle: string, objective: string, current: number, total: number): void {
    if (!entity['notification']) return;
    
    const notificationComp = entity['notification'] as NotificationComponent;
    const progress = Math.round((current / total) * 100);
    
    notificationComp.sendNotification(
      '任务进度',
      `📋 任务进度更新`,
      `[${questTitle}] ${objective}: ${current}/${total} (${progress}%)`,
      { duration: 2000, priority: 3 }
    );
  }

  /**
   * 发送任务完成通知
   */
  sendQuestCompleteNotification(entity: any, questTitle: string, rewards: any[]): void {
    if (!entity['notification']) return;
    
    const notificationComp = entity['notification'] as NotificationComponent;
    const rewardText = rewards.map(r => `${r.amount}${r.target || r.type}`).join(', ');
    
    notificationComp.sendNotification(
      '任务完成',
      `✅ 任务完成!`,
      `[${questTitle}] 已完成，获得奖励: ${rewardText}`,
      { duration: 3000, priority: 8, animation: 'bounce' }
    );
  }
}

// ==========================================
// 随机事件系统 - Event System
// ==========================================
export class EventSystem extends BaseSystem {
  constructor() {
    super('随机事件系统', 90);
  }

  getRequiredComponents(): string[] {
    return ['eventSystem', 'identity'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(e => e.eventSystem && e.identity?.entityType === '世界');
  }

  update(entities: any[], dt: number): void {
    const worldEntity = this.filterEntities(entities)[0];
    if (!worldEntity) return;

    const eventComp = worldEntity.eventSystem as EventSystemComponent;
    
    // 初始化事件配置
    if (eventComp.eventConfig.length === 0) {
      EVENTS_CONFIG.forEach(event => eventComp.registerEvent(event));
      console.log('🎲 随机事件系统已初始化，共加载' + EVENTS_CONFIG.length + '个事件');
    }
  }

  /**
   * 在指定触发点触发随机事件
   */
  triggerEvent(triggerType: EventTrigger, playerEntity: any, worldEntity: any): GameEvent | null {
    const eventComp = worldEntity.eventSystem as EventSystemComponent;
    const playerLevel = playerEntity.character?.level ?? 1;

    // 检查触发概率
    if (Math.random() > eventComp.eventTriggerChance) {
      return null;
    }

    const triggeredEvent = eventComp.triggerRandomEvent(triggerType, playerLevel);
    if (triggeredEvent) {
      console.log(`🎲 触发事件: ${triggeredEvent.name} - ${triggeredEvent.description}`);
      this.applyEventEffects(triggeredEvent, playerEntity, worldEntity);
    }

    return triggeredEvent;
  }

  /**
   * 应用事件效果
   */
  private applyEventEffects(event: GameEvent, playerEntity: any, worldEntity: any): void {
    const resourceComp = playerEntity.resource as ResourceComponent;

    event.effects.forEach(effect => {
      switch (effect.type) {
        case '资源变更':
          if (effect.target === '所有') {
            Object.keys(resourceComp.resources).forEach(type => {
              const change = typeof effect.value === 'number' && effect.value < 1 
                ? Math.floor(resourceComp.resources[type] * effect.value)
                : effect.value as number;
              if (change < 0) {
                resourceComp.removeResource(type, Math.abs(change));
              } else {
                resourceComp.addResource(type, change);
              }
            });
          } else {
            const change = typeof effect.value === 'number' && effect.value < 1 
              ? Math.floor(resourceComp.resources[effect.target] * effect.value)
              : effect.value as number;
            if (change < 0) {
              resourceComp.removeResource(effect.target, Math.abs(change));
            } else {
              resourceComp.addResource(effect.target, change);
            }
          }
          break;
        case '生产效率变更':
          // 生产效率变更效果在ProductionSystem中应用
          break;
        case '获得卡牌':
          // 获得卡牌效果在CardSystem中应用
          break;
        case '失去卡牌':
          // 失去卡牌效果在CardSystem中应用
          break;
        case '获得遗物':
          // 获得遗物效果在RelicSystem中应用
          break;
      }
    });
  }

  /**
   * 回合结束时更新事件状态
   */
  endOfRoundUpdate(worldEntity: any): void {
    const eventComp = worldEntity.eventSystem as EventSystemComponent;
    eventComp.updateEvents();
  }
}

// ==========================================
// 遗物系统 - Relic System
// ==========================================
export class RelicSystem extends BaseSystem {
  constructor() {
    super('遗物系统', 85);
  }

  getRequiredComponents(): string[] {
    return ['relic', 'identity'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(e => e.relic && e.identity?.entityType === '玩家');
  }

  update(entities: any[], dt: number): void {
    const playerEntity = this.filterEntities(entities)[0];
    if (!playerEntity) return;

    const relicComp = playerEntity.relic as RelicComponent;
    
    // 初始化遗物配置
    if (relicComp.relicConfig.length === 0) {
      RELICS_CONFIG.forEach(relic => relicComp.registerRelic(relic));
      console.log('💎 遗物系统已初始化，共加载' + RELICS_CONFIG.length + '个遗物');
    }
  }

  /**
   * 玩家获得遗物
   */
  addRelic(playerEntity: any, relicId: string): boolean {
    const relicComp = playerEntity.relic as RelicComponent;
    const success = relicComp.addRelic(relicId);
    if (success) {
      const relic = relicComp.relics.find(r => r.id === relicId);
      console.log(`💎 获得遗物: ${relic?.name} - ${relic?.description}`);
      this.applyRelicEffects(playerEntity);
    }
    return success;
  }

  /**
   * 应用所有遗物的效果
   */
  applyRelicEffects(playerEntity: any): void {
    const relicComp = playerEntity.relic as RelicComponent;
    const resourceComp = playerEntity.resource as ResourceComponent;
    const energyComp = playerEntity.energy as EnergyComponent;
    const handComp = playerEntity.hand as HandComponent;

    // 应用资源加成
    const goldBonus = relicComp.getEffectSum('资源加成', '金币');
    if (goldBonus > 0 && Number.isInteger(goldBonus)) {
      resourceComp.addResource('金币', goldBonus);
    }

    // 应用能量上限提升
    const energyBonus = relicComp.getEffectSum('特殊效果', '能量上限提升');
    energyComp.max = 10 + energyBonus;

    // 应用手牌上限提升
    const handBonus = relicComp.getEffectSum('特殊效果', '手牌上限提升');
    handComp.maxHandSize = 8 + handBonus;

    // 应用存储上限提升
    const storageBonus = relicComp.getEffectSum('资源加成', '存储上限');
    Object.keys(resourceComp.maxStorage).forEach(type => {
      resourceComp.maxStorage[type] = Math.floor(resourceComp.maxStorage[type] * (1 + storageBonus));
    });
  }

  /**
   * 获取所有生产加成
   */
  getProductionBonus(playerEntity: any, targetType: string): number {
    const relicComp = playerEntity.relic as RelicComponent;
    return relicComp.getEffectSum('生产加成', targetType);
  }

  /**
   * 获取事件概率调整
   */
  getEventProbabilityModifier(playerEntity: any, eventType: string): number {
    const relicComp = playerEntity.relic as RelicComponent;
    return relicComp.getEffectSum('事件概率调整', eventType);
  }
}

// ==========================================
// 卡组管理系统 - Deck Management System
// ==========================================
export class DeckManagementSystem extends BaseSystem {
  constructor() {
    super('卡组管理系统', 80);
  }

  getRequiredComponents(): string[] {
    return ['deck', 'identity'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(e => e.deck && e.identity?.entityType === '玩家');
  }

  update(entities: any[], dt: number): void {
    // 不需要每帧更新
  }

  /**
   * 删除卡牌
   */
  deleteCard(playerEntity: any, cardId: string): boolean {
    const deckComp = playerEntity.deck as DeckComponent;
    const success = deckComp.removeCardFromLibrary(cardId);
    if (success) {
      console.log(`🗑️  删除卡牌: ${cardId}`);
    }
    return success;
  }

  /**
   * 升级卡牌
   */
  upgradeCard(playerEntity: any, cardId: string): boolean {
    const deckComp = playerEntity.deck as DeckComponent;
    const resourceComp = playerEntity.resource as ResourceComponent;
    const relicComp = playerEntity.relic as RelicComponent;

    const card = deckComp.library.find(c => c.identity?.uniqueId === cardId);
    if (!card || !card.upgrade) return false;

    // 计算升级消耗（考虑遗物效果）
    const costReduction = Number(relicComp?.getEffectSum('特殊效果', '升级消耗减少') ?? 0);
    const upgradeCost = { ...card.upgrade.upgradeCost };
    
    Object.keys(upgradeCost).forEach(type => {
      upgradeCost[type] = Math.floor(upgradeCost[type] * (1 - costReduction));
    });

    // 检查资源是否足够
    const canUpgrade = Object.entries(upgradeCost).every(
      ([type, cost]) => resourceComp.resources[type] >= (cost as number)
    );

    if (!canUpgrade) return false;

    // 扣除资源
    Object.entries(upgradeCost).forEach(([type, cost]) => {
      resourceComp.removeResource(type, cost as number);
    });

    // 升级卡牌
    const success = deckComp.upgradeCard(cardId);
    if (success) {
      console.log(`⬆️  升级卡牌: ${card.identity.name} 到等级 ${card.identity.level}`);
    }

    return success;
  }

  /**
   * 获取所有可升级的卡牌
   */
  getUpgradableCards(playerEntity: any): any[] {
    const deckComp = playerEntity.deck as DeckComponent;
    return deckComp.getUpgradableCards();
  }
}

// ==========================================
// 意图提示系统 - Intent Preview System
// ==========================================
export class IntentPreviewSystem extends BaseSystem {
  constructor() {
    super('意图提示系统', 75);
  }

  getRequiredComponents(): string[] {
    return ['intentPreview', 'identity'];
  }

  filterEntities(entities: any[]): any[] {
    return entities.filter(e => e.intentPreview && e.identity?.entityType === '世界');
  }

  update(entities: any[], dt: number): void {
    // 不需要每帧更新
  }

  /**
   * 添加未来事件提示
   */
  addFutureIntent(worldEntity: any, intent: FutureIntent): void {
    const intentComp = worldEntity.intentPreview as IntentPreviewComponent;
    intentComp.addIntent(intent);
    console.log(`🔮 添加意图提示: ${intent.name} 将在第 ${intent.round} 回合发生`);
  }

  /**
   * 获取当前需要显示的意图
   */
  getCurrentIntents(worldEntity: any, currentRound: number): FutureIntent[] {
    const intentComp = worldEntity.intentPreview as IntentPreviewComponent;
    return intentComp.getCurrentIntents(currentRound);
  }

  /**
   * 回合结束时更新意图状态
   */
  endOfRoundUpdate(worldEntity: any, currentRound: number): void {
    const intentComp = worldEntity.intentPreview as IntentPreviewComponent;
    intentComp.updateIntents(currentRound);

    // 自动生成未来灾害/价格波动提示
    this.generateFutureIntents(worldEntity, currentRound);
  }

  /**
   * 生成未来事件提示
   */
  private generateFutureIntents(worldEntity: any, currentRound: number): void {
    const eventComp = worldEntity.eventSystem as EventSystemComponent;
    const intentComp = worldEntity.intentPreview as IntentPreviewComponent;

    // 提前生成未来2回合可能发生的灾害事件
    for (let i = 1; i <= intentComp.previewRounds; i++) {
      const futureRound = currentRound + i;
      
      // 70%概率生成灾害预警
      if (Math.random() < 0.7) {
        const disasterEvents = eventComp.eventConfig.filter(e => e.type === '灾害');
        const randomDisaster = disasterEvents[Math.floor(Math.random() * disasterEvents.length)];
        
        this.addFutureIntent(worldEntity, {
          type: '灾害预警',
          name: randomDisaster.name,
          description: randomDisaster.description,
          round: futureRound,
          severity: '高'
        });
      }

      // 50%概率生成价格波动提示
      if (Math.random() < 0.5) {
        const isRise = Math.random() > 0.5;
        this.addFutureIntent(worldEntity, {
          type: '价格波动',
          name: isRise ? '作物价格上涨' : '作物价格下跌',
          description: isRise ? '未来作物价格将上涨30%，建议提前储备' : '未来作物价格将下跌20%，建议尽快出售',
          round: futureRound,
          severity: isRise ? '低' : '中'
        });
      }
    }
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
    .registerSystem(new CardPlaySystem())
    .registerSystem(new UpgradeSystem())
    .registerSystem(new CombatSystem())
    .registerSystem(new EffectSystem())
    .registerSystem(new ComboSystem())
    .registerSystem(new WorldSystem())
    .registerSystem(new GameStateSystem())
    .registerSystem(new QuestSystem())
    .registerSystem(new AchievementSystem())
    .registerSystem(new DifficultySystem())
    .registerSystem(new NotificationSystem())
    .registerSystem(new EventSystem())
    .registerSystem(new RelicSystem())
    .registerSystem(new DeckManagementSystem())
    .registerSystem(new IntentPreviewSystem());

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
