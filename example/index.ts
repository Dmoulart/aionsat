import { Polygon, Sat, vec } from '../dist'

const canvas = document.createElement('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')

const polyA = new Polygon(
    [
        vec(100, 100),
        vec(100, 200),
        vec(200, 200)
    ]
);

const polyB = new Polygon(
    [
        vec(100 + 1, 100 + 20),
        vec(100 + 1, 200 + 20),
        vec(200 + 1, 200 + 20)
    ]
);

const sat = new Sat()

console.log(polyA);

console.log(sat.collides(polyA, polyB));

(function loop() {
    //ctx.clearRect(0, 0, innerWidth, innerHeight)
    ctx.strokeStyle = 'white'
    drawPolygon(polyA)
    drawPolygon(polyB)
    drawAxes(polyA)
    drawAxes(polyB)
    // drawProjections(polyA, 'green')
    // drawProjections(polyB, 'red')
    //requestAnimationFrame(loop)
})()


function drawPolygon(polygon: Polygon) {
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
