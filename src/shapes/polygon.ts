import { Projection } from "..";
import { Vector } from "../math/vector";
import { Shape } from "./shape";

/**
 * A polygon is a collection of vertices that form a closed shape. 
 * Only convex polygons can be used for this type of collision detection.
 * 
 */
export class Polygon extends Shape {

    /**
     * The vertices in their relative positions.
     * 
     */
    private _vertices: Vector[] = []

    constructor(pos: Vector, vertices: Vector[] = []) {
        super(pos)
        if (vertices.length < 3) {
            throw new Error(`Polygon has been instanciated with less than 3 vertices.`)
        }
        this._vertices = vertices
    }

    /**
     * Project the vertices of the polygon onto a given axis.
     * 
     * @param axis 
     * @returns projection
     */
    public project(axis: Vector): Projection {
        const vertices = this.vertices
        const len = vertices.length

        let min = axis.dot(vertices[0])
        let max = Number.MIN_VALUE

        for (let i = 1; i < len; i++) {
            const dot = axis.dot(vertices[i])
            if (dot < min) {
                min = dot
            }
            if (dot > max) {
                max = dot
            }
        }

        return new Projection(min, max)
    }

    /**
     * Returns the vertices absolute positions of the polygon.
     * 
     * @returns vertices
     */
    public get vertices(): Vector[] {
        const vertices = []

        for (let i = 0; i < this._vertices.length; i++) {
            vertices.push(this._vertices[i].add(this.pos))
        }

        return vertices
    }

    /**
     * Set the vertices relative positions.
     * 
     * @param vertices
     */
    public set vertices(vertices: Vector[]) {
        this._vertices = vertices
    }

    /**
     * Returns the axes perpendicular to the edges of the polygon.
     * 
     * @returns axes
     */
    public get axes(): Vector[] {
        const vertices = this.vertices
        const len = vertices.length

        const axes = []

        for (let i = 0; i < len; i++) {
            const currentVertex = vertices[i]

            const nextVertex = vertices[i + 1] || vertices[0]
            const edge = nextVertex.sub(currentVertex)

            const perp = edge.perp()
            const normal = perp.norm()

            axes[i] = normal
        }
        return axes
    }

    /**
     * Returns the center of the polygon.
     * 
     * @returns centroid
     */
    public get centroid(): Vector {
        const vertices = this.vertices
        const len = vertices.length

        return vertices.reduce(function (center, point, i) {
            center.x += point.x;
            center.y += point.y;

            if (i === len - 1) {
                center.x /= len;
                center.y /= len;
            }

            return center;
        }, new Vector(0, 0));
    }
}

