import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
  AssignedAgentChangedData,
  AssignedAgentChangedEvent,
  ChatEvent,
  ChatEventData,
  ChatSdk,
  ContactToRoutingQueueAssignmentChangedChatEvent,
  isAgentTypingEndedEvent,
  isAgentTypingStartedEvent,
  isMessageCreatedEvent,
  LivechatThread,
  Message as ContentMessage,
  MessageType,
  Thread,
} from '@nice-devone/nice-cxone-chat-web-sdk';

import { MessagesBoard } from './MessagesBoard/MessagesBoard';
import { SendMessageForm } from './SendMessageForm/SendMessageForm';
import { Customer } from './Customer/Customer';
import { useWindowFocus } from '../hooks/focus';
import { parseAgentName } from './Agent/agentName';
import { Typography } from '@mui/material';
import { mergeMessages } from '../state/messages/mergeMessages';
import { STORAGE_CHAT_CUSTOMER_NAME } from '../constants';
import { AgentTyping } from './Agent/AgentTyping';
import { Header } from './Header/Header';
import { ChatOptions, ChatOption } from './Options/ChatOptions';
import { SystemMessage } from './SystemMessage/SystemMessage';
import { Postback } from './MessageRichContent/MessageRichContent.tsx';
import {
  EmployeeInfoDialog,
  EmployeeInfo,
} from './EmployeeInfo/EmployeeInfoDialog';
import { CustomField, customFieldsArrayToRecord } from './utils/composeMessageData';

type Message = ContentMessage | SystemMessage;

interface ChatWindowProps {
  sdk: ChatSdk;
  thread: Thread | LivechatThread;
  onClose: () => void;
}

export const ChatWindow: FC<ChatWindowProps> = ({ sdk, thread, onClose }) => {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [customerName, setCustomerName] = useState<string>(
    localStorage.getItem(STORAGE_CHAT_CUSTOMER_NAME) ?? '',
  );
  const windowFocus = useWindowFocus();
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentTyping, setAgentTyping] = useState<boolean | null>(null);
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [pendingOption, setPendingOption] = useState<ChatOption | null>(null);

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
      } catch (error) {
        console.error(error);
      }
    };

    recover();
  }, [sdk, thread]);

  useEffect(() => {
    const removeMessageCreatedEventListener = thread.onThreadEvent(
      ChatEvent.MESSAGE_CREATED,
      handleMessageAdded,
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
      removeAssignedAgentChangedListener();
      removeRoutingQueueAssignmentChangedListener();
      removeAgentTypingStartedListener();
      removeAgentTypingEndedListener();
    };
  }, []);

  useEffect(() => {
    if (windowFocus && messages.size > 0) {
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
        console.log('Agent started typing');
        setAgentTyping(true);
      }
    },
    [],
  );

  const handleAgentTypingEndedEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (isAgentTypingEndedEvent(event.detail)) {
        console.log('Agent stopped typing');
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

  const handleSendMessage = useCallback(
    (messageText: string, customFields?: CustomField[]) => {
      if (customFields && customFields.length > 0) {
        const messageData = {
          thread: {
            idOnExternalPlatform: thread.idOnExternalPlatform,
          },
          idOnExternalPlatform: `message:${Math.random()}`,
          messageContent: {
            type: MessageType.TEXT,
            payload: {
              text: messageText,
              postback: undefined,
              elements: undefined,
            },
          },
          consumer: {
            customFields: customFields,
          },
          consumerContact: {
            customFields: customFields,
          },
          attachments: [],
          browserFingerprint: {
            browser: null,
            browserVersion: null,
            country: null,
            ip: null,
            language: '',
            location: null,
            os: null,
            osVersion: null,
            deviceToken: undefined,
            deviceType: null,
            applicationType: null,
          },
        };
        thread.sendMessage(messageData);
      } else {
        thread.sendTextMessage(messageText);
      }
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

  const handlePostback = useCallback(
    async (postback: Postback) => {
      const { text, postback: postbackValue } = postback;
      await thread.sendPostbackMessage(postbackValue, text);
    },
    [thread],
  );

  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (messages.size > 0) {
      setShowWelcome(false);
    }
  }, [messages.size]);

  const handleOptionSelect = async (option: ChatOption) => {
    if (option.label === 'Windows Unlock') {
      setPendingOption(option);
      setShowEmployeeDialog(true);
      return;
    }

    handleSendMessage(option.value);
    setShowWelcome(false);

    console.log('Selected option:', {
      label: option.label,
      value: option.value,
      queueId: option.queueId,
    });
  };

  const handleEmployeeInfoSubmit = async (info: EmployeeInfo) => {
    setShowEmployeeDialog(false);

    const customFields: CustomField[] = [
      { ident: 'reason_for_chat', value: pendingOption?.caseName || '' },
      { ident: 'emp_id', value: info.employeeId },
      { ident: 'user_name', value: info.name },
      { ident: 'callback_number', value: info.callbackNumber },
    ];
    const contactCustomFields = customFieldsArrayToRecord(customFields);

    localStorage.setItem(STORAGE_CHAT_CUSTOMER_NAME, info.name);
    setCustomerName(info.name);
    sdk.getCustomer()?.setName(info.name);

    if (pendingOption) {
      try {
        await thread.setCustomFields(contactCustomFields);
      } catch (error) {
        console.error('Failed to set contact custom fields', error);
      }
      handleSendMessage(pendingOption.value, customFields);
      setShowWelcome(false);

      console.log('Selected option with employee info:', {
        label: pendingOption.label,
        value: pendingOption.value,
        caseName: pendingOption.caseName,
        queueId: pendingOption.queueId,
        employeeInfo: info,
        customFields: customFields,
      });

      setPendingOption(null);
    }
  };

  const handleEmployeeInfoCancel = () => {
    setShowEmployeeDialog(false);
    setPendingOption(null);
  };

  return (
    <>
      <EmployeeInfoDialog
        open={showEmployeeDialog}
        onSubmit={handleEmployeeInfoSubmit}
        onCancel={handleEmployeeInfoCancel}
      />
      <div className="chat-window">
        <Header onClose={onClose} />
        <div className="chat-content">
          <div className="chat-messages">
            {showWelcome ? (
              <>
                <div className="message bot">
                  <img
                    src={`${import.meta.env.BASE_URL}images/simple-icon.svg`}
                    alt=""
                  />
                  <div className="message-content">
                    Hello! I'm EDD's virtual assistant. I'd be happy to guide
                    you on next steps or provide other helpful information!
                    Let's get started! Which option can I help you with?
                  </div>
                </div>
                <ChatOptions onSelect={handleOptionSelect} />
              </>
            ) : (
              <>
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
                  <Typography
                    variant="subtitle2"
                    sx={{ padding: '0.5rem 1rem' }}
                  >
                    You are talking with {agentName}
                  </Typography>
                )}
                {agentTyping ? <AgentTyping /> : null}
              </>
            )}
          </div>
          <SendMessageForm
            onSubmit={handleSendMessage}
            onFileUpload={handleFileUpload}
            onKeyUp={handleMessageKeyUp}
            disabled={false}
          />
        </div>
      </div>
    </>
  );
};
