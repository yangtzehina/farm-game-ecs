/**
 * UI反馈升级功能测试用例
 */
import { expect } from '@jest/globals';
import { EffectComponent, QuestComponent, ComboComponent, DeckComponent, HandComponent, EnergyComponent, GameStateComponent, WorldComponent, ResourceComponent, EntityFactory } from './components';
import { FarmGameEngine } from './engine';
import { FarmGameUIManager } from './ui';
describe('组件构造函数修复测试', () => {
    test('EffectComponent支持Partial构造参数', () => {
        const effect = new EffectComponent({
            effects: [{
                    name: '测试buff',
                    type: 'buff',
                    duration: 1000,
                    maxDuration: 1000,
                    strength: 1,
                    stacking: 1,
                    source: 'test'
                }]
        });
        expect(effect.effects.length).toBe(1);
        expect(effect.effects[0].name).toBe('测试buff');
    });
    test('QuestComponent支持Partial构造参数', () => {
        const quest = new QuestComponent({
            completedQuests: ['test-quest-1']
        });
        expect(quest.completedQuests).toContain('test-quest-1');
    });
    test('ComboComponent支持Partial构造参数', () => {
        const combo = new ComboComponent({
            activeCombos: [{
                    id: 'test-combo',
                    name: '测试组合',
                    description: '测试',
                    effect: 'test',
                    activatedAt: Date.now(),
                    strength: 1,
                    active: true
                }]
        });
        expect(combo.activeCombos.length).toBe(1);
        expect(combo.activeCombos[0].name).toBe('测试组合');
    });
    test('DeckComponent支持Partial构造参数', () => {
        const deck = new DeckComponent({
            library: [EntityFactory.createCardEntity('作物')]
        });
        expect(deck.library.length).toBe(1);
    });
    test('HandComponent支持Partial构造参数', () => {
        const hand = new HandComponent({
            maxHandSize: 10
        });
        expect(hand.maxHandSize).toBe(10);
    });
    test('EnergyComponent支持Partial构造参数', () => {
        const energy = new EnergyComponent({
            current: 5,
            max: 15
        });
        expect(energy.current).toBe(5);
        expect(energy.max).toBe(15);
    });
    test('GameStateComponent支持Partial构造参数', () => {
        const gameState = new GameStateComponent({
            score: 1000,
            combo: 5
        });
        expect(gameState.score).toBe(1000);
        expect(gameState.combo).toBe(5);
    });
    test('WorldComponent支持Partial构造参数', () => {
        const world = new WorldComponent({
            currentDay: 10,
            difficulty: '困难'
        });
        expect(world.currentDay).toBe(10);
        expect(world.difficulty).toBe('困难');
    });
    test('ResourceComponent支持Partial构造参数', () => {
        const resource = new ResourceComponent({
            resources: { '金币': 1000, '木材': 500 }
        });
        expect(resource.resources['金币']).toBe(1000);
        expect(resource.resources['木材']).toBe(500);
    });
});
describe('UI反馈系统测试', () => {
    let engine;
    let ui;
    beforeEach(() => {
        engine = FarmGameEngine.getInstance();
        ui = new FarmGameUIManager(engine);
    });
    test('全局提示系统正常工作', () => {
        // 模拟console.log
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        ui.showToast('测试提示', 'success', 1000);
        expect(ui['toastQueue'].length).toBe(1);
        ui['processToastQueue']();
        expect(ui['activeToast']).not.toBeNull();
        expect(ui['activeToast']?.message).toBe('测试提示');
        expect(ui['activeToast']?.type).toBe('success');
        // 渲染提示
        ui['renderToast']();
        expect(consoleLogSpy).toHaveBeenCalled();
        consoleLogSpy.mockRestore();
    });
    test('事件系统正常注册和触发', (done) => {
        const mockCallback = jest.fn();
        engine.on('test:event', mockCallback);
        engine.emit('test:event', 'test data');
        setTimeout(() => {
            expect(mockCallback).toHaveBeenCalledWith('test data');
            done();
        }, 0);
    });
    test('任务完成动画触发', () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        const testQuest = {
            id: 'test-quest',
            title: '测试任务',
            rewards: [{ type: '资源', target: '金币', amount: 100 }]
        };
        ui['playQuestCompleteAnimation'](testQuest);
        expect(ui['activeAnimations'].length).toBe(1);
        expect(ui['activeAnimations'][0].type).toBe('quest-complete');
        expect(consoleLogSpy).toHaveBeenCalled();
        consoleLogSpy.mockRestore();
    });
    test('奖励获取动画触发', () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        const testReward = {
            type: '资源',
            target: '金币',
            amount: 100
        };
        ui['playRewardGetAnimation'](testReward);
        expect(ui['activeAnimations'].length).toBeGreaterThan(0);
        expect(consoleLogSpy).toHaveBeenCalled();
        consoleLogSpy.mockRestore();
    });
    test('建筑升级动画触发', () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        const testBuilding = {
            identity: { name: '农舍', uniqueId: 'building-1' },
            production: { productivity: 1.5 }
        };
        ui['playBuildingUpgradeAnimation'](testBuilding, 2);
        expect(ui['activeAnimations'].length).toBeGreaterThan(0);
        expect(consoleLogSpy).toHaveBeenCalled();
        consoleLogSpy.mockRestore();
    });
    test('事件触发动画触发', () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        const testEvent = {
            id: 'event-1',
            name: '暴风雨',
            description: '暴风雨来袭，作物减产20%',
            duration: 10000
        };
        ui['playEventTriggerAnimation'](testEvent);
        expect(ui['activeAnimations'].length).toBeGreaterThan(0);
        expect(consoleLogSpy).toHaveBeenCalled();
        consoleLogSpy.mockRestore();
    });
    test('遗物获取动画触发', () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        const testRelic = {
            id: 'relic-1',
            name: '金锄头',
            description: '传说中的农具',
            effect: '作物产量提升50%'
        };
        ui['playRelicGetAnimation'](testRelic);
        expect(ui['activeAnimations'].length).toBeGreaterThan(0);
        expect(consoleLogSpy).toHaveBeenCalled();
        consoleLogSpy.mockRestore();
    });
});
describe('UI集成测试', () => {
    test('UI初始化正常', () => {
        const engine = FarmGameEngine.getInstance();
        const ui = new FarmGameUIManager(engine);
        expect(ui).toBeInstanceOf(FarmGameUIManager);
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        ui.initialize();
        expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('UI初始化完成'));
        consoleLogSpy.mockRestore();
    });
});
//# sourceMappingURL=test-ui-feedback.js.map