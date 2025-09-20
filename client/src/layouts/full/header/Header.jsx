import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { IconBellRinging, IconMenu, IconShield } from '@tabler/icons-react';
import Profile from './Profile';

const Header = (props) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.primary,
    minHeight: '70px !important',
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
            color: 'text.primary',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(139, 92, 246, 0.04)',
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <Box flexGrow={1} />
        
        <Stack spacing={2} direction="row" alignItems="center">
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            sx={{
              color: 'text.primary',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(139, 92, 246, 0.04)',
              },
            }}
          >
            <Badge 
              variant="dot" 
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#8B5CF6',
                  color: '#8B5CF6',
                },
              }}
            >
              <IconBellRinging size="21" stroke="1.5" />
            </Badge>
          </IconButton>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <IconShield size={16} stroke={2} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                fontSize: '1.1rem',
              }}
            >
              AI Proctored System
            </Typography>
          </Box>
          
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
