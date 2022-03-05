/**
 * A vector is a point in a coordinate system, represented by a pair of numbers.
 */
export class Vector {
  constructor(public x: number, public y: number) {}

  /**
   * Return a vector of value zero, representing the origin of the coordinate system.
   *
   * @returns origin
   */
  static get origin(): Vector {
    return new Vector(0, 0);
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
   * Substract two vectors together and returns the resulting vector.
   *
   * @param  vector
   * @returns difference vector
   */
  sub(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  /**
   * Add two vectors together and returns the resulting vector.
   *
   * @param  vector
   * @returns sum vector
   */
  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  /**
   * Divide two vectors together and returns the resulting vector.
   *
   * @param vector
   * @returns divided vector
   */
  div(v: Vector): Vector {
    return new Vector(this.x / v.x, this.y / v.y);
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
   * Returns a vector that is equal to the vector multiplied by the other vector.
   *
   * @param vector
   * @returns multiplicated vector
   */
  mult(v: Vector): Vector {
    return new Vector(this.x * v.x, this.y * v.y);
  }

  /**
   * Returns the dot product of a vector resulting from the multiplication of two vectors together,
   * and the some of their axes.
   *
   * @param vector
   * @returns dot product
   */
  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
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
  dist(v: Vector): number {
    return Math.sqrt((v.x - this.x) * (v.x - this.x) + (v.y - this.y) * (v.y - this.y));
  }

  /**
   * Return a vector that is perpendicular to itself.
   *
   * @returns this
   */
  perp(): Vector {
    return new Vector(-this.y, this.x);
  }
}

export function vec(x = 0, y = x): Vector {
  return new Vector(x, y);
}
