/**
 * A vector is a point in a coordinate system, represented by a pair of numbers.
 */
export class Vector {
  constructor(
    /**
     * The X value represents the horizontal axis.
     */
    public x = 0,

    /**
     * The Y value represents the vertical axis.
     */
    public y = 0
  ) { }

  /**
   * Return a vector of value zero, representing the origin of the coordinate system.
   *
   * @returns origin
   */
  static get origin(): Vector {
    return new Vector(0, 0);
  }

  /**
   * Return a vector of value zero. It has the same value than the origin vector but is semantically different.
   *
   * @returns zero vector
   */
  static get zero(): Vector {
    return Vector.origin
  }

  /**
   * Return a vector of infinite value.
   *
   * @returns zero vector
   */
  static get infinity(): Vector {
    return new Vector(Infinity, Infinity);
  }

  /**
   * Multiply the two axes of a vector by a given number.
   *
   * @param size
   * @returns scaled vector
   */
  scale(size: number): Vector {
    return new Vector(this.x * size, this.y * size);
  }

  /**
   * Multiply this vector by another vector.
   * Warning: this vector is modified in place.
   * 
   * @param size
   * @returns scaled vector
   */
  mutScale(size: number): Vector {
    this.x *= size;
    this.y *= size;
    return this;
  }

  /**
   * Substract two vectors together and returns the resulting vector.
   *
   * @param  vector
   * @returns difference vector
   */
  sub(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  /**
  * Substract another vector with this one and return this one for chaining.
  * Warning: this vector is modified in place.
  *
  * @param  vector
  * @returns this vector
  */
  mutSub(vector: Vector): this {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  /**
   * Add two vectors together and returns the resulting vector.
   *
   * @param  vector
   * @returns sum vector
   */
  add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  /**
  * Add another vector to this one and return this one for chaining.
  * Warning: this vector is modified in place.
  *
  * @param  vector
  * @returns this vector
  */
  mutAdd(vector: Vector): this {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
   * Divide two vectors together and returns the resulting vector.
   *
   * @param vector
   * @returns divided vector
   */
  div(vector: Vector): Vector {
    return new Vector(this.x / vector.x, this.y / vector.y);
  }

  /**
  * Divide another vector with this one and return this one for chaining.
  * Warning: this vector is modified in place.
  *
  * @param  vector
  * @returns this vector
  */
  mutDiv(vector: Vector): this {
    this.x /= vector.x;
    this.y /= vector.y;
    return this;
  }

  /**
   * Returns a vector that is equal to the vector multiplied by -1.
   *
   * @returns negative vector
   */
  negate(): Vector {
    return this.scale(-1);
  }

  /**
  * Make this vector negative.
  * Warning: this vector is modified in place.
  *
  * @returns this vector
  */
  mutNegate(): this {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  /**
   * Returns a vector that is equal to the vector multiplied by the other vector.
   *
   * @param vector
   * @returns multiplicated vector
   */
  mult(vector: Vector): Vector {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }

  /**
  * Multiply this vector by another one.
  * Warning: this vector is modified in place.
  *
  * @returns this vector
  */
  mutMult(vector: Vector): this {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }

  /**
   * Returns the dot product of a vector resulting from the multiplication of two vectors together,
   * and the some of their axes.
   *
   * @param vector
   * @returns dot product
   */
  dot(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
   * Returns the normal of the vector. The normal is also known as the unit vector. It is a vector of
   * size 1, pointing in the same direction as the original vector.
   *
   * @returns normal
   */
  norm(): Vector {
    const mag = this.mag();
    if (mag > 0) {
      return new Vector(this.x / mag, this.y / mag);
    } else {
      return new Vector(0, 1);
    }
  }

  /**
  * Normalize this vector.
  * Warning: this vector is modified in place.
  *
  * @returns this vector
  */
  mutNorm(): this {
    const mag = this.mag();
    if (mag > 0) {
      this.x /= mag;
      this.y /= mag;
      return this;
    } else {
      this.x = 0;
      this.y = 1;
      return this;
    }
  }

  /**
   * Returns the magnitude or the length of the vector.
   *
   * @returns magnitude
   */
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the distance between two vectors.
   *
   * @returns this
   */
  dist(vector: Vector): number {
    return Math.sqrt((vector.x - this.x) * (vector.x - this.x) + (vector.y - this.y) * (vector.y - this.y));
  }

  /**
   * Return a vector that is perpendicular to itself.
   *
   * @returns this
   */
  perp(): Vector {
    return new Vector(-this.y, this.x);
  }

  /**
   * Make this vector perendicular to itself.
   *
   * @returns this
   */
  mutPerp(): this {
    const temp = this.x;
    this.x = -this.y;
    this.y = temp;
    return this;
  }

  /**
   * Returns true if two vectors have the same x and y values.
   *
   * @param vector
   * @returns vector are equals
   */
  equals(vector: Vector): boolean {
    return this.x === vector.x && this.y === vector.y;
  }

  /**
   * Apply the values of the given vector to this vector.
   *
   * @param vector
   * @returns this vector
   */
  copy(vector: Vector): this {
    this.x = vector.x;
    this.y = vector.y;
    return this
  }

  /**
   * Set the x and y values of this vector.
   *
   * @param x
   * @param y
   * @returns this vector
   */
  set(x: number, y: number = x): this {
    this.x = x;
    this.y = y;
    return this
  }

}

// A shortcut function to instantiate vector
export function vec(x = 0, y = x): Vector {
  return new Vector(x, y);
}

export const Vectors = new Array<Vector>(20).fill(new Vector)