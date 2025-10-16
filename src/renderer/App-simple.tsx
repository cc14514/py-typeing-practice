import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

// 简化版页面组件
const HomePage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>🎮 现代化打字练习</h1>
    <p>欢迎使用全新的现代化打字练习应用！</p>
    <p>从"上个世纪的丑陋软件"升级为Material Design界面</p>
  </Box>
);

const GamePage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>🎯 游戏练习</h1>
    <p>现代化的打字游戏界面即将到来...</p>
  </Box>
);

const AdventurePage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>🗺️ 冒险模式</h1>
    <p>探索打字冒险世界...</p>
  </Box>
);

const SettingsPage = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <h1>⚙️ 设置</h1>
    <p>个性化您的打字体验...</p>
  </Box>
);

// 简化的导航栏
const SimpleNavbar = () => (
  <Box sx={{ 
    display: 'flex', 
    gap: 2, 
    p: 2, 
    backgroundColor: '#6c5ce7', 
    color: 'white' 
  }}>
    <a href="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 首页</a>
    <a href="/game" style={{ color: 'white', textDecoration: 'none' }}>🎮 游戏</a>
    <a href="/adventure" style={{ color: 'white', textDecoration: 'none' }}>🗺️ 冒险</a>
    <a href="/settings" style={{ color: 'white', textDecoration: 'none' }}>⚙️ 设置</a>
  </Box>
);

// 深色主题
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6c5ce7',
    },
    secondary: {
      main: '#00b894',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <SimpleNavbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/adventure" element={<AdventurePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;