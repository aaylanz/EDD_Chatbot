import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
  AssignedAgentChangedData,
  AssignedAgentChangedEvent,
  ChatEvent,
  ChatEventData,
  ChatSdk,
  ContactStatus,
  ContactToRoutingQueueAssignmentChangedChatEvent,
  isAgentTypingEndedEvent,
  isAgentTypingStartedEvent,
  isContactStatusChangedEvent,
  isMessageCreatedEvent,
  LivechatThread,
  Message as ContentMessage,
  Thread,
} from '@nice-devone/nice-cxone-chat-web-sdk';

import { MessagesBoard } from '../Chat/MessagesBoard/MessagesBoard';
import { SendMessageForm } from '../Chat/SendMessageForm/SendMessageForm';
import { Customer } from '../Chat/Customer/Customer';
import { useWindowFocus } from '../hooks/focus';
import { parseAgentName } from '../Chat/Agent/agentName';
import { Typography } from '@mui/material';
import { QueueCounting } from '../Chat/QueueCounting/QueueCounting';
import { isLivechat } from './isLivechat';
import { EndLivechatButton } from './EndLivechatButton';
import { mergeMessages } from '../state/messages/mergeMessages';
import { STORAGE_CHAT_CUSTOMER_NAME } from '../constants';
import { AgentTyping } from '../Chat/Agent/AgentTyping';
import { SystemMessage } from '../Chat/SystemMessage/SystemMessage';
import { Postback } from '../Chat/MessageRichContent/MessageRichContent.tsx';
import { Header } from '../Chat/Header/Header';
import { ChatOptions, ChatOption } from '../Chat/Options/ChatOptions';

type Message = ContentMessage | SystemMessage;

interface LiveChatWindowProps {
  sdk: ChatSdk;
  thread: Thread | LivechatThread;
  onClose: () => void;
}

/* prettier-ignore */
enum LivechatStatus {
  NEW = 'new',
  OPEN = 'open',
  CLOSED = 'closed',
}

export const LivechatWindow: FC<LiveChatWindowProps> = ({
  sdk,
  thread,
  onClose,
}) => {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [customerName, setCustomerName] = useState<string>(
    localStorage.getItem(STORAGE_CHAT_CUSTOMER_NAME) ?? '',
  );
  const [disabled, setDisabled] = useState<boolean>(true);
  const windowFocus = useWindowFocus();
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentTyping, setAgentTyping] = useState<boolean | null>(null);
  const [livechatStatus, setLivechatStatus] = useState<LivechatStatus | null>(
    null,
  );

  // Recover thread
  useEffect(() => {
    sdk
      .getCustomer()
      ?.setName(localStorage.getItem(STORAGE_CHAT_CUSTOMER_NAME) ?? '');

    const recover = async () => {
      try {
        const recoverResponse = await thread.recover();

        const recoveredMessages =
          recoverResponse.messages.reverse() as Message[];
        setMessages((messages) => mergeMessages(messages, recoveredMessages));
        setAgentName(parseAgentName(recoverResponse.inboxAssignee));
        const contact = recoverResponse.contact;
        if (!contact) {
          return;
        }

        handleRecoverThreadStatus(contact.status);
      } catch (error) {
        if (isLivechat(thread)) {
          // if thread does not exist in the system show Livechat button
          setLivechatStatus(LivechatStatus.NEW);
          setDisabled(true);

          return;
        }

        console.error(error);
      }
    };

    recover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread]);

  // Attach ChatEvent listeners
  useEffect(() => {
    const removeMessageCreatedEventListener = thread.onThreadEvent(
      ChatEvent.MESSAGE_CREATED,
      handleMessageAdded,
    );
    const removeContactStatusChangedListener = sdk.onChatEvent(
      ChatEvent.CONTACT_STATUS_CHANGED,
      handleCloseLivechatThread,
    );
    const removeAssignedAgentChangedListener = sdk.onChatEvent(
      ChatEvent.ASSIGNED_AGENT_CHANGED,
      handleAssignedAgentChangeEvent,
    );

    const removeRoutingQueueAssignmentChangedListener = sdk.onChatEvent(
      ChatEvent.CONTACT_TO_ROUTING_QUEUE_ASSIGNMENT_CHANGED,
      handleRoutingQueueAssignmentChangedEvent,
    );

    const removeAgentTypingStartedListener = sdk.onChatEvent(
      ChatEvent.AGENT_TYPING_STARTED,
      handleAgentTypingStartedEvent,
    );

    const removeAgentTypingEndedListener = sdk.onChatEvent(
      ChatEvent.AGENT_TYPING_ENDED,
      handleAgentTypingEndedEvent,
    );

    return () => {
      removeMessageCreatedEventListener();
      removeContactStatusChangedListener();
      removeAssignedAgentChangedListener();
      removeRoutingQueueAssignmentChangedListener();
      removeAgentTypingStartedListener();
      removeAgentTypingEndedListener();
    };
  }, []);

  useEffect(() => {
    if (windowFocus) {
      thread.lastMessageSeen().catch((error) => console.error(error));
    }
  }, [thread, messages, windowFocus]);

  const handleMessageAdded = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (!isMessageCreatedEvent(event.detail)) {
        return;
      }
      const message = event.detail.data.message;

      setMessages(
        (messages) =>
          new Map<string, Message>(messages.set(message.id, message)),
      );
    },
    [],
  );

  const handleCloseLivechatThread = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (!isContactStatusChangedEvent(event.detail)) {
        return;
      }

      const status = event.detail.data.case.status;

      if (status === ContactStatus.CLOSED) {
        setLivechatStatus(LivechatStatus.CLOSED);
        setDisabled(true);
      }
    },
    [],
  );

  const handleAssignedAgentChangeEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      setAgentName(
        parseAgentName(
          (event.detail.data as AssignedAgentChangedData).inboxAssignee,
        ),
      );

      const systemMessage = event.detail as AssignedAgentChangedEvent;
      setMessages(
        (messages) =>
          new Map<string, Message>(
            messages.set(systemMessage.id, systemMessage),
          ),
      );
    },
    [],
  );

  const handleRoutingQueueAssignmentChangedEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      const systemMessage =
        event.detail as ContactToRoutingQueueAssignmentChangedChatEvent;
      setMessages(
        (messages) =>
          new Map<string, Message>(
            messages.set(systemMessage.id, systemMessage),
          ),
      );
    },
    [],
  );

  const handleAgentTypingStartedEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (isAgentTypingStartedEvent(event.detail)) {
        setAgentTyping(true);
      }
    },
    [],
  );

  const handleAgentTypingEndedEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (isAgentTypingEndedEvent(event.detail)) {
        setAgentTyping(false);
      }
    },
    [],
  );

  const handleInputCustomerNameChanged = useCallback(
    (newCustomerName: string) => {
      localStorage.setItem(STORAGE_CHAT_CUSTOMER_NAME, newCustomerName);
      setCustomerName(newCustomerName);
      sdk.getCustomer()?.setName(newCustomerName);
    },
    [],
  );

  const handleRecoverThreadStatus = useCallback((status: string) => {
    if (status === ContactStatus.CLOSED) {
      setLivechatStatus(LivechatStatus.CLOSED);
      setDisabled(true);

      return;
    }

    setLivechatStatus(LivechatStatus.OPEN);
    setDisabled(false);
  }, []);

  const handleSendMessage = useCallback(
    (messageText: string) => {
      thread.sendTextMessage(messageText);
    },
    [thread],
  );

  const handleFileUpload = useCallback(
    (fileList: FileList) => {
      thread.sendAttachments(fileList);
    },
    [thread],
  );

  const messagePreviewTimeoutId = useRef<ReturnType<typeof setTimeout>>();

  const handleMessageKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      thread.keystroke();

      const inputFieldContent = event.currentTarget.value;
      // defer sending message preview to avoid sending too many requests
      if (messagePreviewTimeoutId.current) {
        clearTimeout(messagePreviewTimeoutId.current);
      }
      messagePreviewTimeoutId.current = setTimeout(() => {
        thread.sendMessagePreview(inputFieldContent);
      }, 300);
    },
    [thread],
  );

  const handleLoadMoreMessages = useCallback(async () => {
    const loadMoreMessageResponse = await thread.loadMoreMessages();

    if (loadMoreMessageResponse === null) {
      return;
    }

    const loadedMessages =
      loadMoreMessageResponse.data.messages.reverse() || [];

    setMessages((messages) => mergeMessages(messages, loadedMessages));
  }, [thread]);

  const handleStartLivechat = useCallback(async () => {
    if (isLivechat(thread)) {
      await thread.startChat();

      setLivechatStatus(LivechatStatus.OPEN);
      setDisabled(false);
    }
  }, [thread]);

  const handleEndLivechat = useCallback(async () => {
    if (isLivechat(thread)) {
      await thread.endChat();

      setLivechatStatus(LivechatStatus.CLOSED);
      setDisabled(true);
    }
  }, [thread]);

  const handlePostback = useCallback(
    async (postback: Postback) => {
      const { text, postback: postbackValue } = postback;
      await thread.sendPostbackMessage(postbackValue, text);
    },
    [thread],
  );

  const handleOptionSelect = async (option: ChatOption) => {
    // Start livechat if it's in NEW status
    if (livechatStatus === LivechatStatus.NEW) {
      await handleStartLivechat();
    }

    // Send message with routing information
    // The message content will be used by CXone routing rules to direct to the appropriate queue
    handleSendMessage(option.value);

    // Log for debugging - this helps verify which option was selected
    console.log('Selected option:', {
      label: option.label,
      value: option.value,
      queueId: option.queueId,
    });
  };

  const showWelcome =
    livechatStatus === LivechatStatus.NEW && messages.size === 0;
  const isInputDisabled = disabled || showWelcome;

  return (
    <div className="chat-window">
      <Header onClose={onClose} />
      <div className="chat-content">
        <div className="chat-messages">
          {showWelcome ? (
            <>
              <div className="message bot">
                <img src={`${import.meta.env.BASE_URL}images/simple-icon.svg`} alt="" />
                <div className="message-content">
                  Hello! I'm EDD's virtual assistant. I'd be happy to guide you
                  on next steps or provide other helpful information! Let's get
                  started! Which option can I help you with?
                </div>
              </div>
              <ChatOptions onSelect={handleOptionSelect} />
            </>
          ) : (
            <>
              <QueueCounting sdk={sdk} />
              <Customer
                name={customerName}
                onChange={handleInputCustomerNameChanged}
              />
              <MessagesBoard
                messages={messages}
                loadMoreMessages={handleLoadMoreMessages}
                onPostback={handlePostback}
              />
              {agentName === null ? null : (
                <Typography variant="subtitle2" sx={{ padding: '0.5rem 1rem' }}>
                  You are talking with {agentName}
                </Typography>
              )}
              {livechatStatus === LivechatStatus.CLOSED ? (
                <Typography variant="subtitle2" sx={{ padding: '0.5rem 1rem' }}>
                  Your chat ended.
                </Typography>
              ) : null}
              {agentTyping ? <AgentTyping /> : null}
            </>
          )}
        </div>
        {livechatStatus === LivechatStatus.OPEN && (
          <div style={{
            padding: '0.35rem 0.75rem',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '0.85rem'
          }}>
            <EndLivechatButton
              sdk={sdk}
              handleEndLivechat={handleEndLivechat}
            />
          </div>
        )}
        <SendMessageForm
          onSubmit={handleSendMessage}
          onFileUpload={handleFileUpload}
          onKeyUp={handleMessageKeyUp}
          disabled={isInputDisabled}
        />
      </div>
    </div>
  );
};
