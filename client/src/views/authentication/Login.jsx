import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography } from '@mui/material';

import PageContainer from '../../components/container/PageContainer';
// import Logo from '../../assets/images/logos/logo.png';
import AuthLogin from './auth/AuthLogin';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useDispatch, useSelector } from 'react-redux';

import { useLoginMutation } from '../../slices/usersApiSlice';

import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from './Loader';

const userValidationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(2, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});
const initialUserValues = {
  email: '',
  password: '',
};

const Login = () => {
  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: (values, action) => {
      handleSubmit(values);
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const handleSubmit = async ({ email, password }) => {
    try {
      const res = await login({ email, password }).unwrap();

      dispatch(setCredentials({ ...res }));
      formik.resetForm();

      // Check for saved redirect location
      const redirectLocation = localStorage.getItem('redirectLocation');
      if (redirectLocation) {
        try {
          const location = JSON.parse(redirectLocation);
          localStorage.removeItem('redirectLocation');
          navigate(location.pathname || '/dashboard');
        } catch (e) {
          navigate('/dashboard');
        }
      } else {
        // Default redirect based on user role
        if (res.role === 'teacher') {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <PageContainer title="Login" description="Sign in to your account">
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)',
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ 
            height: '100vh',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={0}
              sx={{
                p: 4,
                zIndex: 1,
                width: '100%',
                maxWidth: '450px',
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                <Typography
                  variant="h3"
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                  }}
                >
                  Contest
                </Typography>
              </Box>
              <AuthLogin
                formik={formik}
                subtext={
                  <Typography 
                    variant="subtitle1" 
                    textAlign="center" 
                    color="text.secondary" 
                    mb={3}
                    sx={{ fontWeight: 500 }}
                  >
                    CONDUCT SECURE ONLINE EXAMS NOW
                  </Typography>
                }
                subtitle={
                  <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                    <Typography color="text.secondary" variant="body1" fontWeight="400">
                      New to Contest?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/auth/register"
                      fontWeight="600"
                      sx={{
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Create an account
                    </Typography>
                    {isLoading && <Loader />}
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login;
