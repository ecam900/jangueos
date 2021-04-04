import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

const themes = {
  lightTheme,
  darkTheme,
};

export default function getTheme(theme) {
  return themes[theme];
}
