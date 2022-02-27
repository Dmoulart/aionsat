import { Polygon, Sat, vec, Vector } from '../dist'
import { Circle } from '../dist/shapes/circle'
import { Shape } from '../dist/shapes/shape'

// Create canvas
const canvas = document.createElement('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')
ctx.strokeStyle = 'white'

const polygon = new Polygon(new Vector(10, 10), [new Vector(0, 0), new Vector(10, 0), new Vector(10, 0)])
const axes = polygon.axes

// Instantiate user polygon
const polyA = new Polygon(
    vec(window.innerWidth / 2, window.innerHeight / 2),
    [
        vec(0, 0),
        vec(100, 0),
        vec(100, 100),
    ]
);
document.onmousemove = (e: MouseEvent) => {
    polyA.pos = vec(e.clientX, e.clientY)
}

// Instantiate other shapes
const square = new Polygon(
    vec(200, 200),
    [
        vec(0, 0),
        vec(100, 0),
        vec(100, 100),
        vec(0, 100),
    ]
);
const circleA = new Circle(vec(200, 200), 100)
const circleB = new Circle(vec(400, 200), 20)
const sat = new Sat();

(function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    // Let's check collisions one by one
    let col = null

    if ((col = sat.intersects(circleB, polyA))) {
        resolve(col, circleB)
    }
    else if ((col = sat.intersects(circleA, polyA))) {
        resolve(col, circleA)
    }
    // Sometimes the polygon/square collision behave weirdly, like the poly would be shaped like the square.
    // I don't know why
    else if ((col = sat.intersects(square, polyA))) {
        resolve(col, square)
    }

    drawPolygon(square)
    drawPolygon(polyA)
    drawCircle(circleA)
    drawCircle(circleB)

    requestAnimationFrame(loop)

})()

function resolve(collision: { overlap: number, normal: Vector }, shape: Shape) {
    shape.pos = shape.pos.add(collision.normal.scale(collision.overlap + 1))
}

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

function drawCircle(circle: Circle, color = "white") {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
}

