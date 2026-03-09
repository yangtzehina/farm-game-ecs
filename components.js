/**
 * 🏡 农庄卡牌：田园物语 - ECS系统设计
 *
 * 资深ECS系统设计专家视角
 * 遵循Data-Oriented Design原则
 * 优先设计数据Component，再设计System
 */
// ==========================================
// 基础组件 - Core Components
// ==========================================
/**
 * IdentityComponent - 身份标识组件
 * 所有实体都应包含
 */
export class IdentityComponent {
    constructor(config = {}) {
        this.name = '';
        this.description = '';
        this.entityType = '';
        this.tier = 1;
        this.level = 1;
        this.exp = 0;
        this.maxExp = 100;
        this.uniqueId = '';
        Object.assign(this, config);
    }
}
IdentityComponent.TYPE = 'identity';
/**
 * PositionComponent - 位置组件
 * 用于布局和空间计算
 */
export class PositionComponent {
    constructor(x = 0, y = 0, rotation = 0) {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }
}
PositionComponent.TYPE = 'position';
/**
 * DimensionsComponent - 尺寸组件
 * 用于渲染和碰撞检测
 */
export class DimensionsComponent {
    constructor(width = 1, height = 1) {
        this.width = 1;
        this.height = 1;
        this.width = width;
        this.height = height;
    }
}
DimensionsComponent.TYPE = 'dimensions';
// ==========================================
// 资源和经济组件 - Resource Components
// ==========================================
/**
 * ResourceComponent - 资源组件
 * 实体的资源存储和生产
 */
export class ResourceComponent {
    constructor(config = {}) {
        this.resources = {
            '金币': 0,
            '木材': 0,
            '石头': 0,
            '作物': 0,
            '动物': 0
        };
        this.production = {
            '金币': 0,
            '木材': 0,
            '石头': 0,
            '作物': 0,
            '动物': 0
        };
        this.maxStorage = {
            '金币': 10000,
            '木材': 2000,
            '石头': 1500,
            '作物': 1000,
            '动物': 500
        };
        Object.assign(this, config);
    }
    addResource(type, amount) {
        if (!this.resources[type])
            return false;
        if (this.resources[type] + amount > this.maxStorage[type])
            return false;
        this.resources[type] += amount;
        return true;
    }
    removeResource(type, amount) {
        if (!this.resources[type])
            return false;
        if (this.resources[type] - amount < 0)
            return false;
        this.resources[type] -= amount;
        return true;
    }
}
ResourceComponent.TYPE = 'resource';
/**
 * ProductionComponent - 生产组件
 * 实体的生产能力
 */
export class ProductionComponent {
    constructor(config = {}) {
        this.rate = 1;
        this.productionTime = 0;
        this.nextProduction = 1000; // 毫秒
        this.efficiency = 1.0;
        this.quality = 1.0;
        this.automation = false;
        Object.assign(this, config);
    }
    calculateProduction(baseAmount, efficiency, quality) {
        return baseAmount * this.rate * efficiency * quality;
    }
}
ProductionComponent.TYPE = 'production';
// ==========================================
// 卡牌组件 - Card Components
// ==========================================
/**
 * CardComponent - 卡牌基础组件
 * 所有卡牌实体的基类
 */
export class CardComponent {
    constructor(config = {}) {
        this.cardType = '作物';
        this.energyCost = 1;
        this.cooldown = 0;
        this.maxCooldown = 0;
        Object.assign(this, config);
    }
}
CardComponent.TYPE = 'card';
/**
 * CropComponent - 作物卡牌组件
 */
export class CropComponent {
    constructor(config = {}) {
        this.growthStage = 0;
        this.maxGrowthStage = 4;
        this.growthTime = 0;
        this.growTimePerStage = 2500; // 2.5秒每阶段，4阶段总共10秒对应小麦生长周期
        this.yield = 2;
        this.quality = 1.0;
        this.fertilityBonus = 0;
        Object.assign(this, config);
    }
    calculateYield() {
        return this.yield * this.quality * (1 + this.fertilityBonus);
    }
}
CropComponent.TYPE = 'crop';
/**
 * AnimalComponent - 动物卡牌组件
 */
export class AnimalComponent {
    constructor(config = {}) {
        this.productivity = 0.5;
        this.consumption = 0.2;
        this.happiness = 80;
        this.maxHappiness = 100;
        this.age = 0;
        this.maxAge = 100;
        this.health = 100;
        Object.assign(this, config);
    }
    getProductionBonus() {
        return Math.min(1.5, Math.max(0.5, this.happiness / 100));
    }
}
AnimalComponent.TYPE = 'animal';
/**
 * ToolComponent - 工具卡牌组件
 */
export class ToolComponent {
    constructor(config = {}) {
        this.efficiencyBonus = 0.1;
        this.range = 1;
        this.durability = 100;
        this.maxDurability = 100;
        this.toolType = '收获';
        Object.assign(this, config);
    }
    use() {
        if (this.durability > 0) {
            this.durability--;
            return true;
        }
        return false;
    }
    repair(amount) {
        if (this.durability + amount > this.maxDurability) {
            this.durability = this.maxDurability;
        }
        else {
            this.durability += amount;
        }
        return true;
    }
}
ToolComponent.TYPE = 'tool';
/**
 * BuildingComponent - 建筑卡牌组件
 */
export class BuildingComponent {
    constructor(config = {}) {
        this.buildTime = 0;
        this.buildTimeRemaining = 0;
        this.workers = 0;
        this.maxWorkers = 10;
        this.productivity = 1.0;
        this.maintenanceCost = 5;
        Object.assign(this, config);
    }
    calculateProductionBonus() {
        return this.workers / this.maxWorkers * this.productivity;
    }
}
BuildingComponent.TYPE = 'building';
/**
 * CharacterComponent - 人物卡牌组件
 */
export class CharacterComponent {
    constructor(config = {}) {
        this.stats = {
            health: 100,
            maxHealth: 100,
            mana: 50,
            maxMana: 50
        };
        this.skills = [];
        this.experience = 0;
        this.level = 1;
        this.job = '农民';
        Object.assign(this, config);
    }
    addExperience(amount) {
        const requiredExp = this.level * 100;
        if (this.experience + amount >= requiredExp) {
            this.level++;
            this.experience = (this.experience + amount) - requiredExp;
            this.stats.maxHealth += 10;
            this.stats.maxMana += 5;
            return true;
        }
        this.experience += amount;
        return false;
    }
}
CharacterComponent.TYPE = 'character';
// ==========================================
// 卡牌升级组件 - Card Upgrade Components
// ==========================================
/**
 * UpgradeTreeComponent - 升级树组件
 * 卡牌的升级路径
 */
export class UpgradeTreeComponent {
    constructor(config = {}) {
        this.upgrades = [];
        Object.assign(this, config);
    }
    getAvailableUpgrades(currentLevel) {
        return this.upgrades.filter(u => u.level < u.maxLevel &&
            (!u.unlockLevel || currentLevel >= u.unlockLevel));
    }
}
UpgradeTreeComponent.TYPE = 'upgradeTree';
/**
 * UpgradeComponent - 升级组件
 * 当前实体的升级状态
 */
export class UpgradeComponent {
    constructor(config = {}) {
        this.points = 0;
        this.currentUpgrades = [];
        this.upgradeCost = {
            '金币': 100,
            '木材': 10,
            '作物': 5
        };
        Object.assign(this, config);
    }
    canUpgrade(upgradeCost, currentResources) {
        return Object.entries(upgradeCost).every(([type, cost]) => currentResources[type] >= cost);
    }
}
UpgradeComponent.TYPE = 'upgrade';
// ==========================================
// 战斗组件 - Combat Components
// ==========================================
/**
 * CombatComponent - 战斗基础组件
 */
export class CombatComponent {
    constructor(config = {}) {
        this.damage = 10;
        this.defense = 5;
        this.attackSpeed = 1.0;
        this.range = 1.0;
        this.accuracy = 0.9;
        this.criticalChance = 0.1;
        this.criticalMultiplier = 2.0;
        this.attackPattern = '近战';
        Object.assign(this, config);
    }
    calculateDamage() {
        const baseDamage = this.damage;
        const crit = Math.random() < this.criticalChance;
        return crit ? baseDamage * this.criticalMultiplier : baseDamage;
    }
}
CombatComponent.TYPE = 'combat';
/**
 * EffectComponent - 效果组件
 * 应用于实体的状态效果
 */
export class EffectComponent {
    constructor(config = {}) {
        this.effects = [];
        Object.assign(this, config);
    }
    addEffect(name, type, duration, strength, source) {
        const existing = this.effects.find(e => e.name === name && e.source === source);
        if (existing) {
            existing.stacking++;
            existing.duration = duration;
        }
        else {
            this.effects.push({
                name, type, duration, maxDuration: duration,
                strength, stacking: 1, source
            });
        }
    }
    removeEffect(name, source) {
        const index = this.effects.findIndex(e => e.name === name && (!source || e.source === source));
        if (index !== -1) {
            this.effects.splice(index, 1);
        }
    }
    updateEffects(dt) {
        this.effects = this.effects.filter(e => {
            e.duration -= dt;
            return e.duration > 0;
        });
    }
}
EffectComponent.TYPE = 'effect';
// ==========================================
// 卡牌玩法核心组件 - Card Gameplay Core Components
// ==========================================
/**
 * DeckComponent - 牌组组件
 * 玩家的卡牌库、抽牌堆、弃牌堆
 */
export class DeckComponent {
    constructor(config = {}) {
        this.library = []; // 牌库：所有拥有的卡牌
        this.drawPile = []; // 抽牌堆：待抽的卡牌
        this.discardPile = []; // 弃牌堆：打出/弃掉的卡牌
        Object.assign(this, config);
    }
    shuffleDrawPile() {
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
        }
    }
    drawCard() {
        if (this.drawPile.length === 0) {
            // 抽牌堆空了，洗弃牌堆到抽牌堆
            if (this.discardPile.length === 0)
                return null;
            this.drawPile = [...this.discardPile];
            this.discardPile = [];
            this.shuffleDrawPile();
        }
        return this.drawPile.pop();
    }
    discardCard(card) {
        this.discardPile.push(card);
    }
}
DeckComponent.TYPE = 'deck';
/**
 * HandComponent - 手牌组件
 * 玩家当前持有的手牌
 */
export class HandComponent {
    constructor(config = {}) {
        this.cards = [];
        this.maxHandSize = 8; // 手牌上限
        Object.assign(this, config);
    }
    addCard(card) {
        if (this.cards.length >= this.maxHandSize)
            return false;
        this.cards.push(card);
        return true;
    }
    removeCard(cardId) {
        const index = this.cards.findIndex(c => c.identity?.uniqueId === cardId);
        if (index > -1) {
            return this.cards.splice(index, 1)[0];
        }
        return null;
    }
}
HandComponent.TYPE = 'hand';
/**
 * EnergyComponent - 能量组件
 * 打牌消耗的能量
 */
export class EnergyComponent {
    constructor(config = {}) {
        this.current = 3;
        this.max = 10;
        this.regenPerTurn = 2; // 每回合恢复量
        Object.assign(this, config);
    }
    spend(amount) {
        if (this.current >= amount) {
            this.current -= amount;
            return true;
        }
        return false;
    }
    regen() {
        this.current = Math.min(this.max, this.current + this.regenPerTurn);
    }
}
EnergyComponent.TYPE = 'energy';
/**
 * QuestComponent - 任务组件
 * 玩家的任务列表和进度
 */
export class QuestComponent {
    constructor(config = {}) {
        this.quests = [];
        this.completedQuests = [];
        this.dailyResetTime = 86400000; // 24小时
        this.lastDailyReset = Date.now();
        Object.assign(this, config);
    }
    /**
     * 添加新任务
     */
    addQuest(quest) {
        if (this.quests.find(q => q.id === quest.id))
            return false;
        this.quests.push(quest);
        return true;
    }
    /**
     * 更新任务进度
     */
    updateProgress(objectiveType, target, amount = 1) {
        this.quests.forEach(quest => {
            if (!quest.unlocked || quest.completed)
                return;
            quest.objectives.forEach(objective => {
                if (objective.type === objectiveType &&
                    objective.target === target &&
                    !objective.completed) {
                    objective.currentAmount = Math.min(objective.requiredAmount, objective.currentAmount + amount);
                    if (objective.currentAmount >= objective.requiredAmount) {
                        objective.completed = true;
                    }
                    this.checkQuestCompletion(quest);
                }
            });
        });
    }
    /**
     * 检查任务是否完成
     */
    checkQuestCompletion(quest) {
        const allCompleted = quest.objectives.every(o => o.completed);
        if (allCompleted && !quest.completed) {
            quest.completed = true;
            this.completedQuests.push(quest.id);
            console.log(`✅ 任务完成: ${quest.title}`);
            return true;
        }
        return false;
    }
    /**
     * 领取任务奖励
     */
    claimRewards(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (!quest || !quest.completed || quest.claimed)
            return false;
        quest.claimed = true;
        return quest.rewards;
    }
    /**
     * 重置日常任务
     */
    resetDailyQuests() {
        const now = Date.now();
        if (now - this.lastDailyReset >= this.dailyResetTime) {
            this.quests = this.quests.filter(q => q.type !== '日常');
            this.lastDailyReset = now;
            console.log('🔄 日常任务已重置');
        }
    }
    /**
     * 获取可领取奖励的任务
     */
    getClaimableQuests() {
        return this.quests.filter(q => q.completed && !q.claimed);
    }
    /**
     * 获取进行中的任务
     */
    getActiveQuests() {
        return this.quests.filter(q => q.unlocked && !q.completed);
    }
}
QuestComponent.TYPE = 'quest';
// ==========================================
// 世界组件 - World Components
// ==========================================
/**
 * WorldComponent - 世界状态组件
 */
export class WorldComponent {
    constructor(config = {}) {
        this.dayNightCycle = 0;
        this.currentDay = 1;
        this.difficulty = '中等';
        this.events = [];
        Object.assign(this, config);
    }
    getWeatherEffect() {
        // 根据昼夜周期计算天气效果
        return Math.sin(this.dayNightCycle / 10000) * 0.5 + 0.5;
    }
}
WorldComponent.TYPE = 'world';
/**
 * GameStateComponent - 游戏状态组件
 */
export class GameStateComponent {
    constructor(config = {}) {
        this.gamePhase = '菜单';
        this.score = 0;
        this.combo = 0;
        this.streak = 0;
        this.highScore = 0;
        this.playTime = 0;
        Object.assign(this, config);
    }
    increaseCombo() {
        this.combo++;
        this.score += Math.floor(this.combo * 1.5);
    }
    resetCombo() {
        if (this.combo > 5) {
            this.streak++;
        }
        this.combo = 0;
    }
}
GameStateComponent.TYPE = 'gameState';
/**
 * ComboComponent - 组合技组件
 * 跟踪激活的组合技和效果
 */
export class ComboComponent {
    constructor(config = {}) {
        this.activeCombos = [];
        Object.assign(this, config);
    }
    // 激活组合技
    activateCombo(id, name, description, effect, strength, duration) {
        const existing = this.activeCombos.find(c => c.id === id);
        if (existing) {
            existing.active = true;
            existing.activatedAt = Date.now();
            existing.strength = strength;
            if (duration)
                existing.duration = duration;
            return false; // 已存在，更新状态
        }
        this.activeCombos.push({
            id, name, description, effect, strength,
            activatedAt: Date.now(), duration, active: true
        });
        return true; // 新激活
    }
    // 失效组合技
    deactivateCombo(id) {
        const combo = this.activeCombos.find(c => c.id === id);
        if (combo) {
            combo.active = false;
            return true;
        }
        return false;
    }
    // 检查组合是否激活
    isComboActive(id) {
        return this.activeCombos.some(c => c.id === id && c.active);
    }
    // 获取所有激活的组合
    getActiveCombos() {
        return this.activeCombos.filter(c => c.active);
    }
    // 更新组合状态
    update(dt) {
        this.activeCombos.forEach(combo => {
            if (combo.duration && combo.active) {
                combo.duration -= dt;
                if (combo.duration <= 0) {
                    combo.active = false;
                }
            }
        });
    }
}
ComboComponent.TYPE = 'combo';
// ==========================================
// 组件注册表 - Component Registry
// ==========================================
export const COMPONENT_REGISTRY = {
    'identity': IdentityComponent,
    'position': PositionComponent,
    'dimensions': DimensionsComponent,
    'resource': ResourceComponent,
    'production': ProductionComponent,
    'card': CardComponent,
    'crop': CropComponent,
    'animal': AnimalComponent,
    'tool': ToolComponent,
    'building': BuildingComponent,
    'character': CharacterComponent,
    'upgradeTree': UpgradeTreeComponent,
    'upgrade': UpgradeComponent,
    'combat': CombatComponent,
    'effect': EffectComponent,
    'world': WorldComponent,
    'gameState': GameStateComponent,
    'deck': DeckComponent,
    'hand': HandComponent,
    'energy': EnergyComponent,
    'combo': ComboComponent,
    'quest': QuestComponent
};
// ==========================================
// 实体工厂 - Entity Factory
// ==========================================
export class EntityFactory {
    static createCardEntity(type, config = {}) {
        const entity = {};
        // 添加基础组件
        entity['identity'] = new IdentityComponent({
            entityType: type,
            ...config.identity
        });
        entity['position'] = new PositionComponent(config.position?.x ?? 0, config.position?.y ?? 0);
        entity['dimensions'] = new DimensionsComponent(config.dimensions?.width ?? 1, config.dimensions?.height ?? 1);
        // 添加卡牌特定组件
        entity['card'] = new CardComponent({
            cardType: type,
            ...config.card
        });
        // 根据类型添加特定组件
        switch (type) {
            case '作物':
                entity['crop'] = new CropComponent(config.crop);
                entity['production'] = new ProductionComponent(config.production);
                break;
            case '动物':
                entity['animal'] = new AnimalComponent(config.animal);
                entity['production'] = new ProductionComponent(config.production);
                break;
            case '工具':
                entity['tool'] = new ToolComponent(config.tool);
                entity['combat'] = new CombatComponent(config.combat);
                break;
            case '建筑':
                entity['building'] = new BuildingComponent(config.building);
                entity['production'] = new ProductionComponent(config.production);
                entity['resource'] = new ResourceComponent(config.resource);
                break;
            case '人物':
                entity['character'] = new CharacterComponent(config.character);
                entity['combat'] = new CombatComponent(config.combat);
                break;
        }
        // 添加升级组件
        entity['upgrade'] = new UpgradeComponent(config.upgrade);
        entity['upgradeTree'] = new UpgradeTreeComponent(config.upgradeTree);
        return entity;
    }
    static createPlayerEntity(config = {}) {
        // 创建初始牌组
        const initialDeck = new DeckComponent();
        // 初始卡牌：6张小麦、2张小鸡、1张锄头、1张农舍
        for (let i = 0; i < 6; i++) {
            initialDeck.library.push(EntityFactory.createCardEntity('作物', {
                identity: { name: '小麦', description: '基础作物，种植后生产作物资源' }
            }));
        }
        for (let i = 0; i < 2; i++) {
            initialDeck.library.push(EntityFactory.createCardEntity('动物', {
                identity: { name: '小鸡', description: '养殖后生产动物资源' }
            }));
        }
        initialDeck.library.push(EntityFactory.createCardEntity('工具', {
            identity: { name: '锄头', description: '提升耕作效率' }
        }));
        initialDeck.library.push(EntityFactory.createCardEntity('建筑', {
            identity: { name: '小型农舍', description: '提升资源存储上限' }
        }));
        // 初始化抽牌堆
        initialDeck.drawPile = [...initialDeck.library];
        initialDeck.shuffleDrawPile();
        const entity = {
            'identity': new IdentityComponent({
                name: '玩家',
                entityType: '玩家',
                ...config.identity
            }),
            'resource': new ResourceComponent(config.resource),
            'combat': new CombatComponent(config.combat),
            'character': new CharacterComponent(config.character),
            'upgrade': new UpgradeComponent(config.upgrade),
            'gameState': new GameStateComponent(config.gameState),
            'deck': initialDeck,
            'hand': new HandComponent(config.hand),
            'energy': new EnergyComponent(config.energy),
            'quest': new QuestComponent(config.quest),
            'combo': new ComboComponent(config.combo)
        };
        return entity;
    }
    static createWorldEntity(config = {}) {
        const entity = {
            'identity': new IdentityComponent({
                name: '世界',
                entityType: '世界',
                ...config.identity
            }),
            'world': new WorldComponent(config.world),
            'resource': new ResourceComponent(config.resource),
            'gameState': new GameStateComponent(config.gameState)
        };
        return entity;
    }
}
// ==========================================
// 组件创建和管理工具
// ==========================================
export function createComponent(type, config) {
    const ComponentClass = COMPONENT_REGISTRY[type];
    if (!ComponentClass)
        return null;
    return new ComponentClass(config);
}
export function getComponent(entity, type) {
    return entity[type];
}
export function addComponent(entity, type, config) {
    if (entity[type])
        return false;
    const component = createComponent(type, config);
    if (component) {
        entity[type] = component;
        return true;
    }
    return false;
}
export function removeComponent(entity, type) {
    if (!entity[type])
        return false;
    delete entity[type];
    return true;
}
export function hasComponent(entity, type) {
    return !!entity[type];
}
//# sourceMappingURL=components.js.map