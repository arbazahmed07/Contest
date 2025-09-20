import PropTypes from 'prop-types';
// mui imports
import { ListSubheader, styled } from '@mui/material';

const NavGroup = ({ item }) => {
  const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky {...props} />)(
    ({ theme }) => ({
      ...theme.typography.overline,
      fontWeight: '600',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      color: '#8B5CF6',
      lineHeight: '26px',
      padding: '3px 16px',
    }),
  );
  return (
    <ListSubheaderStyle>{item.subheader}</ListSubheaderStyle>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
