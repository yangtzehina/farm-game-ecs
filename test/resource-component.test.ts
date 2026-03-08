import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResourceComponent } from '../src/components.js';

describe('ResourceComponent', () => {
  describe('addResource', () => {
    it('should add resource correctly when under max limit', () => {
      const rc = new ResourceComponent();

      // Initially "金币" is 0. Adding 100 should succeed.
      assert.equal(rc.resources['金币'], 0);
      const result = rc.addResource('金币', 100);

      assert.equal(result, true);
      assert.equal(rc.resources['金币'], 100);
    });

    it('should fail to add resource if it exceeds max storage', () => {
      const rc = new ResourceComponent();

      // Exceed max storage (10000 for "金币")
      const result = rc.addResource('金币', rc.maxStorage['金币'] + 1);

      assert.equal(result, false);
      assert.equal(rc.resources['金币'], 0); // Unchanged
    });

    it('should add resource exactly up to the max limit', () => {
      const rc = new ResourceComponent();

      const result = rc.addResource('金币', rc.maxStorage['金币']);

      assert.equal(result, true);
      assert.equal(rc.resources['金币'], rc.maxStorage['金币']);
    });

    it('should fail if resource type does not exist', () => {
      const rc = new ResourceComponent();

      const result = rc.addResource('invalid_resource_type', 100);

      assert.equal(result, false);
      // Ensure 'invalid_resource_type' isn't accidentally added
      assert.equal(rc.resources['invalid_resource_type'], undefined);
    });

    it('should be able to add multiple times as long as it does not exceed max limit', () => {
        const rc = new ResourceComponent();

        assert.equal(rc.addResource('木材', 100), true);
        assert.equal(rc.addResource('木材', 200), true);

        assert.equal(rc.resources['木材'], 300);
    });
  });

  describe('removeResource', () => {
    it('should remove resource correctly when sufficient amount exists', () => {
        const rc = new ResourceComponent();
        rc.addResource('石头', 500);

        const result = rc.removeResource('石头', 200);
        assert.equal(result, true);
        assert.equal(rc.resources['石头'], 300);
    });

    it('should fail to remove resource when removing more than available', () => {
        const rc = new ResourceComponent();
        rc.addResource('石头', 500);

        const result = rc.removeResource('石头', 600);
        assert.equal(result, false);
        assert.equal(rc.resources['石头'], 500); // Unchanged
    });

    it('should fail to remove resource if type does not exist', () => {
        const rc = new ResourceComponent();

        const result = rc.removeResource('invalid_resource_type', 100);
        assert.equal(result, false);
    });

    it('should remove exactly all available resources', () => {
        const rc = new ResourceComponent();
        rc.addResource('石头', 500);

        const result = rc.removeResource('石头', 500);
        assert.equal(result, true);
        assert.equal(rc.resources['石头'], 0);
    });
  });
});
