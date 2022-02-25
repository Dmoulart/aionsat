import { Vector } from "../math/vector";

/**
 * The abstract class Shape from which Circle and Polygon derive.
 * 
 */
export abstract class Shape {
    /**
     * The shape's world position.
     * 
     */
    pos: Vector

    constructor(pos: Vector) {
        this.pos = pos
    }
}