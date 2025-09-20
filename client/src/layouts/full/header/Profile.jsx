import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import { IconListCheck, IconMail, IconUser } from '@tabler/icons-react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../../../slices/authSlice';
import { useLogoutMutation } from '../../../slices/usersApiSlice';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="profile menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          borderRadius: 2,
          '&:hover': {
            backgroundColor: 'rgba(139, 92, 246, 0.04)',
          },
          ...(typeof anchorEl2 === 'object' && {
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
          }),
        }}
        onClick={handleClick2}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            border: '2px solid #E5E7EB',
          }}
        >
          <IconUser size={20} stroke={2} />
        </Box>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Profile Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '220px',
            borderRadius: 2,
            boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E5E7EB',
            mt: 1,
          },
        }}
      >
        <Box px={2} py={2} borderBottom="1px solid #E5E7EB">
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {userInfo?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userInfo?.email}
          </Typography>
        </Box>
       
        <MenuItem 
          component={Link} 
          to="/user/account"
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(139, 92, 246, 0.04)',
            },
          }}
        >
          <ListItemIcon>
            <IconMail width={20} color="#8B5CF6" />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        
        <MenuItem
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(139, 92, 246, 0.04)',
            },
          }}
        >
          <ListItemIcon>
            <IconListCheck width={20} color="#8B5CF6" />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem>
        
        <Box mt={1} py={2} px={2}>
          <Button 
            variant="contained" 
            onClick={logoutHandler} 
            fullWidth
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              borderRadius: 2,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
