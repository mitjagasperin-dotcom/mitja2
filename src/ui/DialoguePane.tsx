import { useGameStore } from '../app/store';
import ChoiceButton from './ChoiceButton';

export default function DialoguePane(): JSX.Element {
  const session = useGameStore((state) => state.dialogueSession);
  const choose = useGameStore((state) => state.chooseDialogue);

  if (!session) {
    return (
      <aside className="dialogue-pane dialogue-pane--idle">
        <h2>Flatland Dispatch</h2>
        <p>Approach an agent and press T to converse.</p>
      </aside>
    );
  }

  const { actor } = session.script;
  return (
    <aside className="dialogue-pane">
      <header className="dialogue-pane__header">
        <div className="dialogue-pane__icon">n={actor.shape.n}</div>
        <div>
          <div className="dialogue-pane__name">{actor.name}</div>
          <div className="dialogue-pane__subtitle">Regular {actor.shape.n}-gon</div>
        </div>
      </header>
      <p className="dialogue-pane__text">{session.node.text}</p>
      <div className="dialogue-pane__choices">
        {session.node.choices.map((choice, idx) => (
          <ChoiceButton key={choice.label} label={choice.label} index={idx} onSelect={choose} />
        ))}
      </div>
    </aside>
  );
}
