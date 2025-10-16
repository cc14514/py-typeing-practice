import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          ⚙️ 设置
        </Typography>
        <Typography variant="h6" color="text.secondary">
          在这里可以个性化您的打字练习体验
        </Typography>
      </Box>
    </Container>
  );
};

export default SettingsPage;