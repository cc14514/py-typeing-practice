import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const AdventurePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          🗺️ 冒险模式
        </Typography>
        <Typography variant="h6" color="text.secondary">
          敬请期待！这里将是您的打字冒险之旅
        </Typography>
      </Box>
    </Container>
  );
};

export default AdventurePage;