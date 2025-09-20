import React from 'react';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const CustomTextField = styled((props) => <TextField {...props} />)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.action.disabled,
    opacity: 1,
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderColor: '#E5E7EB',
      borderWidth: 2,
    },
    '&:hover fieldset': {
      borderColor: '#8B5CF6',
      borderWidth: 2,
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8B5CF6',
      borderWidth: 2,
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.error.main,
    },
    '&.Mui-disabled': {
      backgroundColor: '#F3F4F6',
      '& fieldset': {
        borderColor: '#D1D5DB',
      },
    },
  },
  '& .MuiInputLabel-outlined': {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#8B5CF6',
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
    '&.Mui-disabled': {
      color: theme.palette.action.disabled,
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 4,
    fontSize: '0.875rem',
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

export default CustomTextField;
