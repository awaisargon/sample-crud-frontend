import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInterceptor';

const Dashboard = () => {

  const { data: carsCount } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await axiosInstance.get("cars/count");
      return response?.data?.count;
    },
    keepPreviousData: true,
  });

  return (
    <Card sx={{ minWidth: 275, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, boxShadow: 3, mr: 25 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
          <DirectionsCarIcon sx={{ fontSize: 50, color: 'primary.main' }} />
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {carsCount}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Total Cars
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Dashboard;