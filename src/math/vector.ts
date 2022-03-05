/**
 * A vector is a point in a coordinate system, represented by a pair of numbers.
 */
export class Vector {
  constructor(public x: number, public y: number) { }

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
  sub(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
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
   * Divide two vectors together and returns the resulting vector.
   *
   * @param vector
   * @returns divided vector
   */
  div(vector: Vector): Vector {
    return new Vector(this.x / vector.x, this.y / vector.y);
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
  mult(vector: Vector): Vector {
    return new Vector(this.x * vector.x, this.y * vector.y);
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
   * Returns true if two vectors have the same x and y values.  
   * 
   * @param vector
   * @returns vector are equals
   */
  equals(vector: Vector): boolean {
    return this.x === vector.x && this.y === vector.y;
  }
}

export function vec(x = 0, y = x): Vector {
  return new Vector(x, y);
}
