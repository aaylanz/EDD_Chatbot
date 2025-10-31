import { ChatSdk } from '@nice-devone/nice-cxone-chat-web-sdk';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useState } from 'react';

interface StartLivechatButtonProps {
  sdk: ChatSdk;
  handleStartLivechat: () => Promise<void>;
}
export function StartLivechatButton({
  sdk,
  handleStartLivechat,
}: StartLivechatButtonProps): JSX.Element | null {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onButtonClick = useCallback(async () => {
    setIsLoading(true);
    await handleStartLivechat();
  }, [handleStartLivechat]);

  if (sdk.isLivechat === false) {
    return null;
  }

  const LoadingIcon = isLoading ? <CircularProgress color="inherit" /> : null;

  return (
    <Button
      variant="contained"
      size="small"
      onClick={onButtonClick}
      startIcon={LoadingIcon}
      sx={{
        backgroundColor: 'var(--edd-blue)',
        color: 'white',
        textTransform: 'none',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: '#055580',
        },
      }}
    >
      Start Livechat
    </Button>
  );
}
