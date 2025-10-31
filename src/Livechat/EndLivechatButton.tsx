import { ChatSdk } from '@nice-devone/nice-cxone-chat-web-sdk';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useState } from 'react';

interface EndLivechatButtonProps {
  sdk: ChatSdk;
  handleEndLivechat: () => Promise<void>;
}
export function EndLivechatButton({
  sdk,
  handleEndLivechat,
}: EndLivechatButtonProps): JSX.Element | null {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onButtonClick = useCallback(async () => {
    setIsLoading(true);
    await handleEndLivechat();
    setIsLoading(false);
  }, [handleEndLivechat]);

  if (sdk.isLivechat === false) {
    return null;
  }

  return (
    <button
      onClick={onButtonClick}
      disabled={isLoading}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--edd-blue)',
        cursor: isLoading ? 'default' : 'pointer',
        fontSize: '0.85rem',
        padding: 0,
        textDecoration: 'underline',
      }}
      onMouseEnter={(e) => !isLoading && (e.currentTarget.style.color = '#055580')}
      onMouseLeave={(e) => !isLoading && (e.currentTarget.style.color = 'var(--edd-blue)')}
    >
      {isLoading ? <CircularProgress size={14} /> : 'End Livechat'}
    </button>
  );
}
