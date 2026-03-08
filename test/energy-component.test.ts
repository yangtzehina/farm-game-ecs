import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { EnergyComponent } from '../dist/components.js';

describe('EnergyComponent', () => {
  let energy: EnergyComponent;

  beforeEach(() => {
    energy = new EnergyComponent();
    energy.current = 5;
    energy.max = 10;
    energy.regenPerTurn = 2;
  });

  describe('spend', () => {
    it('should decrease current energy when having enough energy', () => {
      const result = energy.spend(3);
      assert.strictEqual(result, true);
      assert.strictEqual(energy.current, 2);
    });

    it('should not decrease current energy and return false when not having enough energy', () => {
      const result = energy.spend(6);
      assert.strictEqual(result, false);
      assert.strictEqual(energy.current, 5);
    });

    it('should allow spending all current energy', () => {
      const result = energy.spend(5);
      assert.strictEqual(result, true);
      assert.strictEqual(energy.current, 0);
    });

    it('should handle spending 0 energy', () => {
        const result = energy.spend(0);
        assert.strictEqual(result, true);
        assert.strictEqual(energy.current, 5);
    });

    it('should not allow spending negative energy', () => {
        const result = energy.spend(-2);
        assert.strictEqual(result, false);
        assert.strictEqual(energy.current, 5);
    });
  });

  describe('regen', () => {
    it('should increase current energy by regenPerTurn', () => {
      energy.regen();
      assert.strictEqual(energy.current, 7);
    });

    it('should not exceed max energy', () => {
      energy.current = 9;
      energy.regen();
      assert.strictEqual(energy.current, 10);
    });

    it('should stay at max energy if already at max', () => {
      energy.current = 10;
      energy.regen();
      assert.strictEqual(energy.current, 10);
    });
  });
});
