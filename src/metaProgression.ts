import { ALL_ACHIEVEMENTS, ACHIEVEMENT_MAP, Achievement } from './achievements';
import { ALL_UNLOCKS, UNLOCK_MAP, UnlockItem } from './unlocks';

export interface PlayerMetaState {
  achievements: Record<string, {
    unlocked: boolean;
    progress: number;
    unlockedAt?: number;
  }>;
  unlocks: Record<string, boolean>;
  stats: {
    totalGames: number;
    totalPlayTime: number;
    totalGoldEarned: number;
    totalCardsCollected: number;
    totalRelicsCollected: number;
    totalCropsHarvested: number;
    totalQuestsCompleted: number;
    totalTrades: number;
    totalWins: number;
    totalLosses: number;
    maxCombo: number;
    fastestClearTime: number;
    highestDifficultyCleared: string;
  };
}

const STORAGE_KEY = 'farm_game_meta_state';

class MetaProgressionManager {
  private state: PlayerMetaState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    this.migrateState();
  }

  private loadState(): PlayerMetaState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load meta state', e);
    }

    // 默认初始状态
    return {
      achievements: Object.fromEntries(ALL_ACHIEVEMENTS.map(ach => [ach.id, {
        unlocked: false,
        progress: 0
      }])),
      unlocks: Object.fromEntries(ALL_UNLOCKS.map(unlock => [unlock.id, false])),
      stats: {
        totalGames: 0,
        totalPlayTime: 0,
        totalGoldEarned: 0,
        totalCardsCollected: 0,
        totalRelicsCollected: 0,
        totalCropsHarvested: 0,
        totalQuestsCompleted: 0,
        totalTrades: 0,
        totalWins: 0,
        totalLosses: 0,
        maxCombo: 0,
        fastestClearTime: Infinity,
        highestDifficultyCleared: 'normal'
      }
    };
  }

  private migrateState() {
    // 新增成就/解锁时自动初始化
    ALL_ACHIEVEMENTS.forEach(ach => {
      if (!this.state.achievements[ach.id]) {
        this.state.achievements[ach.id] = {
          unlocked: false,
          progress: 0
        };
      }
    });

    ALL_UNLOCKS.forEach(unlock => {
      if (this.state.unlocks[unlock.id] === undefined) {
        this.state.unlocks[unlock.id] = false;
      }
    });

    this.saveState();
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save meta state', e);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getState(): Readonly<PlayerMetaState> {
    return this.state;
  }

  // 更新统计数据
  public updateStats(updates: Partial<PlayerMetaState['stats']>) {
    Object.assign(this.state.stats, updates);
    this.checkAchievements();
    this.saveState();
  }

  // 更新成就进度
  public updateAchievementProgress(achievementId: string, progress: number) {
    const ach = this.state.achievements[achievementId];
    if (!ach || ach.unlocked) return;

    ach.progress = Math.min(progress, ACHIEVEMENT_MAP.get(achievementId)!.target);
    
    if (ach.progress >= ACHIEVEMENT_MAP.get(achievementId)!.target) {
      this.unlockAchievement(achievementId);
    } else {
      this.saveState();
    }
  }

  public incrementAchievementProgress(achievementId: string, amount: number = 1) {
    const ach = this.state.achievements[achievementId];
    if (!ach || ach.unlocked) return;

    this.updateAchievementProgress(achievementId, ach.progress + amount);
  }

  private unlockAchievement(achievementId: string) {
    const ach = this.state.achievements[achievementId];
    if (!ach || ach.unlocked) return;

    ach.unlocked = true;
    ach.unlockedAt = Date.now();

    // 解锁对应的奖励
    const achievement = ACHIEVEMENT_MAP.get(achievementId)!;
    if (achievement.unlockReward) {
      const { cards, relics, characters, difficulty } = achievement.unlockReward;
      cards?.forEach(cardId => this.unlockItem(cardId));
      relics?.forEach(relicId => this.unlockItem(relicId));
      characters?.forEach(charId => this.unlockItem(charId));
      if (difficulty) this.unlockItem(difficulty);
    }

    this.saveState();
    console.log(`Achievement unlocked: ${achievement.name}`);
  }

  private unlockItem(itemId: string) {
    if (this.state.unlocks[itemId] === false) {
      this.state.unlocks[itemId] = true;
    }
  }

  // 检查所有成就是否满足条件
  private checkAchievements() {
    const { stats } = this.state;

    // 收集类成就
    this.updateAchievementProgress('coll_001', stats.totalCardsCollected);
    this.updateAchievementProgress('coll_002', stats.totalCardsCollected);
    this.updateAchievementProgress('coll_003', stats.totalCardsCollected);
    this.updateAchievementProgress('coll_006', stats.totalRelicsCollected);
    this.updateAchievementProgress('coll_007', stats.totalRelicsCollected);
    this.updateAchievementProgress('coll_008', stats.totalRelicsCollected);
    this.updateAchievementProgress('coll_011', stats.totalCropsHarvested);
    this.updateAchievementProgress('coll_012', stats.totalCropsHarvested);
    this.updateAchievementProgress('coll_013', stats.totalCropsHarvested);
    this.updateAchievementProgress('coll_018', stats.totalQuestsCompleted);
    this.updateAchievementProgress('coll_019', stats.totalQuestsCompleted);
    this.updateAchievementProgress('coll_020', stats.totalCardsCollected + stats.totalRelicsCollected);

    // 挑战类成就
    this.updateAchievementProgress('chal_008', stats.totalWins);
    this.updateAchievementProgress('chal_009', stats.totalGoldEarned);
    this.updateAchievementProgress('chal_010', stats.totalGoldEarned);
    this.updateAchievementProgress('chal_011', stats.maxCombo);
    this.updateAchievementProgress('chal_012', stats.maxCombo);
    if (stats.fastestClearTime <= 30 * 60 * 1000) this.unlockAchievement('chal_002');
    if (stats.fastestClearTime <= 15 * 60 * 1000) this.unlockAchievement('chal_003');
    if (stats.highestDifficultyCleared === 'hard') this.unlockAchievement('chal_004');
    if (stats.highestDifficultyCleared === 'hell') this.unlockAchievement('chal_005');

    // 玩法类成就
    this.updateAchievementProgress('game_002', stats.totalGames);
    this.updateAchievementProgress('game_003', stats.totalGames);
    this.updateAchievementProgress('game_004', stats.totalGames);
    this.updateAchievementProgress('game_007', stats.totalQuestsCompleted);
    this.updateAchievementProgress('game_008', stats.totalQuestsCompleted);
    this.updateAchievementProgress('game_009', stats.totalTrades);
    this.updateAchievementProgress('game_010', stats.totalTrades);
  }

  // 获取已解锁的内容
  public getUnlockedItems(type?: string): UnlockItem[] {
    return ALL_UNLOCKS.filter(unlock => 
      (!type || unlock.type === type) && this.state.unlocks[unlock.id]
    );
  }

  // 获取所有成就（包括未解锁的）
  public getAllAchievements(): (Achievement & {
    unlocked: boolean;
    progress: number;
    unlockedAt?: number;
  })[] {
    return ALL_ACHIEVEMENTS.map(ach => ({
      ...ach,
      ...this.state.achievements[ach.id]
    }));
  }

  // 检查物品是否已解锁
  public isUnlocked(itemId: string): boolean {
    return this.state.unlocks[itemId] === true;
  }

  // 重置所有进度（调试用）
  public resetProgress() {
    this.state = this.loadState();
    this.saveState();
  }
}

export const metaProgressionManager = new MetaProgressionManager();
