import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Pagination, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from '../utils/axiosInterceptor';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CategoryList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from searchParams or default to 1
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories with pagination from the backend
  const { isPending, error, data: categoriesData } = useQuery({
    queryKey: ['categories', currentPage],
    queryFn: async () => {
      const response = await axios.get(`categories?page=${currentPage}&limit=10`);
      return response?.data;
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    }
  });

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value });
  };

  if (isPending) return <LoadingSpinner />;
  if (error) return <p>Error fetching categories: {error.message}</p>;

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category Name</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categoriesData?.data?.map((category) => (
            <TableRow key={category._id}>
              <TableCell>{category.title}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => navigate(`/dashboard/categories?updateCatId=${category._id}`)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => deleteCategory.mutate(category._id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={categoriesData?.pagination?.total || 1}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </>
  );
};

export default CategoryList;
