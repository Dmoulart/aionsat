/**
 * A projection is a pair of numbers, representing the minimum and maximum values of a given axis.
 * It is a one dimensional representation used by comparison to check if two shapes are colliding.
 *
 */
export class Projection {
  constructor(
    /**
     * The beginning of the projection.
     *
     */
    public min = 0,

    /**
     * The end of the projection
     *
     */
    public max = 0
  ) {}

  /**
   * Returns true if two projections overlap.
   *
   * @param otherProjection
   * @returns is overlapping with other projection
   */
  public overlap(other: Projection): boolean {
    return !(this.min > other.max || this.max < other.min);
  }

  /**
   * Returns the penetration coefficient of two projections.
   *
   * @param other
   * @returns overlap value
   */
  public getOverlap(other: Projection): number {
    if (!this.overlap(other)) return 0;

    return Math.min(other.max - this.min, this.max - other.min);
  }

  /**
   * Mutate the min and max values of the projection.
   *
   * @param min
   * @param max
   * @returns this projection
   */
  public set(min: number, max: number): this {
    this.min = min;
    this.max = max;
    return this;
  }
}
