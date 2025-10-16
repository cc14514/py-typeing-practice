import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Container,
  Paper,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  PlayArrow, 
  School, 
  EmojiEvents, 
  Settings as SettingsIcon,
  Timeline 
} from '@mui/icons-material';

import { RootState } from '../store/store';
import { navigateTo } from '../store/uiSlice';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, stats } = useSelector((state: RootState) => state.user);
  const { animationsEnabled } = useSelector((state: RootState) => state.ui);

  const quickActions = [
    {
      title: '开始练习',
      description: '立即开始打字练习',
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      color: '#6c5ce7',
      path: '/game',
      action: 'game'
    },
    {
      title: '冒险模式',
      description: '探索有趣的打字冒险',
      icon: <School sx={{ fontSize: 40 }} />,
      color: '#00b894',
      path: '/adventure',
      action: 'adventure'
    },
    {
      title: '我的成就',
      description: '查看学习成果',
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      color: '#fdcb6e',
      path: '/profile',
      action: 'profile'
    },
    {
      title: '设置',
      description: '个性化设置',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      color: '#e17055',
      path: '/settings',
      action: 'settings'
    }
  ];

  const handleQuickAction = (path: string, action: string) => {
    dispatch(navigateTo(action));
    navigate(path);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 欢迎区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animationsEnabled ? 0.6 : 0 }}
      >
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
            color: 'white',
            p: 4,
            mb: 4,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            欢迎回来，{profile.name}！
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            继续你的打字学习之旅
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3 }}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {profile.level}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                等级
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {stats.bestWPM}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                最佳速度
              </Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {Math.round(stats.bestAccuracy)}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                最佳精度
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>

      {/* 快速操作 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
          快速开始
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={action.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: animationsEnabled ? 0.6 : 0, 
                  delay: animationsEnabled ? index * 0.1 : 0 
                }}
                whileHover={{ 
                  scale: animationsEnabled ? 1.05 : 1,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: animationsEnabled ? 0.95 : 1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)`,
                    border: `2px solid transparent`,
                    '&:hover': {
                      border: `2px solid ${action.color}`,
                      boxShadow: `0 8px 32px ${action.color}40`,
                    }
                  }}
                  onClick={() => handleQuickAction(action.path, action.action)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box
                      sx={{
                        color: action.color,
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="600">
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 学习进度 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animationsEnabled ? 0.6 : 0, delay: 0.4 }}
      >
        <Typography variant="h4" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
          学习进度
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timeline sx={{ color: '#6c5ce7', mr: 1 }} />
                <Typography variant="h6" fontWeight="600">
                  本周学习统计
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="#6c5ce7">
                    {profile.totalGamesPlayed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总练习次数
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="#00b894">
                    {profile.totalTimeSpent}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总练习时间(分钟)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="#fdcb6e">
                    {stats.currentStreak}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    连续学习天数
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                今日目标
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={75}
                  size={120}
                  thickness={8}
                  sx={{
                    color: '#6c5ce7',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    75%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    已完成
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
                继续努力，快要达成今日目标了！
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default HomePage;