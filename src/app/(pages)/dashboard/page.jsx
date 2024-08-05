'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, MenuItem, ListItemIcon, lighten } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { MaterialReactTable, useMaterialReactTable, MRT_GlobalFilterTextField, MRT_ToggleFiltersButton } from 'material-react-table';
import { AccountCircle, Dns, Edit, ProductionQuantityLimits, Send } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { get } from 'http';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Mock Data
// import { data } from './makeData';


const Dashboard = () => {
  const router = useRouter();

  const [incidentsData, setIncidentsData] = useState([]);

  const columns = useMemo(
    () => [
          {
            accessorKey: 'incidentNo',
            emableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'incident ID',
            size: 300,
          },
          {
            accessorKey: 'status',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Status',
            size: 300,
          },
          {
            accessorFn: (row) => new Date(row.dateOfInput),
            id: 'dateOfInput',
            header: 'Start Date',
            filterVariant: 'date',
            filterFn: 'lessThan',
            sortingFn: 'datetime',
            Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
            Header: ({ column }) => <em>{column.columnDef.header}</em>,
            muiFilterTextFieldProps: {
              sx: {
                minWidth: '250px',
              },
            },
          },
        ],
    [],
  );


  const getIncidents = async ()=>{
    try {

      const response = await axios.get('/api/newincident');
      const data = response.data.data;
      console.log(data);
      setIncidentsData(data);
      if(response.status == 200){
        return alert("incidents fetched successfully");
      }
      return alert("fetching failed");

    } catch(error) {
      console.log(error);
    }
  };

  useEffect(()=> {
    getIncidents();
  }, [])

  
  
  const table = useMaterialReactTable({
    columns,
    data: incidentsData,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: false,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: false,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      variant: 'outlined',
    },
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          left: '30px',
          maxWidth: '1000px',
          position: 'sticky',
          width: '100%',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4">Incident Brief:</Typography>
          <Typography variant="h6">
            &quot;{row.original.brief}&quot;
          </Typography>
        </Box>
      </Box>
    ),
    renderRowActionMenuItems: ({ closeMenu, row }) => [
      <MenuItem
        key={0}
        onClick={() => {
          console.log('Row data:', row.original); // Log the entire row data
          const incId = row.original?.incidentNo; // Check property name
          console.log('Incident ID:', incId); // Log the incident ID
          if (incId) {
            router.push(`dashboard/incident/${incId}`);
          } else {
            console.error('Incident ID is undefined');
          }
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Dns/>
        </ListItemIcon>
        View
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        Edit
      </MenuItem>,
    ],

    muiTableBodyProps: {
        sx: {
          '& tr:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5'
          }
        }
      },
  
  
      muiTableBodyRowProps: ({ row }) => ({
        // Add row click handling 
        onClick: (event) => {
          console.log(row.original.indicentNo);
          const incId = row.original?.indicentNo;
          if (incId) {
            router.push(`/incident/${incId}`);
          }
        },
        sx: {
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#eee'
          }
        }
      }),
  
      muiTableProps: {
        sx: {
          // Custom table styles  
          borderCollapse: 'collapse',
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: 4,
          boxShadow: '0px 2px 10px #ddd',
  
          // Header styling
          '& .MuiTableCell-head': {
            backgroundColor: '#12a1c0',
            color: 'white',
            fontWeight: 'bold',
            border: '1px solid #ddd',
            padding: '8px',
          },
  
          // Cell styling
          '& .MuiTableCell-body': {
            border: '1px solid #ddd',
          },
  
          // Hover effect for rows
          '& .MuiTableRow-root:hover': {
            backgroundColor: '#eee',
          },
          '& .MuiTableRow-root:nth-of-type(odd)': {
            backgroundColor: '#f9f9f9 !important',
          },
        }
      }
  });


  return (
    <Box 
      sx={{ 
        backgroundColor: '#f0f4f8', // Light background color
        minHeight: '100vh', // Ensure the background color covers the full height
        padding: 2 // Optional padding for better spacing
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card sx={{ boxShadow: 'sm' }} className='shadow-md'>
            <CardContent>
              <Typography variant='h6'>
                Total Incidents: XX
              </Typography>
              <Typography variant='h6'>
                Incidents Closed: XX
              </Typography>
              <Typography variant='h6'>
                Incidents Open: XX
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className='shadow-md'>
            <CardContent>
              <Typography variant='h6'>
                Average Closing Time: XX
              </Typography>
              <Typography variant='h6'>
                Max Closing Time: XX
              </Typography>
              <Typography variant='h6'>
                Min Closing Time: XX
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MaterialReactTable table={table} />
        </LocalizationProvider>
      </Card>
    </Box>
  );
};

export default Dashboard;

// const columns = useMemo(
//   () => [
//         {
//           accessorKey: 'incidentNo',
//           enableClickToCopy: true,
//           filterVariant: 'autocomplete',
//           header: 'Incident ID',
//           size: 300,
//         },
//         {
//           accessorKey: 'salary',
//           filterFn: 'between',
//           header: 'Salary',
//           size: 200,
//           Cell: ({ cell }) => (
//             <Box
//               component="span"
//               sx={(theme) => ({
//                 backgroundColor:
//                   cell.getValue() < 50_000
//                     ? theme.palette.error.dark
//                     : cell.getValue() >= 50_000 && cell.getValue() < 75_000
//                       ? theme.palette.warning.dark
//                       : theme.palette.success.dark,
//                 borderRadius: '0.25rem',
//                 color: '#fff',
//                 maxWidth: '9ch',
//                 p: '0.25rem',
//               })}
//             >
//               {cell.getValue()?.toLocaleString?.('en-US', {
//                 style: 'currency',
//                 currency: 'USD',
//                 minimumFractionDigits: 0,
//                 maximumFractionDigits: 0,
//               })}
//             </Box>
//           ),
//         },
//         {
//           accessorKey: 'status',
//           header: 'Job Status',
//           size: 350,
//         },
//         {
//           accessorFn: (row) => new Date(row.dateOfInput),
//           id: 'dateOfInput',
//           header: 'Start Date',
//           filterVariant: 'date',
//           filterFn: 'lessThan',
//           sortingFn: 'datetime',
//           Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
//           Header: ({ column }) => <em>{column.columnDef.header}</em>,
//           muiFilterTextFieldProps: {
//             sx: {
//               minWidth: '250px',
//             },
//           },
//         },
//       ],
//   [],
// );