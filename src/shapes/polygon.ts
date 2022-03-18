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


  /**
   * The axis projection of the polygon. We keep a reference to it so we do not have to instantiate a new 
   * one each time we must calculate it.
   */
  private _projection: Projection

  /**
   * The center of the polygon, in aboslute coordinates.
   */
  private _centroid: Vector;


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

    // Initialize the projection instance we'll recycle.
    this._projection = new Projection();

    // Initialize the centroid instance we'll recycle.
    this._centroid = new Vector();
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

    return this._projection.set(min, max);
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
        .copy(this.pos)             // Get the current position.
        .mutAdd(this._vertices[i]); // Add the vertex relative position.
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
   * Use it to find the separating axis.
   *
   * @returns axes
   */
  public get axes(): Vector[] {
    const vertices = this.vertices;
    const len = vertices.length;

    for (let i = 0; i < len; i++) {
      // Reuse the precedent axis instance to avoid creating new instances.
      this._axes[i] = this._axes[i]
        .copy(vertices[(i + 1) % len]) // Get the next vertex.
        .mutSub(vertices[i])           // Substract the next vertex with the current vertex.
        .mutPerp()                     // Get the perpendicular vector.
        .mutNorm()                     // Normalize it to get the unit vector
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

    this._centroid.set(0, 0)

    for (let i = 0; i < len; i++) {
      this._centroid.mutAdd(vertices[i]);

      if (i === len - 1) {
        this._centroid.x /= len;
        this._centroid.y /= len;
      }
    }

    return this._centroid;
  }
}
