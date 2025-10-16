import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import AdventurePage from './pages/AdventurePage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Navbar from './components/organisms/Navbar';
import NotificationSystem from './components/molecules/NotificationSystem';
import LoadingScreen from './components/atoms/LoadingScreen';

// Store
import { RootState } from './store/store';
import { navigateTo } from './store/uiSlice';

// Hooks
import { useTheme } from './hooks/useTheme';
import { useAudio } from './hooks/useAudio';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Redux state
  const { currentPage, animationsEnabled } = useSelector((state: RootState) => state.ui);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  
  // Custom hooks
  const { themeColors, switchTheme } = useTheme();
  const { playSound, playMusic, stopMusic } = useAudio();

  // 页面切换动画配置
  const pageVariants = {
    initial: {
      opacity: 0,
      x: animationsEnabled ? 50 : 0,
      scale: animationsEnabled ? 0.95 : 1,
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      x: animationsEnabled ? -50 : 0,
      scale: animationsEnabled ? 0.95 : 1,
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: animationsEnabled ? 0.4 : 0,
  };

  // 监听路由变化
  useEffect(() => {
    const pathToPage: { [key: string]: string } = {
      '/': 'home',
      '/game': 'game',
      '/adventure': 'adventure',
      '/settings': 'settings',
      '/profile': 'profile',
    };
    
    const page = pathToPage[location.pathname] || 'home';
    if (page !== currentPage) {
      dispatch(navigateTo(page));
    }
  }, [location.pathname, currentPage, dispatch]);

  // 监听菜单事件
  useEffect(() => {
    const handleNewGame = () => {
      playSound('click');
      dispatch(navigateTo('game'));
    };

    const handleSettings = () => {
      playSound('click');
      dispatch(navigateTo('settings'));
    };

    const handleAbout = () => {
      playSound('click');
      // 显示关于对话框
    };

    // 使用 electronAPI 监听菜单事件（如果在 Electron 环境中）
    if (window.electronAPI) {
      window.electronAPI.on('menu-new-game', handleNewGame);
      window.electronAPI.on('menu-settings', handleSettings);
      window.electronAPI.on('menu-about', handleAbout);
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('menu-new-game');
        window.electronAPI.removeAllListeners('menu-settings');
        window.electronAPI.removeAllListeners('menu-about');
      }
    };
  }, [dispatch, playSound]);

  // 启动背景音乐
  useEffect(() => {
    const startBackgroundMusic = async () => {
      try {
        await playMusic('background', { loop: true, volume: 0.3 });
      } catch (error) {
        console.log('无法播放背景音乐:', error);
      }
    };

    if (isLoggedIn) {
      startBackgroundMusic();
    }

    return () => {
      stopMusic();
    };
  }, [isLoggedIn, playMusic, stopMusic]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: themeColors.background,
        color: themeColors.text,
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* 导航栏 */}
      <Navbar />

      {/* 主内容区域 */}
      <Container
        maxWidth="xl"
        sx={{
          minHeight: 'calc(100vh - 64px)',
          padding: { xs: 1, sm: 2, md: 3 },
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{
              position: 'absolute',
              width: '100%',
              left: 0,
              top: 0,
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/adventure" element={<AdventurePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* 通知系统 */}
      <NotificationSystem />

      {/* 全局加载屏幕 */}
      <LoadingScreen />

      {/* 粒子背景效果 */}
      {animationsEnabled && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          {/* 这里可以添加粒子效果组件 */}
        </Box>
      )}
    </Box>
  );
};

export default App;