import { DifficultyComponent, DifficultyLevelConfig, WorldComponent, ResourceComponent, NotificationComponent, GameStateComponent } from '../src/components';
import { DifficultySystem } from '../src/systems';

describe('难度系统测试 - Difficulty System Test', () => {
  let difficultyComp: DifficultyComponent;
  let worldComp: WorldComponent;
  let resourceComp: ResourceComponent;
  let notificationComp: NotificationComponent;
  let gameStateComp: GameStateComponent;
  let playerEntity: any;
  let difficultySystem: DifficultySystem;

  beforeEach(() => {
    // 初始化组件
    difficultyComp = new DifficultyComponent();
    worldComp = new WorldComponent();
    resourceComp = new ResourceComponent();
    notificationComp = new NotificationComponent();
    gameStateComp = new GameStateComponent();

    // 添加难度加成事件到世界组件
    worldComp.events.push({
      name: '难度加成',
      type: '难度加成',
      duration: -1,
      effects: [],
      active: true
    });

    // 创建玩家实体
    playerEntity = {
      difficulty: difficultyComp,
      world: worldComp,
      resource: resourceComp,
      notification: notificationComp,
      gameState: gameStateComp
    };

    // 初始化系统
    difficultySystem = new DifficultySystem();
  });

  test('1. 验证20级难度的属性调整规则正确性', () => {
    // 测试1-20级的属性是否符合预期
    for (let i = 1; i <= 20; i++) {
      const levelConfig = difficultyComp.levels.find(l => l.level === i)!;
      
      // 预期值
      const expectedResourceMultiplier = 1 - (i - 1) * 0.05;
      const expectedProductionMultiplier = 1 - (i - 1) * 0.03;
      const expectedEnemyHealthMultiplier = 1 + (i - 1) * 0.1;
      const expectedEnemyDamageMultiplier = 1 + (i - 1) * 0.08;
      const expectedRewardMultiplier = 1 + (i - 1) * 0.15;

      // 验证
      expect(levelConfig.resourceMultiplier).toBeCloseTo(expectedResourceMultiplier, 2);
      expect(levelConfig.productionMultiplier).toBeCloseTo(expectedProductionMultiplier, 2);
      expect(levelConfig.enemyHealthMultiplier).toBeCloseTo(expectedEnemyHealthMultiplier, 2);
      expect(levelConfig.enemyDamageMultiplier).toBeCloseTo(expectedEnemyDamageMultiplier, 2);
      expect(levelConfig.rewardMultiplier).toBeCloseTo(expectedRewardMultiplier, 2);

      console.log(`✅ 难度${i}属性验证通过: 资源×${expectedResourceMultiplier.toFixed(2)}, 生产×${expectedProductionMultiplier.toFixed(2)}, 敌人生命×${expectedEnemyHealthMultiplier.toFixed(2)}, 敌人伤害×${expectedEnemyDamageMultiplier.toFixed(2)}, 奖励×${expectedRewardMultiplier.toFixed(2)}`);
    }

    // 测试20级特殊值
    const level20 = difficultyComp.levels.find(l => l.level === 20)!;
    expect(level20.resourceMultiplier).toBeCloseTo(0.05, 2); // 减少95%
    expect(level20.productionMultiplier).toBeCloseTo(0.43, 2); // 减少57%
    expect(level20.enemyHealthMultiplier).toBeCloseTo(2.9, 2); // 增加190%
    expect(level20.enemyDamageMultiplier).toBeCloseTo(2.52, 2); // 增加152%
    expect(level20.rewardMultiplier).toBeCloseTo(3.85, 2); // 增加285%
    console.log('✅ 20级难度属性验证通过');
  });

  test('2. 验证难度解锁逻辑（通关前一级解锁下一级）', () => {
    // 初始状态：只有1级解锁
    expect(difficultyComp.getUnlockedLevels().length).toBe(1);
    expect(difficultyComp.levels.find(l => l.level === 1)?.unlocked).toBe(true);
    expect(difficultyComp.levels.find(l => l.level === 2)?.unlocked).toBe(false);
    console.log('✅ 初始解锁状态正确，仅难度1解锁');

    // 通关难度1：highScore >= 1*1000 = 1000
    gameStateComp.highScore = 1000;
    difficultySystem.update([playerEntity], 1000);

    // 难度2应该解锁
    expect(difficultyComp.levels.find(l => l.level === 2)?.unlocked).toBe(true);
    expect(difficultyComp.getUnlockedLevels().length).toBe(2);
    console.log('✅ 通关难度1后，难度2解锁成功');

    // 通关难度5：highScore >=5*1000=5000
    gameStateComp.highScore = 5000;
    difficultySystem.update([playerEntity], 1000);

    // 难度2-5都应该解锁
    for (let i=2; i<=5; i++) {
      expect(difficultyComp.levels.find(l => l.level === i)?.unlocked).toBe(true);
    }
    expect(difficultyComp.getUnlockedLevels().length).toBe(5);
    console.log('✅ 得分达到5000后，难度2-5全部解锁成功');

    // 通关难度20：highScore >=20*1000=20000
    gameStateComp.highScore = 20000;
    difficultySystem.update([playerEntity], 1000);

    // 所有难度都应该解锁
    expect(difficultyComp.getUnlockedLevels().length).toBe(20);
    expect(difficultyComp.levels.find(l => l.level === 20)?.unlocked).toBe(true);
    console.log('✅ 得分达到20000后，所有20级难度全部解锁成功');
  });

  test('3. 验证不同难度下的结算逻辑正确性', () => {
    // 测试1级难度结算
    difficultyComp.currentLevel = 1;
    resourceComp.resources['金币'] = 0;
    difficultySystem.difficultySettlement(playerEntity);
    expect(resourceComp.resources['金币']).toBe(100); // 100 * 1.0 = 100
    console.log('✅ 难度1结算正确，获得100金币');

    // 测试2级难度结算
    difficultyComp.currentLevel = 2;
    resourceComp.resources['金币'] = 0;
    difficultySystem.difficultySettlement(playerEntity);
    expect(resourceComp.resources['金币']).toBe(115); // 100 * 1.15 = 115
    console.log('✅ 难度2结算正确，获得115金币');

    // 测试10级难度结算
    difficultyComp.currentLevel = 10;
    resourceComp.resources['金币'] = 0;
    difficultySystem.difficultySettlement(playerEntity);
    expect(resourceComp.resources['金币']).toBe(235); // 100 * (1 + 9*0.15) = 100*2.35=235
    console.log('✅ 难度10结算正确，获得235金币');

    // 测试20级难度结算
    difficultyComp.currentLevel = 20;
    resourceComp.resources['金币'] = 0;
    difficultySystem.difficultySettlement(playerEntity);
    expect(resourceComp.resources['金币']).toBe(385); // 100 * 3.85 = 385
    console.log('✅ 难度20结算正确，获得385金币');
  });

  test('4. 验证难度切换后的全局属性同步', () => {
    // 切换到难度5
    difficultyComp.currentLevel = 5;
    difficultyComp.levels.find(l => l.level ===5)!.unlocked = true;
    difficultySystem.update([playerEntity], 1000);

    // 检查世界属性中的难度加成是否正确
    const difficultyEvent = worldComp.events.find(e => e.type === '难度加成')!;
    const effects = difficultyEvent.effects;
    
    expect(effects.find(e => e.property === 'resourceMultiplier')?.value).toBeCloseTo(0.8, 2); // 1 - 4*0.05=0.8
    expect(effects.find(e => e.property === 'productionMultiplier')?.value).toBeCloseTo(0.88, 2); // 1 -4*0.03=0.88
    expect(effects.find(e => e.property === 'enemyHealthMultiplier')?.value).toBeCloseTo(1.4, 2); // 1 +4*0.1=1.4
    expect(effects.find(e => e.property === 'enemyDamageMultiplier')?.value).toBeCloseTo(1.32, 2); // 1 +4*0.08=1.32
    console.log('✅ 切换到难度5后，全局属性同步正确');

    // 切换到难度20
    difficultyComp.currentLevel = 20;
    difficultyComp.levels.find(l => l.level ===20)!.unlocked = true;
    difficultySystem.update([playerEntity], 1000);

    // 再次检查世界属性
    expect(effects.find(e => e.property === 'resourceMultiplier')?.value).toBeCloseTo(0.05, 2);
    expect(effects.find(e => e.property === 'productionMultiplier')?.value).toBeCloseTo(0.43, 2);
    expect(effects.find(e => e.property === 'enemyHealthMultiplier')?.value).toBeCloseTo(2.9, 2);
    expect(effects.find(e => e.property === 'enemyDamageMultiplier')?.value).toBeCloseTo(2.52, 2);
    console.log('✅ 切换到难度20后，全局属性同步正确');
  });

  test('5. 验证非法难度切换拦截', () => {
    // 尝试切换到未解锁的难度10
    const result = difficultySystem.setDifficultyLevel(playerEntity, 10);
    expect(result).toBe(false);
    expect(notificationComp.notifications.some(n => n.title.includes('难度未解锁'))).toBe(true);
    console.log('✅ 未解锁难度切换被正确拦截');

    // 解锁难度10后切换
    difficultyComp.levels.find(l => l.level ===10)!.unlocked = true;
    const result2 = difficultySystem.setDifficultyLevel(playerEntity, 10);
    expect(result2).toBe(true);
    expect(difficultyComp.currentLevel).toBe(10);
    console.log('✅ 已解锁难度切换成功');
  });
});
