import { useGameStore } from '../app/store';

export default function ExpertToggle(): JSX.Element {
  const expertMode = useGameStore((state) => state.expertMode);
  const toggle = useGameStore((state) => state.toggleExpertMode);
  return (
    <button type="button" className="expert-toggle" onClick={toggle} title="Hide Top-Down view; progress enabled.">
      {expertMode ? 'Expert Mode' : 'Explorer Mode'}
    </button>
  );
}
