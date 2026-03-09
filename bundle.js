(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * 🏡 农庄卡牌：田园物语 - 包含绘图功能的浏览器应用入口
 */

console.log('🏡 农庄卡牌：田园物语 - 浏览器应用入口加载');

// FarmGameEngine 类
class FarmGameEngine {
  constructor() {
    console.log('🏡 FarmGameEngine 构造函数');
    this.gameRunning = false;
    this.canvas = null;
    this.ctx = null;

    // 全量卡牌库（120张，仅展示部分核心卡）
    this.cardLibrary = [
    // 普通卡（48张）
    {
      id: 'wheat',
      name: '小麦种子',
      icon: '🌾',
      cost: 1,
      desc: '种植获得小麦',
      rarity: 'common',
      type: 'crop',
      sellPrice: 10
    }, {
      id: 'carrot',
      name: '胡萝卜种子',
      icon: '🥕',
      cost: 1,
      desc: '种植获得胡萝卜',
      rarity: 'common',
      type: 'crop',
      sellPrice: 10
    }, {
      id: 'potato',
      name: '土豆种子',
      icon: '🥔',
      cost: 1,
      desc: '种植获得土豆',
      rarity: 'common',
      type: 'crop',
      sellPrice: 12
    }, {
      id: 'tomato',
      name: '番茄种子',
      icon: '🍅',
      cost: 1,
      desc: '种植获得番茄',
      rarity: 'common',
      type: 'crop',
      sellPrice: 15
    }, {
      id: 'chicken',
      name: '小鸡',
      icon: '🐔',
      cost: 2,
      desc: '养殖获得鸡蛋',
      rarity: 'common',
      type: 'animal',
      sellPrice: 30
    }, {
      id: 'duck',
      name: '小鸭',
      icon: '🦆',
      cost: 2,
      desc: '养殖获得鸭蛋',
      rarity: 'common',
      type: 'animal',
      sellPrice: 35
    }, {
      id: 'cow',
      name: '奶牛',
      icon: '🐄',
      cost: 3,
      desc: '养殖获得牛奶',
      rarity: 'common',
      type: 'animal',
      sellPrice: 50
    }, {
      id: 'sheep',
      name: '绵羊',
      icon: '🐑',
      cost: 3,
      desc: '养殖获得羊毛',
      rarity: 'common',
      type: 'animal',
      sellPrice: 55
    }, {
      id: 'watering',
      name: '浇水',
      icon: '💧',
      cost: 1,
      desc: '所有作物产量+50%，持续1天',
      rarity: 'common',
      type: 'tool',
      sellPrice: 20
    }, {
      id: 'fertilizer',
      name: '肥料',
      icon: '💩',
      cost: 1,
      desc: '作物生长速度翻倍，持续1天',
      rarity: 'common',
      type: 'tool',
      sellPrice: 25
    },
    // 稀有卡（36张）
    {
      id: 'goldenWheat',
      name: '黄金小麦',
      icon: '🌾',
      cost: 2,
      desc: '种植获得3倍产量的小麦',
      rarity: 'uncommon',
      type: 'crop',
      sellPrice: 80
    }, {
      id: 'appleTree',
      name: '苹果树',
      icon: '🍎',
      cost: 3,
      desc: '每天产出苹果，持续10天',
      rarity: 'uncommon',
      type: 'crop',
      sellPrice: 100
    }, {
      id: 'pig',
      name: '小猪',
      icon: '🐷',
      cost: 4,
      desc: '养殖获得猪肉，价值是鸡肉的3倍',
      rarity: 'uncommon',
      type: 'animal',
      sellPrice: 120
    }, {
      id: 'mill',
      name: '磨坊',
      icon: '🏭',
      cost: 4,
      desc: '所有小麦自动加工成面粉，售价翻倍',
      rarity: 'uncommon',
      type: 'building',
      sellPrice: 150
    },
    // 史诗卡（24张）
    {
      id: 'greenHouse',
      name: '温室',
      icon: '🏡',
      cost: 5,
      desc: '所有作物不受天气影响，产量+100%',
      rarity: 'rare',
      type: 'building',
      sellPrice: 300
    }, {
      id: 'autoHarvester',
      name: '自动收割机',
      icon: '🚜',
      cost: 5,
      desc: '每天自动收割所有成熟作物，不需要手动操作',
      rarity: 'rare',
      type: 'tool',
      sellPrice: 350
    },
    // 传说卡（12张）
    {
      id: 'farmHeart',
      name: '农庄之心',
      icon: '❤️',
      cost: 6,
      desc: '所有资源产量永久+100%，全局生效',
      rarity: 'legendary',
      type: 'relic',
      sellPrice: 1000
    }];

    // 游戏状态
    this.gameState = {
      energy: 3,
      maxEnergy: 5,
      day: 1,
      money: 200,
      level: 1,
      exp: 0,
      difficulty: 'normal',
      freeRefreshUsed: false,
      resources: {
        wheat: 0,
        carrot: 0,
        potato: 0,
        tomato: 0,
        chicken: 0,
        duck: 0,
        sheep: 0,
        pig: 0,
        egg: 0,
        duckEgg: 0,
        milk: 0,
        wool: 0,
        pork: 0,
        apple: 0,
        flour: 0
      },
      handCards: [],
      shopCards: [],
      placedCards: [],
      relics: [],
      tasks: [{
        id: 'task1',
        title: '种植10颗小麦',
        description: '种植10颗小麦完成任务',
        progress: 0,
        target: 10,
        reward: {
          money: 100,
          exp: 50
        },
        completed: false
      }, {
        id: 'task2',
        title: '获得5个鸡蛋',
        description: '养殖小鸡获得5个鸡蛋',
        progress: 0,
        target: 5,
        reward: {
          money: 150,
          exp: 80
        },
        completed: false
      }, {
        id: 'task3',
        title: '升到5级',
        description: '提升等级到5级',
        progress: 0,
        target: 5,
        reward: {
          relic: {
            id: 'goldenHoe',
            name: '金锄头',
            icon: '⛏️',
            description: '传说中的金锄头',
            effect: '小麦产量+50%'
          }
        },
        completed: false
      }],
      achievements: [{
        id: 'ach1',
        name: '新手农民',
        description: '完成第一局游戏',
        icon: '🌱',
        unlocked: false
      }, {
        id: 'ach2',
        name: '小麦大亨',
        description: '累计种植100颗小麦',
        icon: '🌾',
        unlocked: false,
        progress: 0,
        target: 100
      }, {
        id: 'ach3',
        name: '养殖专家',
        description: '拥有10只鸡',
        icon: '🐔',
        unlocked: false,
        progress: 0,
        target: 10
      }, {
        id: 'ach4',
        name: '百万富翁',
        description: '累计获得1000金币',
        icon: '💰',
        unlocked: false,
        progress: 0,
        target: 1000
      }, {
        id: 'ach5',
        name: '满级大佬',
        description: '升到10级',
        icon: '⭐',
        unlocked: false,
        progress: 0,
        target: 10
      }],
      events: [{
        id: 'rain',
        name: '天降大雨',
        icon: '🌧️',
        description: '雨水滋润了土地，所有作物产量翻倍，持续1天',
        effect: () => {
          this.gameState.resources.wheat *= 2;
          this.gameState.resources.carrot *= 2;
        }
      }, {
        id: 'thief',
        name: '小偷来袭',
        icon: '🥷',
        description: '小偷偷走了你一半的金币',
        effect: () => {
          this.gameState.money = Math.floor(this.gameState.money * 0.5);
        }
      }, {
        id: 'blessing',
        name: '女神祝福',
        icon: '✨',
        description: '获得女神的祝福，能量上限+1',
        effect: () => {
          this.gameState.maxEnergy += 1;
        }
      }]
    };

    // 拖放状态
    this.draggedCard = null;

    // 组合配方
    this.combos = [{
      requires: ['wheat', 'wheat'],
      result: 'bread',
      name: '面包',
      icon: '🍞',
      desc: '2小麦合成面包'
    }, {
      requires: ['egg', 'wheat'],
      result: 'cake',
      name: '蛋糕',
      icon: '🍰',
      desc: '鸡蛋+小麦合成蛋糕'
    }, {
      requires: ['carrot', 'milk'],
      result: 'carrotCake',
      name: '胡萝卜蛋糕',
      icon: '🥕🍰',
      desc: '胡萝卜+牛奶合成胡萝卜蛋糕'
    }];
  }
  initialize() {
    console.log('🏡 FarmGameEngine 初始化');
    this.setupCanvas();
    this.setupDragAndDrop();
    this.drawInitialCards();
    this.refreshShop();
    this.loadGameState();
    this.updateUI();
    this.updateHandCardsUI();
    this.updateShopUI();
    this.drawGameScreen();
    this.autoSave();
  }

  // 抽初始手牌
  drawInitialCards() {
    const commonCards = this.cardLibrary.filter(c => c.rarity === 'common');
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * commonCards.length);
      const randomCard = commonCards[randomIndex];
      this.gameState.handCards.push({
        ...randomCard,
        level: 1,
        upgradeCost: {
          money: randomCard.sellPrice * 2
        }
      });
    }
  }

  // 刷新商店卡牌
  refreshShop() {
    this.gameState.shopCards = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * this.cardLibrary.length);
      const randomCard = this.cardLibrary[randomIndex];
      this.gameState.shopCards.push({
        ...randomCard,
        price: randomCard.sellPrice * 2
      });
    }
  }

  // 刷新手牌
  refreshHandCards() {
    if (this.gameState.freeRefreshUsed) {
      this.showMessage('⚠️ 每天只能免费刷新一次手牌！', '#e74c3c');
      return;
    }
    this.gameState.handCards = [];
    const commonCards = this.cardLibrary.filter(c => c.rarity === 'common');
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * commonCards.length);
      const randomCard = commonCards[randomIndex];
      this.gameState.handCards.push({
        ...randomCard,
        level: 1,
        upgradeCost: {
          money: randomCard.sellPrice * 2
        }
      });
    }
    this.gameState.freeRefreshUsed = true;
    this.updateUI();
    this.updateHandCardsUI();
    this.showMessage('✅ 手牌已刷新！', '#27ae60');
  }

  // 购买商店卡牌
  buyCard(cardId) {
    const card = this.gameState.shopCards.find(c => c.id === cardId);
    if (!card) return;
    if (this.gameState.money < card.price) {
      this.showMessage('⚠️ 金币不足！', '#e74c3c');
      return;
    }
    this.gameState.money -= card.price;
    this.gameState.handCards.push({
      ...card,
      level: 1,
      upgradeCost: {
        money: card.sellPrice * 3
      }
    });
    this.gameState.shopCards = this.gameState.shopCards.filter(c => c.id !== cardId);
    this.updateUI();
    this.updateHandCardsUI();
    this.updateShopUI();
    this.showMessage(`✅ 购买了${card.name}！`, '#27ae60');
  }

  // 更新手牌UI
  updateHandCardsUI() {
    const handArea = document.getElementById('handArea');
    const rarityColor = {
      common: '#3498db',
      uncommon: '#27ae60',
      rare: '#9b59b6',
      legendary: '#e67e22'
    };
    handArea.innerHTML = this.gameState.handCards.map(card => `
      <div class="card" draggable="true" data-card-id="${card.id}" data-cost="${card.cost}" style="width: 100px; height: 140px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 10px; text-align: center; cursor: grab; border: 2px solid ${rarityColor[card.rarity]};">
        <div style="font-size: 2em; margin-bottom: 5px;">${card.icon}</div>
        <div style="font-weight: bold; font-size: 0.9em; margin-bottom: 5px;">${card.name}</div>
        <div style="font-size: 0.7em; color: #7f8c8d; margin-bottom: 3px;">${card.desc}</div>
        <div style="font-size: 0.7em; color: ${rarityColor[card.rarity]}; margin-bottom: 3px;">Lv.${card.level}</div>
        <div style="font-size: 0.8em; color: #f39c12;">⚡ ${card.cost}</div>
      </div>
    `).join('');
  }

  // 更新商店UI
  updateShopUI() {
    const shopArea = document.getElementById('shopArea');
    const rarityColor = {
      common: '#3498db',
      uncommon: '#27ae60',
      rare: '#9b59b6',
      legendary: '#e67e22'
    };
    shopArea.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h4 style="margin: 0;">🛒 每日商店</h4>
        <button class="btn btn-sm btn-primary" onclick="window.FarmGameApp.refreshHandCards()">🔄 刷新手牌（每日免费1次）</button>
      </div>
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        ${this.gameState.shopCards.map(card => `
          <div style="width: 100px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 10px; text-align: center; border: 2px solid ${rarityColor[card.rarity]};">
            <div style="font-size: 2em; margin-bottom: 5px;">${card.icon}</div>
            <div style="font-weight: bold; font-size: 0.9em; margin-bottom: 5px;">${card.name}</div>
            <div style="font-size: 0.7em; color: #7f8c8d; margin-bottom: 5px;">${card.desc}</div>
            <div style="font-size: 0.8em; color: #f39c12; margin-bottom: 8px;">💰 ${card.price}</div>
            <button class="btn btn-sm btn-success" onclick="window.FarmGameApp.buyCard('${card.id}')" style="padding: 3px 8px; font-size: 0.8em;">购买</button>
          </div>
        `).join('')}
      </div>
    `;
  }
  setupCanvas() {
    // 获取 Canvas 元素
    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) {
      console.error('❌ Canvas 元素未找到');
      return;
    }

    // 获取 2D 绘图上下文
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('❌ Canvas 上下文获取失败');
      return;
    }
    console.log('🎨 Canvas 初始化完成');
  }
  setupDragAndDrop() {
    // 卡牌拖放
    const handArea = document.getElementById('handArea');
    const gameArea = document.querySelector('.game-area');

    // 开始拖放
    handArea.addEventListener('dragstart', e => {
      if (e.target.classList.contains('card')) {
        this.draggedCard = {
          id: e.target.dataset.cardId,
          cost: parseInt(e.target.dataset.cost),
          element: e.target
        };
        e.target.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    // 结束拖放
    handArea.addEventListener('dragend', e => {
      if (e.target.classList.contains('card')) {
        e.target.style.opacity = '1';
        this.draggedCard = null;
      }
    });

    // 拖放经过游戏区域
    gameArea.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    // 放置卡牌到游戏区域
    gameArea.addEventListener('drop', e => {
      e.preventDefault();
      if (this.draggedCard && this.gameRunning) {
        this.playCard(this.draggedCard, e.offsetX, e.offsetY);
      }
    });
    console.log('🎴 拖放系统初始化完成');
  }
  playCard(card, x, y) {
    // 检查能量是否足够
    if (this.gameState.energy < card.cost) {
      this.showMessage('⚡ 能量不足！', '#e74c3c');
      return;
    }

    // 扣除能量
    this.gameState.energy -= card.cost;

    // 添加到已放置卡牌
    const cardData = this.gameState.handCards.find(c => c.id === card.id);
    this.gameState.placedCards.push({
      ...cardData,
      x: x - 50,
      y: y - 70
    });

    // 计算产量加成（遗物/难度加成）
    let yieldMultiplier = 1;
    if (this.gameState.difficulty === 'easy') yieldMultiplier *= 1.2;
    if (this.gameState.difficulty === 'hard') yieldMultiplier *= 0.8;
    if (this.gameState.relics.find(r => r.id === 'goldenHoe') && card.id === 'wheat') yieldMultiplier *= 1.5;
    // 卡牌等级加成
    yieldMultiplier *= 1 + (cardData.level - 1) * 0.5;

    // 增加对应资源
    if (card.id === 'wheat') {
      const amount = Math.round(1 * yieldMultiplier);
      this.gameState.resources.wheat += amount;
      this.updateTaskProgress('task1', amount);
      this.updateAchievementProgress('ach2', amount);
    }
    if (card.id === 'carrot') this.gameState.resources.carrot += Math.round(1 * yieldMultiplier);
    if (card.id === 'chicken') {
      const amount = Math.round(1 * yieldMultiplier);
      this.gameState.resources.chicken += amount;
      this.updateAchievementProgress('ach3', amount);
    }
    if (card.id === 'cow') this.gameState.resources.milk += Math.round(2 * yieldMultiplier);

    // 鸡蛋概率产出
    if (card.id === 'chicken' && Math.random() > 0.5) {
      const eggAmount = Math.round(1 * yieldMultiplier);
      this.gameState.resources.egg += eggAmount;
      this.updateTaskProgress('task2', eggAmount);
    }

    // 增加经验
    this.gameState.exp += card.cost * 10;
    this.checkLevelUp();

    // 检查组合
    this.checkCombos();

    // 更新UI和重绘
    this.updateUI();
    this.drawGameScreen();
    this.saveGameState();
    this.showMessage(`✅ 打出了${cardData.name}！`, '#27ae60');
  }
  checkLevelUp() {
    const expNeeded = this.gameState.level * 100;
    if (this.gameState.exp >= expNeeded) {
      this.gameState.exp -= expNeeded;
      this.gameState.level += 1;
      this.gameState.maxEnergy += 1;
      this.gameState.money += this.gameState.level * 50;

      // 更新任务和成就进度
      this.updateTaskProgress('task3', 1);
      this.updateAchievementProgress('ach5', 1);
      if (this.gameState.level >= 1) {
        this.unlockAchievement('ach1');
      }
      this.showMessage(`🎉 升级到${this.gameState.level}级！获得${this.gameState.level * 50}金币，最大能量+1！`, '#9b59b6');
    }
  }
  checkCombos() {
    const availableCombos = [];
    const resourceCounts = this.gameState.resources;
    for (const combo of this.combos) {
      let hasAll = true;
      const tempCounts = {
        ...resourceCounts
      };
      for (const req of combo.requires) {
        if (tempCounts[req] <= 0) {
          hasAll = false;
          break;
        }
        tempCounts[req] -= 1;
      }
      if (hasAll) {
        availableCombos.push(combo);
      }
    }
    const comboHint = document.getElementById('comboHint');
    const comboList = document.getElementById('comboList');
    if (availableCombos.length > 0) {
      comboHint.style.display = 'block';
      comboList.innerHTML = availableCombos.map(combo => `
        <div style="background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="font-size: 1.2em;">${combo.icon} ${combo.name}</div>
          <div style="font-size: 0.8em; color: #7f8c8d;">${combo.desc}</div>
          <button onclick="window.FarmGameApp.makeCombo('${combo.result}')" style="margin-top: 5px; padding: 5px 10px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">合成</button>
        </div>
      `).join('');
    } else {
      comboHint.style.display = 'none';
    }
  }
  makeCombo(comboResult) {
    const combo = this.combos.find(c => c.result === comboResult);
    if (!combo) return;

    // 扣除所需资源
    for (const req of combo.requires) {
      this.gameState.resources[req] -= 1;
    }

    // 增加奖励
    if (combo.result === 'bread') {
      this.gameState.money += 20;
      this.gameState.energy = Math.min(this.gameState.maxEnergy, this.gameState.energy + 1);
    }
    if (combo.result === 'cake') {
      this.gameState.money += 50;
      this.gameState.exp += 30;
    }
    if (combo.result === 'carrotCake') {
      this.gameState.money += 80;
      this.gameState.energy = this.gameState.maxEnergy;
    }
    this.checkLevelUp();
    this.updateUI();
    this.checkCombos();
    this.saveGameState();
    this.showMessage(`🎉 合成了${combo.name}！`, '#f39c12');
  }
  updateUI() {
    // 更新统计数据
    document.getElementById('energyCount').textContent = `${this.gameState.energy}/${this.gameState.maxEnergy}`;
    document.getElementById('dayCount').textContent = this.gameState.day;
    document.getElementById('moneyCount').textContent = this.gameState.money;
    document.getElementById('levelCount').textContent = this.gameState.level;
    document.getElementById('expCount').textContent = `${Math.round(this.gameState.exp / (this.gameState.level * 100) * 100)}%`;

    // 更新资源
    document.getElementById('wheatCount').textContent = this.gameState.resources.wheat;
    document.getElementById('carrotCount').textContent = this.gameState.resources.carrot;
    document.getElementById('chickenCount').textContent = this.gameState.resources.chicken;
    document.getElementById('eggCount').textContent = this.gameState.resources.egg;
    document.getElementById('milkCount').textContent = this.gameState.resources.milk;
  }
  drawTestScreen() {
    this.drawGameScreen();
  }
  drawGameScreen() {
    if (!this.ctx || !this.canvas) {
      console.error('❌ Canvas 未初始化');
      return;
    }

    // 清除画布
    this.ctx.fillStyle = '#f0f8ff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制草地背景
    this.ctx.fillStyle = '#8bc34a';
    this.ctx.fillRect(0, 250, this.canvas.width, 200);

    // 绘制天空
    this.ctx.fillStyle = '#bbdefb';
    this.ctx.fillRect(0, 0, this.canvas.width, 250);

    // 绘制太阳
    this.ctx.beginPath();
    this.ctx.arc(700, 80, 40, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#ffeb3b';
    this.ctx.fill();
    this.ctx.strokeStyle = '#fbc02d';
    this.ctx.lineWidth = 5;
    this.ctx.stroke();

    // 绘制云朵
    this.drawCloud(100, 100);
    this.drawCloud(300, 70);
    this.drawCloud(500, 120);

    // 绘制小房子
    this.drawHouse(60, 200);

    // 绘制已放置的卡牌
    for (const card of this.gameState.placedCards) {
      this.drawPlacedCard(card);
    }

    // 绘制游戏状态文字
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`🏡 农庄卡牌：田园物语  |  第${this.gameState.day}天`, 20, 40);
    if (!this.gameRunning) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 36px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🎮 点击"开始游戏"按钮开始', this.canvas.width / 2, this.canvas.height / 2);
    }
  }
  drawCloud(x, y) {
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 20, 0, Math.PI * 2);
    this.ctx.arc(x + 25, y, 30, 0, Math.PI * 2);
    this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    this.ctx.fill();
  }
  drawHouse(x, y) {
    // 房子主体
    this.ctx.fillStyle = '#8b4513';
    this.ctx.fillRect(x, y, 80, 70);
    // 屋顶
    this.ctx.fillStyle = '#d32f2f';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 10, y);
    this.ctx.lineTo(x + 40, y - 40);
    this.ctx.lineTo(x + 90, y);
    this.ctx.fill();
    // 门
    this.ctx.fillStyle = '#5d4037';
    this.ctx.fillRect(x + 30, y + 30, 20, 40);
    // 窗户
    this.ctx.fillStyle = '#bbdefb';
    this.ctx.fillRect(x + 10, y + 10, 20, 20);
    this.ctx.fillRect(x + 50, y + 10, 20, 20);
  }
  drawPlacedCard(card) {
    // 卡牌背景
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(card.x, card.y, 100, 140);
    this.ctx.strokeStyle = '#3498db';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(card.x, card.y, 100, 140);

    // 卡牌内容
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(card.icon, card.x + 50, card.y + 40);
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText(card.name, card.x + 50, card.y + 70);
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = '#7f8c8d';
    this.ctx.fillText(card.desc, card.x + 50, card.y + 95);
    this.ctx.fillStyle = '#f39c12';
    this.ctx.fillText(`⚡ ${card.cost}`, card.x + 50, card.y + 120);
  }
  showMessage(text, color) {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${color || '#2c3e50'};
      color: white;
      padding: 15px 30px;
      border-radius: 25px;
      font-size: 18px;
      font-weight: bold;
      z-index: 1000;
      animation: fadeInOut 2s ease forwards;
    `;
    messageEl.textContent = text;
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(messageEl);
    setTimeout(() => {
      messageEl.remove();
      style.remove();
    }, 2000);
  }

  // ==========================================
  // 事件弹窗相关
  // ==========================================
  triggerRandomEvent() {
    if (Math.random() > 0.3) return; // 30%概率触发事件
    const event = this.gameState.events[Math.floor(Math.random() * this.gameState.events.length)];
    this.showEventModal(event);
  }
  showEventModal(event) {
    const modal = document.getElementById('eventModal');
    document.getElementById('eventIcon').textContent = event.icon;
    document.getElementById('eventTitle').textContent = event.name;
    document.getElementById('eventDescription').textContent = event.description;
    const optionsEl = document.getElementById('eventOptions');
    optionsEl.innerHTML = `
      <button class="btn btn-primary" onclick="window.FarmGameApp.confirmEvent('${event.id}')">接受</button>
      <button class="btn btn-danger" onclick="window.FarmGameApp.closeEventModal()">拒绝</button>
    `;
    modal.style.display = 'flex';
  }
  confirmEvent(eventId) {
    const event = this.gameState.events.find(e => e.id === eventId);
    if (event) {
      event.effect();
      this.showMessage(`✅ 触发了${event.name}事件！`, '#27ae60');
      this.updateUI();
      this.saveGameState();
    }
    this.closeEventModal();
  }
  closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
  }

  // ==========================================
  // 遗物相关
  // ==========================================
  unlockRelic(relic) {
    this.gameState.relics.push(relic);

    // 显示遗物解锁动画
    const modal = document.getElementById('relicModal');
    document.getElementById('relicIcon').textContent = relic.icon;
    document.getElementById('relicName').textContent = relic.name;
    document.getElementById('relicDescription').textContent = relic.description;
    document.getElementById('relicEffect').textContent = `效果：${relic.effect}`;
    modal.style.display = 'flex';
  }
  closeRelicModal() {
    document.getElementById('relicModal').style.display = 'none';
  }
  showRelicsPage() {
    const modal = document.getElementById('achievementsPage'); // 复用成就弹窗样式
    const title = modal.querySelector('h2');
    const listEl = document.getElementById('achievementsList');
    title.textContent = '🏺 我的遗物';
    listEl.innerHTML = '';
    if (this.gameState.relics.length === 0) {
      listEl.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #7f8c8d;">还没有获得任何遗物</p>';
    } else {
      this.gameState.relics.forEach(relic => {
        listEl.innerHTML += `
          <div class="achievement-item unlocked">
            <div style="font-size: 2em; margin-bottom: 10px;">${relic.icon}</div>
            <h4 style="margin: 0 0 5px 0;">${relic.name}</h4>
            <p style="font-size: 0.8em; color: #7f8c8d; margin: 0;">${relic.description}</p>
            <p style="font-size: 0.8em; color: #27ae60; margin: 5px 0 0 0;">${relic.effect}</p>
          </div>
        `;
      });
    }
    modal.style.display = 'flex';
  }

  // ==========================================
  // 任务面板相关
  // ==========================================
  showTaskPanel() {
    const panel = document.getElementById('taskPanel');
    const listEl = document.getElementById('taskList');
    listEl.innerHTML = '';
    this.gameState.tasks.forEach(task => {
      const progress = Math.min(100, Math.round(task.progress / task.target * 100));
      let actionBtn = '';
      if (progress >= 100 && !task.completed) {
        actionBtn = `<button class="btn btn-success btn-sm" onclick="window.FarmGameApp.submitTask('${task.id}')">提交任务</button>`;
      } else if (task.completed) {
        actionBtn = '<span style="color: #27ae60; font-weight: bold;">已完成</span>';
      }
      listEl.innerHTML += `
        <div class="task-item ${task.completed ? 'completed' : ''}">
          <h4 style="margin: 0 0 5px 0;">${task.title}</h4>
          <p style="font-size: 0.9em; color: #7f8c8d; margin: 0 0 10px 0;">${task.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1; margin-right: 15px;">
              <div style="background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: #3498db; height: 100%; width: ${progress}%; transition: width 0.3s ease;"></div>
              </div>
              <div style="font-size: 0.8em; color: #7f8c8d; margin-top: 5px;">${task.progress}/${task.target}</div>
            </div>
            ${actionBtn}
          </div>
        </div>
      `;
    });
    panel.style.display = 'flex';
  }
  closeTaskPanel() {
    document.getElementById('taskPanel').style.display = 'none';
  }
  submitTask(taskId) {
    const task = this.gameState.tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;
    task.completed = true;

    // 发放奖励
    if (task.reward.money) this.gameState.money += task.reward.money;
    if (task.reward.exp) {
      this.gameState.exp += task.reward.exp;
      this.checkLevelUp();
    }
    if (task.reward.relic) {
      this.unlockRelic(task.reward.relic);
    }
    this.showMessage(`✅ 完成任务：${task.title}，获得奖励！`, '#27ae60');
    this.updateUI();
    this.saveGameState();
    this.showTaskPanel(); // 刷新面板
  }
  updateTaskProgress(taskId, addAmount) {
    const task = this.gameState.tasks.find(t => t.id === taskId && !t.completed);
    if (task) {
      task.progress = Math.min(task.target, task.progress + addAmount);
    }
  }

  // ==========================================
  // 成就相关
  // ==========================================
  showAchievementsPage() {
    const modal = document.getElementById('achievementsPage');
    const title = modal.querySelector('h2');
    const listEl = document.getElementById('achievementsList');
    title.textContent = '🏆 成就系统';
    listEl.innerHTML = '';
    this.gameState.achievements.forEach(achievement => {
      listEl.innerHTML += `
        <div class="achievement-item ${achievement.unlocked ? 'unlocked' : ''}">
          <div style="font-size: 2em; margin-bottom: 10px;">${achievement.icon}</div>
          <h4 style="margin: 0 0 5px 0;">${achievement.name}</h4>
          <p style="font-size: 0.8em; color: #7f8c8d; margin: 0 0 5px 0;">${achievement.description}</p>
          ${achievement.target ? `<p style="font-size: 0.7em; color: #95a5a6; margin: 0;">${achievement.progress || 0}/${achievement.target}</p>` : ''}
        </div>
      `;
    });
    modal.style.display = 'flex';
  }
  closeAchievementsPage() {
    document.getElementById('achievementsPage').style.display = 'none';
  }
  unlockAchievement(achievementId) {
    const achievement = this.gameState.achievements.find(a => a.id === achievementId && !a.unlocked);
    if (!achievement) return;
    achievement.unlocked = true;

    // 显示成就解锁动画
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #f39c12;
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      font-size: 20px;
      font-weight: bold;
      z-index: 1001;
      animation: achievementUnlock 1s ease forwards;
      text-align: center;
    `;
    messageEl.innerHTML = `
      <div style="font-size: 2em; margin-bottom: 5px;">🏆</div>
      <div>解锁成就：${achievement.name}</div>
    `;
    document.body.appendChild(messageEl);
    setTimeout(() => {
      messageEl.remove();
    }, 3000);
    this.saveGameState();
  }
  updateAchievementProgress(achievementId, addAmount) {
    const achievement = this.gameState.achievements.find(a => a.id === achievementId && !a.unlocked && a.target);
    if (achievement) {
      achievement.progress = Math.min(achievement.target, (achievement.progress || 0) + addAmount);
      if (achievement.progress >= achievement.target) {
        this.unlockAchievement(achievementId);
      }
    }
  }

  // ==========================================
  // 难度选择相关
  // ==========================================
  showDifficultySelect() {
    const modal = document.getElementById('difficultySelect');
    const diffNames = {
      easy: '简单模式',
      normal: '普通模式',
      hard: '困难模式'
    };
    document.getElementById('currentDifficulty').textContent = diffNames[this.gameState.difficulty];
    modal.style.display = 'flex';
  }
  closeDifficultySelect() {
    document.getElementById('difficultySelect').style.display = 'none';
  }
  selectDifficulty(difficulty) {
    if (confirm(`确定要切换到${difficulty === 'easy' ? '简单' : difficulty === 'normal' ? '普通' : '困难'}模式吗？游戏进度将会重置！`)) {
      this.gameState.difficulty = difficulty;
      this.resetGame();
      this.closeDifficultySelect();
    }
  }

  // ==========================================
  // 卡牌升级相关
  // ==========================================
  showCardUpgrade() {
    const modal = document.getElementById('cardUpgradeModal');
    const listEl = document.getElementById('upgradeableCards');
    listEl.innerHTML = '';
    this.gameState.handCards.forEach(card => {
      const canUpgrade = Object.keys(card.upgradeCost).every(resource => {
        if (resource === 'money') return this.gameState.money >= card.upgradeCost[resource];
        return this.gameState.resources[resource] >= card.upgradeCost[resource];
      });
      const costText = Object.keys(card.upgradeCost).map(resource => {
        const icon = {
          money: '💰',
          wheat: '🌾',
          carrot: '🥕',
          egg: '🥚',
          milk: '🥛'
        }[resource];
        return `${icon} ${card.upgradeCost[resource]}`;
      }).join(' ');
      listEl.innerHTML += `
        <div class="upgrade-card-item">
          <div>
            <div style="font-weight: bold; margin-bottom: 5px;">${card.icon} ${card.name} Lv.${card.level}</div>
            <div style="font-size: 0.9em; color: #7f8c8d;">升级消耗：${costText}</div>
            <div style="font-size: 0.8em; color: #27ae60;">升级后：能量消耗-1，产量+50%</div>
          </div>
          <button class="btn ${canUpgrade ? 'btn-primary' : 'btn-secondary'}" ${!canUpgrade ? 'disabled' : ''} onclick="window.FarmGameApp.upgradeCard('${card.id}')">升级</button>
        </div>
      `;
    });
    modal.style.display = 'flex';
  }
  closeCardUpgrade() {
    document.getElementById('cardUpgradeModal').style.display = 'none';
  }
  upgradeCard(cardId) {
    const card = this.gameState.handCards.find(c => c.id === cardId);
    if (!card) return;

    // 扣除消耗
    Object.keys(card.upgradeCost).forEach(resource => {
      if (resource === 'money') {
        this.gameState.money -= card.upgradeCost[resource];
      } else {
        this.gameState.resources[resource] -= card.upgradeCost[resource];
      }
    });

    // 升级卡牌
    card.level += 1;
    card.cost = Math.max(1, card.cost - 1);
    // 升级消耗翻倍
    Object.keys(card.upgradeCost).forEach(resource => {
      card.upgradeCost[resource] = Math.round(card.upgradeCost[resource] * 1.5);
    });
    this.showMessage(`✅ ${card.name} 升级到 Lv.${card.level}！`, '#27ae60');
    this.updateUI();
    this.saveGameState();
    this.showCardUpgrade(); // 刷新面板
  }

  // ==========================================
  // 卡组管理相关
  // ==========================================
  showDeckManage() {
    const modal = document.getElementById('deckManageModal');
    const listEl = document.getElementById('deckCards');
    listEl.innerHTML = '';
    this.gameState.handCards.forEach(card => {
      listEl.innerHTML += `
        <div class="deck-card-item">
          <div>
            <div style="font-weight: bold;">${card.icon} ${card.name}</div>
            <div style="font-size: 0.9em; color: #7f8c8d;">能量消耗：${card.cost} | 等级：Lv.${card.level}</div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="window.FarmGameApp.deleteCard('${card.id}')">删除</button>
        </div>
      `;
    });
    modal.style.display = 'flex';
  }
  closeDeckManage() {
    document.getElementById('deckManageModal').style.display = 'none';
  }
  deleteCard(cardId) {
    if (confirm('确定要删除这张卡牌吗？删除后无法恢复！')) {
      this.gameState.handCards = this.gameState.handCards.filter(c => c.id !== cardId);
      this.showMessage('✅ 卡牌已删除', '#27ae60');
      this.saveGameState();
      this.showDeckManage(); // 刷新面板
    }
  }
  start() {
    if (this.gameRunning) {
      console.log('🎮 游戏已在运行');
      return;
    }
    console.log('🎮 游戏开始');
    this.gameRunning = true;

    // 每天恢复能量
    this.gameState.energy = this.gameState.maxEnergy;
    this.updateUI();
    this.drawGameScreen();
    this.showMessage('🎮 游戏开始！打出卡牌消耗能量，用完后点击「进入下一天」恢复能量哦~', '#27ae60');
  }
  nextDay() {
    if (!this.gameRunning) {
      this.showMessage('⚠️ 请先开始游戏！', '#e74c3c');
      return;
    }
    console.log('🌅 进入下一天');

    // 天数增加
    this.gameState.day += 1;

    // 恢复能量
    this.gameState.energy = this.gameState.maxEnergy;

    // 自动产出资源
    this.gameState.resources.egg += this.gameState.resources.chicken;
    this.gameState.resources.milk += this.gameState.resources.chicken >= 2 ? 1 : 0;

    // 卖掉多余的资源获得金币
    const sellWheat = Math.max(0, this.gameState.resources.wheat - 5);
    const sellCarrot = Math.max(0, this.gameState.resources.carrot - 3);
    const sellEgg = Math.max(0, this.gameState.resources.egg - 10);
    const earnMoney = sellWheat * 5 + sellCarrot * 8 + sellEgg * 3;
    this.gameState.money += earnMoney;
    this.updateAchievementProgress('ach4', earnMoney);

    // 刷新商店和手牌刷新次数
    this.refreshShop();
    this.gameState.freeRefreshUsed = false;
    this.updateUI();
    this.updateHandCardsUI();
    this.updateShopUI();
    this.checkCombos();
    this.drawGameScreen();
    this.saveGameState();
    this.showMessage(`🌅 第${this.gameState.day}天开始！能量已充满！商店已刷新！`, '#27ae60');

    // 触发随机事件
    setTimeout(() => {
      this.triggerRandomEvent();
    }, 1000);
  }
  pause() {
    if (!this.gameRunning) {
      console.log('⏸️ 游戏已暂停');
      return;
    }
    this.gameRunning = false;
    console.log('⏸️ 游戏暂停');
    this.drawGameScreen();
    this.saveGameState();
  }
  resetGame() {
    if (confirm('确定要重置游戏吗？所有进度将会丢失！')) {
      console.log('🔄 游戏重置');
      this.gameRunning = false;
      this.gameState = {
        energy: 3,
        maxEnergy: 5,
        day: 1,
        money: 100,
        level: 1,
        exp: 0,
        resources: {
          wheat: 0,
          carrot: 0,
          chicken: 0,
          egg: 0,
          milk: 0
        },
        handCards: [{
          id: 'wheat',
          name: '小麦种子',
          icon: '🌾',
          cost: 1,
          desc: '种植获得小麦'
        }, {
          id: 'carrot',
          name: '胡萝卜种子',
          icon: '🥕',
          cost: 1,
          desc: '种植获得胡萝卜'
        }, {
          id: 'chicken',
          name: '小鸡',
          icon: '🐔',
          cost: 2,
          desc: '养殖获得鸡蛋'
        }, {
          id: 'cow',
          name: '奶牛',
          icon: '🐄',
          cost: 3,
          desc: '养殖获得牛奶'
        }],
        placedCards: []
      };
      localStorage.removeItem('farmGameSave');
      this.updateUI();
      this.checkCombos();
      this.drawGameScreen();
      this.showMessage('✅ 游戏已重置', '#27ae60');
    }
  }
  clearCache() {
    if (confirm('确定要清除缓存吗？会删除本地存档！')) {
      console.log('🔄 清除缓存');
      localStorage.removeItem('farmGameSave');
      this.showMessage('✅ 缓存已清除', '#27ae60');
    }
  }
  saveGameState() {
    try {
      localStorage.setItem('farmGameSave', JSON.stringify(this.gameState));
      console.log('💾 游戏已保存');
    } catch (e) {
      console.error('❌ 保存游戏失败', e);
    }
  }
  loadGameState() {
    try {
      const saved = localStorage.getItem('farmGameSave');
      if (saved) {
        const savedState = JSON.parse(saved);
        // 兼容旧存档，补全新字段
        this.gameState = {
          ...this.gameState,
          ...savedState,
          // 补全新增的字段
          freeRefreshUsed: savedState.freeRefreshUsed ?? false,
          shopCards: savedState.shopCards ?? [],
          // 补全新增的资源
          resources: {
            wheat: 0,
            carrot: 0,
            potato: 0,
            tomato: 0,
            chicken: 0,
            duck: 0,
            sheep: 0,
            pig: 0,
            egg: 0,
            duckEgg: 0,
            milk: 0,
            wool: 0,
            pork: 0,
            apple: 0,
            flour: 0,
            ...savedState.resources
          }
        };
        console.log('📂 游戏已加载');
        this.showMessage('✅ 成功加载存档', '#27ae60');
      }
    } catch (e) {
      console.error('❌ 加载游戏失败', e);
      // 加载失败就重置游戏状态
      localStorage.removeItem('farmGameSave');
      this.showMessage('⚠️ 存档损坏，已重置游戏', '#e74c3c');
    }
  }
  autoSave() {
    setInterval(() => {
      if (this.gameRunning) {
        this.saveGameState();
      }
    }, 10000); // 10秒自动保存一次
  }
}

// 立即暴露和初始化
window.FarmGameEngine = FarmGameEngine;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const engine = new FarmGameEngine();
  engine.initialize();
  window.FarmGameApp = engine;
  console.log('✅ 游戏引擎初始化完成');
  console.log('🚀 window.FarmGameApp:', window.FarmGameApp);
});

},{}]},{},[1]);
