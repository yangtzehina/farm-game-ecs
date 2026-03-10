# Game Playtest Agent Skill
## Skill Name: Farm Cards Playtest Agent
### Description
Specialized agent for automated playtesting of the *Farm Cards: Pastoral Tale* roguelike farming card game. Designed to simulate real player behavior, run thousands of game sessions, collect statistical data, and generate actionable UX/balance feedback reports.
### Capabilities
1. **Automated Gameplay**: Run hundreds/thousands of full game sessions without manual intervention
2. **Strategy Simulation**: Emulate multiple player archetypes:
   - Aggressive rush players (focus on fast crop farming)
   - Defensive/long-term players (focus on animal breeding and building synergies)
   - Combo-focused players (prioritize card combination effects)
   - Casual players (random card selection)
3. **Data Collection**: Track 50+ metrics per session:
   - Game duration (turns/days survived)
   - Gold generation per turn
   - Card usage frequency and win rate
   - Synergy/combo activation rate
   - Player frustration triggers (unwinnable starts, over-powered negative events)
   - Progression milestones reached
4. **Balance Analysis**: Identify over-powered/under-powered cards, broken synergies, and unfair difficulty spikes
5. **UX Feedback Generation**: Generate data-driven improvement recommendations based on aggregated player simulation data
### Evaluation Metrics
| Metric | Target Threshold |
|--------|-------------------|
| Average game length | 12-18 days |
| Win rate (reach day 30) | 30-40% |
| Card usage spread | All cards used in ≥5% of sessions |
| Frustration event rate | ≤15% of sessions |
| Average gold per day | 15-25g/day at stage 1, 30-50g/day at stage 3 |
### Usage
```typescript
// Run 100 playtest sessions with mixed strategies
const agent = new PlaytestAgent({
  sessionCount: 100,
  strategyMix: {
    rush: 0.25,
    defensive: 0.25,
    combo: 0.25,
    casual: 0.25
  }
});
const report = await agent.run();
```
### Workflow
1. Initialize game state for each new session
2. Simulate player decisions (card selection, placement, upgrades) based on selected strategy
3. Track all game events and metrics
4. Aggregate data across all sessions
5. Generate comprehensive report with statistical analysis and recommendations
### Compliance
- All simulations follow official game rules exactly
- No cheating or manipulation of game state
- Reports include raw statistical data + interpreted insights
