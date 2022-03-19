import { Polygon, Sat, Vector } from '../dist/index.js';

var assert = require('assert');
describe('Polygon', function () {
  it('cannot be instantiated with less than three vertices', function () {
    assert.throws(() => {
      new Polygon([new Vector(0, 0), new Vector(0, 0)] as any, new Vector(0, 0));
    }, Error);
  });

  describe('vertices', function () {
    it('have a world position that is the sum of vertices local position and shape position.', function () {
      const polygon = new Polygon([new Vector(0, 0), new Vector(10, 0), new Vector(10, 0)], new Vector(10, 10));

      const vertices = polygon.vertices;

      assert.equal(vertices[0].x, 10);
      assert.equal(vertices[0].y, 10);

      assert.equal(vertices[1].x, 20);
      assert.equal(vertices[1].y, 10);
    });
  });

  describe('axes', function () {
    it('should be perpendicular to each side and of length 1', function () {
      const polygon = new Polygon([new Vector(0, 0), new Vector(10, 0), new Vector(10, 0)], new Vector(0, 0));

      const axes = polygon.axes;

      assert.equal(axes[1].x, 0);
      assert.equal(axes[1].y, 1);
    });
  });

  describe('centroid', function () {
    it('should be the correct value for a square', function () {
      const rectangle = new Polygon(
        [new Vector(0, 0), new Vector(10, 0), new Vector(10, 10), new Vector(0, 10)],
        new Vector(0, 0)
      );

      const centroid = rectangle.centroid;

      assert.equal(centroid.x, 5);
      assert.equal(centroid.y, 5);
    });
    it('should be the correct value for a triangle', function () {
      const triangle = new Polygon([new Vector(0, 0), new Vector(100, 0), new Vector(50, 99)], new Vector(0, 0));

      const centroid = triangle.centroid;

      assert.equal(centroid.x, 50);
      assert.equal(centroid.y, 33);
    });
  });

  describe('recalc', function () {
    it('should cache the global vertices positions if the polygon has not moved since last time it calculated it', function () {
      const rectangle = new Polygon(
        [new Vector(0, 0), new Vector(10, 0), new Vector(10, 10), new Vector(0, 10)],
        new Vector(0, 0)
      );

      const triangle = new Polygon([new Vector(0, 0), new Vector(100, 0), new Vector(50, 99)], new Vector(0, 0));

      const sat = new Sat()

      sat.intersects(rectangle, triangle);

      // Rectangle last position was unknown (just instantiated) before the intersection 
      // so it has been registered now. Next check the recalc will be setted to false
      assert.equal(rectangle.recalc, true);

      sat.intersects(rectangle, triangle);

      // The rectangle position hasn't changed so the recalc should have been setted to false at the beginning of the collision check
      assert.equal(rectangle.recalc, false);

    });
    it('should recalculate the global vertices positions if the polygon has moved since last time', function () {
      const rectangle = new Polygon(
        [new Vector(0, 0), new Vector(10, 0), new Vector(10, 10), new Vector(0, 10)],
        new Vector(0, 0)
      );

      const triangle = new Polygon([new Vector(0, 0), new Vector(100, 0), new Vector(50, 99)], new Vector(0, 0));

      const sat = new Sat()

      sat.intersects(rectangle, triangle);

      // Rectangle last position was unknown (just instantiated) before the intersection so it has been registered now.
      assert.equal(rectangle.recalc, true);

      // Move the rectangle
      rectangle.pos = new Vector(10, 10);

      sat.intersects(rectangle, triangle);

      // The rectangle position has changed so the recalc should have been setted to true at the beginning of the collision
      assert.equal(rectangle.recalc, true);

    });
  });
});
