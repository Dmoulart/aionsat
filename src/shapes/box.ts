import { Vector } from "../math/vector";
import { Polygon } from "./polygon";

/**
 * The box class inherits from Polygon. It defines a square shape by specifying its width and its height.
 * 
 */
export class Box extends Polygon {
    constructor(public pos: Vector, public width: number, public height: number) {
        super(pos, [
            new Vector(0, 0),
            new Vector(width, 0),
            new Vector(width, height),
            new Vector(0, height)
        ]);
    }
}