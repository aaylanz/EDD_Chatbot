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
    queueId: 'DEV_Windows_Unlock_Chat', // Maps to CXone skill ID 35606166
  },
  {
    label: 'Windows Password Reset',
    value: 'Windows Password Reset',
    queueId: 'Windows_Password_Reset', // Maps to CXone skill ID 35665540
  },
  {
    label: 'Mainframe Account Revoked',
    value: 'Mainframe Account Revoked',
    queueId: 'Mainframe_Account_Revoked', // Maps to CXone skill ID 35665541
  },
  {
    label: 'MFA Support',
    value: 'MFA Support',
    queueId: 'MFA_Support', // Maps to CXone skill ID 35665543
  },
  {
    label: 'Report Outage',
    value: 'Report Outage',
    queueId: 'Report_Outage', // Maps to CXone skill ID 35665544
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
