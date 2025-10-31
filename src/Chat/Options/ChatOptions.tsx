import { FC } from 'react';

export interface ChatOption {
  label: string;
  value: string;
  caseName: string;  // The case name sent to NICE (e.g., "win_unlock")
  queueId?: string;
}

interface ChatOptionsProps {
  onSelect: (option: ChatOption) => void;
}

const CHAT_OPTIONS: ChatOption[] = [
  {
    label: 'Windows Unlock',
    value: 'Windows Unlock',
    caseName: 'win_unlock',
    queueId: 'win_unlock_chat',
  },
  {
    label: 'Windows Password Reset',
    value: 'Windows Password Reset',
    caseName: 'win_password_reset',
    queueId: 'Windows_Password_Reset',
  },
  {
    label: 'Mainframe Account Revoked',
    value: 'Mainframe Account Revoked',
    caseName: 'mainframe_revoked',
    queueId: 'Mainframe_Account_Revoked',
  },
  {
    label: 'Report Outage',
    value: 'Report Outage',
    caseName: 'report_outage',
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
