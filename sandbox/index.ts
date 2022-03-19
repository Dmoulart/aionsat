import { Polygon, Sat, vec, Vector, Box, Circle, Shape } from '../dist';
import { ctx, draw, generateShapes } from './utils';

// Instantiate user polygon
const polyA = new Polygon([vec(0, 0), vec(100, 0), vec(100, 100)], vec(window.innerWidth / 2, window.innerHeight / 2));
const shapes = [...generateShapes(10, 'Circle'), ...generateShapes(40, 'Box')];
// Instantiate other shapes
const square = new Box(100, 100, vec(200, 200));

const user = new Polygon([vec(0, 0), vec(10, 0), vec(10, 10), vec(0, 10)], vec(200, 200));
const circleA = new Circle(10, vec(200, 200));

document.onmousemove = (e: MouseEvent) => {
  square.pos = vec(e.clientX, e.clientY);
};
const circleB = new Circle(120, vec(400, 200));

const sat = new Sat();

(function loop() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  const collision = sat.intersects(square, circleA);

  draw(square);

  draw(circleA, collision ? 'red' : 'white');

  shapes.forEach((shape) => {
    const collision = sat.intersects(square, shape);
    if (collision) {
      shape.pos = shape.pos.sub(collision.normal.scale(collision.overlap));
    }
    draw(shape, collision ? 'red' : 'white');
  });

  requestAnimationFrame(loop);
})();
