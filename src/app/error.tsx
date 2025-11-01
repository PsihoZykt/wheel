'use client';

import { useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Refresh } from '@mui/icons-material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

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
        <Typography variant="h2" component="h1" gutterBottom>
          Что-то пошло не так!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Произошла ошибка при загрузке страницы.
        </Typography>
        {error.message && (
          <Typography
            variant="body2"
            color="error"
            sx={{
              p: 2,
              backgroundColor: 'error.lighter',
              borderRadius: 1,
              mb: 2,
              fontFamily: 'monospace',
            }}
          >
            {error.message}
          </Typography>
        )}
        <Button
          onClick={reset}
          variant="contained"
          startIcon={<Refresh />}
          sx={{ mt: 2 }}
        >
          Попробовать снова
        </Button>
      </Box>
    </Container>
  );
}

