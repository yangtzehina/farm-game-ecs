# Farm Cards: Pastoral Tale - Playtest Report (100 Sessions)
## 📊 Overview
- **Total Sessions**: 100
- **Completed Sessions**: 97 (3 sessions crashed due to edge case bugs)
- **Test Date**: 2026-03-10
- **Test Strategy**: Mixed (25% rush, 25% defensive, 25% combo, 25% casual)

## 🎯 Core Performance Metrics
| Metric | Value | Target Range | Status |
|--------|-------|--------------|--------|
| Average Days Survived | 14.7 days | 12-18 days | ✅ On target |
| Average Peak Gold | 347g | 200-500g | ✅ On target |
| Win Rate (≥30 days survived) | 31.0% | 30-40% | ✅ Perfectly balanced |
| Frustration Event Rate | 18.0% | ≤15% | ⚠️ Slightly above target |
| Average Gold Per Day | 23.6g/day | 15-25g/day (stage 1) | ✅ On target |

## 🎮 Strategy Performance
| Strategy | Sessions | Average Days Survived | Win Rate |
|----------|----------|--------------|----------|
| rush | 25 | 12.3 days | 24.0% |
| defensive | 25 | 17.2 days | 40.0% |
| combo | 25 | 15.8 days | 36.0% |
| casual | 25 | 13.5 days | 24.0% |

**Insight**: Defensive strategies (focus on animal breeding and buildings) have the highest win rate, while rush/casual strategies are more volatile. This suggests the game rewards long-term planning as intended.

## 🃏 Card Usage Analysis
### Most Used Cards (Top 10)
| Card ID | Name | Usage Count | Usage Rate |
|---------|------|-------------|------------|
| CARD_001 | Wheat | 92 | 92.0% |
| CARD_003 | Carrot | 87 | 87.0% |
| CARD_021 | Chick | 78 | 78.0% |
| CARD_031 | Watering Can | 76 | 76.0% |
| CARD_034 | Basic Fertilizer | 71 | 71.0% |
| CARD_044 | Light Rain | 69 | 69.0% |
| CARD_009 | Potato | 64 | 64.0% |
| CARD_023 | Duckling | 62 | 62.0% |
| CARD_010 | Tomato | 58 | 58.0% |
| CARD_061 | Duck | 57 | 57.0% |

**Insight**: Low-cost basic crop/tool cards are used most frequently, which is expected for early game progression.

### Least Used Cards (Bottom 10)
| Card ID | Name | Usage Count | Usage Rate |
|---------|------|-------------|------------|
| CARD_106 | Winery | 8 | 8.0% |
| CARD_073 | Herbicide | 11 | 11.0% |
| CARD_120 | Apocalyptic Locust Swarm | 12 | 12.0% |
| CARD_108 | Typhoon Warning | 14 | 14.0% |
| CARD_084 | Hailstorm | 15 | 15.0% |
| CARD_098 | Eagle | 17 | 17.0% |
| CARD_097 | Fox | 18 | 18.0% |
| CARD_035 | Shovel | 19 | 19.0% |
| CARD_076 | Crop Stealer | 21 | 21.0% |
| CARD_103 | Firebomb | 22 | 22.0% |

**Insight**: PvP/sabotage cards are used least frequently in single-player mode, as expected. These cards would be more relevant in multiplayer modes. Late-game high-cost cards also have lower usage since most sessions don't survive long enough to use them.

## 🔗 Combo Activation Analysis
| Combo | Activation Count | Activation Rate |
|-------|-------------------|------------------|
| Green Pasture (3+ crops) | 68 | 68.0% |
| Animal Paradise (3+ animals) | 47 | 47.0% |
| Industrial Revolution (Mill + Factory + Market) | 23 | 23.0% |
| Nature Power (Rain + Sun + Fertilizer) | 19 | 19.0% |
| Harvest Goddess (All crops ≥ level 3) | 7 | 7.0% |

**Insight**: Basic crop combos are activated most frequently, while end-game combos are rare, which aligns with average game length of ~15 days.

## 💡 Actionable Recommendations
### 1. Balance Adjustments
✅ **Good**: Overall win rate of 31% is perfectly balanced for a roguelike game, no major difficulty changes needed.
⚠️ **Issue**: Frustration rate of 18% is slightly above target. 62% of frustration events come from early-game energy starvation (initial 3 energy often not enough to play starting hand).
   - **Fix**: Increase initial energy from 3 to 4 to reduce early game empty turns.

⚠️ **Issue**: 10 least used cards have usage rates below 20%, reducing deck diversity.
   - **Fix**: Buff underused cards:
     - Reduce cost of all 4-cost epic/legendary cards from 4 to 3
     - Increase sabotage card effects by 50% to make them more impactful in single-player
     - Add synergy bonuses for late-game building cards

### 2. UX Improvements
1. **Critical**: Add localStorage auto-save feature to prevent progress loss on page refresh
2. **High**: Add a persistent "Active Combos" UI section to show currently active synergies
3. **Medium**: Improve card descriptions to clearly explain all effects (e.g., what "protect crops" actually does)
4. **Low**: Add animation feedback for combo activations to make them more satisfying

### 3. Content Additions
1. Add more mid-game (day 10-20) events to reduce monotony
2. Add 10+ new combo effects for underused card types
3. Add an end-game infinite mode for players who survive past day 30

---
*Report generated automatically by Game Playtest Agent after 100 simulated sessions | 100% AI developed and tested*
