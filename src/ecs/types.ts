import { Vec2 } from "@geom/vec2";
import { Segment } from "@geom/vec2";
import { AnalyticShape } from "@geom/roommesh";

export type EntityId = number;

export type EntityKind = "player" | "polygonAgent" | "lineAgent" | "house" | "room" | "puzzleShape";

export interface TransformComponent {
  position: Vec2;
  rotation: number;
}

export interface KinematicsComponent {
  velocity: Vec2;
  angularVelocity: number;
}

export interface PolygonColliderComponent {
  vertices: Vec2[];
  radius: number;
  sides: number;
  isDoor?: boolean;
}

export interface LineAgentComponent {
  length: number;
  rotationSpeed: number;
  translationVelocity: Vec2;
}

export interface DialogueComponent {
  id: string;
  activeNodeId?: string;
}

export interface RoomComponent {
  id: string;
  segments: Segment[];
  shapes: AnalyticShape[];
}

export interface AgentProfileComponent {
  name: string;
  intellectRank: string;
  behaviour: "TriangleWander" | "SquareStudent" | "Scholar" | "Line";
}

export interface SideCounterComponent {
  sides: number;
}

export interface DoorComponent {
  angle: number;
  width: number;
}

export interface Entity {
  id: EntityId;
  kind: EntityKind;
  transform: TransformComponent;
  polygon?: PolygonColliderComponent;
  kinematics?: KinematicsComponent;
  line?: LineAgentComponent;
  dialogue?: DialogueComponent;
  room?: RoomComponent;
  agentProfile?: AgentProfileComponent;
  sideCounter?: SideCounterComponent;
  door?: DoorComponent;
  linkedRoomId?: string;
}

export type EntityMap = Map<EntityId, Entity>;

export interface DialogueChoiceEffect {
  sidesDelta?: number;
  explanation?: string;
}

export interface DialogueChoice {
  label: string;
  goto?: string;
  end?: boolean;
  effects?: DialogueChoiceEffect;
}

export interface DialogueNode {
  id: string;
  text: string;
  choices: DialogueChoice[];
  end?: boolean;
}

export interface DialogueDefinition {
  id: string;
  actor: {
    name: string;
    shape: { type: "regular"; n: number };
  };
  nodes: Record<string, DialogueNodeDefinition>;
}

export interface DialogueNodeDefinition {
  text: string;
  choices?: DialogueChoiceDefinition[];
  end?: boolean;
}

export interface DialogueChoiceDefinition {
  label: string;
  goto?: string;
  end?: boolean;
  effects?: DialogueChoiceEffect;
}

export interface DialogueRuntime {
  dialogue: DialogueDefinition;
  currentNode: DialogueNode;
  speakerEntityId: EntityId;
  pendingExplanation?: string;
}

export interface PuzzleDefinition {
  id: string;
  type: "numeric_mcq";
  prompt: string;
  choices: string[];
  correctIndex: number;
  effectsOnCorrect: DialogueChoiceEffect;
  effectsOnWrong: DialogueChoiceEffect;
  explainWrong?: string;
}

export interface LevelDefinition {
  id: string;
  playerStart: [number, number];
  houses: HouseDefinition[];
  agents: AgentDefinition[];
  lines: LineDefinition[];
}

export interface HouseDefinition {
  id: string;
  n: number;
  center: [number, number];
  radius: number;
  rotation: number;
  doors: DoorDefinition[];
  roomId?: string;
}

export interface DoorDefinition {
  angle: number;
  width: number;
}

export interface AgentDefinition {
  id: string;
  name: string;
  n: number;
  pos: [number, number];
  ai: AgentProfileComponent["behaviour"];
  dialogue?: string;
  intellectRank?: string;
}

export interface LineDefinition {
  id: string;
  pos: [number, number];
  length: number;
  speed: number;
  rotSpeed: number;
}

export interface RoomDefinition {
  id: string;
  equations: AnalyticShape[];
  puzzles: string[];
}
