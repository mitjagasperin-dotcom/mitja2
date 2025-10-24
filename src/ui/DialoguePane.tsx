import { useEffect } from "react";
import { useGameStore } from "@app/store";
import { ChoiceButton } from "@ui/ChoiceButton";

export function DialoguePane(): JSX.Element {
  const dialogue = useGameStore((state) => state.dialogue);
  const dialogueResult = useGameStore((state) => state.dialogueResult);
  const chooseDialogue = useGameStore((state) => state.chooseDialogue);

  useEffect(() => {
    if (!dialogue) return;
    const handler = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const index = parseInt(event.key, 10) - 1;
      if (!Number.isNaN(index)) {
        chooseDialogue(index);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [chooseDialogue, dialogue]);

  if (!dialogue) {
    return (
      <aside className="dialogue-pane empty">
        <p>Select an agent with T to begin a conversation.</p>
      </aside>
    );
  }

  const choices = dialogue.currentNode.choices ?? [];

  return (
    <aside className="dialogue-pane">
      <header className="dialogue-header">
        <div className="dialogue-avatar">n={dialogue.dialogue.actor.shape.n}</div>
        <div>
          <h2 className="dialogue-name">{dialogue.dialogue.actor.name}</h2>
          <p className="dialogue-text">{dialogue.currentNode.text}</p>
        </div>
      </header>
      <div className="dialogue-choices">
        {choices.length === 0 && dialogue.currentNode.end ? (
          <p className="dialogue-end">Conversation concluded.</p>
        ) : (
          choices.map((choice, index) => (
            <ChoiceButton key={`${choice.label}-${index}`} index={index} onClick={() => chooseDialogue(index)}>
              {choice.label}
            </ChoiceButton>
          ))
        )}
      </div>
      {dialogueResult?.explanation ? <p className="dialogue-explanation">{dialogueResult.explanation}</p> : null}
    </aside>
  );
}
