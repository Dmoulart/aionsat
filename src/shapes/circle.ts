import { Polygon, Projection } from '..';
import { Vector } from '../math/vector';
import { Shape } from './shape';

/**
 * The circle is a shape that is defined by a center point and a radius.
 *
 */
export class Circle extends Shape {
  /**
   * The circle's radius.
   *
   */
  private _radius: number;

  /**
   * The projection direction and radius. This reserve one vector instance to perform this calculation.
   */
  private _projectionDirectionAndRadius: Vector;

  /**
   *  The first projection point. This reserve one vector instance to perform this calculation.
   */
  private _projectionPoint1: Vector;

  /**
   *  The second projection point. This reserve one vector instance to perform this calculation.
   */
  private _projectionPoint2: Vector;

  /**
   *  The distance attribute has no particular object it only reserve one vector instance to perform distance calculation.
   */
  private _distance: Vector;

  constructor(
    /**
     * Circle's have a default radius of 50.
     */
    radius = 50,
    /**
     * The circle's center.
     *
     */
    pos = Vector.origin
  ) {
    super(pos);
    // Circle can not have a radius inferior to zero.
    if (radius < 0) {
      throw new Error(`Circle was instantiated with a radius of ${radius}. Radius cannot be less than zero.`);
    }
    this._radius = radius;

    // Initialize the projection direction and radius.
    this._projectionDirectionAndRadius = Vector.infinity;

    // Initialize the projection points
    this._projectionPoint1 = Vector.infinity;
    this._projectionPoint2 = Vector.infinity;

    // Initialize the distance points
    this._distance = Vector.infinity;
  }

  /**
   * Project the circle onto a given axis.
   *
   * @param axis
   * @returns projection
   */
  public project(axis: Vector): Projection {
    this._projectionDirectionAndRadius.copy(axis).mutScale(this.radius);

    this._projectionPoint1.copy(this.pos).mutAdd(this._projectionDirectionAndRadius);

    this._projectionPoint2.copy(this.pos).mutSub(this._projectionDirectionAndRadius);

    let min = this._projectionPoint1.dot(axis);
    let max = this._projectionPoint2.dot(axis);

    if (min > max) {
      // Swap the values
      [min, max] = [max, min];
    }

    return this._projection.set(min, max);
  }

  /**
   * Find the closest point on the polygon from the circle's center.
   *
   * @param polygon
   * @returns vertexIndex
   */
  public findClosestPolygonPoint(polygon: Polygon): number {
    const vertices = polygon.vertices;
    const len = vertices.length;

    let vertexIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < len; i++) {
      const distance = this._distance.copy(this.pos).mutSub(vertices[i]).mag();

      if (distance < minDistance) {
        minDistance = distance;
        vertexIndex = i;
      }
    }

    return vertexIndex;
  }

  /**
   * Returns true if this circle contains another circle. We can provide a calculated distance
   * square root to improve performance.
   *
   *
   * @todo Not in use for now delete it ?
   *
   * @param other
   * @param distanceSquareRoot
   * @returns contains other circle
   */
  public containsCircle(other: Circle, distanceSquareRoot?: number): boolean {
    if (distanceSquareRoot === undefined) {
      const distance = this.pos.sub(other.pos);
      const distanceSquared = distance.dot(distance);
      distanceSquareRoot = Math.sqrt(distanceSquared);
    }

    return this._radius <= other._radius && distanceSquareRoot <= other._radius - this._radius;
  }

  /**
   * Returns true if this circle is contained inside another circle. We can provide a calculated distance
   * square root to improve performance.
   *
   * @todo Not in use for now delete it ?
   *
   * @param other
   * @param distanceSquareRoot
   * @returns contains other circle
   */
  public isContainedInsideCircle(other: Circle, distanceSquareRoot?: number): boolean {
    if (distanceSquareRoot === undefined) {
      const distance = this.pos.sub(other.pos);
      const distanceSquared = distance.dot(distance);
      distanceSquareRoot = Math.sqrt(distanceSquared);
    }

    return other._radius <= this._radius && distanceSquareRoot <= this._radius - other._radius;
  }

  /**
   * Returns true if this circle contains the specified point.
   *
   * @param point
   * @returns contains point
   */
  public containsPoint(point: Vector): boolean {
    this._distance.copy(point).mutSub(this.pos);
    const distanceSquared = this._distance.dot(this._distance);
    return distanceSquared <= this._radius * this._radius;
  }

  /**
   * THIS METHOD IS NOT IMPLEMENTED. Returns true if this circle is contained y the speicified polygon
   * @warning NOT_IMPLEMENTED
   * @param polygon
   * @returns contains point
   */
  public isInsidePolygon(polygon: Polygon): any {
    // const vertices = polygon.vertices
    // const len = vertices.length
    // const center = this.pos
    // let min = Infinity
    // let max = -Infinity
    // let isInside = true
    // for (let i = 0; i < len; i++) {
    //     const distance = center.dist(vertices[i])
    //     if (distance < min) {
    //         min = distance
    //     }
    //     if (distance > max) {
    //         max = distance
    //     }
    //     console.log(this.radius, 'min', min, 'max', max)
    //     if (this.radius > min)
    //         return false
    // }
    // return this.radius < min
  }

  /**
   * Get the circle's radius
   *
   * @returns circle's radius
   */
  public get radius(): number {
    return this._radius;
  }

  /**
   * Set the circle's radius
   *
   * @param radius
   */
  public set radius(radius: number) {
    // Circle can not have a radius inferior to zero.
    if (radius < 0) {
      throw new Error(`Circle cannot have a radius of ${radius}. Radius cannot be less than zero.`);
    }
    this._radius = radius;
  }
}
