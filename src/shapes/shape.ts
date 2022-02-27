import { Projection } from "..";
import { Vector } from "../math/vector";

/**
 * The abstract class Shape from which Circle and Polygon derive.
 * 
 */
export abstract class Shape {
    constructor(
        /**
         * The shape's world position.
         * 
         */
        public pos: Vector
    ) { }

    /**
     * Project the shape onto a given axis.
     * 
     * @param axis 
     * @returns projection
     */
    public abstract project(axis: Vector): Projection
}