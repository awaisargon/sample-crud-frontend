import React from 'react';
import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import SideDrawer from '../components/SideDrawer';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const AuthLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <SideDrawer />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8, ml: `${drawerWidth}px` }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;
