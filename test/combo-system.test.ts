import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { EntityFactory, ComboComponent } from '../src/components.js';
import { SystemManager, createDefaultSystems, ComboSystem } from '../src/systems.js';

describe('组合技系统测试', () => {
  let systemManager: SystemManager;
  let player: any;

  beforeEach(() => {
    // 重置系统管理器
    SystemManager.instance = undefined as any;
    systemManager = createDefaultSystems();
    
    // 创建玩家实体
    player = EntityFactory.createPlayerEntity();
    systemManager.addEntity(player);
  });

  describe('1. 绿色田园组合', () => {
    it('应在小麦、蔬菜、水果同时在场时激活，作物产量提升1.5倍', () => {
      // 创建所需卡牌
      const wheat = EntityFactory.createCardEntity('作物', { identity: { name: '小麦' } });
      const vegetable = EntityFactory.createCardEntity('作物', { identity: { name: '蔬菜' } });
      const fruit = EntityFactory.createCardEntity('作物', { identity: { name: '水果' } });
      
      // 设置卡牌位置（表示已打出）
      wheat.position.x = 0; wheat.position.y = 0;
      vegetable.position.x = 1; vegetable.position.y = 0;
      fruit.position.x = 2; fruit.position.y = 0;

      // 添加到实体列表
      systemManager.addEntity(wheat);
      systemManager.addEntity(vegetable);
      systemManager.addEntity(fruit);

      // 运行一次系统更新
      systemManager.update(1000);

      // 检查组合是否激活
      const comboComp = player['combo'] as ComboComponent;
      assert.equal(comboComp.isComboActive('green_garden'), true, '绿色田园组合未激活');

      // 检查产量效果
      assert.equal(wheat.production.efficiency, 1.5, '小麦产量未提升1.5倍');
      assert.equal(vegetable.production.efficiency, 1.5, '蔬菜产量未提升1.5倍');
      assert.equal(fruit.production.efficiency, 1.5, '水果产量未提升1.5倍');
    });

    it('应在任意卡牌离场时失效，产量恢复正常', () => {
      // 创建所需卡牌
      const wheat = EntityFactory.createCardEntity('作物', { identity: { name: '小麦' } });
      const vegetable = EntityFactory.createCardEntity('作物', { identity: { name: '蔬菜' } });
      const fruit = EntityFactory.createCardEntity('作物', { identity: { name: '水果' } });
      
      wheat.position.x = 0; wheat.position.y = 0;
      vegetable.position.x = 1; vegetable.position.y = 0;
      fruit.position.x = 2; fruit.position.y = 0;

      systemManager.addEntity(wheat);
      systemManager.addEntity(vegetable);
      systemManager.addEntity(fruit);

      // 激活组合
      systemManager.update(1000);

      // 移除水果卡牌
      systemManager.removeEntity(fruit);

      // 再次更新
      systemManager.update(1000);

      // 检查组合是否失效
      const comboComp = player['combo'] as ComboComponent;
      assert.equal(comboComp.isComboActive('green_garden'), false, '绿色田园组合未失效');

      // 检查产量恢复
      assert.equal(wheat.production.efficiency, 1.0, '小麦产量未恢复');
      assert.equal(vegetable.production.efficiency, 1.0, '蔬菜产量未恢复');
    });
  });

  describe('2. 动物天堂组合', () => {
    it('应在鸡、牛、羊同时在场时激活，动物自动收集开启', () => {
      // 创建所需卡牌
      const chicken = EntityFactory.createCardEntity('动物', { identity: { name: '鸡' } });
      const cow = EntityFactory.createCardEntity('动物', { identity: { name: '牛' } });
      const sheep = EntityFactory.createCardEntity('动物', { identity: { name: '羊' } });
      
      chicken.position.x = 0; chicken.position.y = 0;
      cow.position.x = 1; cow.position.y = 0;
      sheep.position.x = 2; sheep.position.y = 0;

      systemManager.addEntity(chicken);
      systemManager.addEntity(cow);
      systemManager.addEntity(sheep);

      // 运行更新
      systemManager.update(1000);

      // 检查组合激活
      const comboComp = player['combo'] as ComboComponent;
      assert.equal(comboComp.isComboActive('animal_paradise'), true, '动物天堂组合未激活');

      // 检查自动收集开启
      assert.equal(chicken.production.automation, true, '鸡未开启自动收集');
      assert.equal(cow.production.automation, true, '牛未开启自动收集');
      assert.equal(sheep.production.automation, true, '羊未开启自动收集');
    });

    it('应在任意动物离场时失效，自动收集关闭', () => {
      const chicken = EntityFactory.createCardEntity('动物', { identity: { name: '鸡' } });
      const cow = EntityFactory.createCardEntity('动物', { identity: { name: '牛' } });
      const sheep = EntityFactory.createCardEntity('动物', { identity: { name: '羊' } });
      
      chicken.position.x = 0; chicken.position.y = 0;
      cow.position.x = 1; cow.position.y = 0;
      sheep.position.x = 2; sheep.position.y = 0;

      systemManager.addEntity(chicken);
      systemManager.addEntity(cow);
      systemManager.addEntity(sheep);

      systemManager.update(1000);

      // 移除鸡
      systemManager.removeEntity(chicken);
      systemManager.update(1000);

      const comboComp = player['combo'] as ComboComponent;
      assert.equal(comboComp.isComboActive('animal_paradise'), false, '动物天堂组合未失效');
      assert.equal(cow.production.automation, false, '牛自动收集未关闭');
      assert.equal(sheep.production.automation, false, '羊自动收集未关闭');
    });
  });

  describe('3. 工业革命组合', () => {
    it('应在磨坊、工厂、市场同时在场时激活，每秒额外生产50金币', () => {
      // 创建所需卡牌
      const mill = EntityFactory.createCardEntity('建筑', { identity: { name: '磨坊' } });
      const factory = EntityFactory.createCardEntity('建筑', { identity: { name: '工厂' } });
      const market = EntityFactory.createCardEntity('建筑', { identity: { name: '市场' } });
      
      mill.position.x = 0; mill.position.y = 0;
      factory.position.x = 1; factory.position.y = 0;
      market.position.x = 2; market.position.y = 0;

      systemManager.addEntity(mill);
      systemManager.addEntity(factory);
      systemManager.addEntity(market);

      // 初始金币为0
      player.resource.resources['金币'] = 0;

      // 运行1秒更新
      systemManager.update(1000);

      // 检查组合激活
      const comboComp = player['combo'] as ComboComponent;
      assert.equal(comboComp.isComboActive('industrial_revolution'), true, '工业革命组合未激活');

      // 检查金币增加
      assert.equal(player.resource.resources['金币'], 50, '金币未增加50');
    });
  });

  describe('4. 自然之力组合', () => {
    it('应在雨水、阳光、肥料同时在场时激活，作物产量提升2倍，持续30秒后自动失效', () => {
      // 创建所需卡牌
      const rain = EntityFactory.createCardEntity('工具', { identity: { name: '雨水' } });
      const sun = EntityFactory.createCardEntity('工具', { identity: { name: '阳光' } });
      const fertilizer = EntityFactory.createCardEntity('工具', { identity: { name: '肥料' } });
      const wheat = EntityFactory.createCardEntity('作物', { identity: { name: '小麦' } });
      
      rain.position.x = 0; rain.position.y = 0;
      sun.position.x = 1; sun.position.y = 0;
      fertilizer.position.x = 2; fertilizer.position.y = 0;
      wheat.position.x = 3; wheat.position.y = 0;

      systemManager.addEntity(rain);
      systemManager.addEntity(sun);
      systemManager.addEntity(fertilizer);
      systemManager.addEntity(wheat);

      // 激活组合
      systemManager.update(1000);
      const comboComp = player['combo'] as ComboComponent;
      assert.equal(comboComp.isComboActive('nature_force'), true, '自然之力组合未激活');
      assert.equal(wheat.production.efficiency, 2.0, '作物产量未提升2倍');

      // 模拟30秒后
      systemManager.update(30000);
      assert.equal(comboComp.isComboActive('nature_force'), false, '自然之力组合未自动失效');
      assert.equal(wheat.production.efficiency, 1.0, '作物产量未恢复');
    });
  });

  describe('5. 丰收女神组合', () => {
    it('应在所有作物卡牌等级≥3时激活，全局产量提升1.8倍', () => {
      // 创建3个作物卡牌，等级都为3
      const wheat = EntityFactory.createCardEntity('作物', { identity: { name: '小麦', level: 3 } });
      const vegetable = EntityFactory.createCardEntity('作物', { identity: { name: '蔬菜', level: 3 } });
      const fruit = EntityFactory.createCardEntity('作物', { identity: { name: '水果', level: 3 } });
      const cow = EntityFactory.createCardEntity('动物', { identity: { name: '牛' } });
      
      wheat.position.x = 0; wheat.position.y = 0;
      vegetable.position.x = 1; vegetable.position.y = 0;
      fruit.position.x = 2; fruit.position.y = 0;
      cow.position.x = 3; cow.position.y = 0;

      systemManager.addEntity(wheat);
      systemManager.addEntity(vegetable);
      systemManager.addEntity(fruit);
      systemManager.addEntity(cow);

      // 运行更新
      systemManager.update(1000);

      const comboComp = player['combo'] as ComboComponent;
      assert.equal(comboComp.isComboActive('harvest_goddess'), true, '丰收女神组合未激活');

      // 检查全局产量提升
      assert.equal(wheat.production.efficiency, 1.8, '小麦产量未提升1.8倍');
      assert.equal(vegetable.production.efficiency, 1.8, '蔬菜产量未提升1.8倍');
      assert.equal(fruit.production.efficiency, 1.8, '水果产量未提升1.8倍');
      assert.equal(cow.production.efficiency, 1.8, '动物产量未提升1.8倍');
    });

    it('应在有作物等级低于3时失效', () => {
      const wheat = EntityFactory.createCardEntity('作物', { identity: { name: '小麦', level: 3 } });
      const vegetable = EntityFactory.createCardEntity('作物', { identity: { name: '蔬菜', level: 3 } });
      const fruit = EntityFactory.createCardEntity('作物', { identity: { name: '水果', level: 2 } }); // 等级2
      
      wheat.position.x = 0; wheat.position.y = 0;
      vegetable.position.x = 1; vegetable.position.y = 0;
      fruit.position.x = 2; fruit.position.y = 0;

      systemManager.addEntity(wheat);
      systemManager.addEntity(vegetable);
      systemManager.addEntity(fruit);

      systemManager.update(1000);

      const comboComp = player['combo'] as ComboComponent;
      assert.equal(comboComp.isComboActive('harvest_goddess'), false, '丰收女神组合不应激活');
    });
  });
});
