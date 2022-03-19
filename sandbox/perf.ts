import { Polygon, Sat, vec, Vector, Box, Circle, Shape } from '../dist';
import { ctx, drawPolygon, drawCircle, draw, counter } from './utils';

const polyA = new Polygon([vec(0, 0), vec(100, 0), vec(100, 100)], vec(window.innerWidth / 2, window.innerHeight / 2));

const square = generateShapes(1, 'Circle')[0];
const circle = generateShapes(1, 'Circle')[0]; //new Circle(10, vec(200, 200));

const shapes = [...generateShapes(1500, 'Circle'), circle];
console.log(shapes);
document.onmousemove = (e: MouseEvent) => {
  square.pos = vec(e.clientX, e.clientY);
};

const sat = new Sat();

let before = performance.now();
let dt = 0;
let c;
(function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  const collision = sat.intersects(square, circle);

  draw(square);
  draw(circle, collision ? 'red' : 'white');
  let checks = 0;
  //shapes.forEach((shape) => draw(shape))
  for (let i = 0; i < shapes.length; i++) {
    if (Math.random() > 0.5) {
      shapes[i].pos = Math.random() > 0.5 ? shapes[i].pos.add(vec(2, 2)) : shapes[i].pos.add(vec(-2, -2));
    }
    for (let j = 0; j < shapes.length; j++) {
      if (i !== j) {
        const collision = sat.intersects(shapes[i], shapes[j]);
        checks++;
      }
    }
  }

  dt = performance.now() - before;
  counter(dt);
  before = performance.now();
  console.log('checks : ', checks);
  requestAnimationFrame(loop);
})();

function generateShapes(n: number = 10, shape: 'Box' | 'Circle' = 'Box'): Array<Shape> {
  const shapes = [];
  const box = () => new Box(50, 50, vec(Math.random() * innerWidth, Math.random() * innerHeight));
  const circle = () => new Circle(50, vec(Math.random() * innerWidth, Math.random() * innerHeight));
  if (shape === 'Box') {
    for (let i = 0; i < n; i++) {
      shapes.push(box());
    }
  } else if (shape === 'Circle') {
    for (let i = 0; i < n; i++) {
      shapes.push(circle());
    }
  }
  return shapes;
}
