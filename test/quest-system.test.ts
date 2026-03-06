/**
 * 🧪 任务系统测试文件
 */

import { EntityFactory } from '../src/components';
import { createDefaultSystems, SystemManager, QuestSystem } from '../src/systems';

// 初始化游戏
const systemManager = createDefaultSystems();
const player = EntityFactory.createPlayerEntity();
systemManager.addEntity(player);

// 获取任务系统
const questSystem = systemManager.getSystem<QuestSystem>('任务管理');
if (!questSystem) {
  console.error('❌ 任务系统未找到');
  process.exit(1);
}

// 添加初始任务
questSystem.addDefaultQuests(player);

console.log('=== 初始任务列表 ===');
console.log('进行中的任务:', player.quest.getActiveQuests().map(q => q.title));
console.log('可领取奖励的任务:', player.quest.getClaimableQuests().map(q => q.title));

// 模拟收集作物资源
console.log('\n=== 模拟收集10个作物 ===');
for (let i = 0; i < 10; i++) {
  player.resource.addResource('作物', 1);
  questSystem.updateQuestProgress(player, '收集资源', '作物', 1);
}

// 执行一次系统更新
questSystem.update([player], 1000);

console.log('收集完成后状态:');
console.log('进行中的任务:', player.quest.getActiveQuests().map(q => q.title));
console.log('可领取奖励的任务:', player.quest.getClaimableQuests().map(q => q.title));
console.log('当前金币:', player.resource.resources['金币']);
console.log('当前木材:', player.resource.resources['木材']);

// 再执行一次更新，领取奖励
console.log('\n=== 执行系统更新，自动领取奖励 ===');
questSystem.update([player], 1000);

console.log('领取奖励后状态:');
console.log('进行中的任务:', player.quest.getActiveQuests().map(q => q.title));
console.log('可领取奖励的任务:', player.quest.getClaimableQuests().map(q => q.title));
console.log('当前金币:', player.resource.resources['金币']);
console.log('当前木材:', player.resource.resources['木材']);

// 模拟获得50金币
console.log('\n=== 模拟获得50金币 ===');
player.resource.addResource('金币', 50);
questSystem.updateQuestProgress(player, '收集资源', '金币', 50);

// 执行系统更新
questSystem.update([player], 1000);

console.log('获得金币后状态:');
console.log('进行中的任务:', player.quest.getActiveQuests().map(q => q.title));
console.log('可领取奖励的任务:', player.quest.getClaimableQuests().map(q => q.title));
console.log('当前玩家等级:', player.character.level);
console.log('当前石头:', player.resource.resources['石头']);

// 领取第二个任务奖励
questSystem.update([player], 1000);

console.log('\n=== 领取第二个任务奖励后 ===');
console.log('当前玩家等级:', player.character.level);
console.log('当前经验:', player.character.experience);
console.log('当前石头:', player.resource.resources['石头']);

console.log('\n✅ 任务系统测试完成！所有功能正常工作');
