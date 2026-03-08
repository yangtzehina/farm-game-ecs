/**
 * 🏡 农庄卡牌：田园物语 - 包含绘图功能的浏览器应用入口
 */

// console.log('🏡 农庄卡牌：田园物语 - 浏览器应用入口加载');

// FarmGameEngine 类
class FarmGameEngine {
  constructor() {
    // 调试模式
    this.debug = false;
    this.log('🏡 FarmGameEngine 构造函数');
    this.gameRunning = false;
    this.canvas = null;
    this.ctx = null;
    
    // 游戏状态
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
      handCards: [
        { id: 'wheat', name: '小麦种子', icon: '🌾', cost: 1, desc: '种植获得小麦' },
        { id: 'carrot', name: '胡萝卜种子', icon: '🥕', cost: 1, desc: '种植获得胡萝卜' },
        { id: 'chicken', name: '小鸡', icon: '🐔', cost: 2, desc: '养殖获得鸡蛋' },
        { id: 'cow', name: '奶牛', icon: '🐄', cost: 3, desc: '养殖获得牛奶' }
      ],
      placedCards: []
    };
    
    // 拖放状态
    this.draggedCard = null;
    
    // 组合配方
    this.combos = [
      { requires: ['wheat', 'wheat'], result: 'bread', name: '面包', icon: '🍞', desc: '2小麦合成面包' },
      { requires: ['egg', 'wheat'], result: 'cake', name: '蛋糕', icon: '🍰', desc: '鸡蛋+小麦合成蛋糕' },
      { requires: ['carrot', 'milk'], result: 'carrotCake', name: '胡萝卜蛋糕', icon: '🥕🍰', desc: '胡萝卜+牛奶合成胡萝卜蛋糕' }
    ];
  }

  log(...args) {
    if (this.debug) {
      console.log(...args);
    }
  }

  initialize() {
    this.log('🏡 FarmGameEngine 初始化');
    this.setupCanvas();
    this.setupDragAndDrop();
    this.loadGameState();
    this.updateUI();
    this.drawGameScreen();
    this.autoSave();
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

    this.log('🎨 Canvas 初始化完成');
  }

  setupDragAndDrop() {
    // 卡牌拖放
    const handArea = document.getElementById('handArea');
    const gameArea = document.querySelector('.game-area');

    // 开始拖放
    handArea.addEventListener('dragstart', (e) => {
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
    handArea.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('card')) {
        e.target.style.opacity = '1';
        this.draggedCard = null;
      }
    });

    // 拖放经过游戏区域
    gameArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    // 放置卡牌到游戏区域
    gameArea.addEventListener('drop', (e) => {
      e.preventDefault();
      if (this.draggedCard && this.gameRunning) {
        this.playCard(this.draggedCard, e.offsetX, e.offsetY);
      }
    });

    this.log('🎴 拖放系统初始化完成');
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

    // 增加对应资源
    if (card.id === 'wheat') this.gameState.resources.wheat += 1;
    if (card.id === 'carrot') this.gameState.resources.carrot += 1;
    if (card.id === 'chicken') this.gameState.resources.chicken += 1;
    if (card.id === 'cow') this.gameState.resources.milk += 2;

    // 鸡蛋概率产出
    if (card.id === 'chicken' && Math.random() > 0.5) {
      this.gameState.resources.egg += 1;
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
      this.showMessage(`🎉 升级到${this.gameState.level}级！获得${this.gameState.level * 50}金币，最大能量+1！`, '#9b59b6');
    }
  }

  checkCombos() {
    const availableCombos = [];
    const resourceCounts = this.gameState.resources;

    for (const combo of this.combos) {
      let hasAll = true;
      const tempCounts = {...resourceCounts};
      
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
      comboList.innerHTML = '';
      availableCombos.forEach(combo => {
        const card = document.createElement('div');
        card.style.cssText = 'background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';

        const title = document.createElement('div');
        title.style.fontSize = '1.2em';
        title.textContent = `${combo.icon} ${combo.name}`;
        card.appendChild(title);

        const desc = document.createElement('div');
        desc.style.cssText = 'font-size: 0.8em; color: #7f8c8d;';
        desc.textContent = combo.desc;
        card.appendChild(desc);

        const btn = document.createElement('button');
        btn.style.cssText = 'margin-top: 5px; padding: 5px 10px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;';
        btn.textContent = '合成';
        btn.onclick = () => {
          if (window.FarmGameApp) {
            window.FarmGameApp.makeCombo(combo.result);
          }
        };
        card.appendChild(btn);

        comboList.appendChild(card);
      });
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

  start() {
    if (this.gameRunning) {
      this.log('🎮 游戏已在运行');
      return;
    }

    this.log('🎮 游戏开始');
    this.gameRunning = true;
    
    // 每天恢复能量
    this.gameState.energy = this.gameState.maxEnergy;
    this.updateUI();
    this.drawGameScreen();
    this.dayLoop();
  }

  dayLoop() {
    if (!this.gameRunning) return;
    
    setTimeout(() => {
      if (!this.gameRunning) return;
      
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
      this.gameState.money += sellWheat * 5 + sellCarrot * 8 + sellEgg * 3;
      
      this.updateUI();
      this.checkCombos();
      this.drawGameScreen();
      this.saveGameState();
      
      this.dayLoop();
    }, 30000); // 30秒一天
  }

  pause() {
    if (!this.gameRunning) {
      this.log('⏸️ 游戏已暂停');
      return;
    }

    this.gameRunning = false;
    this.log('⏸️ 游戏暂停');
    this.drawGameScreen();
    this.saveGameState();
  }

  resetGame() {
    if (confirm('确定要重置游戏吗？所有进度将会丢失！')) {
      this.log('🔄 游戏重置');
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
        handCards: [
          { id: 'wheat', name: '小麦种子', icon: '🌾', cost: 1, desc: '种植获得小麦' },
          { id: 'carrot', name: '胡萝卜种子', icon: '🥕', cost: 1, desc: '种植获得胡萝卜' },
          { id: 'chicken', name: '小鸡', icon: '🐔', cost: 2, desc: '养殖获得鸡蛋' },
          { id: 'cow', name: '奶牛', icon: '🐄', cost: 3, desc: '养殖获得牛奶' }
        ],
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
      this.log('🔄 清除缓存');
      localStorage.removeItem('farmGameSave');
      this.showMessage('✅ 缓存已清除', '#27ae60');
    }
  }

  saveGameState() {
    try {
      localStorage.setItem('farmGameSave', JSON.stringify(this.gameState));
      this.log('💾 游戏已保存');
    } catch (e) {
      console.error('❌ 保存游戏失败', e);
    }
  }

  loadGameState() {
    try {
      const saved = localStorage.getItem('farmGameSave');
      if (saved) {
        this.gameState = JSON.parse(saved);
        this.log('📂 游戏已加载');
        this.showMessage('✅ 成功加载存档', '#27ae60');
      }
    } catch (e) {
      console.error('❌ 加载游戏失败', e);
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
  // engine.log('✅ 游戏引擎初始化完成');
  // engine.log('🚀 window.FarmGameApp:', window.FarmGameApp);
});
