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
    public min: number,

    /**
     * The end of the projection
     *
     */
    public max: number
  ) {}

  /**
   * Returns true if two projections overlap.
   *
   * @param otherProjection
   * @returns is overlapping with other projection
   */
  overlap(other: Projection): boolean {
    return !(this.min > other.max || this.max < other.min);
  }

  /**
   * Returns the penetration coefficient of two projections.
   *
   * @param other
   * @returns overlap value
   */
  getOverlap(other: Projection): number {
    if (!this.overlap(other)) return 0;

    return Math.min(other.max - this.min, this.max - other.min);
  }
}
