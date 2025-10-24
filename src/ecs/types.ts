import { Vec2, Segment } from "../geom/vec2";

export type Entity = number;

export interface TransformComponent {
  position: Vec2;
  rotation: number;
}

export interface KinematicsComponent {
  velocity: Vec2;
  angularVelocity: number;
}

export interface PolygonCollider {
  points: Vec2[];
  radius: number;
}

export interface LineAgentComponent {
  length: number;
  width: number;
  rotationSpeed: number;
}

export interface DialogueComponent {
  dialogueId: string;
  currentNode: string;
  active: boolean;
}

export interface AgentComponent {
  name: string;
  sides: number;
  intellectRank: "Triangle" | "Square" | "Scholar";
  dialogueId: string;
  mood: "neutral" | "pleased" | "upset";
}

export interface PlayerComponent {
  sides: number;
  expertMode: boolean;
  perceptionRays: number[];
}

export interface HouseComponent {
  id: string;
  polygon: Vec2[];
  doors: DoorDescriptor[];
}

export interface DoorDescriptor {
  angle: number;
  width: number;
  targetRoomId: string | null;
}

export interface RoomComponent {
  id: string;
  segments: Segment[];
  puzzles: string[];
}

export type ColliderComponent = PolygonCollider;

export interface LineColliderComponent {
  segment: Segment;
  width: number;
}

export interface DialogueSessionState {
  actorId: string | null;
  nodeId: string;
  options: DialogueChoiceState[];
  text: string;
  shapeSides: number;
  iconSides: number;
}

export interface DialogueChoiceState {
  label: string;
  goto: string | null;
  effects: DialogueEffects | null;
}

export interface DialogueEffects {
  sidesDelta?: number;
  explanation?: string;
}
