import { FC } from 'react';

interface HelpButtonProps {
  onClick: () => void;
}

export const HelpButton: FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button className="help-btn" onClick={onClick}>
      ?
    </button>
  );
};
