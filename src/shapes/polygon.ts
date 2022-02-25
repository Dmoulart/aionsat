import { Projection } from "..";
import { Vector } from "../math/vector";

/**
 * A polygon is a collection of vertices that form a closed shape. 
 * Only convex polygons can be used for this type of collision detection.
 * 
 */
export class Polygon {

    private _vertices: Vector[] = []

    constructor(vertices: Vector[] = []) {
        if (vertices.length < 3) {
            console.error(`Polygon has been instanciated with less than 3 vertices.`)
        }
        this._vertices = vertices
    }

    /**
     * Project the vertices of the polygon onto a given axis.
     * 
     * @param axis 
     * @returns projection
     */
    project(axis: Vector): Projection {
        const vertices = this.vertices
        const len = vertices.length

        let min = Number.MAX_VALUE
        let max = Number.MIN_VALUE

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

    /**
     * Returns the vertices of the polygon as a collection of vector.
     * 
     * @returns vertices
     */
    get vertices(): Vector[] {
        return this._vertices
    }

    set vertices(vertices: Vector[]) {
        this._vertices = vertices
    }

    /**
     * Returns the axes perpendicular to the edges of the polygon.
     * 
     * @returns axes
     */
    get axes(): Vector[] {
        const vertices = this.vertices
        const len = vertices.length

        const axes = []

        for (let i = 0; i < len; i++) {
            const currentVertex = vertices[i]
            const nextVertex = vertices[i + 1] || vertices[0]
            const edge = nextVertex.sub(currentVertex)
            const perp = new Vector(-edge.y, edge.x)
            const normal = perp.norm()
            axes[i] = normal
        }

        return axes
    }
}

