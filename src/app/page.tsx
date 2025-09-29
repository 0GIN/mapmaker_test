'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Paper,
  Stack,
  Chip
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Build as BuildIcon, 
  Analytics as AnalyticsIcon 
} from '@mui/material/icons-material';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          MapMaker Test
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Next.js with Material-UI Integration
        </Typography>
        <Chip label="TypeScript" color="primary" sx={{ mr: 1 }} />
        <Chip label="Material-UI" color="secondary" sx={{ mr: 1 }} />
        <Chip label="Next.js 14" color="primary" variant="outlined" />
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
              <HomeIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Modern Architecture
              </Typography>
              <Typography color="text.secondary">
                Built with Next.js 14 App Router, TypeScript, and Material-UI for a robust foundation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
              <BuildIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Developer Experience
              </Typography>
              <Typography color="text.secondary">
                Professional folder structure with components, hooks, utilities, and type safety.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
              <AnalyticsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Scalable Design
              </Typography>
              <Typography color="text.secondary">
                Organized structure ready for complex applications with theme customization.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to Build Amazing Things?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This project includes all the essentials: TypeScript support, Material-UI theming, 
          professional folder structure, and modern development tools.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" size="large">
            Get Started
          </Button>
          <Button variant="outlined" size="large">
            View Documentation
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}