import type { GameWorld } from '../ecs/ecs';
import { playerEntity } from '../ecs/ecs';
import type { Entity } from '../ecs/types';
import { WORLD_SCALE, CANVAS_BACKGROUND } from '../app/constants';

function transformVertex(x: number, y: number, offsetX: number, offsetY: number, scale: number) {
  return {
    x: x * scale + offsetX,
    y: y * scale + offsetY,
  };
}

function drawPolygon(ctx: CanvasRenderingContext2D, entity: Entity, offsetX: number, offsetY: number, scale: number) {
  const { vertices } = entity.collider;
  if (vertices.length === 0) return;
  ctx.beginPath();
  const first = transformVertex(vertices[0].x, vertices[0].y, offsetX, offsetY, scale);
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < vertices.length; i += 1) {
    const vertex = transformVertex(vertices[i].x, vertices[i].y, offsetX, offsetY, scale);
    ctx.lineTo(vertex.x, vertex.y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function entityFill(entity: Entity): string {
  switch (entity.type) {
    case 'player':
      return '#cccccc';
    case 'polygonAgent':
      return '#a0a0a0';
    case 'lineAgent':
      return '#777777';
    case 'house':
    default:
      return '#2a2a2a';
  }
}

export function drawWorld(ctx: CanvasRenderingContext2D, world: GameWorld, width: number, height: number): void {
  ctx.save();
  ctx.fillStyle = CANVAS_BACKGROUND;
  ctx.fillRect(0, 0, width, height);
  const player = playerEntity(world);
  const scale = WORLD_SCALE;
  const offsetX = width / 2 - player.transform.position.x * scale;
  const offsetY = height / 2 - player.transform.position.y * scale;

  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';

  for (const entity of world.entities) {
    if (entity.type === 'player') continue;
    ctx.fillStyle = entityFill(entity);
    drawPolygon(ctx, entity, offsetX, offsetY, scale);
  }

  ctx.fillStyle = entityFill(player);
  drawPolygon(ctx, player, offsetX, offsetY, scale);
  ctx.restore();
}
