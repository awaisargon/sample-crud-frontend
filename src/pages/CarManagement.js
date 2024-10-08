import React, { useState } from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import CarForm from '../components/CarForm';
import CarList from '../components/CarList';

const CarManagement = () => {
  const [updateId, setUpdateId] = useState(null);

  const handleSetUpdateId = (id) => {
    setUpdateId(id);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Car Management
      </Typography>
      <Stack spacing={3} alignItems="center">
        <Box sx={{ width: '80%', maxWidth: '1200px' }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {updateId ? 'Update Car' : 'Add New Car'}
            </Typography>
            <CarForm updateId={updateId} setUpdateId={handleSetUpdateId} />
          </Paper>
        </Box>
        <Box sx={{ width: '80%', maxWidth: '1200px' }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Car List
            </Typography>
            <CarList setUpdateId={handleSetUpdateId} />
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
};

export default CarManagement;
