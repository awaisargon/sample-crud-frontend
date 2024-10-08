import React from 'react';
import { Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../utils/axiosInterceptor';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CarList = ({ setUpdateId }) => {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const queryClient = useQueryClient();

  const { data: carsData, isLoading } = useQuery({
    queryKey: ['cars', page, pageSize],
    queryFn: async () => {
      const response = await axios.get(`cars?page=${page + 1}&limit=${pageSize}`);
      return response?.data;
    },
    keepPreviousData: true,
  });

  const deleteCar = useMutation({
    mutationFn: async (id) => await axios.delete(`cars/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['cars']),
  });

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'categoryTitle', headerName: 'Category', flex: 1 },
    { field: 'color', headerName: 'Color', flex: 1 },
    { field: 'model', headerName: 'Model', flex: 1 },
    { field: 'make', headerName: 'Make', flex: 1 },
    { field: 'registrationNo', headerName: 'Registration No', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => setUpdateId(params.row._id)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteCar.mutate(params.row._id)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = carsData?.data?.map(car => ({
    id: car._id,
    _id: car._id,
    title: car.title,
    categoryTitle: car.categoryId?.title,
    color: car.color,
    model: car.model,
    make: car.make,
    registrationNo: car.registrationNo,
  })) || [];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={carsData?.pagination?.total || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        loading={isLoading}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default CarList;