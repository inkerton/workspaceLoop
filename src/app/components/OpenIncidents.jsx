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
  AddCircle,
  Delete,
  Dns,
  Edit,
  ProductionQuantityLimits,
  Send,
  TrackChangesOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

function OpenIncidents({ data, username }) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [status, setStatus] = useState("ASSIGNED");
  const [incidentNo, setIncidentNo] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [incidentClosedOn, setIncidentClosedOn] = useState("");
  const [timeOfAction, setTimeOfAction] = useState("");
  const [incidentDeletedOn, setIncidentDeletedOn] = useState("");
  const [deletedOn, setDeletedOn] = useState("");
  const [openBinConfirmationModal, setOpenBinConfirmationModal] = useState(false);


  const statusMap = {
    ASSIGNED: "Assigned",
    UNASSIGNED: "Unassigned",
    INFORMATION_AWAITED: "Information Awaited",
    PROCESSING: "Processing",
    TEAM_SENT: "Team Sent",
    REPORT_BEING_PREPARED: "Report Being Prepared",
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
        accessorKey: "entityImpacted",
        emableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Entity Impacted",
        size: 150,
      },
      {
        accessorFn: (row) => row.assignedTo.join(", "),
        id: "assignedTo",
        header: "Assigned To",
        size: 150,
        Cell: ({ cell }) => cell.getValue(),
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
      density: "compact",
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
      rowsPerPageOptions: [10, 20, 30, 50, 100, 200],
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
          const incId = row.original?.incidentNo; // Check property name
          if (incId) {
            router.push(`dashboard/viewIncident/${incId}`);
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
            router.push(`dashboard/incidentInfo/${incId}`);
          } else {
            console.error("Incident ID is undefined");
          }
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AddCircle />
        </ListItemIcon>
        Add IncInfo
      </MenuItem>,

      <MenuItem
        key={2}
        onClick={() => {
          const incId = row.original?.incidentNo; // Check property name
          closeMenu();
          handleOpenModal(row.original);
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <TrackChangesOutlined />
        </ListItemIcon>
        Change status
      </MenuItem>,

      <MenuItem
        key={3}
        onClick={() => {
          const incId = row.original?.incidentNo; // Check property name
          if (incId) {
            router.push(`dashboard/edit/${incId}`);
          } else {
            console.error("Incident ID is undefined");
          }
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Edit />
        </ListItemIcon>
        Edit
      </MenuItem>,

      <MenuItem
        key={4}
        onClick={() => {
          const incId = row.original?.incidentNo; // Check property name
          setIncidentNo(incId);
          closeMenu();
          handleBinOpenModal();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Delete />
        </ListItemIcon>
        Move to Bin
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

    // muiTableProps: {
    //   sx: {
    //     // Custom table styles
    //     borderCollapse: 'collapse',
    //     width: '100%',
    //     border: '1px solid #ddd',
    //     borderRadius: 4,
    //     boxShadow: '0px 2px 10px #ddd',

    //     // Header styling
    //     '& .MuiTableCell-head': {
    //       backgroundColor: '#12a1c0',
    //       color: 'white',
    //       fontWeight: 'bold',
    //       border: '1px solid #ddd',
    //       padding: '8px',
    //     },

    //     // Cell styling
    //     '& .MuiTableCell-body': {
    //       border: '1px solid #ddd',
    //     },

    //     // Hover effect for rows
    //     '& .MuiTableRow-root:hover': {
    //       backgroundColor: '#eee',
    //     },
    //     '& .MuiTableRow-root:nth-of-type(odd)': {
    //       backgroundColor: '#f9f9f9 !important',
    //     },
    //   }
    // }
  });

  const handleOpenModal = (incident) => {
    setOpenModal(true);

    setStatus(incident.status);
    setIncidentNo(incident.incidentNo);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedIncident(null);
  };

  const handleUpdate = async () => {
    if (status === "CLOSED_INCIDENT") {
      setIncidentClosedOn(new Date().toISOString().split("T")[0]);
      setOpenConfirmationModal(true);
    } else {
      setTimeOfAction(new Date().toISOString());
      await updateStatus();
    }
  };

  const handleConfirmCloseIncident = async (confirm) => {
    setOpenConfirmationModal(false);
    if (confirm) {
      setTimeOfAction(new Date().toISOString());
      await updateStatus();
      setOpenModal(false);
    }
  };

  const updateStatus = async () => {
    try {
      const response = await axios.put("/api/newincident", {
        incidentNo,
        status,
        incidentClosedOn,
        timeOfAction,
        username,
      });
      if (response.status === 200) {
        setOpenModal(false);
        window.location.reload();
        toast.success("Incident updated successfully");
      } else {
        toast.error("Failed to update incident");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the incident");
    }
  };

  const handleBinOpenModal = (incident) => {
    setOpenBinConfirmationModal(true);
    setIncidentDeletedOn(new Date().toISOString().split("T")[0]);
    setDeletedOn(new Date().toISOString());
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
      const response = await axios.post("/api/bin", {
        incidentNo,
        deletedOn,
        deletedBy: username,
      });
      if (response.status === 200) {
        setOpenModal(false);
        window.location.reload();
        toast.success("Incident moved to bin successfully");
      } else {
        alert("Failed to delete incident");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while deleting the incident");
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

      {/* Modal for changing status */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="change-status-modal"
        aria-describedby="change-status-modal-description"
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
          <Typography variant="h6" id="change-status-modal-description">
            Change status of{" "}
            <span style={{ color: "#12a1c0", fontWeight: "bold" }}>
              {" "}
              {incidentNo}{" "}
            </span>
          </Typography>

          <Grid container spacing={2}>
            {/* status */}
            <Grid item xs={12}>
              <Box
                className="flex"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  mt: 2,
                }}
              >
                <Grid item xs={3}>
                  <Typography variant="h6">Status:</Typography>
                </Grid>

                <Grid item xs={9}>
                  <TextField
                    select
                    label="status"
                    defaultValue="Assigned"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    margin="normal"
                    fullWidth
                    sx={{ flexGrow: 1, backgroundColor: "white" }}
                  >
                    <MenuItem value="ASSIGNED">Assigned</MenuItem>
                    <MenuItem value="UNASSIGNED">Unassigned</MenuItem>
                    <MenuItem value="INFORMATION_AWAITED">
                      Information Awaited
                    </MenuItem>
                    <MenuItem value="PROCESSING">Processing</MenuItem>
                    <MenuItem value="TEAM_SENT">Team Sent</MenuItem>
                    <MenuItem value="REPORT_BEING_PREPARED">
                      Report Being Prepared
                    </MenuItem>
                    <MenuItem value="CLOSED_INCIDENT">Close Incident</MenuItem>
                  </TextField>
                </Grid>
              </Box>
            </Grid>
          </Grid>

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
              onClick={handleCloseModal}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#12a1c0",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0F839D",
                },
              }}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
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
            Are you sure you want to close this incident?
            <br></br>
            Incident closed on:{" "}
            <span style={{ color: "#12a1c0", fontWeight: "bold" }}>
              {incidentClosedOn}
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
              onClick={() => handleConfirmCloseIncident(false)}
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
              onClick={() => handleConfirmCloseIncident(true)}
            >
              Yes
            </Button>
          </div>
        </Box>
      </Modal>

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
            Are you sure you want to move this incident to bin?
            <br></br>
            Incident deleted on:{" "}
            <span style={{ color: "#12a1c0", fontWeight: "bold" }}>
              {incidentDeletedOn}
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

export default OpenIncidents;
