import React, { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  LinearProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

interface GameStats {
  wpm: number;
  accuracy: number;
  errors: number;
  timeLeft: number;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6c5ce7',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
  },
});

const SAMPLE_TEXT = `欢迎使用现代化打字练习应用！这是一个全新设计的Material Design界面，告别了上个世纪的丑陋软件风格。现在您可以享受流畅的动画、美观的界面和智能的反馈系统。`;

const SimpleApp: React.FC = () => {
  const [gameText] = useState(SAMPLE_TEXT);
  const [userInput, setUserInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    timeLeft: 60,
  });

  // 计算统计数据
  const calculateStats = useCallback(() => {
    if (!startTime || !userInput.length) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // 分钟
    const wordsTyped = userInput.length / 5; // 假设平均每个单词5个字符
    const wpm = Math.round(wordsTyped / timeElapsed);

    let errors = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== gameText[i]) {
        errors++;
      }
    }

    const accuracy = userInput.length > 0 ? Math.round(((userInput.length - errors) / userInput.length) * 100) : 100;

    setStats(prev => ({
      ...prev,
      wpm: isNaN(wpm) ? 0 : wpm,
      accuracy,
      errors,
    }));
  }, [userInput, gameText, startTime]);

  // 游戏计时器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && stats.timeLeft > 0) {
      timer = setInterval(() => {
        setStats(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            setIsPlaying(false);
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, stats.timeLeft]);

  // 更新统计数据
  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const startGame = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
    setUserInput('');
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      timeLeft: 60,
    });
  };

  const stopGame = () => {
    setIsPlaying(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying) return;
    const value = event.target.value;
    if (value.length <= gameText.length) {
      setUserInput(value);
    }
  };

  const renderText = () => {
    return gameText.split('').map((char, index) => {
      let color = '#666';
      if (index < userInput.length) {
        color = userInput[index] === char ? '#4caf50' : '#f44336';
      } else if (index === userInput.length) {
        color = '#6c5ce7';
      }
      
      return (
        <span key={index} style={{ color, backgroundColor: index === userInput.length ? 'rgba(108, 92, 231, 0.2)' : 'transparent' }}>
          {char}
        </span>
      );
    });
  };

  const progress = ((userInput.length / gameText.length) * 100);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: '#6c5ce7', fontWeight: 'bold' }}>
          🎮 现代化打字练习
        </Typography>
        
        <Typography variant="h6" align="center" sx={{ mb: 4, color: '#b0b0b0' }}>
          告别"上个世纪的丑陋软件"，拥抱Material Design！
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">速度</Typography>
                <Typography variant="h4">{stats.wpm}</Typography>
                <Typography variant="body2" color="textSecondary">WPM</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">准确率</Typography>
                <Typography variant="h4">{stats.accuracy}%</Typography>
                <Typography variant="body2" color="textSecondary">正确率</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">错误</Typography>
                <Typography variant="h4">{stats.errors}</Typography>
                <Typography variant="body2" color="textSecondary">错误数</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">时间</Typography>
                <Typography variant="h4">{stats.timeLeft}</Typography>
                <Typography variant="body2" color="textSecondary">剩余秒数</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
          <Typography variant="h6" sx={{ mb: 2, fontFamily: 'monospace', lineHeight: 1.8, fontSize: '1.2rem' }}>
            {renderText()}
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder={isPlaying ? "开始输入上面的文字..." : "点击开始游戏后在此输入"}
            value={userInput}
            onChange={handleInputChange}
            disabled={!isPlaying}
            autoFocus={isPlaying}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1.1rem',
                fontFamily: 'monospace',
              }
            }}
          />
        </Paper>

        <Box sx={{ textAlign: 'center' }}>
          {!isPlaying ? (
            <Button 
              variant="contained" 
              size="large" 
              onClick={startGame}
              sx={{ 
                px: 4, 
                py: 2, 
                fontSize: '1.2rem',
                background: 'linear-gradient(45deg, #6c5ce7 30%, #a29bfe 90%)',
              }}
            >
              🚀 开始现代化体验
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              size="large" 
              onClick={stopGame}
              sx={{ px: 4, py: 2, fontSize: '1.2rem' }}
            >
              ⏹️ 停止游戏
            </Button>
          )}
        </Box>

        {!isPlaying && userInput.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#4caf50', mb: 2 }}>
              🎉 游戏结束！
            </Typography>
            <Typography variant="body1" sx={{ color: '#b0b0b0' }}>
              最终成绩: {stats.wpm} WPM，准确率 {stats.accuracy}%
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default SimpleApp;