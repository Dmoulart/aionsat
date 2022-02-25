import { Polygon, Sat, vec } from '../dist'

// Create canvas
const canvas = document.createElement('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')
ctx.strokeStyle = 'white'

// Mouse position
let mousePosition = vec(0, 0)


// Instantiate Polygons
const polyA = new Polygon(
    vec(window.innerWidth / 2, window.innerHeight / 2),
    [
        vec(100, 100),
        vec(100, 200),
        vec(200, 100),
    ]
);

const verticesB = [
    vec(100 + 1, 100 + 20),
    vec(200 + 1, 100 + 20),
    vec(200 + 1, 200 + 20),
    vec(100 + 1, 200 + 20),
]

const polyB = new Polygon(
    mousePosition,
    verticesB
);

document.onmousemove = (e: MouseEvent) => {
    polyB.vertices = verticesB.map(v => vec(v.x + e.clientX - 200, v.y + e.clientY - 200))
    mousePosition = vec(e.clientX, e.clientY)
}

const sat = new Sat();

(function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    const collision = sat.collides(polyA, polyB)
    if (collision) {
        polyA.pos = polyA.pos.add(collision.normal.scale(collision.overlap + 1))
    }
    drawPolygon(polyA)
    drawPolygon(polyB, collision ? 'red' : 'green')

    requestAnimationFrame(loop)
})()


function drawPolygon(polygon: Polygon, color = "white") {
    ctx.strokeStyle = color
    ctx.beginPath()
    polygon.vertices.forEach((v, i) => {
        if (i === 0) {
            ctx.moveTo(v.x, v.y)
        } else {
            ctx.lineTo(v.x, v.y)
        }
    })
    ctx.closePath()
    ctx.stroke()
}

function drawAxes(poly: Polygon) {
    ctx.strokeStyle = 'white'
    poly.axes.forEach(axis => {
        ctx.strokeRect(axis.x, axis.y, 20, 20)
    })
}

function drawProjections(polyA: Polygon, color: string) {
    ctx.strokeStyle = color
    polyA.axes.forEach((axis, i) => {
        const p = polyA.project(axis)
        //console.log(p.min, p.max)
        ctx.beginPath()
        ctx.moveTo(400 + p.min / 100, 200 + i * 200)
        ctx.lineTo(400 + p.max / 100, 200 + i * 200)
        ctx.stroke()
        ctx.closePath()
    })
}
// /**
//      * Creates a standard polygon shape with the requested number of sides
//      * @param {int} numOfSides 
//      * @param {number} radius 
//      */
//     static CreatePolygon(numOfSides = 3, radius = 100)
// {
//     numOfSides = Math.round(numOfSides);
//     if (numOfSides < 3)
//         throw "You need at least 3 sides for a polygon"

//     var poly = new SATPolygon();
//     // figure out the angles required
//     var rotangle = (Math.PI * 2) / numOfSides;
//     var angle = 0;
//     // loop through and generate each point
//     for (var i = 0; i < numOfSides; i++) {
//         angle = (i * rotangle) + ((Math.PI - rotangle) * 0.5);
//         let pt = new SATPoint(Math.cos(angle) * radius,
//             Math.sin(angle) * radius);
//         poly.vertices.push(pt);
//     }
//     return poly;
// }