import { Polygon, Sat, vec, Vector } from '../dist'
import { Collision } from '../dist/sat'
import { Circle } from '../dist/shapes/circle'
import { Shape } from '../dist/shapes/shape'

// Create canvas
const canvas = document.createElement('canvas')
canvas.width = innerWidth
canvas.height = innerHeight
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')
ctx.strokeStyle = 'white'

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
    //polyA.pos = vec(e.clientX, e.clientY)
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
const squareB = new Polygon(
    vec(200, 200),
    [
        vec(0, 0),
        vec(10, 0),
        vec(10, 10),
        vec(0, 10),
    ]
);
document.onmousemove = (e: MouseEvent) => {
    square.pos = vec(e.clientX, e.clientY)
}

const circleA = new Circle(vec(200, 200), 20)

const circleB = new Circle(vec(400, 200), 120)

const sat = new Sat();

(function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight)


    // if ((collision = sat.intersects(square, polyA))) {
    //     resolve(collision, square)
    // }
    // if ((collision = sat.intersects(circleA, polyA))) {
    //     resolve(collision, circleA)
    // }



    const collision = sat.intersects(square, squareB)
    // if (collision) {
    //     //resolve(collision, circleA)
    //     drawCircle(circleA, collision.aInB ? "red" : "white")
    // }
    // else {
    //     drawCircle(circleA)
    // }

    drawPolygon(square)
    drawPolygon(squareB, collision && collision.bInA ? "red" : "white")

    //drawCircle(circleA, collision)
    //drawCircle(circleB)

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

