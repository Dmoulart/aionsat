export class Vector {

    constructor(public x: number, public y: number) { }

    static get Origin(): Vector {
        return new Vector(0, 0)
    }

    static get Zero(): Vector {
        return new Vector(0, 0)
    }

    scale(size: number): Vector {
        return new Vector(this.x * size, this.y * size)
    }

    sub(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y)
    }

    add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y)
    }

    negate(): Vector {
        return this.scale(-1)
    }

    dot(v: Vector): number {
        return this.x * v.x + this.y * v.y
    }

    norm() {
        const mag = this.mag()
        return new Vector(this.x / mag, this.y / mag)
    }

    mag(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y))
    }

    perp(): Vector {
        this.x = this.y
        this.y = -this.x
        return this
    }
}

export function vec(x = 0, y = x): Vector {
    return new Vector(x, y)
}
