import { Polygon, Sat, Vector } from "../dist/index.js";

var assert = require('assert');
describe('Polygon', function () {
    it('cannot be instantiated with less than three vertices', function () {
        assert.throws(() => {
            new Polygon(new Vector(0, 0), [new Vector(0, 0), new Vector(0, 0)])
        }, Error)
    });

    describe('vertices', function () {
        it('have a world position that is the sum of vertices local position and shape position.', function () {
            const polygon = new Polygon(new Vector(10, 10), [new Vector(0, 0), new Vector(10, 0), new Vector(10, 0)])

            const vertices = polygon.vertices

            assert.equal(vertices[0].x, 10)
            assert.equal(vertices[0].y, 10)
            assert.equal(vertices[1].x, 20)
            assert.equal(vertices[1].y, 10)
        });
    });

    describe('axes', function () {
        it('should be perpendicular to each side and of length 1', function () {
            const polygon = new Polygon(new Vector(0, 0), [new Vector(0, 0), new Vector(10, 0), new Vector(10, 0)])

            const axes = polygon.axes

            assert.equal(axes[1].x, 0)
            assert.equal(axes[1].y, 1)
        });
    });

    describe('centroid', function () {
        it('should be the correct value for a square', function () {
            const rectangle = new Polygon(new Vector(0, 0), [
                new Vector(0, 0),
                new Vector(10, 0),
                new Vector(10, 10),
                new Vector(0, 10)]
            )

            const centroid = rectangle.centroid

            assert.equal(centroid.x, 5)
            assert.equal(centroid.y, 5)
        });
        it('should be the correct value for a triangle', function () {
            const triangle = new Polygon(new Vector(0, 0), [
                new Vector(0, 0),
                new Vector(100, 0),
                new Vector(50, 99)
            ])

            const centroid = triangle.centroid

            assert.equal(centroid.x, 50)
            assert.equal(centroid.y, 33)
        });
    });
});