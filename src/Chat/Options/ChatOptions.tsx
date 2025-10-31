import { FC } from 'react';

export interface ChatOption {
  label: string;
  value: string;
  queueId?: string;
}

interface ChatOptionsProps {
  onSelect: (option: ChatOption) => void;
}

const CHAT_OPTIONS: ChatOption[] = [
  {
    label: 'Windows Unlock',
    value: 'Windows Unlock',
    queueId: 'DEV_Windows_Unlock_Chat',
  },
  {
    label: 'Windows Password Reset',
    value: 'Windows Password Reset',
    queueId: 'Windows_Password_Reset',
  },
  {
    label: 'Mainframe Account Revoked',
    value: 'Mainframe Account Revoked',
    queueId: 'Mainframe_Account_Revoked',
  },
  {
    label: 'Report Outage',
    value: 'Report Outage',
    queueId: 'Report_Outage',
  },
];

export const ChatOptions: FC<ChatOptionsProps> = ({ onSelect }) => {
  return (
    <div className="chat-options">
      {CHAT_OPTIONS.map((option) => (
        <button
          key={option.value}
          className="option-button"
          onClick={() => onSelect(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
