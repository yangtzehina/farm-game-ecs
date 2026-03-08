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
  Quest,
  QuestObjectiveType,
  QuestReward
} from './components';
import { getRandomEvent, ALL_EVENTS } from './events';
import { addRelic, ALL_RELICS } from './relics';
import { metaProgressionManager } from './metaProgression';

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
    
    // 3. 回合数+1
    gameState.turn += 1;
    console.log(`🔄 第${gameState.turn}回合结束`);
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
    
    filteredEntities.forEach(player => {
      const comboComp = player['combo'] as ComboComponent;
      
      // 更新组合持续时间
      comboComp.update(dt);
      
      // 获取所有已打出的卡牌（场上的实体）
      const fieldCards = entities.filter(e => e['card'] && e['position']);
      
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
            // TODO: 实现卡牌奖励逻辑
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
    questComp.updateProgress(objectiveType, target, amount);
  }

  /**
   * 添加预设的初始任务
   */
  addDefaultQuests(entity: any): void {
    if (!entity['quest']) return;
    
    const questComp = entity['quest'] as QuestComponent;
    
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
    
    console.log('📋 初始任务已添加');
  }
}

// ==========================================
// 随机事件系统 - Random Event System
// ==========================================
export class EventSystem extends BaseSystem {
  constructor() {
    super('事件管理', 35);
    this.updateInterval = 1000;
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
      
      // 初始化遗物相关属性
      if (!entity.relics) entity.relics = [];
      if (!entity.relicPool) entity.relicPool = ALL_RELICS.filter(r => r.rarity === 'common' || r.rarity === 'rare');
      
      // 每3回合触发一次随机事件
      if (gameState.turn % 3 === 0 && gameState.turn > 0 && !gameState.eventTriggeredThisTurn) {
        // 检查是否有负面事件免疫
        if (entity.negativeEventImmunity && entity.negativeEventImmunity > 0) {
          entity.negativeEventImmunity -= 1;
          console.log('🛡️  遗物免疫了本次负面事件！');
          gameState.eventTriggeredThisTurn = true;
          return;
        }

        // 调整概率：有正面事件加成的话提升正面概率
        const positiveBonus = entity.positiveEventBonus || 0;
        const roll = Math.random() * 100;
        let event;
        if (roll < 60 + positiveBonus * 100) {
          event = ALL_EVENTS.filter(e => e.type === 'positive')[Math.floor(Math.random() * ALL_EVENTS.filter(e => e.type === 'positive').length)];
        } else if (roll < 85 + positiveBonus * 100) {
          event = ALL_EVENTS.filter(e => e.type === 'neutral')[Math.floor(Math.random() * ALL_EVENTS.filter(e => e.type === 'neutral').length)];
        } else {
          event = ALL_EVENTS.filter(e => e.type === 'negative')[Math.floor(Math.random() * ALL_EVENTS.filter(e => e.type === 'negative').length)];
        }

        // 触发事件效果
        event.effect(entity);
        gameState.eventTriggeredThisTurn = true;
        console.log(`🎲 随机事件触发: [${event.type}] ${event.name} - ${event.description}`);
      }

      // 重置本回合事件触发标记
      if (gameState.turn % 3 !== 0) {
        gameState.eventTriggeredThisTurn = false;
      }
    });
  }
}

// ==========================================
// 遗物系统 - Relic System
// ==========================================
export class RelicSystem extends BaseSystem {
  constructor() {
    super('遗物管理', 30);
    this.updateInterval = 1000;
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
      
      // 初始化遗物列表
      if (!entity.relics) {
        entity.relics = [];
        entity.relicPool = ALL_RELICS.filter(r => r.rarity === 'common' || r.rarity === 'rare');
      }

      // 最多携带6个遗物
      if (entity.relics.length > 6) {
        entity.relics = entity.relics.slice(0, 6);
        console.log('⚠️  遗物数量超过上限，已自动丢弃多余遗物');
      }

      // 检查任务完成是否奖励遗物
      const questComp = entity['quest'] as QuestComponent;
      if (questComp) {
        const completedMidQuests = questComp.completedQuests.filter((qid: string) => qid.startsWith('main_') && parseInt(qid.split('_')[1]) >= 3);
        completedMidQuests.forEach((qid: string) => {
          if (!entity.rewardedQuests?.includes(qid)) {
            entity.rewardedQuests = entity.rewardedQuests || [];
            entity.rewardedQuests.push(qid);
            // 奖励一个随机稀有遗物
            const rareRelics = ALL_RELICS.filter(r => r.rarity === 'rare' || r.rarity === 'epic');
            const randomRelic = rareRelics[Math.floor(Math.random() * rareRelics.length)];
            const success = addRelic(entity, randomRelic.id);
            if (success) {
              console.log(`🎁 任务奖励遗物: ${randomRelic.name} - ${randomRelic.description}`);
            }
          }
        });
      }
    });
  }

  // 外部调用：添加遗物
  addRelic(entity: any, relicId: string): boolean {
    return addRelic(entity, relicId);
  }

  // 获取所有遗物
  getAllRelics() {
    return [...ALL_RELICS];
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
    .registerSystem(new EventSystem())
    .registerSystem(new RelicSystem());

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
