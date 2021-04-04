import React, { useState } from 'react';
import { responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import getTheme from './base';

// eslint-disable-next-line no-unused-vars
export const CustomThemeContext = React.createContext({
  currentTheme: 'lightTheme',
  setTheme: null,
});

const CustomThemeProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;

  // Read current theme from localStorage or maybe from an api
  const currentTheme = 'darkTheme';

  // State to hold the selected theme name
  const [themeName, _setThemeName] = useState(currentTheme);

  // Retrieve the theme object by theme name
  const theme = getTheme(themeName);
  // Responseive Font Sizes from MUI for better typography
  const responseiveTextTheme = responsiveFontSizes(theme);

  // Wrap _setThemeName to store new theme names in localStorage
  const setThemeName = (name) => {
    // localStorage.setItem('appTheme', name);
    _setThemeName(name);
  };

  const contextValue = {
    currentTheme: themeName,
    setTheme: setThemeName,
  };

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={responseiveTextTheme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export default CustomThemeProvider;
