import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Box, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from '../utils/axiosInterceptor';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch categories
  const { isLoading, error, data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('categories?limit=10');
      return response.data;
    },
    staleTime: 0
  });

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
  });

  const columns = [
    { field: 'title', headerName: 'Category Name', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => navigate(`/dashboard/categories?updateCatId=${params.id}`)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => deleteCategory.mutate(params.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Typography color="error">Error fetching categories: {error.message}</Typography>;

  const rows = categoriesData?.data?.map(category => ({
    id: category._id,
    title: category.title
  })) || [];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default CategoryList;