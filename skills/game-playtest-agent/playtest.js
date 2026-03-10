/**
 * Farm Cards Automated Playtest Agent
 * Runs 100+ game sessions and generates performance/balance report
 */

const fs = require('fs');

// Import game logic
const GameEngine = require('../../src/browser-app.js').FarmGameEngine;

class PlaytestAgent {
  constructor(config = {}) {
    this.config = {
      sessionCount: config.sessionCount || 100,
      strategy: config.strategy || 'mixed', // rush, defensive, combo, casual, mixed
      outputPath: config.outputPath || 'playtest-report.md'
    };
    
    this.metrics = {
      totalSessions: 0,
      completedSessions: 0,
      averageDaysSurvived: 0,
      averagePeakGold: 0,
      winRate: 0, // win = survived ≥30 days
      cardUsage: {},
      comboActivations: {},
      frustrationEvents: 0,
      strategyPerformance: {}
    };
    
    this.cardLibrary = require('../../农庄卡牌V2.0卡牌配置.json').cards;
  }

  // Run all playtest sessions
  async run() {
    console.log(`🚀 Starting ${this.config.sessionCount} playtest sessions with ${this.config.strategy} strategy...`);
    
    const strategies = this.config.strategy === 'mixed' 
      ? ['rush', 'defensive', 'combo', 'casual'] 
      : [this.config.strategy];
    
    for (let i = 0; i < this.config.sessionCount; i++) {
      const strategy = strategies[Math.floor(Math.random() * strategies.length)];
      const sessionMetrics = await this.runSingleSession(strategy);
      
      // Aggregate metrics
      this.metrics.totalSessions++;
      if (sessionMetrics.completed) this.metrics.completedSessions++;
      this.metrics.averageDaysSurvived += sessionMetrics.daysSurvived;
      this.metrics.averagePeakGold += sessionMetrics.peakGold;
      if (sessionMetrics.daysSurvived >= 30) this.metrics.winRate++;
      if (sessionMetrics.frustrationEvent) this.metrics.frustrationEvents++;
      
      // Track card usage
      Object.keys(sessionMetrics.cardUsage).forEach(cardId => {
        if (!this.metrics.cardUsage[cardId]) this.metrics.cardUsage[cardId] = 0;
        this.metrics.cardUsage[cardId] += sessionMetrics.cardUsage[cardId];
      });
      
      // Track combo activations
      Object.keys(sessionMetrics.comboActivations).forEach(comboId => {
        if (!this.metrics.comboActivations[comboId]) this.metrics.comboActivations[comboId] = 0;
        this.metrics.comboActivations[comboId] += sessionMetrics.comboActivations[comboId];
      });
      
      // Track strategy performance
      if (!this.metrics.strategyPerformance[strategy]) {
        this.metrics.strategyPerformance[strategy] = { sessions: 0, totalDays: 0, wins: 0 };
      }
      this.metrics.strategyPerformance[strategy].sessions++;
      this.metrics.strategyPerformance[strategy].totalDays += sessionMetrics.daysSurvived;
      if (sessionMetrics.daysSurvived >= 30) this.metrics.strategyPerformance[strategy].wins++;
      
      if ((i + 1) % 10 === 0) {
        console.log(`✅ Completed ${i + 1}/${this.config.sessionCount} sessions`);
      }
    }
    
    // Calculate averages
    this.metrics.averageDaysSurvived = (this.metrics.averageDaysSurvived / this.metrics.totalSessions).toFixed(2);
    this.metrics.averagePeakGold = (this.metrics.averagePeakGold / this.metrics.totalSessions).toFixed(0);
    this.metrics.winRate = ((this.metrics.winRate / this.metrics.totalSessions) * 100).toFixed(1);
    this.metrics.frustrationRate = ((this.metrics.frustrationEvents / this.metrics.totalSessions) * 100).toFixed(1);
    
    // Generate report
    await this.generateReport();
    console.log(`🎉 Playtest completed! Report saved to ${this.config.outputPath}`);
    
    return this.metrics;
  }

  // Run a single game session
  async runSingleSession(strategy) {
    const game = new GameEngine();
    game.initialize();
    game.start();
    
    const sessionMetrics = {
      completed: false,
      daysSurvived: 0,
      peakGold: 0,
      cardUsage: {},
      comboActivations: {},
      frustrationEvent: false
    };

    try {
      // Simulate up to 50 days
      for (let day = 1; day <= 50; day++) {
        sessionMetrics.daysSurvived = day;
        sessionMetrics.peakGold = Math.max(sessionMetrics.peakGold, game.gameState.money);
        
        // Play cards according to strategy
        await this.playTurn(game, strategy, sessionMetrics);
        
        // End day
        game.nextDay();
        
        // Check for frustration events (unwinnable state)
        if (game.gameState.energy <= 0 && game.gameState.money < 2 && game.gameState.handCards.length === 0) {
          sessionMetrics.frustrationEvent = true;
          break;
        }
      }
      
      sessionMetrics.completed = true;
    } catch (e) {
      console.error('Session error:', e);
    }

    return sessionMetrics;
  }

  // Simulate a single turn play
  async playTurn(game, strategy, sessionMetrics) {
    // Sort hand cards according to strategy
    let sortedCards = [...game.gameState.handCards];
    
    switch(strategy) {
      case 'rush':
        // Prioritize low-cost crop cards for fast gold generation
        sortedCards.sort((a, b) => a.cost - b.cost || (a.type === 'crop' ? -1 : 1));
        break;
      case 'defensive':
        // Prioritize animals and buildings for long-term gains
        sortedCards.sort((a, b) => (a.type === 'animal' || a.type === 'building') ? -1 : 1 || b.cost - a.cost);
        break;
      case 'combo':
        // Prioritize cards that activate known synergies
        sortedCards.sort((a, b) => this.hasComboSynergy(a, game) ? -1 : this.hasComboSynergy(b, game) ? 1 : 0);
        break;
      case 'casual':
      default:
        // Random play order
        sortedCards.sort(() => Math.random() - 0.5);
        break;
    }

    // Play as many cards as possible with available energy
    for (const card of sortedCards) {
      if (game.gameState.energy >= card.cost) {
        // Place card in random position
        const x = Math.random() * 700 + 50;
        const y = Math.random() * 250 + 50;
        game.playCard({ id: card.id, cost: card.cost }, x, y);
        
        // Track usage
        if (!sessionMetrics.cardUsage[card.id]) sessionMetrics.cardUsage[card.id] = 0;
        sessionMetrics.cardUsage[card.id]++;
      }
    }
  }

  // Check if card has combo synergy with already placed cards
  hasComboSynergy(card, game) {
    const placedCardTypes = game.gameState.placedCards.map(c => c.type);
    const combos = [
      { requires: ['crop', 'crop', 'crop'], bonus: 1.5 },
      { requires: ['animal', 'animal', 'animal'], bonus: 2 },
      { requires: ['building', 'tool', 'crop'], bonus: 2.5 }
    ];
    
    return combos.some(combo => {
      const types = [...placedCardTypes, card.type];
      return combo.requires.every(req => types.includes(req));
    });
  }

  // Generate final report
  async generateReport() {
    const report = `# Farm Cards: Pastoral Tale - Playtest Report
## 📊 Overview
- **Total Sessions**: ${this.metrics.totalSessions}
- **Completed Sessions**: ${this.metrics.completedSessions}
- **Test Date**: ${new Date().toISOString().split('T')[0]}
- **Test Strategy**: ${this.config.strategy}

## 🎯 Core Performance Metrics
| Metric | Value |
|--------|-------|
| Average Days Survived | ${this.metrics.averageDaysSurvived} days |
| Average Peak Gold | ${this.metrics.averagePeakGold}g |
| Win Rate (≥30 days) | ${this.metrics.winRate}% |
| Frustration Event Rate | ${this.metrics.frustrationRate}% |

## 🎮 Strategy Performance
| Strategy | Sessions | Average Days | Win Rate |
|----------|----------|--------------|----------|
${Object.entries(this.metrics.strategyPerformance).map(([strategy, data]) => 
  `| ${strategy} | ${data.sessions} | ${(data.totalDays / data.sessions).toFixed(2)} | ${((data.wins / data.sessions) * 100).toFixed(1)}% |`
).join('\n')}

## 🃏 Card Usage Analysis
### Most Used Cards (Top 10)
| Card ID | Name | Usage Count | Usage Rate |
|---------|------|-------------|------------|
${Object.entries(this.metrics.cardUsage)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([cardId, count]) => {
    const card = this.cardLibrary.find(c => c.id === cardId) || { name: 'Unknown' };
    return `| ${cardId} | ${card.name} | ${count} | ${((count / this.metrics.totalSessions) * 100).toFixed(1)}% |`;
  })
  .join('\n')}

### Least Used Cards (Bottom 10)
| Card ID | Name | Usage Count | Usage Rate |
|---------|------|-------------|------------|
${Object.entries(this.metrics.cardUsage)
  .sort((a, b) => a[1] - b[1])
  .slice(0, 10)
  .map(([cardId, count]) => {
    const card = this.cardLibrary.find(c => c.id === cardId) || { name: 'Unknown' };
    return `| ${cardId} | ${card.name} | ${count} | ${((count / this.metrics.totalSessions) * 100).toFixed(1)}% |`;
  })
  .join('\n')}

## 🔗 Combo Activation Analysis
| Combo | Activation Count | Activation Rate |
|-------|-------------------|------------------|
${Object.entries(this.metrics.comboActivations)
  .sort((a, b) => b[1] - a[1])
  .map(([comboId, count]) => 
    `| ${comboId} | ${count} | ${((count / this.metrics.totalSessions) * 100).toFixed(1)}% |`
  )
  .join('\n')}

## 💡 Recommendations
1. **Balance Adjustments**:
   - Win rate is ${this.metrics.winRate}% (target 30-40%) - ${this.metrics.winRate < 30 ? 'Game is too difficult, reduce negative event impact' : this.metrics.winRate > 40 ? 'Game is too easy, increase difficulty scaling' : 'Well balanced, no major changes needed'}
   - Frustration rate is ${this.metrics.frustrationRate}% (target ≤15%) - ${this.metrics.frustrationRate > 15 ? 'Reduce early game energy starvation, increase initial energy to 4' : 'Acceptable level'}

2. **Card Balance**:
   - Buff bottom 10 least used cards to increase usage diversity
   - Nerf top 3 most used cards if they are over-performing

3. **UX Improvements**:
   - Add better visibility for active combo effects
   - Implement auto-save feature to prevent progress loss
   - Improve card description clarity for new players

---
*Report generated automatically by Farm Cards Playtest Agent | 100% AI powered*
`;

    fs.writeFileSync(this.config.outputPath, report, 'utf8');
  }
}

// Run 100 playtest sessions if executed directly
if (require.main === module) {
  const agent = new PlaytestAgent({
    sessionCount: 100,
    strategy: 'mixed',
    outputPath: '/Users/ai/.openclaw/workspace/farm-game-ecs/playtest-100-sessions-report.md'
  });
  agent.run().then(metrics => {
    console.log('Playtest complete! Metrics:', metrics);
  });
}

module.exports = PlaytestAgent;
