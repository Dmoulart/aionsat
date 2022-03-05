import { Vector } from '../math/vector';
import { Polygon } from './polygon';

/**
 * The box class inherits from Polygon. It defines a square shape by specifying its width and its height.
 *
 */
export class Box extends Polygon {
  constructor(
    /**
     * The box width.
     *
     */
    public width: number,
    /**
     * The box height.
     *
     */
    public height: number,
    /**
     * The box position.
     *
     */
    public pos: Vector = Vector.origin
  ) {
    super([new Vector(0, 0), new Vector(width, 0), new Vector(width, height), new Vector(0, height)], pos);
  }
}
