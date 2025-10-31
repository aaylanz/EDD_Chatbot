import { FC, useState } from 'react';
import { ChatWindow } from './ChatWindow';
import {
  ChatSdk,
  Thread,
  LivechatThread,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { HelpButton } from './HelpButton';

interface ChatProps {
  sdk: ChatSdk;
  thread: Thread | LivechatThread;
}

export const Chat: FC<ChatProps> = ({ sdk, thread }) => {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <div className="chat-container">
      {isChatVisible && (
        <ChatWindow sdk={sdk} thread={thread} onClose={toggleChat} />
      )}
      <HelpButton onClick={toggleChat} />
    </div>
  );
};
