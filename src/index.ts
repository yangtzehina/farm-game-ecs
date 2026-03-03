#!/usr/bin/env node

/**
 * 🏡 农庄卡牌：田园物语 - 游戏启动入口
 *
 * Flecs风格ECS架构实现
 */

import { FarmGameEngine, createGameEngine } from './engine';
import { FarmGameUIManager } from './ui';
import chalk from 'chalk';
import figlet from 'figlet';

// ==========================================
// 游戏入口 - Game Entry Point
// ==========================================

console.clear();
console.log(chalk.green('🏡 农庄卡牌：田园物语 - 初始化'));
console.log(chalk.blue('=' . repeat(50)));
console.log();

try {
  // 显示欢迎信息
  figlet('农庄卡牌', (err, data) => {
    if (err) {
      console.log('🏡 农庄卡牌：田园物语');
    } else {
      console.log(data);
    }
    
    console.log();
    console.log(chalk.cyan('🏆 开始您的田园冒险'));
    console.log(chalk.yellow('🚜 种植作物，养殖动物，管理农庄'));
    console.log(chalk.green('✨ 升级卡牌，解锁新能力'));
    console.log(chalk.red('🌍 探索肉鸽模式，挑战高难度'));
    console.log();
    
    // 启动游戏
    initializeGame();
  });
  
} catch (error) {
  console.error(chalk.red('🚨 游戏启动失败'));
  console.error(chalk.red(error instanceof Error ? error.message : String(error)));
}

// ==========================================
// 初始化游戏 - Initialize Game
// ==========================================

async function initializeGame() {
  try {
    console.log(chalk.yellow('🔄 初始化游戏引擎...'));
    
    // 等待1秒让动画效果完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 初始化游戏引擎
    const engine = createGameEngine();
    engine.initialize();
    
    // 创建UI管理器
    const uiManager = new FarmGameUIManager(engine);
    uiManager.initialize();
    
    // 显示系统信息
    displaySystemInfo(engine);
    
    // 启动游戏循环
    uiManager.startGameLoop();
    
    console.log(chalk.green('✅ 游戏引擎初始化完成！'));
    
  } catch (error) {
    console.error(chalk.red('🚨 游戏初始化错误'));
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    
    // 显示错误详情
    if (error instanceof Error) {
      console.error(chalk.gray(error.stack));
    }
  }
}

// ==========================================
// 显示系统信息 - Display System Information
// ==========================================

function displaySystemInfo(engine: FarmGameEngine) {
  console.log();
  console.log(chalk.blue('📊 系统信息'));
  console.log(chalk.gray('-' . repeat(50)));
  
  try {
    const stats = engine.getStats();
    
    console.log(chalk.cyan(`🎮 状态: ${engine.getGameState()}`));
    console.log(chalk.cyan(`⏱️  FPS: ${stats.fps}`));
    console.log(chalk.cyan(`📦 实体数: ${stats.entities}`));
    console.log(chalk.cyan(`🔧 系统数: ${stats.systems}`));
    console.log(chalk.cyan(`📝 组件总数: ${stats.totalComponents}`));
    console.log(chalk.cyan(`💾 内存使用: ${stats.memory} MB`));
    
  } catch (error) {
    console.error(chalk.red('🚨 系统信息获取失败'));
  }
  
  console.log();
}

// ==========================================
// 版本信息 - Version Information
// ==========================================

const VERSION_INFO = {
  game: '1.0.0',
  engine: '1.0.0',
  architecture: 'Flecs-style ECS',
  date: '2026年',
  features: [
    '🏡 农庄管理',
    '🎴 卡牌升级',
    '🔄 肉鸽模式',
    '🌍 实时世界',
    '🎨 视觉效果',
    '🎮 游戏状态'
  ]
};

// 导出到模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VERSION_INFO,
    createGameEngine,
    initializeGame
  };
}
