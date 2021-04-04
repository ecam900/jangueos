import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#845886',
    },
    secondary: {
      main: '#845886',
    },
    error: {
      main: red[800],
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",

    h1: {
      fontFamily: `'Pacifico', sans-serif`,
      fontWeight: '400',
    },
    h2: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 'bold',
    },
    h3: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 'bold',
    },
    h4: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: '600',
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        margin: '.7rem',
      },
      containedPrimary: {
        color: 'white',
      },
    },
  },
  props: {
    MuiButton: {
      variant: 'contained',
      color: 'secondary',
    },
  },
});

export default lightTheme;
