import { Polygon, Projection } from '..';
import { Vector } from '../math/vector';
import { Shape } from './shape';

/**
 * The circle is a shape that is defined by a center point and a radius.
 *
 */
export class Circle extends Shape {
  constructor(
    /**
     * The circle's radius.
     *
     */
    public radius: number,

    /**
     * The circle's center.
     *
     */
    public pos: Vector = Vector.origin
  ) {
    super(pos);
  }

  /**
   * Project the circle onto a given axis.
   *
   * @param axis
   * @returns projection
   */
  public project(axis: Vector): Projection {
    const direction = axis;
    const directionAndRadius = direction.scale(this.radius);

    const point1 = this.pos.add(directionAndRadius);
    const point2 = this.pos.sub(directionAndRadius);

    let min = point1.dot(axis);
    let max = point2.dot(axis);

    if (min > max) {
      // Swap the values
      [min, max] = [max, min];
    }

    return new Projection(min, max);
  }

  /**
   * Find the closest point on the polygon from the circle's center.
   *
   * @param polygon
   * @returns closest point
   */
  public findClosestPolygonPoint(polygon: Polygon): { minDistance: number; vertexIndex: number } {
    const vertices = polygon.vertices;
    const len = vertices.length;

    let vertexIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < len; i++) {
      const distance = this.pos.sub(vertices[i]).mag();

      if (distance < minDistance) {
        minDistance = distance;
        vertexIndex = i;
      }
    }

    return { minDistance, vertexIndex };
  }

  /**
   * Returns true if this circle contains another circle. We can provide a calculated distance
   * square root to improve performance.
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

    return this.radius <= other.radius && distanceSquareRoot <= other.radius - this.radius;
  }

  /**
   * Returns true if this circle is contained inside another circle. We can provide a calculated distance
   * square root to improve performance.
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

    return other.radius <= this.radius && distanceSquareRoot <= this.radius - other.radius;
  }

  /**
   * Returns true if this circle contains the specified point.
   *
   * @param point
   * @returns contains point
   */
  public containsPoint(point: Vector): boolean {
    const distance = point.sub(this.pos);
    const distanceSquared = distance.dot(distance);
    return distanceSquared <= this.radius * this.radius;
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
}
