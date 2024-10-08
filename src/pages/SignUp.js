import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Grid2 as Grid, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EmailSentModal from '../components/EmailSentModal';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInterceptor';
import { useMutation } from '@tanstack/react-query';

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const SignUp = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: ({ name, email }) => {
      signUpMutation.mutate({ name, email });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (credentials) => {
      axios.post('auth/signup', credentials)
    },
    onSuccess: () => {
      setModalOpen(true);
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
        <Typography component="h1" variant="h5" align="center">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            autoComplete="name"
            autoFocus
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid item
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={(e) => navigate("/signin")}
          >
            <Typography variant="body2">
              Already have an account? Sign In
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <EmailSentModal open={modalOpen} handleClose={() => setModalOpen(false)} />
    </Container>
  );
};

export default SignUp;
