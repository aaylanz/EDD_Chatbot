import {
  SendMessageEventData,
  ThreadIdOnExternalPlatform,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { CustomField } from './composeMessageData';

export function composeAttachmentsMessageData(
  threadId: ThreadIdOnExternalPlatform,
  customFields?: CustomField[]
): Omit<SendMessageEventData, 'attachments' | 'messageContent'> {
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
