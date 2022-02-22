import { Polygon } from "./shapes/polygon";

export class Sat {
    /**
     * Sat collision detection algorithm
     * @param polyA 
     * @param polyB
     */
    collides(a: Polygon, b: Polygon): boolean {

        const axes1 = a.axes;
        const axes2 = b.axes;

        for (let i = 0; i < axes1.length; i++) {
            const axis = axes1[i];
            const projection1 = a.project(axis);
            const projection2 = b.project(axis);
            if (!projection1.overlap(projection2)) {
                return false;
            }
        }

        for (let i = 0; i < axes2.length; i++) {
            const axis = axes2[i];
            const projection1 = a.project(axis);
            const projection2 = b.project(axis);
            if (!projection1.overlap(projection2)) {
                return false;
            }
        }

        return true
        // const axes = a.axes.concat(b.axes)
        // console.log(axes)
        // return axes.some(axis => {
        //     const projectionA = a.project(axis)
        //     const projectionB = b.project(axis)
        //     return projectionA.overlap(projectionB)
        // })
    }

}

