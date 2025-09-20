import { useMediaQuery, Box, Drawer, styled } from '@mui/material';
import SidebarItems from './SidebarItems';

const Sidebar = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const sidebarWidth = '270px';

  const SidebarStyled = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
    color: theme.palette.text.primary,
    borderRight: '1px solid #E5E7EB',
    height: '100%',
  }));

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: 'border-box',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              borderRight: '1px solid #E5E7EB',
              boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
          }}
        >
          <SidebarStyled sx={{ height: '100%' }}>
            <SidebarItems />
          </SidebarStyled>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
          borderRight: '1px solid #E5E7EB',
        },
      }}
    >
      <SidebarStyled sx={{ height: '100%' }}>
        <SidebarItems />
      </SidebarStyled>
    </Drawer>
  );
};

export default Sidebar;
