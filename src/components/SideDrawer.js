import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const menuItems = [
  {
    icon: <DashboardIcon />,
    link: "/dashboard",
    itemText: 'Dashboard',
  },
  {
    icon: <DirectionsCarIcon />,
    link: "/dashboard/car-management",
    itemText: 'Car Management',
  },
  {
    icon: <CategoryIcon />,
    link: "/dashboard/categories",
    itemText: 'Categories',
  }
]

const SideDrawer = () => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1976d2',
          color: '#fff',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#fff', paddingLeft: 2 }}>
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {
          menuItems.map((item, index) => (
            <ListItem button="true" component={Link} to={item.link} key={index} sx={{ color: '#fff' }}>
              <ListItemIcon sx={{ color: '#fff' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.itemText} />
            </ListItem>
          ))
        }
      </List>
      <ListItem button onClick={handleLogout} sx={{ color: '#fff' }} component={Link}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
    </Drawer>
  );
};

export default SideDrawer;
