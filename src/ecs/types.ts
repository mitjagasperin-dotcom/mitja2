import type { Vec2 } from '../geom/vec2';

export type EntityType = 'player' | 'polygonAgent' | 'lineAgent' | 'house';

export interface Transform {
  position: Vec2;
  rotation: number;
}

export interface PolygonCollider {
  vertices: Vec2[];
  radius: number;
  sides: number;
}

export interface LineAgentState {
  length: number;
  angularVelocity: number;
  speed: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  transform: Transform;
  collider: PolygonCollider;
  velocity?: Vec2;
  line?: LineAgentState;
  dialogueId?: string;
  name?: string;
}

export interface DialogueChoiceEffect {
  sidesDelta?: number;
}

export interface DialogueChoice {
  label: string;
  goto?: string;
  effects?: DialogueChoiceEffect;
  end?: boolean;
}

export interface DialogueNode {
  id: string;
  text: string;
  choices: DialogueChoice[];
  end?: boolean;
}

export interface DialogueScript {
  id: string;
  actor: {
    name: string;
    shape: { type: 'regular'; n: number };
  };
  nodes: Record<string, DialogueNode>;
}

export interface DialogueSessionState {
  script: DialogueScript;
  node: DialogueNode;
  speakerId: string;
}
