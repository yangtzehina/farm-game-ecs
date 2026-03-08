import { describe, it, expect, beforeEach } from 'bun:test';
import { BuildingType, BUILDING_CONFIGS, getBuildingLevelConfig, getBuildingUpgradeCost } from '../src/configs/buildings';
import { FarmBuildingFactory, ResourceComponent, EntityFactory } from '../src/components';
import { BuildingSystem } from '../src/systems';

describe('农场建筑系统测试', () => {
  let buildingSystem: BuildingSystem;
  let playerResource: ResourceComponent;

  beforeEach(() => {
    buildingSystem = new BuildingSystem();
    playerResource = new ResourceComponent();
    // 初始化玩家资源足够升级所有建筑
    playerResource.resources = {
      '金币': 10000,
      '木材': 10000,
      '石头': 10000,
      '作物': 10000,
      '动物': 1000
    };
  });

  describe('建筑配置测试', () => {
    it('应该包含6个核心建筑配置', () => {
      const buildingTypes = Object.values(BuildingType);
      expect(buildingTypes.length).toBe(6);
      expect(buildingTypes).toContain(BuildingType.WELL);
      expect(buildingTypes).toContain(BuildingType.FARMLAND);
      expect(buildingTypes).toContain(BuildingType.LIVESTOCK_PEN);
      expect(buildingTypes).toContain(BuildingType.PROCESSING_WORKSHOP);
      expect(buildingTypes).toContain(BuildingType.WAREHOUSE);
      expect(buildingTypes).toContain(BuildingType.MARKET);
    });

    it('每个建筑应该有3级配置', () => {
      Object.values(BuildingType).forEach(type => {
        const config = BUILDING_CONFIGS[type];
        expect(config.maxLevel).toBe(3);
        expect(config.levels.length).toBe(3);
        expect(config.levels[0].level).toBe(1);
        expect(config.levels[1].level).toBe(2);
        expect(config.levels[2].level).toBe(3);
      });
    });

    it('应该正确获取建筑等级配置', () => {
      const wellLevel1 = getBuildingLevelConfig(BuildingType.WELL, 1);
      expect(wellLevel1).not.toBeUndefined();
      expect(wellLevel1?.buff.waterSupply).toBe(10);
      expect(wellLevel1?.upgradeCost.gold).toBe(100);

      const wellLevel2 = getBuildingLevelConfig(BuildingType.WELL, 2);
      expect(wellLevel2?.buff.waterSupply).toBe(25);

      const wellLevel3 = getBuildingLevelConfig(BuildingType.WELL, 3);
      expect(wellLevel3?.buff.waterSupply).toBe(50);
    });

    it('应该正确获取升级消耗', () => {
      const cost1UpgradeCost = getBuildingUpgradeCost(BuildingType.WELL, 1);
      expect(cost1UpgradeCost).not.toBeUndefined();
      expect(cost1UpgradeCost?.gold).toBe(300);

      const cost2UpgradeCost = getBuildingUpgradeCost(BuildingType.WELL, 2);
      expect(cost2UpgradeCost?.gold).toBe(800);

      const cost3UpgradeCost = getBuildingUpgradeCost(BuildingType.WELL, 3);
      expect(cost3UpgradeCost).toBeUndefined(); // 满级没有下一级消耗
    });
  });

  describe('建筑升级测试', () => {
    it('应该成功解锁建筑', () => {
      const well = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.WELL, {x: 0, y: 0});
      expect(well['farm_building'].isUnlocked).toBe(false);

      const result = buildingSystem.unlockBuilding(well);
      expect(result).toBe(true);
      expect(well['farm_building'].isUnlocked).toBe(true);
    });

    it('资源足够时应该可以升级成功', () => {
      const well = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.WELL, {x: 0, y: 0}, true);

      const initialGold = playerResource.resources['金币'];
      const result = buildingSystem.upgradeBuilding(well, playerResource);
      expect(result).toBe(true);
      expect(well['farm_building'].isUpgrading).toBe(true);
      expect(playerResource.resources['金币']).toBe(initialGold - 300); // 升级到2级消耗300金币
    });

    it('资源不足时无法升级', () => {
      const well = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.WELL, {x: 0, y: 0}, true);
      playerResource.resources['金币'] = 100; // 金币不足
      const result = buildingSystem.upgradeBuilding(well, playerResource);
      expect(result).toBe(false);
      expect(well['farm_building'].isUpgrading).toBe(false);
    });

    it('满级建筑无法升级', () => {
      const well = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.WELL, {x: 0, y: 0}, true);
      well['farm_building'].level = 3; // 满级

      const result = buildingSystem.upgradeBuilding(well, playerResource);
      expect(result).toBe(false);
    });

    it('正在升级的建筑无法再次升级', () => {
      const well = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.WELL, {x: 0, y: 0}, true);
      buildingSystem.upgradeBuilding(well, playerResource);
      
      const result = buildingSystem.upgradeBuilding(well, playerResource);
      expect(result).toBe(false);
    });
  });

  describe('Buff计算测试', () => {
    it('升级完成后等级提升', () => {
      const well = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.WELL, {x: 0, y: 0}, true);
      const buffEntity = FarmBuildingFactory.createBuildingBuffEntity();
      buildingSystem.upgradeBuilding(well, playerResource);

      // 模拟升级时间到
      well['farm_building'].upgradeStartTime = Date.now() - 4000; // 超过3秒升级时间

      buildingSystem.update([well, buffEntity], 1000);

      expect(well['farm_building'].level).toBe(2);
      expect(well['farm_building'].isUpgrading).toBe(false);
    });

    it('全局Buff应该正确叠加', () => {
      const well = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.WELL, {x: 0, y: 0}, true);
      const farmland = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.FARMLAND, {x: 2, y: 0}, true);
      const buffEntity = FarmBuildingFactory.createBuildingBuffEntity();

      buildingSystem.update([well, farmland, buffEntity], 1000);

      const buffComp = buffEntity['building_buff'];
      expect(buffComp.waterSupply).toBe(10); // 水井1级提供10
      expect(buffComp.cropYield).toBe(0.05 + 0.1); // 水井0.05 + 农田0.1
      expect(buffComp.growthSpeed).toBe(0.05); // 农田0.05
    });

    it('升级后Buff应该更新', () => {
      const well = FarmBuildingFactory.createFarmBuildingEntity(BuildingType.WELL, {x: 0, y: 0}, true);
      const buffEntity = FarmBuildingFactory.createBuildingBuffEntity();

      buildingSystem.upgradeBuilding(well, playerResource);
      well['farm_building'].upgradeStartTime = Date.now() - 4000;
      buildingSystem.update([well, buffEntity], 1000);

      expect(buffEntity['building_buff'].waterSupply).toBe(25); // 升级到2级后提供25
    });
  });
});
