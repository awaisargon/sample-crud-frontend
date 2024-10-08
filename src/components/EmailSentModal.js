import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmailSentModal = ({ open, handleClose }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    // Close the modal and navigate to the login page
    handleClose();
    navigate('/signin');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Success!
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center">
          <Typography variant="body1" gutterBottom>
            An email with your password has been sent.
          </Typography>
          <Typography variant="body1">
            Continue to Login Page
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleOkClick} 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ fontWeight: 'bold', textTransform: 'none' }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailSentModal;
