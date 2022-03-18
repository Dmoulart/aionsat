import { Projection } from '..';
import { Vector } from '../math/vector';
import { Circle } from './circle';
import { Shape } from './shape';

/**
 * A polygon is a collection of vertices that form a closed shape.
 * Only convex polygons can be used for this type of collision detection.
 *
 */
export class Polygon extends Shape {
  /**
   * The vertices in their relative positions.
   *
   */
  private _vertices: Vector[] = [];

  /**
   * The vertices in their absolute positions.
   *
   */
  private _worldVertices: Vector[];

  /**
   * The axes of the polygon. The axes are normalized and perpendicular to the edges of the polygon.
   *
   */
  private _axes: Vector[];

  constructor(vertices: Vector[] = [], pos: Vector = Vector.origin) {
    super(pos);
    if (vertices.length < 3) {
      throw new Error(`Polygon has been instanciated with less than 3 vertices.`);
    }
    this._vertices = vertices;

    // Preallocate the world vertices array.
    this._worldVertices = new Array(vertices.length).fill(0).map(() => new Vector());

    // Preallocate the axes vertices array.
    this._axes = new Array(vertices.length).fill(0).map(() => new Vector());
  }

  /**
   * Project the vertices of the polygon onto a given axis.
   *
   * @param axis
   * @returns projection
   */
  public project(axis: Vector): Projection {
    const vertices = this.vertices;
    const len = vertices.length;

    // Use infinity because Number.MAX_VALUE produces unexpected results..
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < len; i++) {
      const dot = axis.dot(vertices[i]);
      if (dot < min) {
        min = dot;
      }
      if (dot > max) {
        max = dot;
      }
    }

    return new Projection(min, max);
  }

  /**
   * Returns true if the polygon contains the specified circle.
   *
   * @param b
   * @returns polygon is inside circle
   */
  public isInsideCircle(b: Circle) {
    const vertices = this.vertices;
    const len = vertices.length;
    for (let i = 0; i < len; i++) {
      if (!b.containsPoint(vertices[i])) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the vertices absolute positions of the polygon.
   *
   * @returns vertices absolute positions
   */
  public get vertices(): Vector[] {
    for (let i = 0; i < this._vertices.length; i++) {
      // Use the precedent world vertex instance to avoid creating new instances.
      this._worldVertices[i] = this._worldVertices[i]
        .copy(this.pos)
        .mutAdd(this._vertices[i]);
    }

    return this._worldVertices;
  }

  /**
   * Set the vertices relative positions.
   *
   * @param vertices relative positions
   */
  public set vertices(vertices: Vector[]) {
    this._vertices = vertices;
  }

  /**
   * Returns the axes perpendicular to the edges of the polygon.
   *
   * @returns axes
   */
  public get axes(): Vector[] {
    const vertices = this.vertices;
    const len = vertices.length;

    for (let i = 0; i < len; i++) {
      const currentVertex = vertices[i];

      // Reuse the precedent axis instance to avoid creating new instances.
      const nextVertex = this._axes[i].copy(vertices[(i + 1) % len]);

      this._axes[i] = nextVertex
        .mutSub(currentVertex)
        .mutPerp()
        .mutNorm()

    }
    return this._axes;
  }

  /**
   * Returns the center of the polygon.
   *
   * @returns centroid
   */
  public get centroid(): Vector {
    const vertices = this.vertices;
    const len = vertices.length;

    return vertices.reduce(function (center, point, i) {
      center.x += point.x;
      center.y += point.y;

      if (i === len - 1) {
        center.x /= len;
        center.y /= len;
      }

      return center;
    }, new Vector(0, 0));
  }
}
