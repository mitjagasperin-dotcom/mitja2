import { ReactNode } from "react";
import "@styles/index.css";

interface ChoiceButtonProps {
  index: number;
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

export function ChoiceButton({ index, children, disabled, onClick }: ChoiceButtonProps): JSX.Element {
  return (
    <button className="choice-button" onClick={onClick} disabled={disabled} data-index={index}>
      <span className="choice-index">{index + 1}</span>
      <span className="choice-label">{children}</span>
    </button>
  );
}
