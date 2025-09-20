import { createTheme } from '@mui/material/styles';

export const blackWhiteTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      dark: '#e0e0e0',
      light: '#f5f5f5',
    },
    secondary: {
      main: '#000000',
      dark: '#333333',
      light: '#666666',
    },
    background: {
      default: '#000000',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
    },
    divider: '#333333',
    action: {
      hover: '#333333',
      selected: '#444444',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { color: '#ffffff' },
    h2: { color: '#ffffff' },
    h3: { color: '#ffffff' },
    h4: { color: '#ffffff' },
    h5: { color: '#ffffff' },
    h6: { color: '#ffffff' },
    body1: { color: '#e0e0e0' },
    body2: { color: '#e0e0e0' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          border: '1px solid #333333',
          color: '#ffffff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        contained: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        },
        outlined: {
          borderColor: '#ffffff',
          color: '#ffffff',
          '&:hover': {
            borderColor: '#e0e0e0',
            backgroundColor: '#333333',
          },
        },
      },
    },
  },
});