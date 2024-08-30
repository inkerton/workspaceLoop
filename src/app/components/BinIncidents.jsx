
import React, { useState, useMemo } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  MenuItem,
  ListItemIcon,
  TextField,
} from "@mui/material";
import {
  AccountCircle,
  Dns,
  Edit,
  ProductionQuantityLimits,
  Send,
  TrackChangesOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

function BinIncidents({ data }) {
  const router = useRouter();
  console.log('daaataa',data)
  const [status, setStatus] = useState("FINAL_REPORT_SUBMITTED");
  const [incidentNo, setIncidentNo] = useState("");
  const [incidentClosedOn, setIncidentClosedOn] = useState("");
  const [username, setUsername] = useState("N");


  const statusMap = {
    ASSIGNED: "Assigned",
    UNASSIGNED: "Unassigned",
    INFORMATION_AWAITED: "Information Awaited",
    PROCESSING: "Processing",
    TEAM_SENT: "Team Sent",
    REPORT_BEING_PREPARED: "Report Being Prepared",
    FINAL_REPORT_SUBMITTED: "Final Report Submitted",
    CLOSED_INCIDENT: "Closed Incident",
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "incidentNo",
        emableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "incident ID",
        size: 150,
      },
      {
        accessorKey: "status",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => statusMap[cell.getValue()],
      },
      {
        accessorFn: (row) => new Date(row.dateOfInput),
        id: "dateOfInput",
        header: "Start Date",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        size: 150,
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
      {
        accessorFn: (row) => new Date(row.deletedOn),
        id: "deletedOn",
        header: "Deleted On",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        size: 150,
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();
          return dateValue ? dateValue.toLocaleDateString() : "Unknown";
        },
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
      {
        accessorKey: "deletedBy",
        emableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Deleted By",
        size: 150,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
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
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30, 50, 100],
      shape: "rounded",
      variant: "outlined",
    },
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-around",
          left: "30px",
          maxWidth: "1000px",
          position: "sticky",
          width: "100%",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">Incident Brief:</Typography>
          <Typography variant="h7">&quot;{row.original.brief}&quot;</Typography>
        </Box>
      </Box>
    ),
    renderRowActionMenuItems: ({ closeMenu, row }) => [
      <MenuItem
        key={0}
        onClick={() => {
          console.log("Row data:", row.original); // Log the entire row data
          const incId = row.original?.incidentNo; // Check property name
          console.log("Incident ID:", incId); // Log the incident ID
          // setIncidentNo(incId);
          if (incId) {
            router.push(`/dashboard/viewBin/${incId}`);
          } else {
            console.error("Incident ID is undefined");
          }
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Dns />
        </ListItemIcon>
        View
      </MenuItem>,

    ],

    muiTableBodyProps: {
      sx: {
        "& tr:nth-of-type(odd)": {
          backgroundColor: "#f5f5f5",
        },
      },
    },

    muiTableBodyRowProps: ({ row }) => ({
      // Add row click handling
      onClick: (event) => {
        console.log("Row clicked:", row.original.incidentNo);
        // router.push(`/dashboard/viewIncident/${row.original.incidentNo}`)
      },
      sx: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#eee",
        },
      },
    }),
    muiTableHeadCellProps: ({ column }) => ({
      sx: {
        backgroundColor:
          column.id === "mrt-row-actions" ? "#12a1c0" : "#12a1c0",
        color: column.id === "mrt-row-actions" ? "black" : "white",
        fontWeight: "bold",
        border: "1px solid #ddd",
        padding: "8px",
      },
    }),
    muiTableProps: {
      sx: {
        borderCollapse: "collapse",
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: 4,
        boxShadow: "0px 2px 10px #ddd",
        "& .MuiTableCell-body": {
          border: "1px solid #ddd",
        },
        "& .MuiTableRow-root:hover": {
          backgroundColor: "#eee",
        },
        "& .MuiTableRow-root:nth-of-type(odd)": {
          backgroundColor: "#f9f9f9 !important",
        },
      },
    },
  });





  return (
    <div>
      <div>
        <Card sx={{ mt: 2, mb: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table} />
          </LocalizationProvider>
        </Card>
      </div>

    </div>
  );
}

export default BinIncidents;
