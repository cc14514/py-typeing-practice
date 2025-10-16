import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          👤 个人档案
        </Typography>
        <Typography variant="h6" color="text.secondary">
          查看您的学习进度和成就
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;