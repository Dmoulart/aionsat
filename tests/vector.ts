import { Vector } from '../dist/index.js';

var assert = require('assert');
describe('Vector', function () {
  describe('normalize', function () {
    it('should always have a length of one or minus one', function () {
      const vec = new Vector(924, 543);
      const normalized = vec.norm();
      assert.equal(Math.round(Math.abs(normalized.mag())), 1);
    });
  });
});
