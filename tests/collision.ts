import { Polygon, Sat, Vector } from '../dist/index.js';
import { Collision } from '../dist/sat.js';
import { Circle } from '../dist/shapes/circle.js';

var assert = require('assert');
describe('Collisions', function () {
  describe('Polygon', function () {
    it('should intersects triangle', function () {
      const square = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(0, 0)
      );

      const triangle = new Polygon([new Vector(0, 0), new Vector(30, 0), new Vector(0, 30)], new Vector(30, 0));

      const collision = new Sat().intersects(square, triangle);

      assert(collision && collision.overlap === 10);
    });

    it('should intersects square', function () {
      const squareA = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(0, 0)
      );

      const squareB = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(30, 0)
      );

      const collision = new Sat().intersects(squareA, squareB);

      assert(collision && collision.overlap === 10);
    });

    it('should not intersects square', function () {
      const squareA = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(0, 0)
      );

      const squareB = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(50, 0)
      );

      const collision = new Sat().intersects(squareA, squareB);

      assert(!collision);
    });

    it('should not intersects triangle', function () {
      const square = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(0, 0)
      );

      const triangle = new Polygon([new Vector(0, 0), new Vector(30, 0), new Vector(0, 30)], new Vector(50, 0));

      const collision = new Sat().intersects(square, triangle);

      assert(!collision);
    });

    it('should intersects circle', function () {
      const poly = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(0, 0)
      );

      const circle = new Circle(20, new Vector(20, 20));

      const collision = new Sat().intersects(poly, circle);

      assert(collision);
    });

    it('should not intersects circle', function () {
      const poly = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(0, 0)
      );

      const circle = new Circle(20, new Vector(80, 0));

      const collision = new Sat().intersects(poly, circle);

      assert(!collision);
    });

    it('should be inside square and square should not be inside polygon', function () {
      const squareA = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(20, 20)
      );

      const squareB = new Polygon(
        [new Vector(0, 0), new Vector(10, 0), new Vector(10, 10), new Vector(0, 10)],
        new Vector(30, 30)
      );

      const collision = new Sat().intersects(squareA, squareB);

      assert(collision && !collision.aInB && collision.bInA);
    });

    it('should not be inside square and square should not be inside polygon', function () {
      const squareA = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(20, 20)
      );

      const squareB = new Polygon(
        [new Vector(0, 0), new Vector(10, 0), new Vector(10, 10), new Vector(0, 10)],
        new Vector(55, 55)
      );

      const collision = new Sat().intersects(squareA, squareB);

      assert(collision && !collision.aInB && !collision.bInA);
    });

    it('should not be inside circle', function () {
      const square = new Polygon(
        [new Vector(0, 0), new Vector(10, 0), new Vector(10, 10), new Vector(0, 10)],
        new Vector(15, 15)
      );

      const circle = new Circle(20, new Vector(20, 20));

      const collision = new Sat().intersects(circle, square);

      assert(collision && !collision.aInB);
    });

    it('should be inside circle', function () {
      const square = new Polygon(
        [new Vector(0, 0), new Vector(10, 0), new Vector(10, 10), new Vector(0, 10)],
        new Vector(20, 20)
      );

      const circle = new Circle(60, new Vector(0, 0));

      const collision = new Sat().intersects(square, circle);

      assert(collision && collision.aInB);
    });
  });

  describe('Circle', function () {
    it('should intersects circle', function () {
      const circleA = new Circle(20, new Vector(70, 0));

      const circleB = new Circle(20, new Vector(80, 0));

      const collision = new Sat().intersects(circleA, circleB);

      assert(collision);
    });

    it('should not intersects circle', function () {
      const circleA = new Circle(20, new Vector(70, 0));

      const circleB = new Circle(20, new Vector(120, 0));

      const collision = new Sat().intersects(circleA, circleB);

      assert(!collision);
    });

    it('should intersects polygon', function () {
      const circle = new Circle(20, new Vector(0, 0));

      const square = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(15, 0)
      );

      const collision = new Sat().intersects(circle, square);

      assert(collision);
    });

    it('should not intersects polygon', function () {
      const circle = new Circle(20, new Vector(0, 0));

      const square = new Polygon(
        [new Vector(0, 0), new Vector(40, 0), new Vector(40, 40), new Vector(0, 40)],
        new Vector(25, 0)
      );

      const collision = new Sat().intersects(circle, square);

      assert(!collision);
    });

    it('should be inside circle', function () {
      const circleA = new Circle(20, new Vector(0, 0));

      const circleB = new Circle(2, new Vector(5, 5));

      const collision = new Sat().intersects(circleA, circleB);

      assert(collision && collision.bInA);
    });

    it('should not be inside circle', function () {
      const circleA = new Circle(20, new Vector(0, 0));

      const circleB = new Circle(10, new Vector(15, 15));

      const collision = new Sat().intersects(circleA, circleB);

      assert(collision && !collision.bInA);
    });

    // it('should not be inside polygon', function () {
    //     const circle = new Circle(new Vector(30, 30), 20)

    //     const square = new Polygon(new Vector(30, 30), [
    //         new Vector(0, 0),
    //         new Vector(40, 0),
    //         new Vector(40, 40),
    //         new Vector(0, 40)
    //     ])

    //     const collision = new Sat().intersects(circle, square)

    //     assert(collision && !collision.aInB)
    // });

    // it('should be inside polygon', function () {
    //     const circle = new Circle(new Vector(30, 30), 2)

    //     const square = new Polygon(new Vector(20, 20), [
    //         new Vector(0, 0),
    //         new Vector(40, 0),
    //         new Vector(40, 40),
    //         new Vector(0, 40)
    //     ])

    //     const collision = new Sat().intersects(circle, square)

    //     assert(collision && collision.aInB)
    // });
  });
});
