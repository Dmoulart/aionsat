import { Vector } from '.';
import { Circle } from './shapes/circle';
import { Polygon } from './shapes/polygon';
import { Shape } from './shapes/shape';

/**
 * The collision data returned by the SAT intersection methods.
 * It consists of :
 * - a: the first shape
 * - b: the second shape
 * - normal : it is the collision axis
 * - overlap : the penetration coefficient
 * - aInB : true if the shape A is fully inside the shape B
 * - bInA: true if the shape B is fully inside the shape A
 *
 */
export type Collision = {
  a: Shape;
  b: Shape;
  normal: Vector;
  overlap: number;
  aInB: boolean;
  bInA: boolean;
};

/**
 * An implementation of the Separating Axis Theorem, greatly inspired from the dyn4j blog post.
 * https://dyn4j.org/2010/01/sat/
 *
 */
export class Sat {

  /**
   * The collision response object returned by the SAT intersection methods.
   * We use only one of it to avoid creating new objects for each collision.
   */
  private _response: Collision | false = {
    a: new Circle(0, Vector.zero),
    b: new Circle(0, Vector.zero),
    normal: Vector.zero,
    overlap: 0,
    aInB: false,
    bInA: false,
  };

  /**
   * Detect the collision between two shapes and return the overlap value as well as the
   * collision normal.
   *
   * @param shape
   * @param otherShape
   * @returns collision response
   */
  public intersects(a: Shape, b: Shape): Collision | false {
    if (a instanceof Polygon && b instanceof Polygon) return this.polygonIntersectsPolgon(a, b);

    if (a instanceof Circle && b instanceof Circle) return this.circleIntersectsCircle(a, b);

    if (a instanceof Polygon && b instanceof Circle) return this.polygonIntersectsCircle(a, b);

    if (a instanceof Circle && b instanceof Polygon) return this.circleIntersectsPolygon(a, b);

    console.warn(`Unsupported collision detection between ${a.constructor.name} and ${b.constructor.name}`, a, b);

    return false;
  }

  /**
   * Detect the collision between two polygons and return the overlap value as well as the
   * collision normal.
   *
   * @param a the first polygon
   * @param b the second polygon
   * @returns collision response
   */
  public polygonIntersectsPolgon(a: Polygon, b: Polygon): Collision | false {
    // Calculate vertices and axes of the polygons and cache the result
    a.calculate()
    b.calculate()

    // Get the axes of the two polygons
    // By doing so we also calculate their vertices global positions and cache them
    const axesA = a.axes;
    const axesB = b.axes;

    const lenA = axesA.length;
    const lenB = axesB.length;

    let overlap = Number.MAX_VALUE;
    let normal = Vector.origin;

    let aInB = true;
    let bInA = true;
    let noContainment = false;

    // Project onto each axis of the first shape

    for (let i = 0; i < lenA; i++) {
      const axis = axesA[i];

      const projectionA = a.project(axis);
      const projectionB = b.project(axis);

      if (!projectionA.overlap(projectionB)) {
        return false;
      } else {
        const o = projectionA.getOverlap(projectionB);
        if (o < overlap) {
          overlap = o;
          normal = axis;
        }

        if (noContainment) continue;

        if (projectionA.min < projectionB.min && projectionA.max > projectionB.max) {
          aInB = true;
          bInA = false;
        }
        if (projectionB.min > projectionA.min && projectionB.max < projectionA.max) {
          bInA = true;
          aInB = false;
        }
        // If one axis prove there is no containment then we can stop checking
        else if (!noContainment) {
          noContainment = true;
        }
      }
    }

    // Project onto each axis of the second shape

    for (let i = 0; i < lenB; i++) {
      const axis = axesB[i];

      const projectionA = a.project(axis);
      const projectionB = b.project(axis);

      if (!projectionA.overlap(projectionB)) {
        return false;
      } else {
        const o = projectionA.getOverlap(projectionB);
        if (o < overlap) {
          overlap = o;
          normal = axis;
        }

        if (noContainment) continue;

        if (projectionA.min < projectionB.min && projectionA.max > projectionB.max) {
          aInB = true;
          bInA = false;
        }
        if (projectionB.min > projectionA.min && projectionB.max < projectionA.max) {
          bInA = true;
          aInB = false;
        }
        // If one axis prove there is no containment then we can stop checking
        else if (!noContainment) {
          noContainment = true;
        }
      }
    }

    if (noContainment) {
      aInB = false;
      bInA = false;
    }

    // If the smallest penetration normal points into shape b flip it
    if (a.centroid.sub(b.centroid).dot(normal) < 0)
      normal.mutNegate();

    // This seems to be a little faster than affecting the object directly
    (<Collision>this._response).a = a;
    (<Collision>this._response).b = b;
    (<Collision>this._response).normal = normal;
    (<Collision>this._response).overlap = overlap;
    (<Collision>this._response).aInB = aInB;
    (<Collision>this._response).bInA = bInA;

    return this._response
  }

  /**
   * Detect the collision between two circles and return the overlap value as well as the
   * collision normal.
   *
   * @param a the first circle
   * @param b the second circle
   * @returns collision response
   */
  public circleIntersectsCircle(a: Circle, b: Circle): Collision | false {
    const distance = a.pos.sub(b.pos);
    const distanceSquared = distance.dot(distance);

    const radiusSum = a.radius + b.radius;

    if (distanceSquared > radiusSum * radiusSum) return false;

    const distanceSquareRoot = Math.sqrt(distanceSquared);

    // Give the normal an arbitrary 1,0 normal if the distance is 0
    const normal =
      distanceSquareRoot !== 0
        ? new Vector(distance.x / distanceSquareRoot, distance.y / distanceSquareRoot)
        : new Vector(1, 0);

    const overlap = radiusSum - distanceSquareRoot;

    const aInB = a.radius <= b.radius && distanceSquareRoot <= b.radius - a.radius;
    const bInA = b.radius <= a.radius && distanceSquareRoot <= a.radius - b.radius;

    return {
      a,
      b,
      normal,
      overlap,
      aInB: aInB,
      bInA: bInA
    };
  }

  /**
   * Detect the collision between a polygon and a circle and return the overlap value as well as the
   * collision normal.
   *
   * @param a the polygon
   * @param b the circle
   * @returns collision response
   */
  public polygonIntersectsCircle(a: Polygon, b: Circle): Collision | false {
    let overlap: number = Number.MAX_VALUE;
    let normal: Vector = Vector.origin;

    const axes = a.axes;
    const len = axes.length;

    let aInB: boolean;
    let bInA: boolean;

    for (let i = 0; i < len; i++) {
      const axis = axes[i];
      const projectionA = a.project(axis);
      const projectionB = b.project(axis);

      if (!projectionA.overlap(projectionB)) {
        return false;
      } else {
        const overlapValue = projectionA.getOverlap(projectionB);
        if (overlapValue < overlap) {
          overlap = overlapValue;
          normal = axis;
        }
      }
    }

    const { vertexIndex } = b.findClosestPolygonPoint(a);
    const closestPoint = a.vertices[vertexIndex];

    const axis = closestPoint.sub(b.pos).norm();

    const projectionA = a.project(axis);
    const projectionB = b.project(axis);

    if (!projectionA.overlap(projectionB)) {
      return false;
    } else {
      const overlapValue = projectionA.getOverlap(projectionB);

      if (overlapValue < overlap) {
        overlap = overlapValue;
        normal = axis;
      }
    }

    if (a.centroid.sub(b.pos).dot(normal) < 0) normal = normal.negate();

    aInB = a.isInsideCircle(b);

    // This method is not implemented for now
    bInA = false;

    return {
      a,
      b,
      normal,
      overlap,
      aInB,
      bInA
    };
  }

  /**
   * Detect the collision between a circle and a polygon and return the overlap value as well as the
   * collision normal.
   *
   * @param a the circle
   * @param b the polygon
   * @returns collision response
   */
  public circleIntersectsPolygon(a: Circle, b: Polygon): Collision | false {
    const response = this.polygonIntersectsCircle(b, a);

    if (!response) return false;

    return {
      a,
      b,
      normal: response.normal.negate(),
      overlap: response.overlap,
      aInB: response.bInA,
      bInA: response.aInB
    };
  }


  /**
   * The last collision response registered by the SAT collision detection.
   * Warning : this response is mutated at every intersection method call
   * 
   * @return collision response or false if no collision has been detected
   */
  public get response(): Collision | false {
    return this._response;
  }

}
