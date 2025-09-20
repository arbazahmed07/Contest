import { createTheme } from '@mui/material/styles';
import typography from './Typography';
import { shadows } from './Shadows';

const modernTheme = createTheme({
  direction: 'ltr',
  palette: {
    mode: 'light',
    primary: {
      main: '#8B5CF6', // Purple primary color
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06B6D4', // Cyan secondary
      light: '#67E8F9',
      dark: '#0891B2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981',
      light: '#6EE7B7',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    info: {
      main: '#3B82F6',
      light: '#93C5FD',
      dark: '#1D4ED8',
      contrastText: '#ffffff',
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#DC2626',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    divider: '#E5E7EB',
    action: {
      hover: 'rgba(139, 92, 246, 0.04)',
      selected: 'rgba(139, 92, 246, 0.08)',
      disabled: '#9CA3AF',
      disabledBackground: '#F3F4F6',
    },
  },
  typography: {
    ...typography,
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...shadows.slice(6),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(139, 92, 246, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
        outlined: {
          borderColor: '#8B5CF6',
          color: '#8B5CF6',
          borderWidth: 2,
          '&:hover': {
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(139, 92, 246, 0.04)',
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #E5E7EB',
          '&:hover': {
            boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F9FAFB',
            '& fieldset': {
              borderColor: '#E5E7EB',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#8B5CF6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B5CF6',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-outlined': {
            color: '#6B7280',
            '&.Mui-focused': {
              color: '#8B5CF6',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: '#8B5CF6',
          color: '#ffffff',
        },
        outlined: {
          borderColor: '#8B5CF6',
          color: '#8B5CF6',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1F2937',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&:hover': {
            backgroundColor: 'rgba(139, 92, 246, 0.04)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(139, 92, 246, 0.12)',
            },
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E5E7EB',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F9FAFB',
          '& .MuiTableCell-head': {
            color: '#374151',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(139, 92, 246, 0.04)',
          },
        },
      },
    },
  },
});

export { modernTheme };
export default modernTheme;