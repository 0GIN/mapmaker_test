// ===================================================================
// KOMPONENT STANU ŁADOWANIA
// ===================================================================
// Uniwersalny komponent wyświetlający spinner i opcjonalną wiadomość
// Używany podczas ładowania danych z API lub wykonywania operacji

import { Box, CircularProgress, Typography } from '@mui/material';

// ===================================================================
// INTERFACE PROPS - Właściwości komponentu
// ===================================================================
interface LoadingStateProps {
  message?: string; // Opcjonalna wiadomość do wyświetlenia
}

// ===================================================================
// LOADING STATE COMPONENT
// ===================================================================
// Wyświetla centralnie umieszczony spinner z opcjonalną wiadomością
export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Ładowanie warstw...'  // Domyślna wiadomość
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',   // Elementy jeden pod drugim
        alignItems: 'center',      // Wycentrowanie poziome
        justifyContent: 'center',  // Wycentrowanie pionowe
        p: 4,                      // Padding wokół
        gap: 2                     // Odstęp między elementami
      }}
    >
      {/* Spinner ładowania */}
      <CircularProgress 
        size={32}                    // Rozmiar spinnera
        sx={{ color: '#4fc3f7' }}   // Jasnoniebieski kolor
      />
      
      {/* Tekst informacyjny */}
      <Typography
        sx={{
          color: 'rgba(255, 255, 255, 0.7)', // Półprzezroczysty biały tekst
          fontSize: '12px'                    // Mały rozmiar czcionki
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};