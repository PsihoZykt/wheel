'use client';

import Link from 'next/link';
import { Container, Typography, Button, Box } from '@mui/material';
import { Home } from '@mui/icons-material';

export default function NotFound() {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Страница не найдена
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          К сожалению, запрашиваемая страница не существует.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          startIcon={<Home />}
          sx={{ mt: 2 }}
        >
          Вернуться на главную
        </Button>
      </Box>
    </Container>
  );
}

