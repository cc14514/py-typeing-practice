import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  currentTheme: 'tech' | 'nature' | 'warm' | 'elegant';
  isDarkMode: boolean;
}

const initialState: ThemeState = {
  currentTheme: 'tech',
  isDarkMode: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.currentTheme = action.payload as 'tech' | 'nature' | 'warm' | 'elegant';
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { setTheme, toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;