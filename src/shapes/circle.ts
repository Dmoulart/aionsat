import { Vector } from "../math/vector";
import { Shape } from "./shape";

/**
 * The circle is a shape that is defined by a center point and a radius.
 * 
 */
export class Circle extends Shape {

    /**
     * The circle's radius.
     * 
     */
    radius: number;

    constructor(pos: Vector, radius: number) {
        super(pos);
        this.radius = radius;
    }
}