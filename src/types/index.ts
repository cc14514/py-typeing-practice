// Electron API types
export interface ElectronAPI {
  store: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
    delete: (key: string) => Promise<void>;
  };
  
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
  };
  
  app: {
    getVersion: () => Promise<string>;
  };
  
  on: (channel: string, callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
}

// 扩展 Window 接口
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

// Game types
export interface GameConfig {
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  textType: 'sentences' | 'words' | 'paragraphs';
  language: 'english' | 'chinese';
}

export interface KeyboardKey {
  key: string;
  label: string;
  code: string;
  position: { x: number; y: number; width: number; height: number };
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
  hand: 'left' | 'right';
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  warning: string;
  success: string;
}

export interface AudioConfig {
  volume: number;
  enabled: boolean;
  effects: {
    [key: string]: string; // sound name -> file path
  };
}

// Content types
export interface TypingText {
  id: string;
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'english' | 'chinese';
  category: string;
  tags: string[];
  length: number;
}

export interface PracticeLevel {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  texts: TypingText[];
}

// Animation types
export interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing: string;
  reduceMotion: boolean;
}

export interface ParticleConfig {
  enabled: boolean;
  count: number;
  colors: string[];
  speed: number;
  size: { min: number; max: number };
}

// Export everything - removed duplicate exports since interfaces are already exported above