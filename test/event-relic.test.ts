import { expect, test, describe, beforeEach } from 'vitest';
import { getRandomEvent, ALL_EVENTS, GameEvent } from '../src/events';
import { ALL_RELICS, addRelic, Relic } from '../src/relics';
import { GameStateComponent } from '../src/components';
import { EventSystem, RelicSystem, createDefaultSystems, SystemManager } from '../src/systems';

describe('随机事件系统测试', () => {
  test('事件概率分布符合要求：60%正面/25%中性/15%负面', () => {
    const total = 10000;
    let positive = 0, neutral = 0, negative = 0;

    for (let i = 0; i < total; i++) {
      const event = getRandomEvent();
      switch (event.type) {
        case 'positive': positive++; break;
        case 'neutral': neutral++; break;
        case 'negative': negative++; break;
      }
    }

    const positiveRate = positive / total;
    const neutralRate = neutral / total;
    const negativeRate = negative / total;

    expect(positiveRate).toBeGreaterThan(0.57);
    expect(positiveRate).toBeLessThan(0.63);
    expect(neutralRate).toBeGreaterThan(0.22);
    expect(neutralRate).toBeLessThan(0.28);
    expect(negativeRate).toBeGreaterThan(0.12);
    expect(negativeRate).toBeLessThan(0.18);
  });

  test('总事件数量≥30个', () => {
    expect(ALL_EVENTS.length).toBeGreaterThanOrEqual(30);
  });

  test('正面事件数量≥18个，中性≥8个，负面≥4个', () => {
    const positive = ALL_EVENTS.filter(e => e.type === 'positive').length;
    const neutral = ALL_EVENTS.filter(e => e.type === 'neutral').length;
    const negative = ALL_EVENTS.filter(e => e.type === 'negative').length;
    
    expect(positive).toBeGreaterThanOrEqual(18);
    expect(neutral).toBeGreaterThanOrEqual(8);
    expect(negative).toBeGreaterThanOrEqual(4);
  });

  test('每3回合触发一次事件', () => {
    const systemManager = createDefaultSystems();
    const player = {
      gameState: new GameStateComponent(),
      resource: { resources: { 金币: 100, 作物: 50, 木材: 100, 石头: 100 } },
      relics: [],
      storage: { fruits: [] },
      crops: [],
      items: [],
      fields: [],
      animals: [],
      buildings: [],
      buffs: [],
      debuffs: []
    };
    systemManager.addEntity(player);

    // 模拟3回合
    player.gameState.turn = 3;
    player.gameState.eventTriggeredThisTurn = false;
    systemManager.getSystem<EventSystem>('事件管理')?.update([player], 1000);
    expect(player.gameState.eventTriggeredThisTurn).toBe(true);

    // 第4回合不触发
    player.gameState.turn = 4;
    player.gameState.eventTriggeredThisTurn = false;
    systemManager.getSystem<EventSystem>('事件管理')?.update([player], 1000);
    expect(player.gameState.eventTriggeredThisTurn).toBe(false);

    // 第6回合触发
    player.gameState.turn = 6;
    player.gameState.eventTriggeredThisTurn = false;
    systemManager.getSystem<EventSystem>('事件管理')?.update([player], 1000);
    expect(player.gameState.eventTriggeredThisTurn).toBe(true);
  });
});

describe('遗物系统测试', () => {
  test('总遗物数量≥20个', () => {
    expect(ALL_RELICS.length).toBeGreaterThanOrEqual(20);
  });

  test('最多携带6个遗物', () => {
    const state: any = { relics: [] };
    const commonRelic = 'rel_007'; // 聚宝盆，maxStack=10
    
    // 添加7个遗物
    for (let i = 0; i < 7; i++) {
      addRelic(state, commonRelic);
    }

    expect(state.relics.length).toBe(6);
  });

  test('可叠加遗物效果正确叠加', () => {
    const state: any = { relics: [], cropGrowthMultiplier: 1 };
    const fertileSoil = 'rel_001'; // 肥沃之土：作物生长+10%
    
    // 添加第一个
    addRelic(state, fertileSoil);
    expect(state.cropGrowthMultiplier).toBe(1.1);
    
    // 添加第二个
    addRelic(state, fertileSoil);
    expect(state.cropGrowthMultiplier).toBeCloseTo(1.21);
    
    // 添加第三个
    addRelic(state, fertileSoil);
    expect(state.cropGrowthMultiplier).toBeCloseTo(1.331);
  });

  test('不可叠加遗物无法重复添加', () => {
    const state: any = { relics: [] };
    const endlessPot = 'rel_003'; // 永不干涸的水壶，不可叠加
    
    expect(addRelic(state, endlessPot)).toBe(true);
    expect(addRelic(state, endlessPot)).toBe(false);
    expect(state.relics.length).toBe(1);
  });

  test('遗物效果正确触发', () => {
    const state: any = { relics: [], passiveGoldPerTurn: 0 };
    const treasurePot = 'rel_007'; // 聚宝盆：每回合+10金币
    
    addRelic(state, treasurePot);
    expect(state.passiveGoldPerTurn).toBe(10);
    
    addRelic(state, treasurePot);
    expect(state.passiveGoldPerTurn).toBe(20);
  });

  test('遗物最大堆叠限制生效', () => {
    const state: any = { relics: [] };
    const goldenHoe = 'rel_002'; // 黄金锄头，最大堆叠3层
    
    expect(addRelic(state, goldenHoe)).toBe(true);
    expect(addRelic(state, goldenHoe)).toBe(true);
    expect(addRelic(state, goldenHoe)).toBe(true);
    expect(addRelic(state, goldenHoe)).toBe(false); // 第4个失败
    expect(state.relics.length).toBe(3);
  });
});

describe('集成测试', () => {
  test('负面事件免疫遗物生效', () => {
    const systemManager = createDefaultSystems();
    const player: any = {
      gameState: new GameStateComponent(),
      resource: { resources: { 金币: 100 } },
      relics: [],
      negativeEventImmunity: 1
    };
    systemManager.addEntity(player);

    player.gameState.turn = 3;
    player.gameState.eventTriggeredThisTurn = false;
    systemManager.getSystem<EventSystem>('事件管理')?.update([player], 1000);
    
    expect(player.negativeEventImmunity).toBe(0);
    expect(player.gameState.eventTriggeredThisTurn).toBe(true);
  });

  test('任务完成奖励遗物', () => {
    const systemManager = createDefaultSystems();
    const player: any = {
      gameState: new GameStateComponent(),
      resource: { resources: { 金币: 100 } },
      quest: {
        completedQuests: ['main_3'],
        getClaimableQuests: () => []
      },
      relics: [],
      rewardedQuests: []
    };
    systemManager.addEntity(player);

    systemManager.getSystem<RelicSystem>('遗物管理')?.update([player], 1000);
    
    expect(player.rewardedQuests).toContain('main_3');
    expect(player.relics.length).toBe(1);
  });
});
