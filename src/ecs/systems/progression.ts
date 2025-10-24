import { MIN_SIDES } from "@app/constants";
import { GameContent, WorldState, getPlayer } from "@app/world";
import { DialogueChoiceEffect } from "@ecs/types";
import { buildRegularPolygon } from "@geom/polygon";

export interface ProgressionResult {
  lost: boolean;
  sides: number;
  explanation?: string;
}

export function applyDialogueEffects(world: WorldState, effects?: DialogueChoiceEffect): ProgressionResult | null {
  if (!effects) return null;
  const player = getPlayer(world);
  if (!player.sideCounter || !player.polygon) return null;
  if (effects.sidesDelta) {
    player.sideCounter.sides += effects.sidesDelta;
    if (player.sideCounter.sides < MIN_SIDES) {
      player.sideCounter.sides = MIN_SIDES;
      return { lost: true, sides: player.sideCounter.sides, explanation: effects.explanation };
    }
    player.polygon.sides = player.sideCounter.sides;
    player.polygon.vertices = buildRegularPolygon({
      n: player.polygon.sides,
      center: player.transform.position,
      radius: player.polygon.radius,
      rotation: player.transform.rotation,
    });
  }
  return { lost: false, sides: player.sideCounter.sides, explanation: effects.explanation };
}

export function evaluatePuzzle(world: WorldState, content: GameContent, puzzleId: string, choiceIndex: number): ProgressionResult | null {
  const puzzle = content.puzzles[puzzleId];
  if (!puzzle) return null;
  const correct = choiceIndex === puzzle.correctIndex;
  return applyDialogueEffects(world, correct ? puzzle.effectsOnCorrect : { ...puzzle.effectsOnWrong, explanation: puzzle.explainWrong });
}
