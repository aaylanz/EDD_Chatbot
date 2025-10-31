import {
  MessageType,
  SendMessageEventData,
  ThreadIdOnExternalPlatform,
} from '@nice-devone/nice-cxone-chat-web-sdk';

export interface CustomField {
  ident: string;
  value: string;
}

export function composeSendMessageData(
  messageText: string,
  threadId: ThreadIdOnExternalPlatform,
  customFields?: CustomField[]
): SendMessageEventData {
  return {
    thread: {
      idOnExternalPlatform: threadId,
    },
    consumer: {
      customFields: customFields || []
    },
    consumerContact: {
      customFields: customFields || []
    },
    idOnExternalPlatform: `message:${Math.random()}`,
    messageContent: {
      type: MessageType.TEXT,
      payload: {
        text: messageText,
        postback: undefined,
        elements: undefined
      }
    },
    attachments: [],
    browserFingerprint: {
      browser: null,
      browserVersion: null,
      country: null,
      ip: null,
      language: "",
      location: null,
      os: null,
      osVersion: null,
      deviceToken: undefined,
      deviceType: null,
      applicationType: null
    }
  }
}
