import { Vector } from ".";
import { Circle } from "./shapes/circle";
import { Polygon } from "./shapes/polygon";
import { Shape } from "./shapes/shape";

/**
 * An implementation of the Separating Axis Theorem, greatly inspired from the dyn4j blog post.
 * https://dyn4j.org/2010/01/sat/
 * 
 */
export class Sat {

    /**
     * Detect the collision between two shapes and return the overlap value as well as the
     * collision normal.
     * 
     * @param shape 
     * @param otherShape
     * @returns collision response 
     */
    public intersects(a: Shape, b: Shape): {
        normal: Vector,
        overlap: number
    } | false {

        if (a instanceof Polygon && b instanceof Polygon)
            return this.polygonIntersectsPolgon(a, b)

        if (a instanceof Circle && b instanceof Circle)
            return this.circleIntersectsCircle(a, b)

        if (a instanceof Polygon && b instanceof Circle)
            return this.polygonIntersectsCircle(a, b)

        if (a instanceof Circle && b instanceof Polygon)
            return this.circleIntersectsPolygon(a, b)


        console.warn(`Unsupported collision detection between ${a.constructor.name} and ${b.constructor.name}`, a, b)


        return false
    }

    /**
     * Detect the collision between two polygons and return the overlap value as well as the
     * collision normal.
     * 
     * @param polyA 
     * @param polyB
     * @returns collision response 
     */
    public polygonIntersectsPolgon(a: Polygon, b: Polygon): {
        normal: Vector,
        overlap: number
    } | false {
        const axesA = a.axes;
        const axesB = b.axes;

        const lenA = axesA.length;
        const lenB = axesB.length;

        let overlap = Number.MAX_VALUE
        let normal: Vector = Vector.origin

        let last

        // Project onto each axis of the first shape

        for (let i = 0; i < lenA; i++) {
            const axis = axesA[i];

            const projectionA = a.project(axis);
            const projectionB = b.project(axis);

            if (!projectionA.overlap(projectionB)) {
                return false;
            }
            else {
                const o = projectionA.getOverlap(projectionB);
                if (o < overlap) {
                    overlap = o;
                    normal = axis
                    last = 'a'
                }
            }
        }


        // Project onto each axis of the second Shape

        for (let i = 0; i < lenB; i++) {
            const axis = axesB[i]

            const projectionA = a.project(axis);
            const projectionB = b.project(axis);

            if (!projectionA.overlap(projectionB)) {
                return false;
            }
            else {
                const o = projectionA.getOverlap(projectionB);
                if (o < overlap) {
                    overlap = o;
                    normal = axis
                    last = 'b'
                }
            }
        }

        // If the smallest penetration normal points into shape b flip it
        if (a.centroid.sub(b.centroid).dot(normal) < 0)
            normal = normal.negate()

        console.log(a.pos, 'a pos')
        console.log(b.pos, 'b pos')
        console.log(last)
        console.log(normal)
        console.log('overlap', overlap)

        return {
            normal,
            overlap
        }
    }


    /**
     * Detect the collision between two circles and return the overlap value as well as the
     * collision normal.
     * 
     * @param a circle
     * @param b other circle
     * @returns collision response
     */
    public circleIntersectsCircle(a: Circle, b: Circle): false | { normal: Vector; overlap: number; } {
        const distance = a.pos.sub(b.pos);
        const distanceSquared = distance.dot(distance);

        const radiusSum = a.radius + b.radius;

        if (distanceSquared > radiusSum * radiusSum) return false;

        return {
            normal: new Vector(
                distance.x / Math.sqrt(distanceSquared),
                distance.y / Math.sqrt(distanceSquared)
            ),
            overlap: radiusSum - Math.sqrt(distanceSquared)
        }
    }


    /**
     * Detect the collision between a polygon and a circle and return the overlap value as well as the
     * collision normal.
     * 
     * @param a polygon
     * @param b circle
     * @returns collision response
     */
    public polygonIntersectsCircle(a: Polygon, b: Circle): false | { normal: Vector; overlap: number; } {
        let overlap = Number.MAX_VALUE
        let normal: Vector

        const axes = a.axes;
        const len = axes.length

        for (let i = 0; i < len; i++) {
            const axis = axes[i]
            const projectionA = a.project(axis)
            const projectionB = b.project(axis)

            if (!projectionA.overlap(projectionB)) {
                return false;
            }
            else {
                const overlapValue = projectionA.getOverlap(projectionB);
                if (overlapValue < overlap) {
                    overlap = overlapValue;
                    normal = axis
                }
            }
        }

        const { vertexIndex } = b.findClosestPolygonPoint(a)
        const closestPoint = a.vertices[vertexIndex]

        const axis = closestPoint.sub(b.pos).norm()

        const projectionA = a.project(axis)
        const projectionB = b.project(axis)

        if (!projectionA.overlap(projectionB)) {
            return false;
        }
        else {
            const overlapValue = projectionA.getOverlap(projectionB);

            if (overlapValue < overlap) {
                overlap = overlapValue;
                normal = axis
            }
        }

        if (a.centroid.sub(b.pos).dot(normal) < 0)
            normal = normal.negate()

        return {
            normal,
            overlap
        }
    }

    /**
     * Detect the collision between a circle and a polygon and return the overlap value as well as the
     * collision normal.
     * 
     * @param a circle
     * @param b polygon
     * @returns collision response
     */
    public circleIntersectsPolygon(a: Circle, b: Polygon): false | { normal: Vector; overlap: number; } {
        const response = this.polygonIntersectsCircle(b, a)

        if (!response) return false

        return {
            normal: response.normal.negate(),
            overlap: response.overlap
        }
    }
}

