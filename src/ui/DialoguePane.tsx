import { useGameStore } from "../app/store";
import { ChoiceButton } from "./ChoiceButton";
import "./ui.css";

export function DialoguePane() {
  const dialogue = useGameStore((state) => state.dialogue);
  const advanceDialogue = useGameStore((state) => state.advanceDialogue);
  const dismissDialogue = useGameStore((state) => state.dismissDialogue);
  const puzzle = useGameStore((state) => state.puzzle);
  const answerPuzzle = useGameStore((state) => state.answerPuzzle);

  return (
    <aside className="dialogue-pane">
      <header className="dialogue-header">
        <h2>Dialogue</h2>
        {dialogue && <span className="dialogue-shape">n = {dialogue.iconSides}</span>}
      </header>
      <div className="dialogue-content">
        {dialogue ? (
          <div className="dialogue-body">
            <p className="dialogue-text">{dialogue.text}</p>
            <div className="dialogue-choices">
              {dialogue.options.map((choice, index) => (
                <ChoiceButton key={choice.label} label={choice.label} index={index} onSelect={(i) => advanceDialogue(i)} />
              ))}
            </div>
            <button className="dismiss-button" onClick={() => dismissDialogue()}>
              Close
            </button>
          </div>
        ) : puzzle ? (
          <div className="dialogue-body">
            <h3 className="puzzle-title">Puzzle</h3>
            <p className="dialogue-text">{puzzle.prompt}</p>
            <div className="dialogue-choices">
              {puzzle.choices.map((choice, index) => (
                <ChoiceButton key={choice} label={choice} index={index} onSelect={(i) => answerPuzzle(i)} disabled={puzzle.resolved} />
              ))}
            </div>
            {puzzle.resolved && puzzle.explanation && <p className="puzzle-explanation">{puzzle.explanation}</p>}
          </div>
        ) : (
          <p className="dialogue-placeholder">Approach an agent (T) or enter a Strange Space (F).</p>
        )}
      </div>
    </aside>
  );
}
