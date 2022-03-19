import { Polygon, Sat, vec, Vector, Box, Circle, Shape } from '../dist';
import { ctx, drawPolygon, drawCircle, draw, counter } from './utils';

const polyA = new Polygon([vec(0, 0), vec(100, 0), vec(100, 100)], vec(window.innerWidth / 2, window.innerHeight / 2));

const square = new Box(100, 100, vec(200, 200));

const shapes = generateShapes(700)

const circleA = new Circle(10, vec(200, 200));

document.onmousemove = (e: MouseEvent) => {
  square.pos = vec(e.clientX, e.clientY);
};

const sat = new Sat();

let before = performance.now();
let dt = 0;
let c
(function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  const collision = sat.intersects(square, circleA);

  draw(square);
  draw(circleA, collision ? 'red' : 'white');

  //shapes.forEach((shape) => draw(shape))
  for (let i = 0; i < shapes.length; i++) {
    if (Math.random() > 0.999) {
      shapes[i].pos = Math.random() > 0.5 ?
        shapes[i].pos.add(vec(Math.random() * 2, Math.random() * 2))
        : shapes[i].pos.add(vec(-Math.random() * 2, -Math.random() * 2))
    }
    for (let j = i + 1; j < shapes.length; j++) {
      const collision = sat.intersects(shapes[i], shapes[j])
    }
  }

  dt = performance.now() - before;
  counter(dt)
  before = performance.now()

  requestAnimationFrame(loop);
})();

function generateShapes(n: number = 10): Array<Shape> {
  const shapes = []
  for (let i = 0; i < n; i++) {
    shapes.push(new Box(100, 100, vec(Math.random() * window.innerWidth, Math.random() * window.innerHeight)))
  }
  return shapes
}