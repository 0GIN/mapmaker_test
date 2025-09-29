'use client';

import { Box, Container, Typography, Link, Stack } from '@mui/material';
import { GitHub, LinkedIn, Email } from '@mui/material/icons-material';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'grey.100', 
        py: 6, 
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              MapMaker Test
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Built with Next.js, TypeScript, and Material-UI
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={3} justifyContent="center">
            <Link href="#" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GitHub />
              GitHub
            </Link>
            <Link href="#" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkedIn />
              LinkedIn
            </Link>
            <Link href="#" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email />
              Email
            </Link>
          </Stack>
          
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            © 2025 MapMaker Test. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}