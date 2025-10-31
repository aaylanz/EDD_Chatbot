import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const blink = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
`;

export function AgentTyping(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        gap: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary" fontStyle="italic">
        Agent is typing
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'text.secondary',
            animation: `${blink} 1.4s infinite`,
            animationDelay: '0s',
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'text.secondary',
            animation: `${blink} 1.4s infinite`,
            animationDelay: '0.2s',
          }}
        />
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'text.secondary',
            animation: `${blink} 1.4s infinite`,
            animationDelay: '0.4s',
          }}
        />
      </Box>
    </Box>
  );
}
