import { Projection } from "..";
import { vec, Vector } from "../math/vector";

export class Polygon {

    private _vertices: Vector[] = []

    constructor(vertices: Vector[] = []) {
        this._vertices = vertices
    }

    project(axis: Vector): Projection {
        const vertices = this.vertices
        const len = vertices.length
        let min = Number.MAX_VALUE // axis.dot(vertices[0])
        let max = Number.MIN_VALUE // min
        for (let i = 0; i < len; i++) {
            const dot = axis.dot(vertices[i])
            if (dot > max) {
                max = dot
            }
            if (dot < min) {
                min = dot
            }
        }
        return new Projection(min, max)
    }

    get vertices(): Vector[] {
        return this._vertices
    }

    set vertices(vertices: Vector[]) {
        this._vertices = vertices
    }

    get axes(): Vector[] {
        const vertices = this.vertices
        const len = vertices.length
        const axes = []
        for (let i = 0; i < len; i++) {
            const currentVertex = vertices[i]
            const nextVertex = vertices[i + 1] || vertices[0]
            const edge = new Vector(
                nextVertex.x - currentVertex.x,
                nextVertex.y - currentVertex.y
            )
            const perp = new Vector(-edge.y, edge.x)
            const normal = perp.norm()
            axes[i] = normal
        }
        return axes
    }
}

