import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Box,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { enAU } from "date-fns/locale";
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import {
  fetchComputerLogs,
  fetchRouterLogs,
  exportPDF,
} from "../services/apiService";
import SEO from "../Design/SEO.js";
import LogDetailDialog from "../components/LogDetails.js";

const StyledPaper = styled(Paper)(({ theme }) => ({
	transition: "box-shadow 0.3s ease-in-out",
	padding: theme.spacing(3),
	marginBottom: theme.spacing(3),
	borderRadius: theme.shape.borderRadius,
	"&:hover": {
	  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
	},
  }));
  
  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	maxHeight: 440,
	overflowX: "auto",
	"&::-webkit-scrollbar": {
	  width: 8,
	  height: 8,
	},
	"&::-webkit-scrollbar-thumb": {
	  backgroundColor: theme.palette.primary.light,
	  borderRadius: 4,
	},
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
	cursor: "pointer",
	"&:hover": {
	  backgroundColor: theme.palette.action.hover,
	},
  }));
  
  const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
	color: theme.palette.primary.contrastText,
	"&.MuiTableSortLabel-root:hover": {
	  color: theme.palette.primary.contrastText,
	},
	"&.MuiTableSortLabel-root.Mui-active": {
	  color: theme.palette.primary.contrastText,
	},
	"& .MuiTableSortLabel-icon": {
	  color: `${theme.palette.primary.contrastText} !important`,
	},
  }));
  
  const StyledButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(1, 0),
  }));
  
  const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleString("en-AU", {
	  day: "2-digit",
	  month: "2-digit",
	  year: "numeric",
	  hour: "2-digit",
	  minute: "2-digit",
	  second: "2-digit",
	  hour12: false,
	});
  };
  
  const RELATIVE_TIME_OPTIONS = [
	{ label: 'Last Hour', value: 60 * 60 * 1000 },
	{ label: 'Last 24 Hours', value: 24 * 60 * 60 * 1000 },
	{ label: 'Last 7 Days', value: 7 * 24 * 60 * 60 * 1000 },
  ];

const LogQueries = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [activeTab, setActiveTab] = useState(0);
	const [searchParams, setSearchParams] = useState({
		query: "",
		startTime: null,
		endTime: null,
	});
	const [logs, setLogs] = useState([]);
	const [totalResults, setTotalResults] = useState(0);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [selectedLog, setSelectedLog] = useState(null);
	const [orderBy, setOrderBy] = useState("");
	const [order, setOrder] = useState("asc");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "info",
	});


  const handleSearch = async () => {
    setLoading(true);
    try {
      const fetchFunction = activeTab === 0 ? fetchComputerLogs : fetchRouterLogs;
      const response = await fetchFunction(
        searchParams,
        page + 1,
        rowsPerPage,
        orderBy,
        order
      );
      setLogs(response.results);
      setTotalResults(response.count);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSnackbar({
        open: true,
        message: "Error fetching search results. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  const handleExport = async () => {
    try {
      if (totalResults === 0) {
        setSnackbar({
          open: true,
          message: "No data to export. Please perform a search first.",
          severity: "warning",
        });
        return;
      }

      const response = await exportPDF(
        activeTab === 0 ? "computer" : "router",
        searchParams
      );
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${activeTab === 0 ? "computer" : "router"}_logs.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setSnackbar({
        open: true,
        message: "Failed to export PDF. Please try again.",
        severity: "error",
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchParams({
      query: "",
      startTime: null,
      endTime: null,
    });
    setPage(0);
    setOrderBy("");
    setOrder("asc");
  };

  const handleFirstPage = () => {
    setPage(0);
  };

  const handleLastPage = () => {
    setPage(Math.max(0, Math.ceil(totalResults / rowsPerPage) - 1));
  };

  const handleRelativeTimeFilter = (milliseconds) => {
    const endTime = new Date();
    const startTime = new Date(endTime - milliseconds);
    setSearchParams((prevParams) => ({
      ...prevParams,
      startTime: startTime,
      endTime: endTime,
    }));
    handleSearch();
  };

  useEffect(() => {
    handleSearch();
  }, [activeTab, page, rowsPerPage, orderBy, order]);

  const computerColumns = [
    { id: "iso_timestamp", label: "Timestamp", minWidth: 170 },
    { id: "hostname", label: "Hostname", minWidth: 100 },
    { id: "EventType", label: "Event Type", minWidth: 100 },
    { id: "EventID", label: "EventID", minWidth: 100 },
    { id: "AccountName", label: "Account", minWidth: 100 },
    { id: "message", label: "Message", minWidth: 200 },
  ];

  const routerColumns = [
    { id: "date_time", label: "Timestamp", minWidth: 170 },
    { id: "hostname", label: "Hostname", minWidth: 100 },
    { id: "process", label: "Process", minWidth: 100 },
    { id: "message", label: "Message", minWidth: 200 },
  ];

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const columns = activeTab === 0 ? computerColumns : routerColumns;

  return (
    <>
      <SEO title="Queries" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
          Log Queries
        </Typography>
        <StyledPaper elevation={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search hostname, process or message"
                name="query"
                value={searchParams.query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
                <DateTimePicker
                  label="Start Time"
                  value={searchParams.startTime}
                  onChange={(newValue) => handleDateChange("startTime", newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
                <DateTimePicker
                  label="End Time"
                  value={searchParams.endTime}
                  onChange={(newValue) => handleDateChange("endTime", newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2}>
              <Select
                fullWidth
                value=""
                onChange={(e) => handleRelativeTimeFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Quick Time Filter
                </MenuItem>
                {RELATIVE_TIME_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledButton
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
              >
                Search
              </StyledButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledButton
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
              >
                Clear Filters
              </StyledButton>
            </Grid>
          </Grid>
        </StyledPaper>

        <StyledPaper elevation={3}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="Computer Logs" />
            <Tab label="Router Logs" />
          </Tabs>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" color="primary">Results: {totalResults}</Typography>
            <Box>
              <Tooltip title="Refresh">
                <IconButton onClick={handleSearch} color="primary" disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export to PDF">
                <IconButton onClick={handleExport} color="primary" disabled={loading}>
                  <ExportIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <StyledTableContainer>
              <Table stickyHeader aria-label="log table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{ 
                          backgroundColor: "primary.main", 
                          color: "primary.contrastText", 
                          fontWeight: "bold",
                          ...(isMobile && column.id !== "iso_timestamp" && column.id !== "message" && { display: "none" })
                        }}
                      >
                        <StyledTableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={() => handleRequestSort(column.id)}
                        >
                          {column.label}
                        </StyledTableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <StyledTableRow key={log.id} onClick={() => handleRowClick(log)}>
                      {columns.map((column) => (
                        <TableCell 
                          key={column.id}
                          sx={isMobile && column.id !== "iso_timestamp" && column.id !== "message" ? { display: "none" } : {}}
                        >
                          {column.id === "iso_timestamp" || column.id === "date_time"
                            ? formatDate(log[column.id])
                            : column.id === "message"
                            ? log[column.id].substring(0, isMobile ? 50 : 100) + (log[column.id].length > (isMobile ? 50 : 100) ? "..." : "")
                            : log[column.id]}
                        </TableCell>
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
            <Box>
              <Tooltip title="First Page">
                <IconButton onClick={handleFirstPage} disabled={page === 0}>
                  <FirstPageIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Last Page">
                <IconButton
                  onClick={handleLastPage}
                  disabled={page >= Math.ceil(totalResults / rowsPerPage) - 1}
                >
                  <LastPageIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={totalResults}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </StyledPaper>

        <LogDetailDialog
          log={selectedLog}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          isComputerLog={activeTab === 0}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default LogQueries;