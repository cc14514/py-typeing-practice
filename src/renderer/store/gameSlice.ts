import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  totalChars: number;
  errors: number;
  timeElapsed: number;
}

export interface GameState {
  // 游戏状态
  isPlaying: boolean;
  isPaused: boolean;
  isFinished: boolean;
  
  // 游戏内容
  currentText: string;
  userInput: string;
  currentIndex: number;
  
  // 游戏配置
  difficulty: 'easy' | 'medium' | 'hard';
  gameMode: 'practice' | 'test' | 'adventure';
  timeLimit: number; // 秒
  
  // 统计数据
  stats: GameStats;
  
  // 游戏历史
  startTime: number;
  endTime: number | null;
  
  // 错误追踪
  errorPositions: number[];
  
  // 3D键盘高亮
  highlightedKeys: string[];
}

const initialState: GameState = {
  isPlaying: false,
  isPaused: false,
  isFinished: false,
  currentText: '',
  userInput: '',
  currentIndex: 0,
  difficulty: 'medium',
  gameMode: 'practice',
  timeLimit: 300,
  stats: {
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    totalChars: 0,
    errors: 0,
    timeElapsed: 0,
  },
  startTime: 0,
  endTime: null,
  errorPositions: [],
  highlightedKeys: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<string>) => {
      state.isPlaying = true;
      state.isPaused = false;
      state.isFinished = false;
      state.currentText = action.payload;
      state.userInput = '';
      state.currentIndex = 0;
      state.startTime = Date.now();
      state.endTime = null;
      state.errorPositions = [];
      state.stats = {
        wpm: 0,
        accuracy: 0,
        correctChars: 0,
        totalChars: action.payload.length,
        errors: 0,
        timeElapsed: 0,
      };
    },

    pauseGame: (state) => {
      state.isPaused = !state.isPaused;
    },

    updateInput: (state, action: PayloadAction<string>) => {
      if (!state.isPlaying || state.isPaused) return;
      
      const newInput = action.payload;
      state.userInput = newInput;
      state.currentIndex = newInput.length;
      
      // 计算统计数据
      const correctChars = newInput.split('').filter((char, index) => 
        char === state.currentText[index]
      ).length;
      
      const timeElapsed = (Date.now() - state.startTime) / 1000;
      const wpm = correctChars > 0 ? Math.round((correctChars / 5) / (timeElapsed / 60)) : 0;
      const accuracy = newInput.length > 0 ? Math.round((correctChars / newInput.length) * 100) : 100;
      
      state.stats = {
        ...state.stats,
        correctChars,
        wpm,
        accuracy,
        timeElapsed,
        errors: newInput.length - correctChars,
      };
      
      // 检查是否完成
      if (newInput.length >= state.currentText.length) {
        state.isFinished = true;
        state.isPlaying = false;
        state.endTime = Date.now();
      }
    },

    addError: (state, action: PayloadAction<number>) => {
      if (!state.errorPositions.includes(action.payload)) {
        state.errorPositions.push(action.payload);
      }
    },

    updateHighlightedKeys: (state, action: PayloadAction<string[]>) => {
      state.highlightedKeys = action.payload;
    },

    setDifficulty: (state, action: PayloadAction<GameState['difficulty']>) => {
      state.difficulty = action.payload;
    },

    setGameMode: (state, action: PayloadAction<GameState['gameMode']>) => {
      state.gameMode = action.payload;
    },

    setTimeLimit: (state, action: PayloadAction<number>) => {
      state.timeLimit = action.payload;
    },

    resetGame: (state) => {
      return { ...initialState, difficulty: state.difficulty, gameMode: state.gameMode };
    },

    finishGame: (state) => {
      state.isPlaying = false;
      state.isFinished = true;
      state.endTime = Date.now();
    },
  },
});

export const {
  startGame,
  pauseGame,
  updateInput,
  addError,
  updateHighlightedKeys,
  setDifficulty,
  setGameMode,
  setTimeLimit,
  resetGame,
  finishGame,
} = gameSlice.actions;

export default gameSlice.reducer;