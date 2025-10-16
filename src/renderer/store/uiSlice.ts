import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeVariant = 'space' | 'ocean' | 'forest' | 'city';

export interface UIState {
  // 主题设置
  themeMode: ThemeMode;
  themeVariant: ThemeVariant;
  
  // 动画设置
  animationsEnabled: boolean;
  particleEffectsEnabled: boolean;
  
  // 音频设置
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  
  // 界面设置
  showKeyboard: boolean;
  keyboardLayout: 'qwerty' | 'dvorak' | 'colemak';
  fontSize: number;
  
  // 导航状态
  currentPage: string;
  sidebarOpen: boolean;
  
  // 游戏界面
  showStats: boolean;
  showProgress: boolean;
  
  // 通知和对话框
  notifications: Notification[];
  dialogOpen: boolean;
  dialogType: string | null;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

const initialState: UIState = {
  themeMode: 'dark',
  themeVariant: 'space',
  animationsEnabled: true,
  particleEffectsEnabled: true,
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.7,
  showKeyboard: true,
  keyboardLayout: 'qwerty',
  fontSize: 16,
  currentPage: 'home',
  sidebarOpen: false,
  showStats: true,
  showProgress: true,
  notifications: [],
  dialogOpen: false,
  dialogType: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },

    setThemeVariant: (state, action: PayloadAction<ThemeVariant>) => {
      state.themeVariant = action.payload;
    },

    toggleAnimations: (state) => {
      state.animationsEnabled = !state.animationsEnabled;
    },

    toggleParticleEffects: (state) => {
      state.particleEffectsEnabled = !state.particleEffectsEnabled;
    },

    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },

    toggleMusic: (state) => {
      state.musicEnabled = !state.musicEnabled;
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },

    toggleKeyboard: (state) => {
      state.showKeyboard = !state.showKeyboard;
    },

    setKeyboardLayout: (state, action: PayloadAction<UIState['keyboardLayout']>) => {
      state.keyboardLayout = action.payload;
    },

    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = Math.max(12, Math.min(24, action.payload));
    },

    navigateTo: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    toggleStats: (state) => {
      state.showStats = !state.showStats;
    },

    toggleProgress: (state) => {
      state.showProgress = !state.showProgress;
    },

    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    openDialog: (state, action: PayloadAction<string>) => {
      state.dialogOpen = true;
      state.dialogType = action.payload;
    },

    closeDialog: (state) => {
      state.dialogOpen = false;
      state.dialogType = null;
    },
  },
});

export const {
  setThemeMode,
  setThemeVariant,
  toggleAnimations,
  toggleParticleEffects,
  toggleSound,
  toggleMusic,
  setVolume,
  toggleKeyboard,
  setKeyboardLayout,
  setFontSize,
  navigateTo,
  toggleSidebar,
  toggleStats,
  toggleProgress,
  addNotification,
  removeNotification,
  clearNotifications,
  openDialog,
  closeDialog,
} = uiSlice.actions;

export default uiSlice.reducer;