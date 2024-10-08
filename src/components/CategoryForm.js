import React, { useEffect } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "../utils/axiosInterceptor";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from "react-router-dom";

const CategoryForm = () => {

  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const cachedCategories = queryClient.getQueryData(['categories']);
  const updateId = searchParams.get('updateCatId')

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Category title is required')
      .min(3, 'Category name must be at least 3 characters'),
  });

  const formik = useFormik({
    initialValues: { title: "" },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      updateId ? updateCategories.mutate(values) : createCategory.mutate(values)
      resetForm();
    },
  });

  useEffect(() => {
    const title = cachedCategories?.filter(cat => cat._id === updateId)[0]?.title;
    formik.setFieldValue('title', title);
    // eslint-disable-next-line
  }, [updateId])

  const createCategory = useMutation({
    mutationFn: async (data) => {
      return await axios.post('categories', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    }
  });


  const updateCategories = useMutation({
    mutationFn: async (data) => {
      return await axios.patch(`categories/${updateId}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      clearSearchParams()
    }
  });


  const clearSearchParams = () => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete('updateCatId');
    formik.setFieldValue('title', '');
    setSearchParams(updatedParams);
  }

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        id="title"
        name="title"
        label="Category Name"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" type="submit" sx={{ flex: 1 }}>
          {updateId ? "Update Category" : "Add Category"}
        </Button>

        {updateId && (
          <Button variant="contained" color="warning" sx={{ flex: 1 }} onClick={clearSearchParams}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CategoryForm;
