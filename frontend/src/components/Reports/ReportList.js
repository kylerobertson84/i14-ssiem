import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Typography,
	Chip,
	Box,
	useTheme,
	Paper,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Pagination,
	Grid,
	InputAdornment,
	Tooltip,
	CircularProgress,
	Collapse,
	Button,
	useMediaQuery,
} from "@mui/material";
import {
	Visibility as VisibilityIcon,
	Delete as DeleteIcon,
	Search as SearchIcon,
	Refresh as RefreshIcon,
	FilterList as FilterListIcon,
	ExpandMore as ExpandMoreIcon,
	ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { fetchReports } from "../../services/apiService";
import { debounce } from "lodash";

const typeMapping = {
	security_incident: "Security Incident",
	network_traffic: "Network Traffic Analysis",
	user_activity: "User Activity",
	system_performance: "System Performance",
	compliance_audit: "Compliance Audit",
};

const statusMapping = {
	draft: "Draft",
	pending: "Pending",
	open: "Open",
	approved: "Approved",
	rejected: "Rejected",
	closed: "Closed",
	archived: "Archived",
};

const getStatusColor = (status) => {
	switch (status.toLowerCase()) {
		case "open":
			return "info";
		case "pending":
			return "primary";
		case "approved":
		case "closed":
			return "success";
		case "rejected":
			return "error";
		case "archived":
			return "warning";
		default:
			return "default";
	}
};

const ReportList = ({ onSelect, onDelete, loading: externalLoading }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [reports, setReports] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [search, setSearch] = useState("");
	const [type, setType] = useState("");
	const [status, setStatus] = useState("");
	const [lastUpdate, setLastUpdate] = useState("");
	const [loading, setLoading] = useState(false);
	const [showFilters, setShowFilters] = useState(false);

	const loadReports = useCallback(
		async (searchParams) => {
			setLoading(true);
			try {
				const response = await fetchReports(
					searchParams.page,
					searchParams.pageSize,
					searchParams.search,
					searchParams.type,
					searchParams.status,
					searchParams.lastUpdate
				);
				setReports(response.results);
				setTotalPages(Math.ceil(response.count / pageSize));
			} catch (error) {
				console.error("Error loading reports:", error);
			} finally {
				setLoading(false);
			}
		},
		[pageSize]
	);

	const debouncedLoadReports = useCallback(
		debounce((searchParams) => loadReports(searchParams), 300),
		[loadReports]
	);

	useEffect(() => {
		const searchParams = { page, pageSize, search, type, status, lastUpdate };
		debouncedLoadReports(searchParams);
	}, [page, search, type, status, lastUpdate, debouncedLoadReports]);

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
		setPage(1);
	};

	const handleTypeChange = (event) => {
		setType(event.target.value);
		setPage(1);
	};

	const handleStatusChange = (event) => {
		setStatus(event.target.value);
		setPage(1);
	};

	const handleLastUpdateChange = (event) => {
		setLastUpdate(event.target.value);
		setPage(1);
	};

	const handleRefresh = () => {
		const searchParams = { page, pageSize, search, type, status, lastUpdate };
		loadReports(searchParams);
	};

	const renderFilters = () => (
		<Collapse in={showFilters}>
			<Grid container spacing={2} sx={{ mb: 3 }}>
				<Grid item xs={12} sm={6} md={3}>
					<TextField
						fullWidth
						variant="outlined"
						label="Search Reports"
						value={search}
						onChange={handleSearchChange}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<FormControl fullWidth variant="outlined">
						<InputLabel>Type</InputLabel>
						<Select value={type} onChange={handleTypeChange} label="Type">
							<MenuItem value="">All Types</MenuItem>
							{Object.entries(typeMapping).map(([value, label]) => (
								<MenuItem key={value} value={value}>
									{label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<FormControl fullWidth variant="outlined">
						<InputLabel>Status</InputLabel>
						<Select value={status} onChange={handleStatusChange} label="Status">
							<MenuItem value="">All Statuses</MenuItem>
							{Object.entries(statusMapping).map(([value, label]) => (
								<MenuItem key={value} value={value}>
									{label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<TextField
						fullWidth
						variant="outlined"
						label="Last Update"
						type="date"
						value={lastUpdate}
						onChange={handleLastUpdateChange}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
			</Grid>
		</Collapse>
	);

	const renderReportList = () => (
		<List>
			{reports.map((report, index) => (
				<ListItem
					key={report.id}
					divider={index !== reports.length - 1}
					sx={{
						py: 2,
						flexDirection: isMobile ? "column" : "row",
						alignItems: isMobile ? "flex-start" : "center",
						"&:hover": {
							backgroundColor: theme.palette.action.hover,
							transition: "background-color 0.3s",
						},
					}}
				>
					<ListItemText
						primary={
							<Typography variant="subtitle1" fontWeight="medium">
								{report.title}
							</Typography>
						}
						secondary={
							<Box sx={{ mt: 1 }}>
								<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
									<Chip
										label={typeMapping[report.type] || report.type}
										size="small"
										color="primary"
										variant="outlined"
									/>
									<Chip
										label={statusMapping[report.status] || report.status}
										size="small"
										color={getStatusColor(report.status)}
									/>
								</Box>
								<Typography variant="caption" color="text.secondary">
									Last updated: {format(new Date(report.updated_at), "PPP")}
								</Typography>
							</Box>
						}
					/>
					<ListItemSecondaryAction
						sx={{
							position: isMobile ? "static" : "absolute",
							mt: isMobile ? 2 : 0,
						}}
					>
						<Tooltip title="View Report">
							<IconButton
								edge="end"
								onClick={() => onSelect(report)}
								color="primary"
								sx={{ mr: 1 }}
							>
								<VisibilityIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Delete Report">
							<IconButton
								edge="end"
								onClick={() => onDelete(report)}
								color="error"
							>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);

	return (
		<Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography
					variant="h5"
					component="h2"
					sx={{ fontWeight: "bold", color: "primary.main" }}
				>
					Available Reports
				</Typography>
				<Box>
					<Button
						startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
						onClick={() => setShowFilters(!showFilters)}
						sx={{ mr: 1 }}
					>
						{showFilters ? "Hide Filters" : "Show Filters"}
					</Button>
					<Tooltip title="Refresh">
						<IconButton onClick={handleRefresh} color="primary">
							<RefreshIcon />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>

			{renderFilters()}

			{loading || externalLoading ? (
				<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
					<CircularProgress />
				</Box>
			) : reports.length === 0 ? (
				<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
					<Typography>No reports found.</Typography>
				</Box>
			) : (
				renderReportList()
			)}

			<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
				<Pagination
					count={totalPages}
					page={page}
					onChange={handlePageChange}
					color="primary"
					size={isMobile ? "small" : "large"}
				/>
			</Box>
		</Paper>
	);
};

ReportList.propTypes = {
	onSelect: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	loading: PropTypes.bool,
};

export default ReportList;
