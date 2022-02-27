import { Polygon, Sat, Vector } from "../dist/index.js";
import { Circle } from "../dist/shapes/circle.js";

var assert = require('assert');
describe('Collisions', function () {

    describe('Polygon', function () {
        it('should intersects triangle', function () {
            const square = new Polygon(new Vector(0, 0), [
                new Vector(0, 0),
                new Vector(40, 0),
                new Vector(40, 40),
                new Vector(0, 40)
            ])

            const triangle = new Polygon(new Vector(30, 0), [
                new Vector(0, 0),
                new Vector(30, 0),
                new Vector(0, 30)
            ])

            const collision = new Sat().intersects(square, triangle)

            assert(collision && collision.overlap === 10)
        });

        it('should intersects square', function () {
            const squareA = new Polygon(new Vector(0, 0), [
                new Vector(0, 0),
                new Vector(40, 0),
                new Vector(40, 40),
                new Vector(0, 40)
            ])

            const squareB = new Polygon(new Vector(30, 0), [
                new Vector(0, 0),
                new Vector(40, 0),
                new Vector(40, 40),
                new Vector(0, 40)
            ])

            const collision = new Sat().intersects(squareA, squareB)

            assert(collision && collision.overlap === 10)
        });

        it('should not intersects square', function () {
            const squareA = new Polygon(new Vector(0, 0), [
                new Vector(0, 0),
                new Vector(40, 0),
                new Vector(40, 40),
                new Vector(0, 40)
            ])

            const squareB = new Polygon(new Vector(50, 0), [
                new Vector(0, 0),
                new Vector(40, 0),
                new Vector(40, 40),
                new Vector(0, 40)
            ])

            const collision = new Sat().intersects(squareA, squareB)

            assert(!collision)
        });

        it('should not intersects triangle', function () {
            const square = new Polygon(new Vector(0, 0), [
                new Vector(0, 0),
                new Vector(40, 0),
                new Vector(40, 40),
                new Vector(0, 40)
            ])

            const triangle = new Polygon(new Vector(50, 0), [
                new Vector(0, 0),
                new Vector(30, 0),
                new Vector(0, 30)
            ])

            const collision = new Sat().intersects(square, triangle)

            assert(!collision)
        });

        it('should intersects circle', function () {
            const poly = new Polygon(new Vector(0, 0), [
                new Vector(0, 0),
                new Vector(40, 0),
                new Vector(40, 40),
                new Vector(0, 40)
            ])

            const circle = new Circle(new Vector(20, 20), 20)

            const collision = new Sat().intersects(poly, circle)

            assert(collision)
        });

        it('should not intersects circle', function () {
            const poly = new Polygon(new Vector(0, 0), [
                new Vector(0, 0),
                new Vector(40, 0),
                new Vector(40, 40),
                new Vector(0, 40)
            ])

            const circle = new Circle(new Vector(80, 0), 20)

            const collision = new Sat().intersects(poly, circle)

            assert(!collision)
        });

    })

    describe('Circle', function () {
        it('should intersects circle', function () {
            const circleA = new Circle(new Vector(70, 0), 20)

            const circleB = new Circle(new Vector(80, 0), 20)

            const collision = new Sat().intersects(circleA, circleB)

            assert(collision)
        });

        it('should not intersects circle', function () {
            const circleA = new Circle(new Vector(70, 0), 20)

            const circleB = new Circle(new Vector(100, 0), 20)

            const collision = new Sat().intersects(circleA, circleB)

            assert(collision)
        });
    })
});