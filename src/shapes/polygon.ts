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
   * 
   */
  private _projection: Projection

  /**
   * The center of the polygon, in aboslute coordinates.
   * 
   */
  private _centroid: Vector;

  /**
   * Specify if we must recalculate the vertices positions and the axes.
   * It is triggered to false when they have been setted in the beginning of the 
   * collision detection. It is then setted to true at the end of the collision detection.
   * 
   */
  private _recalc: boolean;

  /**
   * The last position of the polygon. It includes its first vertex and last vertex for comparison
   * 
   */
  private _lastPos: Vector

  constructor(vertices: Vector[] = [], pos: Vector = Vector.origin) {
    super(pos);

    if (vertices.length < 3)
      throw new Error(`Polygon has been instanciated with less than 3 vertices.`);

    // Affect the relative positions vertices.
    this._vertices = vertices;

    // Preallocate the world vertices array.
    this._worldVertices = new Array(vertices.length).fill(0).map(() => new Vector());

    // Preallocate the axes vertices array.
    this._axes = new Array(vertices.length).fill(0).map(() => new Vector());

    // Initialize the projection instance we'll recycle.
    this._projection = new Projection();

    // Initialize the centroid instance we'll recycle.
    this._centroid = new Vector();

    // Initialize the recalc flag to true.
    this._recalc = true;

    // Initialize the last vector positions, first vertex and last vertex
    this._lastPos = Vector.infinity
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
   * Calculate the vertices and axis of this polygon. If position has not been changed since last time this method has been called
   * it will not recalculate the vertices and axes.
   * 
   * @returns vertices and axes
   */
  public calculate(): void {
    if (this.hasMovedSinceLastCalc) {
      this._lastPos = this._lastPos.copy(this.pos);

      // Calculate axes and vertices
      // todo: change getter to methods to make the calculation more explicit
      [this.axes, this.vertices];

      this.recalc = false;

      return
    }
    this.recalc = false;

    return
  }

  private get hasMovedSinceLastCalc(): boolean {
    return this.pos.x !== this._lastPos.x || this.pos.y !== this._lastPos.y;
  }
  /**
   * Returns the vertices absolute positions of the polygon.
   *
   * @returns vertices absolute positions
   */
  public get vertices(): Vector[] {
    // If the vertices do not need to be recalculated, we just reuse theù
    if (!this.recalc) return this._worldVertices;

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
    // If the vertices do not need to be recalculated, we just reuse theù
    if (!this.recalc) return this._axes;

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

  /**
   * Returns true if the vertices and polygon axes must be recalculated. 
   * 
   * @returns must recalculate
   */
  public get recalc(): boolean {
    return this._recalc;
  }

  /**
   * State if the vertices and polygon axes must be recalculated.
   * 
   * @param mustRecalculate
   */
  public set recalc(mustRecalculate: boolean) {
    this._recalc = mustRecalculate;
  }
}
