import { Link } from 'react-router-dom';
import { styled, Typography, Box } from '@mui/material';
import { IconEye } from '@tabler/icons-react';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  padding: '20px 0',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <IconEye size={18} stroke={2} />
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
            textAlign: 'center',
            fontSize: '1.1rem',
          }}
        >
          AI Proctored
        </Typography>
      </Box>
    </LinkStyled>
  );
};

export default Logo;
