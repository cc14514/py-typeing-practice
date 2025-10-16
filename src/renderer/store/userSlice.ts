import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
  progress: number;
  maxProgress: number;
  category: 'speed' | 'accuracy' | 'consistency' | 'time' | 'special';
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  experience: number;
  experienceToNext: number;
  totalGamesPlayed: number;
  totalTimeSpent: number; // 分钟
  createdAt: number;
  lastPlayedAt: number;
}

export interface UserStats {
  bestWPM: number;
  bestAccuracy: number;
  averageWPM: number;
  averageAccuracy: number;
  totalCharactersTyped: number;
  totalCorrectCharacters: number;
  longestStreak: number;
  currentStreak: number;
  favoriteTheme: string;
}

export interface UserPreferences {
  // 学习偏好
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  practiceLanguage: 'english' | 'chinese';
  
  // 游戏偏好
  showHints: boolean;
  showFingerGuide: boolean;
  enableSoundEffects: boolean;
  enableBackgroundMusic: boolean;
  
  // 界面偏好
  colorTheme: string;
  fontSize: number;
  keyboardLayout: string;
  
  // 学习目标
  dailyGoalMinutes: number;
  targetWPM: number;
  targetAccuracy: number;
}

export interface UserState {
  profile: UserProfile;
  stats: UserStats;
  preferences: UserPreferences;
  achievements: Achievement[];
  
  // 学习记录
  recentGames: GameRecord[];
  dailyProgress: DailyProgress[];
  
  // 当前状态
  isLoggedIn: boolean;
  currentStreak: number;
  todayPlayTime: number; // 分钟
}

export interface GameRecord {
  id: string;
  date: number;
  wpm: number;
  accuracy: number;
  duration: number; // 秒
  difficulty: string;
  textLength: number;
  errors: number;
  theme: string;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  gamesPlayed: number;
  timeSpent: number; // 分钟
  bestWPM: number;
  averageAccuracy: number;
  goalAchieved: boolean;
}

const initialState: UserState = {
  profile: {
    name: '小学习者',
    avatar: '🧒',
    level: 1,
    experience: 0,
    experienceToNext: 100,
    totalGamesPlayed: 0,
    totalTimeSpent: 0,
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  },
  stats: {
    bestWPM: 0,
    bestAccuracy: 0,
    averageWPM: 0,
    averageAccuracy: 0,
    totalCharactersTyped: 0,
    totalCorrectCharacters: 0,
    longestStreak: 0,
    currentStreak: 0,
    favoriteTheme: 'space',
  },
  preferences: {
    preferredDifficulty: 'medium',
    practiceLanguage: 'english',
    showHints: true,
    showFingerGuide: true,
    enableSoundEffects: true,
    enableBackgroundMusic: true,
    colorTheme: 'space',
    fontSize: 16,
    keyboardLayout: 'qwerty',
    dailyGoalMinutes: 20,
    targetWPM: 30,
    targetAccuracy: 95,
  },
  achievements: [],
  recentGames: [],
  dailyProgress: [],
  isLoggedIn: false,
  currentStreak: 0,
  todayPlayTime: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },

    addExperience: (state, action: PayloadAction<number>) => {
      state.profile.experience += action.payload;
      
      // 检查升级
      while (state.profile.experience >= state.profile.experienceToNext) {
        state.profile.experience -= state.profile.experienceToNext;
        state.profile.level += 1;
        state.profile.experienceToNext = state.profile.level * 100;
      }
    },

    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    addGameRecord: (state, action: PayloadAction<Omit<GameRecord, 'id'>>) => {
      const record: GameRecord = {
        ...action.payload,
        id: Date.now().toString(),
      };
      
      state.recentGames.unshift(record);
      
      // 保持最近20场游戏记录
      if (state.recentGames.length > 20) {
        state.recentGames = state.recentGames.slice(0, 20);
      }
      
      // 更新统计数据
      state.profile.totalGamesPlayed += 1;
      state.profile.totalTimeSpent += Math.round(record.duration / 60);
      state.profile.lastPlayedAt = Date.now();
      
      // 更新最佳记录
      if (record.wpm > state.stats.bestWPM) {
        state.stats.bestWPM = record.wpm;
      }
      if (record.accuracy > state.stats.bestAccuracy) {
        state.stats.bestAccuracy = record.accuracy;
      }
      
      // 更新平均值
      const totalWPM = state.recentGames.reduce((sum, game) => sum + game.wpm, 0);
      const totalAccuracy = state.recentGames.reduce((sum, game) => sum + game.accuracy, 0);
      state.stats.averageWPM = Math.round(totalWPM / state.recentGames.length);
      state.stats.averageAccuracy = Math.round(totalAccuracy / state.recentGames.length);
    },

    unlockAchievement: (state, action: PayloadAction<string>) => {
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = Date.now();
      }
    },

    updateAchievementProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const achievement = state.achievements.find(a => a.id === action.payload.id);
      if (achievement) {
        achievement.progress = Math.min(action.payload.progress, achievement.maxProgress);
      }
    },

    updateDailyProgress: (state, action: PayloadAction<Partial<DailyProgress>>) => {
      const today = new Date().toISOString().split('T')[0];
      const existingIndex = state.dailyProgress.findIndex(p => p.date === today);
      
      if (existingIndex >= 0) {
        state.dailyProgress[existingIndex] = {
          ...state.dailyProgress[existingIndex],
          ...action.payload,
        };
      } else {
        state.dailyProgress.push({
          date: today,
          gamesPlayed: 0,
          timeSpent: 0,
          bestWPM: 0,
          averageAccuracy: 0,
          goalAchieved: false,
          ...action.payload,
        });
      }
      
      // 保持最近30天的记录
      if (state.dailyProgress.length > 30) {
        state.dailyProgress = state.dailyProgress.slice(-30);
      }
    },

    incrementStreak: (state) => {
      state.currentStreak += 1;
      if (state.currentStreak > state.stats.longestStreak) {
        state.stats.longestStreak = state.currentStreak;
      }
    },

    resetStreak: (state) => {
      state.currentStreak = 0;
    },

    addPlayTime: (state, action: PayloadAction<number>) => {
      state.todayPlayTime += action.payload;
    },

    login: (state) => {
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const {
  updateProfile,
  addExperience,
  updateStats,
  updatePreferences,
  addGameRecord,
  unlockAchievement,
  updateAchievementProgress,
  updateDailyProgress,
  incrementStreak,
  resetStreak,
  addPlayTime,
  login,
  logout,
} = userSlice.actions;

export default userSlice.reducer;