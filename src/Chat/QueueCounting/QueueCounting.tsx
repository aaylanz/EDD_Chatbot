import {
  ChatSdk,
  ChatEvent,
  isSetPositionInQueueEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { useState, useEffect } from 'react';
import { Alert, Typography } from '@mui/material';

interface QueueCountingProps {
  sdk: ChatSdk;
}

export function QueueCounting({ sdk }: QueueCountingProps): JSX.Element | null {
  const [queuePosition, setQueuePosition] = useState<number | null>(null);

  useEffect(() => {
    const removeListenerCallback = sdk.onChatEvent(
      ChatEvent.SET_POSITION_IN_QUEUE,
      (event) => {
        if (isSetPositionInQueueEvent(event.detail)) {
          const position = event.detail.data.positionInQueue;
          console.log('Queue position updated:', position);
          setQueuePosition(position);
        }
      },
    );

    return removeListenerCallback;
  }, [sdk]);

  if (sdk.isLivechat === false) {
    return null;
  }

  if (queuePosition === null || queuePosition === 0) {
    return null;
  }

  const message =
    queuePosition === 1
      ? 'You are next in the queue.'
      : `There ${queuePosition === 2 ? 'is' : 'are'} ${queuePosition - 1} ${queuePosition === 2 ? 'person' : 'people'} ahead of you in the queue.`;

  return (
    <Alert severity="info" sx={{ margin: '0.5rem 1rem' }} data-testid="queue-counting">
      <Typography variant="body2" fontWeight="bold">
        All agents are currently busy
      </Typography>
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
}
