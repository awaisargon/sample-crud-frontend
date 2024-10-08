import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axiosInterceptor';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';

// Validation schema using Yup
const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  categoryId: Yup.string().required('Category is required'),
  color: Yup.string(),
  model: Yup.string(),
  make: Yup.string(),
  registrationNo: Yup.string(),
});

// Component
const CarManagement = () => {
  const [page, setPage] = useState(1);
  const [updateId, setUpdateId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('categories');
      return response?.data?.data;
    },
  });

  // Fetch paginated cars with search
  const { data: carsData } = useQuery({
    queryKey: ['cars', page], // Add search to query key
    queryFn: async () => {
      const response = await axios.get(`cars?page=${page}&limit=10`); // Include search in API call
      return response?.data;
    },
    keepPreviousData: true,
  });

  // Create or Update Car
  const createOrUpdateCar = useMutation({
    mutationFn: async (data) => {
      if (updateId) {
        return await axios.patch(`cars/${updateId}`, data);
      } else {
        return await axios.post('cars', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
      setUpdateId(null);
    },
  });

  // Delete car
  const deleteCar = useMutation({
    mutationFn: async (id) => await axios.delete(`cars/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['cars']),
  });

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      title: '',
      categoryId: '',
      color: '',
      model: '',
      make: '',
      registrationNo: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      createOrUpdateCar.mutate(values);
      resetForm();
    }
  });

  // Handle car edit
  const handleEdit = (car) => {
    setUpdateId(car._id);
    formik.setValues({
      title: car.title,
      categoryId: car.categoryId?._id,
      color: car.color || '',
      model: car.model || '',
      make: car.make || '',
      registrationNo: car.registrationNo || '',
    });
  };

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            select
            fullWidth
            id="categoryId"
            name="categoryId"
            label="Category"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
            helperText={formik.touched.categoryId && formik.errors.categoryId}
          >
            {categories?.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            id="color"
            name="color"
            label="Color"
            value={formik.values.color}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            id="model"
            name="model"
            label="Model"
            value={formik.values.model}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            id="make"
            name="make"
            label="Make"
            value={formik.values.make}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            id="registrationNo"
            name="registrationNo"
            label="Registration No"
            value={formik.values.registrationNo}
            onChange={formik.handleChange}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LoadingButton
              variant="contained"
              color="primary"
              type="submit"
              loading={createOrUpdateCar?.isPending}
              sx={{ flex: 1 }}
            >
              {updateId ? 'Update Car' : 'Add Car'}
            </LoadingButton>
            {updateId && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  formik.resetForm();
                  setUpdateId(null);
                }}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </form>

      {/* List of cars */}
      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Registration No</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carsData?.data?.map((car) => (
              <TableRow key={car._id}>
                <TableCell>{car.title}</TableCell>
                <TableCell>{car.categoryId?.title}</TableCell>
                <TableCell>{car.color}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.make}</TableCell>
                <TableCell>{car.registrationNo}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(car)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteCar.mutate(car._id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        sx={{ marginTop: 2 }}
        count={carsData?.pagination.total}
        page={page}
        onChange={(_, value) => setPage(value)}
      />
    </Box>
  );
};

export default CarManagement;
