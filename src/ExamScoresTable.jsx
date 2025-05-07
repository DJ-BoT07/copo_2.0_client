import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper } from '@mui/material';

const columns = [
  { field: 'prelim', headerName: 'Prelim', width: 100 },
  { field: 'ut1', headerName: 'UT1', width: 100 },
  { field: 'ut2', headerName: 'UT2', width: 100 },
  { field: 'insem', headerName: 'Insem', width: 100 },
  { field: 'endsem', headerName: 'Endsem', width: 100 },
];

const rows = [
  { id: 1, prelim: 42, ut1: 23, ut2: 5, insem: 19, endsem: 38 },
  { id: 2, prelim: 42, ut1: 15, ut2: 15, insem: 22, endsem: 28 },
  { id: 3, prelim: 44, ut1: 23, ut2: 11, insem: 21, endsem: 55 },
  { id: 4, prelim: 40, ut1: 5, ut2: 0, insem: 22, endsem: 41 },
  { id: 5, prelim: 44, ut1: 22, ut2: 18, insem: 17, endsem: 42 },
];

export default function ExamScoresTable() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f9fafb',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 2,
          borderRadius: 3,
          width: 600,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          📄 Sample Upload File
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
            height: 350,
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#e0e7ff',
              color: '#1e3a8a',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f0f4ff',
            },
          }}
        />
      </Paper>
    </Box>
  );
}
