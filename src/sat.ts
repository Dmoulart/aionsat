import { Vector } from ".";
import { Polygon } from "./shapes/polygon";

/**
 * An implementation of the Separating Axis Theorem, greatly inspired from the dyn4j blog post.
 * https://dyn4j.org/2010/01/sat/
 * 
 */
export class Sat {

    /**
     * Detect the collision between two polygons and return the overlap value as well as the
     * collision normal.
     * 
     * @param polyA 
     * @param polyB
     * @returns collision response 
     */
    collides(a: Polygon, b: Polygon): {
        normal: Vector,
        overlap: number
    } | false {
        const axesA = a.axes;
        const axesB = b.axes;

        const lenA = axesA.length;
        const lenB = axesB.length;

        let overlap = Number.MAX_VALUE
        let normal: Vector

        // Project onto each axis of the first shape
        for (let i = 0; i < lenA; i++) {
            const axis = axesA[i];
            const projectionA = a.project(axis);
            const projectionB = b.project(axis);
            if (!projectionA.overlap(projectionB)) {
                return false;
            }
            else {
                if (axis.x === 1) {
                    console.log('axis', axis);
                }
                const o = projectionA.getOverlap(projectionB);
                if (o < overlap) {
                    overlap = o;
                    normal = axis
                }
            }
        }

        // Project onto each axis of the second shape
        for (let i = 0; i < lenB; i++) {
            const axis = axesB[i];
            const projectionA = a.project(axis);
            const projectionB = b.project(axis);
            if (!projectionA.overlap(projectionB)) {
                return false;
            }
            else {
                const o = projectionA.getOverlap(projectionB);
                if (o < overlap) {
                    overlap = o;
                    normal = axis
                }
            }
        }


        // if the smallest penetration normal points into shape b flip it
        // https://community.onelonecoder.com/2020/09/26/separating-axis-theorem-refinements-and-expansion/
        if ((a.vertices[0].sub(b.vertices[0]).dot(normal) < 0))
            normal = normal.scale(-1)

        console.log({
            overlap,
            normal
        })
        return {
            normal,
            overlap
        }
    }

}

