import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container,
  LinearProgress,
  Button,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { PlayArrow, Pause, Refresh, Home } from '@mui/icons-material';

import { RootState } from '../store/store';
import { 
  startGame, 
  pauseGame, 
  updateInput, 
  resetGame,
  finishGame 
} from '../store/gameSlice';

// 示例文本数据
const SAMPLE_TEXTS = {
  easy: [
    "The cat sits on the mat.",
    "I like to eat apples and oranges.",
    "Today is a beautiful sunny day.",
    "She reads books every evening.",
    "We play games in the park."
  ],
  medium: [
    "Technology has revolutionized the way we communicate with each other.",
    "Learning to type efficiently can significantly improve your productivity.",
    "Practice makes perfect, especially when it comes to developing new skills.",
    "The quick brown fox jumps over the lazy dog near the riverbank.",
    "Modern keyboards are designed for comfort and speed during extended use."
  ],
  hard: [
    "Artificial intelligence and machine learning algorithms are transforming industries.",
    "The implementation of cybersecurity measures requires comprehensive understanding of potential vulnerabilities.",
    "Quantum computing represents a paradigm shift in computational methodology and problem-solving approaches.",
    "Sustainable development initiatives necessitate collaborative efforts between governments, corporations, and communities.",
    "Cryptocurrency blockchain technology demonstrates decentralized financial system innovations."
  ]
};

const GamePage: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const { animationsEnabled } = useSelector((state: RootState) => state.ui);
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // 开始新游戏
  const handleStartGame = () => {
    const texts = SAMPLE_TEXTS[gameState.difficulty];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    dispatch(startGame(randomText));
  };

  // 处理用户输入
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    dispatch(updateInput(value));
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      dispatch(pauseGame());
    }
  };

  // 重置游戏
  const handleResetGame = () => {
    dispatch(resetGame());
  };

  // 暂停/继续游戏
  const handlePauseGame = () => {
    dispatch(pauseGame());
  };

  // 渲染文本（带高亮显示）
  const renderText = () => {
    const { currentText, userInput, currentIndex } = gameState;
    
    return currentText.split('').map((char, index) => {
      let className = '';
      let style: React.CSSProperties = {};
      
      if (index < userInput.length) {
        // 已输入的字符
        if (userInput[index] === char) {
          className = 'correct-char';
          style = { 
            backgroundColor: 'rgba(0, 184, 148, 0.2)', 
            color: '#00b894' 
          };
        } else {
          className = 'incorrect-char';
          style = { 
            backgroundColor: 'rgba(225, 112, 85, 0.2)', 
            color: '#e17055' 
          };
        }
      } else if (index === userInput.length) {
        // 当前要输入的字符
        className = 'current-char';
        style = { 
          backgroundColor: 'rgba(108, 92, 231, 0.3)',
          animation: 'blink 1s infinite'
        };
      }
      
      return (
        <span 
          key={index} 
          className={className}
          style={{
            fontSize: '1.2rem',
            padding: '2px 1px',
            borderRadius: '2px',
            ...style
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  // 计算进度百分比
  const progress = gameState.currentText.length > 0 
    ? (gameState.userInput.length / gameState.currentText.length) * 100 
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 游戏状态栏 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animationsEnabled ? 0.6 : 0 }}
      >
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {gameState.stats.wpm}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    WPM
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="secondary" fontWeight="bold">
                    {Math.round(gameState.stats.accuracy)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    精确度
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    {Math.round(gameState.stats.timeElapsed)}s
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    时间
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="error.main" fontWeight="bold">
                    {gameState.stats.errors}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    错误
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {!gameState.isPlaying && !gameState.isFinished && (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={handleStartGame}
                    sx={{ borderRadius: 2 }}
                  >
                    开始
                  </Button>
                )}
                {gameState.isPlaying && (
                  <Button
                    variant="outlined"
                    startIcon={<Pause />}
                    onClick={handlePauseGame}
                    sx={{ borderRadius: 2 }}
                  >
                    {gameState.isPaused ? '继续' : '暂停'}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={handleResetGame}
                  sx={{ borderRadius: 2 }}
                >
                  重置
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          {/* 进度条 */}
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)',
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              进度: {Math.round(progress)}%
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* 主要游戏区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animationsEnabled ? 0.6 : 0, delay: 0.2 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* 文本显示区域 */}
            <Box
              sx={{
                minHeight: 120,
                p: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(108, 92, 231, 0.05)',
                border: '2px solid rgba(108, 92, 231, 0.1)',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '1.2rem',
                lineHeight: 1.8,
                letterSpacing: '0.02em',
                mb: 3,
              }}
            >
              {gameState.currentText ? renderText() : (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  点击"开始"按钮开始练习...
                </Typography>
              )}
            </Box>

            {/* 输入区域 */}
            <textarea
              value={gameState.userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={!gameState.isPlaying || gameState.isPaused}
              placeholder={gameState.isPlaying ? "在此输入..." : "准备开始练习"}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '16px',
                border: '2px solid rgba(108, 92, 231, 0.2)',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: 'inherit',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6c5ce7';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(108, 92, 231, 0.2)';
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* 游戏结果 */}
      {gameState.isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: animationsEnabled ? 0.5 : 0 }}
        >
          <Card sx={{ background: 'linear-gradient(135deg, #00b894, #00cec9)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                🎉 练习完成！
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={6} md={3}>
                  <Typography variant="h5" fontWeight="bold">
                    {gameState.stats.wpm}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    每分钟单词数
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h5" fontWeight="bold">
                    {Math.round(gameState.stats.accuracy)}%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    准确率
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h5" fontWeight="bold">
                    {Math.round(gameState.stats.timeElapsed)}s
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    用时
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h5" fontWeight="bold">
                    {gameState.stats.errors}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    错误数
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStartGame}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                >
                  再来一次
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Home />}
                  onClick={() => window.history.back()}
                  sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  返回首页
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Container>
  );
};

export default GamePage;