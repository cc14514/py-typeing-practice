import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import gameReducer from './gameSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    game: gameReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;