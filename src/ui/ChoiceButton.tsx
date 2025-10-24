import "./ui.css";

interface ChoiceButtonProps {
  label: string;
  index: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export function ChoiceButton({ label, index, onSelect, disabled }: ChoiceButtonProps) {
  return (
    <button className="choice-button" disabled={disabled} onClick={() => onSelect(index)}>
      <span className="choice-index">{index + 1}.</span>
      <span className="choice-label">{label}</span>
    </button>
  );
}
