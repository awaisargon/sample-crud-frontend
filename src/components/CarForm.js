import React, { useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axiosInterceptor';
import { LoadingButton } from '@mui/lab';
import LoadingSpinner from './LoadingSpinner';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  categoryId: Yup.string().required('Category is required'),
  color: Yup.string(),
  model: Yup.string(),
  make: Yup.string(),
  registrationNo: Yup.string(),
});

const CarForm = ({ updateId, setUpdateId }) => {
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories, isPending: isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('categories');
      return response?.data;
    },
    staleTime: 0
  });


  // Mutation for creating or updating a car
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
    },
  });

  useEffect(() => {
    if (updateId) {
      axios.get(`cars/${updateId}`).then(response => {
        const car = response.data.data;
        formik.setValues({
          title: car.title,
          categoryId: car.categoryId?._id,
          color: car.color || '',
          model: car.model || '',
          make: car.make || '',
          registrationNo: car.registrationNo || '',
        });
      });
    }
  // eslint-disable-next-line
  }, [updateId]);

  if (isLoading) return <LoadingSpinner/>;

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}
    >
      <TextField
        fullWidth
        id="title"
        name="title"
        label="Title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        variant="outlined"
      />
      <TextField
        select
        fullWidth
        id="categoryId"
        name="categoryId"
        label="Category"
        value={formik.values.categoryId}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
        helperText={formik.touched.categoryId && formik.errors.categoryId}
        variant="outlined"
      >
        {categories?.data?.map((category) => (
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
        onBlur={formik.handleBlur}
        variant="outlined"
      />
      <TextField
        fullWidth
        id="model"
        name="model"
        label="Model"
        value={formik.values.model}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        variant="outlined"
      />
      <TextField
        fullWidth
        id="make"
        name="make"
        label="Make"
        value={formik.values.make}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        variant="outlined"
      />
      <TextField
        fullWidth
        id="registrationNo"
        name="registrationNo"
        label="Registration No"
        value={formik.values.registrationNo}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        variant="outlined"
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          loading={createOrUpdateCar.isLoading}
          sx={{ flex: 1 }}
        >
          {updateId ? 'Update Car' : 'Add Car'}
        </LoadingButton>
        {updateId && (
          <Button
            variant="contained"
            color="warning"
            sx={{ flex: 1 }}
            onClick={() => {
              formik.resetForm();
              setUpdateId(null);
            }}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CarForm;
