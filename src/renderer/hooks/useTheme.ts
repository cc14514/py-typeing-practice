import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setTheme } from '../store/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  const changeTheme = (newTheme: string) => {
    dispatch(setTheme(newTheme));
  };

  return {
    currentTheme: theme.currentTheme,
    isDarkMode: theme.isDarkMode,
    changeTheme,
  };
};