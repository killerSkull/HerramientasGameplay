import { useState, createContext, useContext } from 'react';
import { THEMES, DEFAULT_THEME } from './config/themes';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  const theme = THEMES[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setCurrentTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
