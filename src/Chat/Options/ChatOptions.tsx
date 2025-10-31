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
    queueId: 'windows_unlock_chat',
  },
  {
    label: 'Windows Password Reset',
    value: 'Windows Password Reset',
    queueId: 'windows_password_reset',
  },
  {
    label: 'Mainframe Account Revoked',
    value: 'Mainframe Account Revoked',
    queueId: 'mainframe_account_revoked',
  },
  {
    label: 'MFA Support',
    value: 'MFA Support',
    queueId: 'mfa_support',
  },
  {
    label: 'Outage',
    value: 'Outage',
    queueId: 'outage',
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
