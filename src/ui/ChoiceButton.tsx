interface ChoiceButtonProps {
  label: string;
  index: number;
  onSelect: (index: number) => void;
}

export default function ChoiceButton({ label, index, onSelect }: ChoiceButtonProps): JSX.Element {
  return (
    <button type="button" className="choice-button" onClick={() => onSelect(index)}>
      <span className="choice-button__key">{index + 1}</span>
      <span>{label}</span>
    </button>
  );
}
