import { Projection } from "..";
import { vec, Vector } from "../math/vector";

export class Polygon {

    private _vertices: Vector[] = []

    constructor(vertices: Vector[] = []) {
        this._vertices = vertices
    }

    project(axis: Vector): Projection {
        const vertices = this.vertices
        let min = axis.dot(vertices[0])
        let max = min
        for (let i = 1; i < vertices.length; i++) {
            const dot = vertices[i].dot(axis)
            if (dot < min) {
                min = dot
            } else if (dot > max) {
                max = dot
            }
        }
        return new Projection(min, max)
    }

    get vertices(): Vector[] {
        return this._vertices
    }

    get axes(): Vector[] {
        const vertices = this.vertices
        const axes = []
        for (let i = 0; i < vertices.length; i++) {
            const currentVertex = vertices[i]
            const nextVertex = vertices[i + 1] || vertices[0]
            const edge = currentVertex.sub(nextVertex)
            const normal = edge.perpendicular().norm()
            console.log(normal)
            axes[i] = normal
        }
        return axes
    }
}

