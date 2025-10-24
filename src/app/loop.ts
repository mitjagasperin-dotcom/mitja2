import { FIXED_DT, FOV, PLAYER_ANGULAR_SPEED, PLAYER_SPEED } from "./constants";
import { roomEntries, useGameStore } from "./store";
import { Vec2, Segment } from "../geom/vec2";
import { collidesSAT } from "../geom/collide";
import { transformPolygon } from "../geom/polygon";
import { fogIntensity } from "../render/fog";
import { castRay } from "../geom/raycast";
import { clamp } from "../utils/math";
import { HouseComponent } from "../ecs/types";

let running = false;
let lastTime = 0;
let accumulator = 0;

function resolvePlayerMovement(dt: number): void {
  const state = useGameStore.getState();
  const {
    level: { world, player },
    input
  } = state;
  const transform = world.transforms.get(player);
  const collider = world.colliders.get(player);
  if (!transform || !collider) return;

  let forward = 0;
  let strafe = 0;
  if (input["w"]) forward += 1;
  if (input["s"]) forward -= 1;
  if (input["d"]) strafe += 1;
  if (input["a"]) strafe -= 1;
  const rotationDelta = ((input["e"] ? 1 : 0) - (input["q"] ? 1 : 0)) * PLAYER_ANGULAR_SPEED * dt;
  transform.rotation += rotationDelta;

  if (forward !== 0 || strafe !== 0) {
    const forwardVec = Vec2.fromAngle(transform.rotation);
    const rightVec = new Vec2(-forwardVec.y, forwardVec.x);
    const movement = forwardVec.scale(forward * PLAYER_SPEED * dt).add(rightVec.scale(strafe * PLAYER_SPEED * dt));
    attemptMove(player, movement);
  }
}

function attemptMove(entity: number, movement: Vec2): void {
  const state = useGameStore.getState();
  const {
    level: { world }
  } = state;
  const transform = world.transforms.get(entity);
  const collider = world.colliders.get(entity);
  if (!transform || !collider) return;
  const previous = transform.position.clone();
  transform.position = transform.position.add(movement);
  const worldPolygon = transformPolygon(collider.points, transform.position, transform.rotation);

  for (const [otherEntity, otherCollider] of world.colliders.entries()) {
    if (otherEntity === entity) continue;
    const otherTransform = world.transforms.get(otherEntity);
    if (!otherTransform) continue;
    const otherPolygon = transformPolygon(otherCollider.points, otherTransform.position, otherTransform.rotation);
    const collision = collidesSAT(worldPolygon, otherPolygon);
    if (collision) {
      const house = world.houses.get(otherEntity);
      if (house) {
        if (doorAllowsPassage(house, otherTransform, transform.position)) {
          continue;
        }
      }
      transform.position = previous;
      return;
    }
  }
}

function doorAllowsPassage(house: HouseComponent, houseTransform: { position: Vec2; rotation: number }, position: Vec2): boolean {
  if (house.doors.length === 0) return false;
  const relative = position.sub(houseTransform.position);
  const angle = Math.atan2(relative.y, relative.x) - houseTransform.rotation;
  const distance = relative.len();
  const baseRadius = house.polygon.length > 0 ? house.polygon[0].len() : 0;
  for (const door of house.doors) {
    const delta = normalizeAngle(angle - door.angle);
    if (Math.abs(delta) <= door.width * 0.5 + 0.2 && distance >= baseRadius - 1.2) {
      return true;
    }
  }
  return false;
}

function normalizeAngle(angle: number): number {
  const twoPi = Math.PI * 2;
  return ((angle % twoPi) + twoPi) % twoPi;
}

function updateLineAgents(dt: number): void {
  const {
    level: { world }
  } = useGameStore.getState();
  for (const [entity, component] of world.lineAgents.entries()) {
    const transform = world.transforms.get(entity);
    const kinematics = world.kinematics.get(entity);
    const collider = world.lineColliders.get(entity);
    if (!transform || !kinematics || !collider) continue;
    transform.rotation += component.rotationSpeed * dt;
    transform.position = transform.position.add(kinematics.velocity.scale(dt));
  }
}

function handleTalkRequests(): void {
  const state = useGameStore.getState();
  if (!state.talkRequested) return;
  const {
    level: { world, player }
  } = state;
  const playerTransform = world.transforms.get(player);
  if (!playerTransform) return;
  let closest: { entity: number; distance: number } | null = null;
  for (const [entity, agent] of world.agents.entries()) {
    const transform = world.transforms.get(entity);
    if (!transform) continue;
    const distance = transform.position.sub(playerTransform.position).len();
    if (distance < 3.2 && (!closest || distance < closest.distance)) {
      closest = { entity, distance };
    }
  }
  if (closest) {
    const agent = world.agents.get(closest.entity);
    if (agent) {
      useGameStore.getState().startDialogue(agent.dialogueId, agent.sides);
    }
  }
  useGameStore.getState().updateWorld((draft) => {
    draft.talkRequested = false;
  });
}

function handleRoomInteraction(): void {
  const state = useGameStore.getState();
  if (!state.roomInteractRequested) return;
  const {
    level: { world, player }
  } = state;
  const playerTransform = world.transforms.get(player);
  if (!playerTransform) return;
  let enteredRoom: string | null = null;
  for (const [entity, house] of world.houses.entries()) {
    const houseTransform = world.transforms.get(entity);
    if (!houseTransform) continue;
    const relative = playerTransform.position.sub(houseTransform.position);
    const angle = Math.atan2(relative.y, relative.x) - houseTransform.rotation;
    const distance = relative.len();
    for (const door of house.doors) {
      const delta = normalizeAngle(angle - door.angle);
      if (Math.abs(delta) <= door.width * 0.5 + 0.1 && distance <= house.polygon[0].len() + 0.5) {
        enteredRoom = door.targetRoomId;
        break;
      }
    }
    if (enteredRoom) break;
  }
  useGameStore.getState().updateWorld((draft) => {
    draft.roomInteractRequested = false;
    draft.currentRoom = enteredRoom;
    if (!enteredRoom) {
      draft.puzzle = null;
    }
  });
  if (enteredRoom) {
    const room = roomEntries[enteredRoom];
    if (room && room.puzzles.length > 0) {
      useGameStore.getState().beginPuzzle(room.puzzles[0]);
    }
  }
}

function gatherRenderData(): void {
  const state = useGameStore.getState();
  const {
    level: { world, player }
  } = state;
  const polygons: typeof state.polygons = [];
  const houses: typeof state.houses = [];
  const lines: typeof state.lines = [];
  const segments: Segment[] = [];

  for (const [entity, house] of world.houses.entries()) {
    const transform = world.transforms.get(entity);
    if (!transform) continue;
    const worldPolygon = transformPolygon(house.polygon, transform.position, transform.rotation);
    houses.push({ id: house.id, points: worldPolygon, doors: house.doors, center: transform.position.clone(), rotation: transform.rotation });
    for (let i = 0; i < worldPolygon.length; i += 1) {
      const a = worldPolygon[i];
      const b = worldPolygon[(i + 1) % worldPolygon.length];
      segments.push({ a, b });
    }
  }

  for (const [entity, collider] of world.colliders.entries()) {
    const transform = world.transforms.get(entity);
    if (!transform) continue;
    const worldPolygon = transformPolygon(collider.points, transform.position, transform.rotation);
    const agent = world.agents.get(entity);
    const fill = entity === player ? "rgba(200,200,210,0.9)" : agent ? "rgba(180,180,180,0.85)" : "rgba(120,120,120,0.5)";
    polygons.push({
      id: `poly-${entity}`,
      points: worldPolygon,
      sides: collider.points.length,
      fill
    });
    if (entity !== player) {
      for (let i = 0; i < worldPolygon.length; i += 1) {
        const a = worldPolygon[i];
        const b = worldPolygon[(i + 1) % worldPolygon.length];
        segments.push({ a, b });
      }
    }
  }

  for (const [entity, line] of world.lineColliders.entries()) {
    const transform = world.transforms.get(entity);
    if (!transform) continue;
    const a = transform.position.add(line.segment.a.rotate(transform.rotation));
    const b = transform.position.add(line.segment.b.rotate(transform.rotation));
    lines.push({ id: `line-${entity}`, a, b });
    segments.push({ a, b });
  }

  const playerTransform = world.transforms.get(player);
  if (!playerTransform) return;
  const canvasWidth = window.innerWidth;
  const rayCount = Math.max(320, Math.min(800, canvasWidth));
  const perception = new Array(rayCount);
  for (let i = 0; i < rayCount; i += 1) {
    const t = i / Math.max(rayCount - 1, 1);
    const angle = playerTransform.rotation - FOV / 2 + FOV * t;
    const dir = Vec2.fromAngle(angle);
    const hit = castRay(playerTransform.position, dir, segments);
    const distance = hit.distance;
    const intensity = fogIntensity(distance);
    perception[i] = {
      angle,
      distance,
      intensity
    };
  }

  const playerComponent = world.player.get(player);
  const lose = playerComponent ? playerComponent.sides < 3 : false;
  const playerSides = playerComponent?.sides ?? 4;

  useGameStore.getState().setRenderState({ polygons, houses, lines, perception, playerSides, lose });
}

function simulate(dt: number): void {
  resolvePlayerMovement(dt);
  updateLineAgents(dt);
  handleTalkRequests();
  handleRoomInteraction();
  gatherRenderData();
}

export function startGameLoop(): void {
  if (running) return;
  running = true;
  lastTime = performance.now();
  const frame = (now: number) => {
    if (!running) return;
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    accumulator += delta;
    accumulator = clamp(accumulator, 0, 0.25);
    while (accumulator >= FIXED_DT) {
      simulate(FIXED_DT);
      accumulator -= FIXED_DT;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function stopGameLoop(): void {
  running = false;
}
