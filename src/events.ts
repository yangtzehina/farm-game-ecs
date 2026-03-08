export type EventType = 'positive' | 'neutral' | 'negative';

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;
  effect: (gameState: any) => void;
}

// 60% 正面事件 (18个)
const positiveEvents: GameEvent[] = [
  {
    id: 'pos_001',
    name: '天降甘霖',
    description: '一场及时雨让所有作物生长速度提升50%，持续3回合。',
    type: 'positive',
    effect: (state) => {
      state.cropGrowthMultiplier = (state.cropGrowthMultiplier || 1) * 1.5;
      state.buffs.push({ id: 'rain_buff', duration: 3, effect: 'cropGrowth*1.5' });
    }
  },
  {
    id: 'pos_002',
    name: '慷慨的商人',
    description: '路过的商人赠送了你50金币和3包高级肥料。',
    type: 'positive',
    effect: (state) => {
      state.gold += 50;
      state.items = state.items || [];
      state.items.push({ id: 'fertilizer_advanced', count: 3 });
    }
  },
  {
    id: 'pos_003',
    name: '丰收之年',
    description: '今年气候适宜，你所有已成熟的作物产量翻倍。',
    type: 'positive',
    effect: (state) => {
      state.crops.forEach((crop: any) => {
        if (crop.mature) crop.yield *= 2;
      });
    }
  },
  {
    id: 'pos_004',
    name: '流浪工匠',
    description: '流浪工匠免费为你升级了一个农田，容量提升100%。',
    type: 'positive',
    effect: (state) => {
      const emptyField = state.fields.find((f: any) => f.level === 1);
      if (emptyField) emptyField.level *= 2;
    }
  },
  {
    id: 'pos_005',
    name: '意外之财',
    description: '你在地里挖出了祖先埋下的宝藏，获得200金币。',
    type: 'positive',
    effect: (state) => {
      state.gold += 200;
    }
  },
  {
    id: 'pos_006',
    name: '良种馈赠',
    description: '农业协会给你送来了10包稀有作物种子。',
    type: 'positive',
    effect: (state) => {
      state.items = state.items || [];
      state.items.push({ id: 'seed_rare', count: 10 });
    }
  },
  {
    id: 'pos_007',
    name: '游客光临',
    description: '城里来的游客高价购买了你仓库里的所有水果，收入增加30%。',
    type: 'positive',
    effect: (state) => {
      const fruitValue = state.storage.fruits.reduce((sum: number, f: any) => sum + f.value, 0);
      state.gold += Math.floor(fruitValue * 0.3);
    }
  },
  {
    id: 'pos_008',
    name: '风车升级',
    description: '你的风车获得了升级，所有加工产品的速度提升40%。',
    type: 'positive',
    effect: (state) => {
      state.processingSpeedMultiplier = (state.processingSpeedMultiplier || 1) * 1.4;
      state.buffs.push({ id: 'windmill_upgrade', duration: 999, effect: 'processingSpeed*1.4' });
    }
  },
  {
    id: 'pos_009',
    name: '动物增产',
    description: '你的家禽牲畜状态极佳，本周产蛋/产奶量提升80%。',
    type: 'positive',
    effect: (state) => {
      state.animalProductMultiplier = (state.animalProductMultiplier || 1) * 1.8;
      state.buffs.push({ id: 'happy_animals', duration: 7, effect: 'animalProduct*1.8' });
    }
  },
  {
    id: 'pos_010',
    name: '农业补贴',
    description: '政府发放农业补贴，你获得了150金币和5个免费建筑名额。',
    type: 'positive',
    effect: (state) => {
      state.gold += 150;
      state.freeBuildingSlots += 5;
    }
  },
  {
    id: 'pos_011',
    name: '神秘老农',
    description: '神秘老农传授了你独家种植技巧，所有作物永久增产20%。',
    type: 'positive',
    effect: (state) => {
      state.permanentCropYieldBonus = (state.permanentCropYieldBonus || 0) + 0.2;
    }
  },
  {
    id: 'pos_012',
    name: '蜜蜂迁徙',
    description: '一群蜜蜂来到了你的农场，所有开花作物的授粉率提升100%。',
    type: 'positive',
    effect: (state) => {
      state.pollinationRate = 2;
      state.buffs.push({ id: 'bees_buff', duration: 10, effect: 'pollinationRate*2' });
    }
  },
  {
    id: 'pos_013',
    name: '畅销市场',
    description: '你农庄的产品最近在市场上特别畅销，售价全部提升30%，持续5回合。',
    type: 'positive',
    effect: (state) => {
      state.sellPriceMultiplier = (state.sellPriceMultiplier || 1) * 1.3;
      state.buffs.push({ id: 'popular_products', duration: 5, effect: 'sellPrice*1.3' });
    }
  },
  {
    id: 'pos_014',
    name: '免费劳动力',
    description: '几个大学生来农场体验生活，免费帮你工作3回合，劳动力提升100%。',
    type: 'positive',
    effect: (state) => {
      state.laborMultiplier = (state.laborMultiplier || 1) * 2;
      state.buffs.push({ id: 'student_helpers', duration: 3, effect: 'labor*2' });
    }
  },
  {
    id: 'pos_015',
    name: '稀有遗物',
    description: '你在古老的树洞里发现了一个神秘遗物！',
    type: 'positive',
    effect: (state) => {
      const randomRelic = state.relicPool[Math.floor(Math.random() * state.relicPool.length)];
      state.relics.push(randomRelic);
    }
  },
  {
    id: 'pos_016',
    name: '水井扩建',
    description: '你扩建了水井，干旱抗性提升80%，浇水需求减少50%。',
    type: 'positive',
    effect: (state) => {
      state.droughtResistance += 0.8;
      state.waterNeedMultiplier *= 0.5;
    }
  },
  {
    id: 'pos_017',
    name: '友情馈赠',
    description: '隔壁农庄的朋友给你送来了4只绵羊和2头牛。',
    type: 'positive',
    effect: (state) => {
      state.animals = state.animals || [];
      state.animals.push({ type: 'sheep', count: 4 }, { type: 'cow', count: 2 });
    }
  },
  {
    id: 'pos_018',
    name: '科技下乡',
    description: '农业科技队来你农场指导，所有科技研发速度提升100%，持续10回合。',
    type: 'positive',
    effect: (state) => {
      state.researchSpeedMultiplier = (state.researchSpeedMultiplier || 1) * 2;
      state.buffs.push({ id: 'tech_boost', duration: 10, effect: 'researchSpeed*2' });
    }
  }
];

// 25% 中性事件 (8个)
const neutralEvents: GameEvent[] = [
  {
    id: 'neu_001',
    name: '多云天气',
    description: '最近几天都是阴天，作物生长速度不变，也不会发生旱灾。',
    type: 'neutral',
    effect: () => {}
  },
  {
    id: 'neu_002',
    name: '集市日',
    description: '今天是镇上的集市日，你可以选择出售任意商品，无需支付交易税。',
    type: 'neutral',
    effect: (state) => {
      state.nextSellNoTax = true;
    }
  },
  {
    id: 'neu_003',
    name: '路过的旅行者',
    description: '旅行者用1个稀有种子换走了你2个普通作物。',
    type: 'neutral',
    effect: (state) => {
      const cropIndex = state.storage.crops.findIndex((c: any) => c.count >= 2);
      if (cropIndex > -1) {
        state.storage.crops[cropIndex].count -= 2;
        state.items.push({ id: 'seed_rare', count: 1 });
      }
    }
  },
  {
    id: 'neu_004',
    name: '天气预报',
    description: '气象台发布了未来5天的天气预报，你可以提前做好准备。',
    type: 'neutral',
    effect: (state) => {
      state.weatherForecast = ['sunny', 'cloudy', 'rain', 'sunny', 'cloudy'];
    }
  },
  {
    id: 'neu_005',
    name: '农场参观',
    description: '小学组织学生来农场参观，你获得了100金币门票收入，但今天无法耕作。',
    type: 'neutral',
    effect: (state) => {
      state.gold += 100;
      state.skipNextFarming = true;
    }
  },
  {
    id: 'neu_006',
    name: '物品交换',
    description: '村民提出用5单位木材换你3单位石料，是否同意？',
    type: 'neutral',
    effect: (state) => {
      state.pendingChoice = {
        title: '物品交换',
        options: [
          { text: '同意', effect: () => { state.resources.wood +=5; state.resources.stone -=3; } },
          { text: '拒绝', effect: () => {} }
        ]
      };
    }
  },
  {
    id: 'neu_007',
    name: '技术培训',
    description: '你可以花费100金币参加农业技术培训，所有作物永久增产5%。',
    type: 'neutral',
    effect: (state) => {
      state.pendingChoice = {
        title: '技术培训',
        options: [
          { text: '参加', effect: () => { if (state.gold >=100) { state.gold -=100; state.permanentCropYieldBonus +=0.05; } } },
          { text: '不参加', effect: () => {} }
        ]
      };
    }
  },
  {
    id: 'neu_008',
    name: '动物走失',
    description: '你的一只羊跑丢了，不过下午就被邻村的人送了回来，虚惊一场。',
    type: 'neutral',
    effect: () => {}
  }
];

// 15% 负面事件 (5个)
const negativeEvents: GameEvent[] = [
  {
    id: 'neg_001',
    name: '干旱来袭',
    description: '连续一周没有下雨，所有未浇水的作物生长速度降低50%，持续3回合。',
    type: 'negative',
    effect: (state) => {
      state.cropGrowthMultiplier = (state.cropGrowthMultiplier || 1) * 0.5;
      state.debuffs.push({ id: 'drought_debuff', duration: 3, effect: 'cropGrowth*0.5' });
    }
  },
  {
    id: 'neg_002',
    name: '虫害爆发',
    description: '农田爆发了虫害，你有20%的作物被毁坏了。',
    type: 'negative',
    effect: (state) => {
      const destroyedCount = Math.floor(state.crops.length * 0.2);
      state.crops = state.crops.slice(destroyedCount);
    }
  },
  {
    id: 'neg_003',
    name: '小偷光顾',
    description: '小偷夜里溜进了你的仓库，偷走了100金币和一半的肥料。',
    type: 'negative',
    effect: (state) => {
      state.gold = Math.max(0, state.gold - 100);
      const fertilizer = state.items.find((i: any) => i.id.includes('fertilizer'));
      if (fertilizer) fertilizer.count = Math.floor(fertilizer.count / 2);
    }
  },
  {
    id: 'neg_004',
    name: '暴风雨',
    description: '突如其来的暴风雨摧毁了你一个未完工的建筑，损失了所有投入的材料。',
    type: 'negative',
    effect: (state) => {
      const unfinishedBuilding = state.buildings.find((b: any) => !b.completed);
      if (unfinishedBuilding) {
        state.buildings = state.buildings.filter((b: any) => b.id !== unfinishedBuilding.id);
      }
    }
  },
  {
    id: 'neg_005',
    name: '动物生病',
    description: '你的部分牲畜生病了，需要花费80金币请兽医来治疗，否则它们会停止产奶/蛋3回合。',
    type: 'negative',
    effect: (state) => {
      state.pendingChoice = {
        title: '动物生病',
        options: [
          { text: '请兽医', effect: () => { state.gold = Math.max(0, state.gold -80); } },
          { text: '不治疗', effect: () => { state.animalProductMultiplier = 0; state.debuffs.push({ id: 'sick_animals', duration: 3, effect: 'animalProduct*0' }); } }
        ]
      };
    }
  }
];

export const ALL_EVENTS: GameEvent[] = [...positiveEvents, ...neutralEvents, ...negativeEvents];

// 按概率权重返回随机事件
export function getRandomEvent(): GameEvent {
  const roll = Math.random() * 100;
  if (roll < 60) {
    return positiveEvents[Math.floor(Math.random() * positiveEvents.length)];
  } else if (roll < 85) {
    return neutralEvents[Math.floor(Math.random() * neutralEvents.length)];
  } else {
    return negativeEvents[Math.floor(Math.random() * negativeEvents.length)];
  }
}
