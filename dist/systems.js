/**
 * 🏡 农庄卡牌：田园物语 - ECS系统架构
 *
 * 资深ECS系统设计专家视角
 * 按照Data-Oriented Design原则设计
 * 重点在于数据处理和组件交互
 */
// ==========================================
// 系统基类 - System Base Class
// ==========================================
export class BaseSystem {
    constructor(name, priority = 100) {
        this.enabled = true;
        this.lastUpdateTime = 0;
        this.updateInterval = 1000; // 默认1秒更新
        this.name = name;
        this.priority = priority;
    }
    isReadyToUpdate(currentTime) {
        return currentTime - this.lastUpdateTime >= this.updateInterval;
    }
    shouldProcessEntity(entity) {
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
    getRequiredComponents() {
        return ['resource'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        filteredEntities.forEach(entity => {
            const resourceComp = entity['resource'];
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
    getRequiredComponents() {
        return ['production', 'resource'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        filteredEntities.forEach(entity => {
            const production = entity['production'];
            const resource = entity['resource'];
            // 更新生产时间
            production.productionTime += dt;
            // 检查是否应该生产
            if (production.productionTime >= production.nextProduction) {
                this.performProduction(entity, production, resource);
                production.productionTime = 0;
            }
        });
    }
    performProduction(entity, production, resource) {
        // 作物生产
        if (entity['crop']) {
            const crop = entity['crop'];
            if (crop.growthStage < crop.maxGrowthStage) {
                this.processCropGrowth(entity, crop);
            }
            else {
                this.harvestCrop(entity, crop, resource, production);
            }
        }
        // 动物生产
        if (entity['animal']) {
            const animal = entity['animal'];
            this.processAnimalProduction(entity, animal, resource, production);
        }
        // 建筑生产
        if (entity['building']) {
            this.processBuildingProduction(entity, resource, production);
        }
    }
    processCropGrowth(entity, crop) {
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
    harvestCrop(entity, crop, resource, production) {
        const yieldAmount = Math.floor(crop.calculateYield() * production.efficiency);
        resource.addResource('作物', yieldAmount);
        crop.growthStage = 0;
        crop.growthTime = 0;
        // 重置生长时间
        crop.growTimePerStage = 5000 + Math.random() * 2000;
    }
    processAnimalProduction(entity, animal, resource, production) {
        const productionAmount = Math.floor(animal.productivity * production.efficiency * animal.getProductionBonus());
        resource.addResource('动物', productionAmount);
        // 动物消耗
        const consumptionAmount = Math.floor(animal.consumption * 0.5);
        if (resource.removeResource('作物', consumptionAmount)) {
            // 消耗成功，动物快乐度增加
            if (animal.happiness < animal.maxHappiness) {
                animal.happiness = Math.min(animal.maxHappiness, animal.happiness + 1);
            }
        }
        else {
            // 消耗失败，动物快乐度降低
            if (animal.happiness > 0) {
                animal.happiness = Math.max(0, animal.happiness - 2);
            }
        }
    }
    processBuildingProduction(entity, resource, production) {
        const building = entity['building'];
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
    getRequiredComponents() {
        return ['card'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        filteredEntities.forEach(entity => {
            const card = entity['card'];
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
    getRequiredComponents() {
        return ['deck', 'hand', 'energy', 'gameState'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        filteredEntities.forEach(entity => {
            const gameState = entity['gameState'];
            // 只有游戏进行中才处理回合逻辑
            if (gameState.gamePhase !== '游戏中')
                return;
            this.processTurn(entity);
        });
    }
    processTurn(player) {
        const deck = player['deck'];
        const hand = player['hand'];
        const energy = player['energy'];
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
    playCard(player, cardId, position) {
        const hand = player['hand'];
        const energy = player['energy'];
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
    discardCard(player, cardId) {
        const hand = player['hand'];
        const deck = player['deck'];
        const card = hand.removeCard(cardId);
        if (!card)
            return false;
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
    getRequiredComponents() {
        return ['upgrade', 'upgradeTree'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        filteredEntities.forEach(entity => {
            const upgrade = entity['upgrade'];
            const upgradeTree = entity['upgradeTree'];
            // 检查升级是否就绪
            upgradeTree.upgrades.forEach(upgradeData => {
                if (upgradeData.level < upgradeData.maxLevel) {
                    this.checkUpgradeAvailable(entity, upgradeData, upgrade);
                }
            });
        });
    }
    checkUpgradeAvailable(entity, upgradeData, upgrade) {
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
    performUpgrade(entity, upgradeData, upgrade) {
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
    applyUpgradeEffect(entity, effect) {
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
    getRequiredComponents() {
        return ['combat'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        // 简单的战斗逻辑
        filteredEntities.forEach(entity => {
            const combat = entity['combat'];
            if (entity['gameState'] && entity['gameState']['gamePhase'] === '战斗') {
                // 战斗逻辑处理
                this.processCombat(entity, combat);
            }
        });
    }
    processCombat(entity, combat) {
        // 简单的攻击逻辑
        const damage = combat.calculateDamage();
        const accuracy = combat.accuracy * (Math.random() * 0.2 + 0.9); // 90-110%精度波动
        if (Math.random() < accuracy) {
            this.dealDamage(entity, damage);
        }
    }
    dealDamage(entity, damage) {
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
    getRequiredComponents() {
        return ['effect'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        filteredEntities.forEach(entity => {
            const effectComp = entity['effect'];
            // 更新效果持续时间
            effectComp.updateEffects(dt);
            // 应用效果
            effectComp.effects.forEach(effect => {
                this.applyEffect(entity, effect);
            });
        });
    }
    applyEffect(entity, effect) {
        // 根据效果类型应用
        if (effect.type === 'buff') {
            this.applyBuff(entity, effect);
        }
        else if (effect.type === 'debuff') {
            this.applyDebuff(entity, effect);
        }
    }
    applyBuff(entity, effect) {
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
    applyDebuff(entity, effect) {
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
    getRequiredComponents() {
        return ['world'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        filteredEntities.forEach(entity => {
            const world = entity['world'];
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
    newDay(world) {
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
    checkWorldEvents(entity, world) {
        world.events.forEach(event => {
            if (event.active) {
                event.duration -= this.updateInterval;
                if (event.duration <= 0) {
                    this.endEvent(event);
                }
            }
        });
    }
    triggerEvent(event) {
        event.active = true;
        event.duration = event.maxDuration;
        console.log(`🌍 事件触发: ${event.name} (${event.type})`);
    }
    endEvent(event) {
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
    getRequiredComponents() {
        return ['gameState'];
    }
    filterEntities(entities) {
        return entities.filter(entity => this.getRequiredComponents().every(type => entity[type]));
    }
    update(entities, dt) {
        const filteredEntities = this.filterEntities(entities);
        filteredEntities.forEach(entity => {
            const gameState = entity['gameState'];
            // 更新游戏时间
            gameState.playTime += dt;
            // 检查游戏状态转换
            this.checkGameState(entity, gameState);
        });
    }
    checkGameState(entity, gameState) {
        // 简单的状态检查
        if (gameState.gamePhase === '菜单') {
            this.handleMenuState(entity, gameState);
        }
        else if (gameState.gamePhase === '游戏中') {
            this.handleGameplayState(entity, gameState);
        }
    }
    handleMenuState(entity, gameState) {
        // 等待开始游戏
        if (entity['input'] && entity['input']['startGame']) {
            gameState.gamePhase = '游戏中';
            console.log('🎮 游戏开始！');
        }
    }
    handleGameplayState(entity, gameState) {
        // 游戏进行中的逻辑
        if (entity['resource'] && entity['resource']['resources']['金币'] >= 1000) {
            this.levelComplete(entity, gameState);
        }
        if (entity['resource'] && entity['resource']['resources']['金币'] <= 0) {
            this.gameOver(entity, gameState);
        }
    }
    levelComplete(entity, gameState) {
        gameState.gamePhase = '升级';
        console.log('🎉 关卡完成！可以升级了！');
    }
    gameOver(entity, gameState) {
        gameState.gamePhase = '结束';
        console.log('💀 游戏结束！');
    }
}
// ==========================================
// 系统管理器 - System Manager
// ==========================================
export class SystemManager {
    constructor() {
        this.systems = [];
        this.entities = [];
        this.currentTime = Date.now();
        this.timeSinceLastUpdate = 0;
    }
    static getInstance() {
        if (!SystemManager.instance) {
            SystemManager.instance = new SystemManager();
        }
        return SystemManager.instance;
    }
    registerSystem(system) {
        this.systems.push(system);
        this.systems.sort((a, b) => a.priority - b.priority);
        return this;
    }
    addEntity(entity) {
        this.entities.push(entity);
    }
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }
    update(dt) {
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
    getSystem(name) {
        return this.systems.find(system => system.name === name);
    }
    getEntitiesWithComponents(components) {
        return this.entities.filter(entity => components.every(type => entity[type] !== undefined));
    }
    getSystemStats() {
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
export function createDefaultSystems() {
    const systemManager = SystemManager.getInstance();
    systemManager
        .registerSystem(new ResourceSystem())
        .registerSystem(new ProductionSystem())
        .registerSystem(new CardSystem())
        .registerSystem(new CardPlaySystem())
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
export function debugSystemPerformance(systems) {
    const sorted = [...systems].sort((a, b) => b.priority - a.priority);
    console.log('🔥 系统性能分析:');
    sorted.forEach(system => {
        const entitiesProcessed = system.filterEntities([]).length;
        console.log(`[${system.priority}] ${system.name}: ${entitiesProcessed}实体`);
    });
}
export function getSystemDependencies() {
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
//# sourceMappingURL=systems.js.map