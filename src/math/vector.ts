export type Direction = 'left' | 'right' | 'up' | 'down' | 'center' | 'none' | 'left-up' | 'left-down' | 'right-up' | 'right-down'

export class Vector {
    x!: number

    y!: number

    constructor(x: number, y: number) {
        this.x = x ?? 0
        this.y = y ?? 0
    }

    static get Origin(): Vector {
        return new Vector(0, 0)
    }

    static get Zero(): Vector {
        return new Vector(0, 0)
    }

    static get Up(): Vector {
        return new Vector(0, -1)
    }

    static get UpLeft(): Vector {
        return new Vector(-1, -1)
    }

    static get UpRight(): Vector {
        return new Vector(1, -1)
    }

    static get Down(): Vector {
        return new Vector(0, 1)
    }

    static get DownLeft(): Vector {
        return new Vector(-1, 1)
    }

    static get DownRight(): Vector {
        return new Vector(1, 1)
    }

    static get Left(): Vector {
        return new Vector(-1, 0)
    }

    static get Right(): Vector {
        return new Vector(1, 0)
    }

    static Directions = {
        left: Vector.Left,
        right: Vector.Right,
        up: Vector.Up,
        upLeft: Vector.UpLeft,
        upRight: Vector.UpRight,
        downLeft: Vector.DownLeft,
        downRight: Vector.DownRight,
    }

    static Distance(v1: Vector, v2?: Vector) {
        if (!v2) {
            v2 = Vector.Origin
        }
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))
    }

    distance(v: Vector) {
        if (!v) {
            v = Vector.Origin
        }
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2))
    }

    static Scale(v: Vector, scale: Vector): Vector
    static Scale(v: Vector, size: number): Vector
    static Scale(v: Vector, sizeOrScale: number | Vector): Vector {
        if (sizeOrScale instanceof Vector) {
            return new Vector(v.x * sizeOrScale.x, v.y * sizeOrScale.y)
        }
        return new Vector(v.x * sizeOrScale, v.y * sizeOrScale)
    }

    scale(scale: Vector): Vector
    scale(size: number): Vector
    scale(sizeOrScale: number | Vector): Vector {
        if (sizeOrScale instanceof Vector) {
            return new Vector(this.x * sizeOrScale.x, this.y * sizeOrScale.y)
        }
        return new Vector(this.x * sizeOrScale, this.y * sizeOrScale)
    }

    static Sub(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y)
    }

    sub(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y)
    }

    subEq(v: Vector): Vector {
        this.x -= v.x
        this.y -= v.y
        return this
    }

    static Add(a: Vector, b: Vector): Vector {
        return new Vector(a.x + b.x, a.y + b.y)
    }

    add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y)
    }

    addEq(v: Vector): Vector {
        this.x += v.x
        this.y += v.y
        return this
    }

    static Negate(v: Vector): Vector {
        return Vector.Scale(v, -1)
    }

    negate(): Vector {
        return this.scale(-1)
    }

    static Rotate(v: Vector, angle: number, anchor?: Vector): Vector {
        if (!anchor) {
            anchor = new Vector(0, 0)
        }
        const sinAngle = Math.sin(angle)
        const cosAngle = Math.cos(angle)
        const x =
            cosAngle * (v.x - anchor.x) - sinAngle * (v.y - anchor.y) + anchor.x
        const y =
            sinAngle * (v.x - anchor.x) + cosAngle * (v.y - anchor.y) + anchor.y
        return new Vector(x, y)
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y * v.y
    }

    static Perpendicular(v: Vector): Vector {
        return new Vector(v.y, -v.x)
    }

    perpendicular(): Vector {
        return new Vector(this.y, -this.x)
    }

    static Normalize(v: Vector): Vector {
        const d = Vector.Distance(v)
        if (d > 0) {
            return new Vector(v.x / d, v.y / d)
        }
        return new Vector(0, 1)
    }

    normalize(): Vector {
        const d = this.distance(this)
        if (d > 0) {
            return new Vector(this.x / d, this.y / d)
        }
        return new Vector(0, 1)
    }

    /**
     * 
     * 
     * 
     * 
     * 
     */

    norm() {
        return new Vector(
            this.x / (Math.sqrt(this.x * this.x + this.y * this.y)),
            this.y / (Math.sqrt(this.x * this.x + this.y * this.y))
        );
    }

    mult(n: number): Vector {
        this.x *= n
        this.y *= n
        return this
    }

    mag(): number {
        return Math.sqrt(this.magSq())
    }

    magSq(): number {
        return (this.x * this.x) + (this.y * this.y)
    }

    static Equals(v1: Vector, v2: Vector): boolean {
        return v1.x === v2.x && v1.y === v2.y
    }

    equals(v: Vector): boolean {
        return this.x === v.x && this.y === v.y
    }

    static Div(v: Vector, n: number): Vector {
        return new Vector(v.x / n, v.y / n)
    }

    div(value: number | Vector): Vector {
        if (typeof value === 'number') {
            return new Vector(this.x / value, this.y / value)
        }
        return new Vector(this.x / value.x, this.y / value.y)
    }

    abs(): Vector {
        return new Vector(Math.abs(this.x), Math.abs(this.y))
    }

    round(): Vector {
        return new Vector(Math.round(this.x), Math.round(this.y))
    }

    floor(): Vector {
        return new Vector(Math.floor(this.x), Math.floor(this.y))
    }

    /**
     * Returns a vector with same x value and y value.
     * @todo find a better names
     * @returns vector
     */
    flat(): Vector {
        return new Vector(this.x, this.x)
    }

    from(value: number | Vector | { x: number, y: number }): Vector {
        if (typeof value === 'number') {
            return new Vector(value, value)
        }
        return new Vector(value.x, value.y)
    }


    directionFrom(v: Vector): Vector {
        return this.sub(v)
    }

    /**
     * Create a linear interpolation between two vectors.
     * Caution as it mutates the vector.
     * @param {Vector} vector
     * @param {number} amount 
     * @returns {Vector} vector
     */
    lerpEq(vector: Vector, amount: number | Vector): Vector {

        if (amount instanceof Vector) {
            if (amount.x > 1.0 || amount.y > 1.0) { amount = vec(1, 1) }
            this.x += (vector.x - this.x) * amount.x;
            this.y += (vector.y - this.y) * amount.y;
            return this;
        }

        if (amount > 1.0) { amount = 1.0 }
        this.x += (vector.x - this.x) * amount;
        this.y += (vector.y - this.y) * amount;
        return this;
    }

    static DirectionAsString(v: Vector): Direction {
        switch (true) {
            case v.equals(Vector.Left):
                return 'left'
            case v.equals(Vector.Left.add(Vector.Up)):
                return 'left-up'
            case v.equals(Vector.Left.add(Vector.Down)):
                return 'left-down'
            case v.equals(Vector.Right):
                return 'right'
            case v.equals(Vector.Right.add(Vector.Up)):
                return 'right-up'
            case v.equals(Vector.Right.add(Vector.Down)):
                return 'right-down'
            case v.equals(Vector.Up):
                return 'up'
            case v.equals(Vector.Down):
                return 'down'
            case v.equals(Vector.Zero):
                return 'center'
            default: break;
        }
        return 'none'
    }

    directionFromAsString(v: Vector): Direction {
        const direction = this.directionFrom(v)
        return Vector.DirectionAsString(direction)
    }

    get hasLength(): boolean {
        return this.x !== 0 || this.y !== 0
    }

    static compareByDistance = (a: Vector, b: Vector, origin = Vector.Origin) => a.distance(origin) > b.distance(origin) ? 1 : -1

}

export function vec(x = 0, y = x): Vector {
    return new Vector(x, y)
}
