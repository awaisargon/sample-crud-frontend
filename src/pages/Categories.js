import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';

const Categories = () => {

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Category Management
        </Typography>
        <Box sx={{ mb: 4 }}>
          <CategoryForm />
        </Box>
        <CategoryList />
      </Paper>
    </Container>
  );
};

export default Categories;
