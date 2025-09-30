import { Box, Typography, IconButton } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        gap: 2,
        bgcolor: 'rgba(244, 67, 54, 0.1)',
        border: '1px solid rgba(244, 67, 54, 0.3)',
        borderRadius: '4px',
        mx: 1,
        my: 2
      }}
    >
      <ErrorIcon sx={{ color: '#f44336', fontSize: '24px' }} />
      <Typography
        sx={{
          color: '#f44336',
          fontSize: '11px',
          textAlign: 'center',
          wordBreak: 'break-word'
        }}
      >
        {error}
      </Typography>
      {onRetry && (
        <IconButton
          size="small"
          onClick={onRetry}
          sx={{
            color: '#4fc3f7',
            fontSize: '12px',
            '&:hover': {
              bgcolor: 'rgba(79, 195, 247, 0.1)'
            }
          }}
        >
          <RefreshIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      )}
    </Box>
  );
};