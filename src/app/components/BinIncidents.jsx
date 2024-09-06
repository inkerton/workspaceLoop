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
  RestorePage,
  Send,
  TrackChangesOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function BinIncidents({ data }) {
  const router = useRouter();
  const [status, setStatus] = useState("FINAL_REPORT_SUBMITTED");
  const [incidentNo, setIncidentNo] = useState("");
  const [incidentClosedOn, setIncidentClosedOn] = useState("");
  const [username, setUsername] = useState("N");
  const [openBinConfirmationModal, setOpenBinConfirmationModal] =
    useState(false);
  const [incidentRestoredOn, setIncidentRestoredOn] = useState("");
  const [restoredOn, setRestoredOn] = useState("");


  const handleGetCookie = () => {
    const cookie = Cookies.get("username");
    setUsername(cookie);
  };

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
      <MenuItem
        key={1}
        onClick={() => {
          const incId = row.original?.incidentNo; // Check property name
          if (incId) {
            const incId = row.original?.incidentNo; // Check property name
            setIncidentNo(incId);
            closeMenu();
            handleRestoreBinOpenModal(row.original);
          } else {
            console.error("Incident ID is undefined");
          }
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <RestorePage />
        </ListItemIcon>
        Restore
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

  const handleRestoreBinOpenModal = (incident) => {
    setOpenBinConfirmationModal(true);
    setIncidentRestoredOn(new Date().toISOString().split("T")[0]);
    setRestoredOn(new Date().toISOString());
    handleGetCookie();
  };

  const handleBinCloseModal = async (confirm) => {
    setOpenBinConfirmationModal(false);
    if (confirm) {
      await updateBin();
      setOpenBinConfirmationModal(false);
    }
  };

  const updateBin = async () => {
    try {
      console.log("janvi", incidentNo, restoredOn, username);
      const response = await axios.post("/api/restore", {
        incidentNo,
        restoredOn,
        username,
      });
      if (response.status === 200) {
        handleRestoreBinOpenModal(false);
        window.location.reload();
        toast.success("Incident restored to bin successfully");
      } else {
        alert("Failed to restore incident");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while restoring the incident");
    }
  };

  return (
    <div>
      <div>
        <Card sx={{ mt: 2, mb: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table} />
          </LocalizationProvider>
        </Card>
      </div>

      {/* Confirmation Modal for Move to Bin */}
      <Modal
        open={openBinConfirmationModal}
        onClose={() => setOpenBinConfirmationModal(false)}
        aria-labelledby="confirmation-dialog"
        aria-describedby="confirmation-dialog-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            // border: '2px solid #000',
            // boxShadow: 24,
            borderRadius: "8px", // Rounded corners
            boxShadow: "none", // No border
            p: 4,
          }}
        >
          <Typography variant="h6" id="confirmation-dialog-description">
            Are you sure you want to restore this incident?
            <br></br>
            Incident restored on:{" "}
            <span style={{ color: "#12a1c0", fontWeight: "bold" }}>
              {incidentRestoredOn}
            </span>
          </Typography>

          <div className="flex justify-end mt-2">
            <Button
              variant="contained"
              color="primary"
              sx={{
                mr: 4,
                backgroundColor: "#12a1c0",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0F839D",
                },
              }}
              onClick={() => handleBinCloseModal(false)}
            >
              No
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                mr: 4,
                backgroundColor: "#12a1c0",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0F839D",
                },
              }}
              onClick={() => handleBinCloseModal(true)}
            >
              Yes
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default BinIncidents;
