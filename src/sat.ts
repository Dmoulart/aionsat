import { Vector } from ".";
import { Polygon } from "./shapes/polygon";

export class Sat {

    /**
     * Detect the collision between two polygons
     * @param polyA 
     * @param polyB
     */
    collides(a: Polygon, b: Polygon): {
        smallest: Vector,
        overlap: number
    } | false {
        const axesA = a.axes;
        const axesB = b.axes;

        const lenA = axesA.length;
        const lenB = axesB.length;

        let overlap = Number.MAX_VALUE
        let smallest: Vector

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
                    smallest = axis
                }
            }
        }

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
                    smallest = axis
                }
            }
        }


        // if the smallest penetration normal
        //     points into shape b,
        //     flip it
        //https://community.onelonecoder.com/2020/09/26/separating-axis-theorem-refinements-and-expansion/
        if ((a.vertices[0].sub(b.vertices[0]).dot(smallest) < 0))
            smallest = smallest.scale(-1)

        console.log({
            overlap,
            smallest
        })
        return {
            overlap,
            smallest
        }
    }

}

