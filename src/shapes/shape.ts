import { Projection } from '..';
import { Vector } from '../math/vector';

/**
 * The abstract class Shape from which Circle and Polygon derive.
 *
 */
export abstract class Shape {

  /**
   * The axes of the polygon. The axes are normalized and perpendicular to the edges of the polygon.
   *
   */
  protected _axes!: Vector[];

  /**
   * The axis projection of the polygon. We keep a reference to it so we do not have to instantiate a new 
   * one each time we must calculate it.
   * 
   */
  protected _projection: Projection

  /**
   * The center of the polygon, in aboslute coordinates.
   * 
   */
  protected _centroid: Vector;

  /**
   * Specify if we must recalculate the vertices positions and the axes.
   * It is triggered to false when they have been setted in the beginning of the 
   * collision detection. It is then setted to true at the end of the collision detection.
   * 
   */
  protected _recalc: boolean;

  /**
   * The last position of the polygon. It includes its first vertex and last vertex for comparison
   * 
   */
  protected _lastPos: Vector


  constructor(
    /**
     * The shape's world position.
     *
     */
    public pos: Vector = Vector.origin
  ) {

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
   * Project the shape onto a given axis.
   *
   * @param axis
   * @returns projection
   */
  public abstract project(axis: Vector): Projection;


  /**
   * Calculate the vertices and axis of this polygon. If position has not been changed since last time this method has been called
   * it will not recalculate the vertices and axes.
   * 
   * @returns vertices and axes
   */
  public calculate(): void {
    if (this.hasMovedSinceLastCalc) {
      // Set the last position to the current position.
      this._lastPos = this._lastPos.copy(this.pos);

      // The axes and vertices have to be re-calculated : set the recalc flag to true.
      this._recalc = true;
    }
    else {
      // The axes and vertices do not need to be calculated, we can set the recalc flag to false.
      this._recalc = false;
    }
  }

  /**
   * Returns true if the polygon has moved since the last time it has caculated its vertices and axes.
   * 
   * @returns has changed position since last calculation
   */
  private get hasMovedSinceLastCalc(): boolean {
    return this.pos.x !== this._lastPos.x || this.pos.y !== this._lastPos.y;
  }
}
