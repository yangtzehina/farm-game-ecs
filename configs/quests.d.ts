/**
 * 🏡 农庄卡牌：田园物语 - 任务配置表
 * 包含短期日常任务和中期阶段任务配置
 */
import { Quest } from '../components';
export declare const DAILY_QUEST_POOL: Omit<Quest, 'unlocked' | 'completed' | 'claimed'>[];
export declare const STAGE_QUESTS: Omit<Quest, 'unlocked' | 'completed' | 'claimed'>[];
export type ExtendedQuestObjectiveType = '收集资源' | '升级卡牌' | '生产物品' | '拥有卡牌' | '达到等级' | '完成任务' | '打出卡牌' | '弃置卡牌' | '激活组合' | '获取经验' | '存活回合' | '使用工具' | '获得buff' | '出售资源' | '等级提升';
