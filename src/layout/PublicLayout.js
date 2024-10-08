import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Car Management App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 8 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout;
