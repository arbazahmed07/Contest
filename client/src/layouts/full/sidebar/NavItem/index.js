import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// mui imports
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme
} from '@mui/material';

const NavItem = ({ item, level, pathDirect, onClick }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

  const ListItemStyled = styled(ListItem)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '6px',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color: theme.palette.text.primary,
    paddingLeft: '16px',
    transition: 'all 0.2s ease-in-out',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: 'rgba(139, 92, 246, 0.08)',
      color: '#8B5CF6',
      transform: 'translateX(4px)',
    },
    '&.Mui-selected': {
      color: '#ffffff',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      boxShadow: '0px 4px 12px rgba(139, 92, 246, 0.4)',
      '&:hover': {
        background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
        color: '#ffffff',
        transform: 'translateX(4px)',
      },
    },
  }));

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button
        component={item.external ? 'a' : NavLink}
        to={item.href}
        href={item.external ? item.href : ''}
        disabled={item.disabled}
        selected={pathDirect === item.href}
        target={item.external ? '_blank' : ''}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: '36px',
            p: '3px 0',
            color: 'inherit',
          }}
        >
          {itemIcon}
        </ListItemIcon>
        <ListItemText>
          <>{item.title}</>
        </ListItemText>
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
};

export default NavItem;
