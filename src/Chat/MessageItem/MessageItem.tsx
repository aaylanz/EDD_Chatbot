import './MessageItem.css';
import { Message } from '@nice-devone/nice-cxone-chat-web-sdk';
import { FC } from 'react';
import { MessageAttachments } from './MessageAttachments.tsx';
import { MessageText } from './MessageText.tsx';
import {
  MessageRichContent,
  Postback,
} from '../MessageRichContent/MessageRichContent.tsx';

interface MessageItemProps {
  message: Message;
  onAction: (postback: Postback) => void;
}

export const MessageItem: FC<MessageItemProps> = ({ message, onAction }) => {
  const isBot = message.direction === 'outbound';

  return (
    <div
      className={`message-item ${isBot ? 'message-item__outbound' : 'message-item__inbound'}`}
    >
      {isBot && <img src={`${import.meta.env.BASE_URL}images/simple-icon.svg`} alt="" className="avatar" />}
      <div className="message-content">
        <MessageAttachments attachments={message.attachments} />
        <MessageText text={message.messageContent.payload.text} />
        <MessageRichContent message={message} onAction={onAction} />
      </div>
    </div>
  );
};
