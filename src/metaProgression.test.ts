import { describe, it, expect, beforeEach, vi } from 'vitest';
// 先stub localStorage再导入模块
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => null),
  setItem: vi.fn()
});

import { metaProgressionManager, PlayerMetaState } from './metaProgression';
import { ALL_ACHIEVEMENTS } from './achievements';
import { ALL_UNLOCKS } from './unlocks';

describe('Meta Progression System', () => {
  beforeEach(() => {
    // 重置localStorage mock
    (localStorage.getItem as vi.Mock).mockReturnValue(null);
    (localStorage.setItem as vi.Mock).mockClear();
    
    // 重置管理器状态
    metaProgressionManager['state'] = metaProgressionManager['loadState']();
  });

  describe('Initialization', () => {
    it('should initialize with default state when no stored data exists', () => {
      const state = metaProgressionManager.getState();
      
      expect(state.achievements).toHaveProperty('coll_001');
      expect(state.unlocks).toHaveProperty('golden_wheat');
      expect(state.stats.totalGames).toBe(0);
      
      // 所有成就初始都是未解锁，进度0
      ALL_ACHIEVEMENTS.forEach(ach => {
        expect(state.achievements[ach.id].unlocked).toBe(false);
        expect(state.achievements[ach.id].progress).toBe(0);
      });
      
      // 所有解锁内容初始都是未解锁
      ALL_UNLOCKS.forEach(unlock => {
        expect(state.unlocks[unlock.id]).toBe(false);
      });
    });

    it('should load saved state from localStorage', () => {
      const mockState: PlayerMetaState = {
        achievements: {
          coll_001: { unlocked: true, progress: 10, unlockedAt: 12345 },
          ...Object.fromEntries(ALL_ACHIEVEMENTS.map(ach => [ach.id, { unlocked: false, progress: 0 }]))
        },
        unlocks: {
          golden_wheat: true,
          ...Object.fromEntries(ALL_UNLOCKS.map(unlock => [unlock.id, false]))
        },
        stats: {
          totalGames: 5,
          totalPlayTime: 1000,
          totalGoldEarned: 10000,
          totalCardsCollected: 20,
          totalRelicsCollected: 10,
          totalCropsHarvested: 500,
          totalQuestsCompleted: 30,
          totalTrades: 20,
          totalWins: 3,
          totalLosses: 2,
          maxCombo: 15,
          fastestClearTime: 20 * 60 * 1000,
          highestDifficultyCleared: 'normal'
        }
      };

      (localStorage.getItem as vi.Mock).mockReturnValue(JSON.stringify(mockState));
      
      // 重新加载状态
      metaProgressionManager['state'] = metaProgressionManager['loadState']();
      const state = metaProgressionManager.getState();
      
      expect(state.stats.totalGames).toBe(5);
      expect(state.achievements.coll_001.unlocked).toBe(true);
      expect(state.unlocks.golden_wheat).toBe(true);
    });
  });

  describe('Achievement System', () => {
    it('should update achievement progress correctly', () => {
      metaProgressionManager.updateAchievementProgress('coll_001', 5);
      expect(metaProgressionManager.getState().achievements.coll_001.progress).toBe(5);
    });

    it('should increment achievement progress correctly', () => {
      metaProgressionManager.incrementAchievementProgress('coll_001', 3);
      expect(metaProgressionManager.getState().achievements.coll_001.progress).toBe(3);
      
      metaProgressionManager.incrementAchievementProgress('coll_001', 4);
      expect(metaProgressionManager.getState().achievements.coll_001.progress).toBe(7);
    });

    it('should unlock achievement when progress reaches target', () => {
      expect(metaProgressionManager.getState().achievements.coll_001.unlocked).toBe(false);
      
      metaProgressionManager.updateAchievementProgress('coll_001', 10);
      
      expect(metaProgressionManager.getState().achievements.coll_001.unlocked).toBe(true);
      expect(metaProgressionManager.getState().achievements.coll_001.unlockedAt).toBeDefined();
    });

    it('should unlock reward when achievement is unlocked', () => {
      expect(metaProgressionManager.getState().unlocks.golden_wheat).toBe(false);
      
      metaProgressionManager.updateAchievementProgress('coll_001', 10);
      
      expect(metaProgressionManager.getState().unlocks.golden_wheat).toBe(true);
    });

    it('should not update progress for already unlocked achievements', () => {
      metaProgressionManager.updateAchievementProgress('coll_001', 10);
      expect(metaProgressionManager.getState().achievements.coll_001.progress).toBe(10);
      
      metaProgressionManager.updateAchievementProgress('coll_001', 15);
      expect(metaProgressionManager.getState().achievements.coll_001.progress).toBe(10);
    });
  });

  describe('Stats and Auto Achievement Unlock', () => {
    it('should update stats and check achievements automatically', () => {
      metaProgressionManager.updateStats({ totalCardsCollected: 10 });
      
      expect(metaProgressionManager.getState().stats.totalCardsCollected).toBe(10);
      expect(metaProgressionManager.getState().achievements.coll_001.unlocked).toBe(true);
    });

    it('should unlock multiple achievements when stats meet multiple conditions', () => {
      metaProgressionManager.updateStats({
        totalCardsCollected: 30,
        totalCropsHarvested: 100
      });
      
      expect(metaProgressionManager.getState().achievements.coll_001.unlocked).toBe(true);
      expect(metaProgressionManager.getState().achievements.coll_002.unlocked).toBe(true);
      expect(metaProgressionManager.getState().achievements.coll_011.unlocked).toBe(true);
    });
  });

  describe('Unlock System', () => {
    it('should return correct unlocked items', () => {
      metaProgressionManager.updateAchievementProgress('coll_001', 10);
      
      const unlockedCards = metaProgressionManager.getUnlockedItems('card');
      expect(unlockedCards.some(card => card.id === 'golden_wheat')).toBe(true);
    });

    it('should correctly check if an item is unlocked', () => {
      expect(metaProgressionManager.isUnlocked('golden_wheat')).toBe(false);
      
      metaProgressionManager.updateAchievementProgress('coll_001', 10);
      
      expect(metaProgressionManager.isUnlocked('golden_wheat')).toBe(true);
    });
  });

  describe('All Achievements Count', () => {
    it('should have at least 50 achievements', () => {
      expect(ALL_ACHIEVEMENTS.length).toBeGreaterThanOrEqual(50);
    });

    it('should have 20 collection achievements', () => {
      expect(ALL_ACHIEVEMENTS.filter(a => a.type === 'collection').length).toBe(20);
    });

    it('should have 20 challenge achievements', () => {
      expect(ALL_ACHIEVEMENTS.filter(a => a.type === 'challenge').length).toBe(20);
    });

    it('should have 15 gameplay achievements', () => {
      expect(ALL_ACHIEVEMENTS.filter(a => a.type === 'gameplay').length).toBe(15);
    });
  });
});
