import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EntityFactory, CardComponent, ResourceComponent } from '../src/components.js';
import { createDefaultSystems } from '../src/systems.js';
import fs from 'fs/promises';

// 加载卡牌配置，先去掉JSON里的注释
const loadCardConfig = async () => {
  const content = await fs.readFile('/Users/ai/.openclaw/workspace/农庄卡牌V2.0卡牌配置.json', 'utf-8');
  // 移除//注释
  const cleaned = content.replace(/\/\/.*$/gm, '');
  return JSON.parse(cleaned);
};

describe('卡牌系统测试', () => {
  let systemManager: any;
  let player: any;
  let cardConfig: any;

  beforeEach(async () => {
    // 重置系统管理器
    (createDefaultSystems as any).instance = undefined as any;
    systemManager = createDefaultSystems();
    
    // 创建玩家实体
    player = EntityFactory.createPlayerEntity();
    systemManager.addEntity(player);
    
    // 加载卡牌配置
    cardConfig = await loadCardConfig();
  });

  it('应该成功加载所有120张卡牌配置', async () => {
    assert.equal(cardConfig.total_cards, 120);
    assert.equal(cardConfig.cards.length, 120);
  });

  describe('普通卡牌效果测试', () => {
    cardConfig.cards.filter((c: any) => c.rarity === 'common').forEach((card: any) => {
      it(`卡牌 ${card.name} (${card.id}) 创建成功`, () => {
        const cardEntity = EntityFactory.createCardEntity(card.type, {
          identity: { name: card.name, description: card.description },
          card: { cost: card.cost, effect: card.effect }
        });
        assert.equal(cardEntity.identity.name, card.name);
        assert.equal(cardEntity.card.cost, card.cost);
      });
    });
  });

  describe('稀有卡牌效果测试', () => {
    cardConfig.cards.filter((c: any) => c.rarity === 'rare').forEach((card: any) => {
      it(`卡牌 ${card.name} (${card.id}) 创建成功`, () => {
        const cardEntity = EntityFactory.createCardEntity(card.type, {
          identity: { name: card.name, description: card.description },
          card: { cost: card.cost, effect: card.effect }
        });
        assert.equal(cardEntity.identity.name, card.name);
        assert.equal(cardEntity.card.cost, card.cost);
      });
    });
  });

  describe('史诗卡牌效果测试', () => {
    cardConfig.cards.filter((c: any) => c.rarity === 'epic').forEach((card: any) => {
      it(`卡牌 ${card.name} (${card.id}) 创建成功`, () => {
        const cardEntity = EntityFactory.createCardEntity(card.type, {
          identity: { name: card.name, description: card.description },
          card: { cost: card.cost, effect: card.effect }
        });
        assert.equal(cardEntity.identity.name, card.name);
        assert.equal(cardEntity.card.cost, card.cost);
      });
    });
  });

  describe('传说卡牌效果测试', () => {
    cardConfig.cards.filter((c: any) => c.rarity === 'legendary').forEach((card: any) => {
      it(`卡牌 ${card.name} (${card.id}) 创建成功`, () => {
        const cardEntity = EntityFactory.createCardEntity(card.type, {
          identity: { name: card.name, description: card.description },
          card: { cost: card.cost, effect: card.effect }
        });
        assert.equal(cardEntity.identity.name, card.name);
        assert.equal(cardEntity.card.cost, card.cost);
      });
    });
  });

  describe('卡组管理功能测试', () => {
    it('应该能正确添加卡牌到卡组', () => {
      const deckComp = player['deck'];
      const initialCount = deckComp.cards.length;
      
      const testCard = EntityFactory.createCardEntity('crop', { identity: { name: '测试卡牌' } });
      deckComp.addCard(testCard);
      
      assert.equal(deckComp.cards.length, initialCount + 1);
      assert.ok(deckComp.cards.find((c: any) => c.identity.name === '测试卡牌'));
    });

    it('应该能正确从卡组移除卡牌', () => {
      const deckComp = player['deck'];
      const testCard = EntityFactory.createCardEntity('crop', { identity: { name: '测试卡牌', id: 'test_001' } });
      deckComp.addCard(testCard);
      const initialCount = deckComp.cards.length;
      
      deckComp.removeCard(testCard.id);
      
      assert.equal(deckComp.cards.length, initialCount - 1);
      assert.equal(deckComp.cards.find((c: any) => c.id === testCard.id), undefined);
    });

    it('应该能正确洗牌', () => {
      const deckComp = player['deck'];
      // 添加多张卡牌
      for (let i = 0; i < 10; i++) {
        const card = EntityFactory.createCardEntity('crop', { identity: { name: `测试卡牌${i}`, id: `test_${i}` } });
        deckComp.addCard(card);
      }
      const originalOrder = [...deckComp.cards.map((c: any) => c.id)];
      
      deckComp.shuffle();
      const newOrder = deckComp.cards.map((c: any) => c.id);
      
      // 洗牌后顺序应该不同（概率性测试）
      assert.notDeepEqual(newOrder, originalOrder);
    });

    it('应该能正确抽卡到手牌', () => {
      const deckComp = player['deck'];
      const handComp = player['hand'];
      const testCard = EntityFactory.createCardEntity('crop', { identity: { name: '测试卡牌' } });
      deckComp.addCard(testCard);
      
      const drawnCard = deckComp.draw();
      handComp.addCard(drawnCard);
      
      assert.equal(handComp.cards.length, 1);
      assert.equal(handComp.cards[0].identity.name, '测试卡牌');
      assert.equal(deckComp.cards.length, 0);
    });
  });
});
