import React from 'react';
import { Box, Button, Container, TextField, Typography, Grid2 as Grid, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../utils/axiosInterceptor';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

// Validation Schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password should be at least 6 characters long')
    .required('Password is required'),
});

const SignIn = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: ({ email, password }) => {
      signInMutation.mutate({ email, password });
    },
  });

  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationFn: async (credentials) => {
      return await axios.post('auth/login', credentials)
    },
    onSuccess: (data) => {
      // setIsAuthenticated(true);
      localStorage.setItem('token', data?.data?.token);
      if (data?.data?.token) navigate('/');
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
        <Typography component="h1" variant="h5" align="center">
          Sign In
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Grid container justifyContent="flex-end" >
          <Grid item 
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick= {(e)=> navigate("/signup")}
          >
            <Typography variant="body2">
              Don't have an account? Sign Up
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignIn;
