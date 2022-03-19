import { Vector, Shape, Polygon, Circle } from '../../dist';

// Create canvas
export const ctx = canvas();

function canvas() {
  const canvas = document.createElement('canvas');
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'white';
  return ctx;
}

export function resolve(collision: { overlap: number; normal: Vector }, shape: Shape) {
  shape.pos = shape.pos.add(collision.normal.scale(collision.overlap + 1));
}

export function draw(shape: Shape, color = 'white') {
  if (shape instanceof Polygon) {
    drawPolygon(shape, color);
  } else if (shape instanceof Circle) {
    drawCircle(shape, color);
  }
}
export function drawPolygon(polygon: Polygon, color = 'white') {
  ctx.strokeStyle = color;
  ctx.beginPath();
  polygon.vertices.forEach((v, i) => {
    if (i === 0) {
      ctx.moveTo(v.x, v.y);
    } else {
      ctx.lineTo(v.x, v.y);
    }
  });
  ctx.closePath();
  ctx.stroke();
}

export function drawCircle(circle: Circle, color = 'white') {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}

export function counter(time: number = 0, id = 'counter') {
  this.i ??= 0;
  this.i++;
  if (!this['id']) {
    const div = document.createElement('div');
    div.id = 'counter';
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.left = '0';
    div.style.color = 'white';
    div.style.fontSize = '20px';
    div.style.fontFamily = 'monospace';
    div.style.textAlign = 'center';
    div.style.width = '100%';
    div.style.height = '20px';
    div.style.backgroundColor = 'black';
    div.style.zIndex = '9999';
    document.body.appendChild(div);
    this['id'] = true;
  }
  if (this.i % 4 === 0) {
    document.getElementById(id).innerHTML = `${time.toFixed()} ms`;
  }
}
