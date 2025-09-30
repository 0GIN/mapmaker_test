import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Ładowanie warstw...' 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        gap: 2
      }}
    >
      <CircularProgress 
        size={32}
        sx={{ color: '#4fc3f7' }}
      />
      <Typography
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '12px'
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};