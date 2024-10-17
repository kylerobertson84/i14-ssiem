import React, { useState, useEffect } from "react";
import AlertDetailsDialog from "../components/AlertDetailsDialog";
import {
	Container,
	Typography,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	IconButton,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Box,
	Tooltip,
	TablePagination,
	TableSortLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	Search as SearchIcon,
	Settings as SettingsIcon,
} from "@mui/icons-material";
import SEO from "../Design/SEO.js";

const { fetchAlerts, updateAlert } = require("../services/apiService");

const StyledPaper = styled(Paper)(({ theme }) => ({
	transition: "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",
	"&:hover": {
		boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
		transform: "translateY(-4px)",
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	cursor: "pointer",
	"&:hover": {
		backgroundColor: theme.palette.action.hover,
	},
}));

const StyledChip = styled(Chip)(({ theme }) => ({
	fontWeight: 600,
}));

const severityColors = {
	INFO: "info",
	LOW: "success",
	MEDIUM: "warning",
	HIGH: "error",
	CRITICAL: "error",
};

const AlertsPage = () => {
	const [alerts, setAlerts] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [totalCount, setTotalCount] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAlert, setSelectedAlert] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [severityFilter, setSeverityFilter] = useState("");
	const [orderBy, setOrderBy] = useState("created_at");
	const [order, setOrder] = useState("desc");

	const loadAlerts = async () => {
		try {
			const data = await fetchAlerts(
				page + 1,
				rowsPerPage,
				searchTerm,
				severityFilter,
				orderBy,
				order
			);
			setAlerts(data.results);
			setTotalCount(data.count);
		} catch (error) {
			console.error("Failed to fetch alerts:", error);
		}
	};

	useEffect(() => {
		loadAlerts();
	}, [page, rowsPerPage, searchTerm, severityFilter, orderBy, order]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			setSearchTerm(event.target.value);
			setPage(0);
		}
	};


	const handleViewDetails = (alert) => {
		const completeAlert = {
			...alert,
			event: alert.event || {},
			rule: typeof alert.rule === "object" ? alert.rule : { name: alert.rule },
		};
		setSelectedAlert(completeAlert);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleAssign = async (alertId, assignee, comment) => {
		try {
			const updatedAlert = await updateAlert(alertId, {
				assigned_to: assignee,
				comments: comment,
			});
			setAlerts(
				//alerts.map((alert) => (alert.id === alertId ? updatedAlert : alert))
				alerts.filter((alert) => alert.id !== alertId)
			);
			/*
			setTimeout(() => {
				window.location.reload();
			}, 500);
			*/
		} catch (error) {
			console.error("Failed to update alert:", error);
		}
	};

	const handleRequestSort = (property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
		setPage(0);
	};

	const handleSearch = (event) => {
		setSearchTerm(event.target.value);
		setPage(0);
	};

	const handleSeverityFilter = (event) => {
		setSeverityFilter(event.target.value);
		setPage(0);
	};


	//Updated Time Format
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		
		return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
	};

	return (
		<>
			<SEO title="Alerts" />
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					sx={{ mb: 4, fontWeight: "bold" }}
				>
					Alerts
				</Typography>

				<Box sx={{ display: "flex", mb: 2, gap: 2 }}>
					<TextField
						variant="outlined"
						placeholder="Search alerts..."
						InputProps={{
							startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
						}}
						onChange={handleSearch}
						onKeyDown={handleKeyPress}
						sx={{ flexGrow: 1 }}
					/>
					<FormControl sx={{ minWidth: 120 }}>
						<InputLabel>Severity</InputLabel>
						<Select
							value={severityFilter}
							onChange={handleSeverityFilter}
							label="Severity"
						>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="INFO">Info</MenuItem>
							<MenuItem value="LOW">Low</MenuItem>
							<MenuItem value="MEDIUM">Medium</MenuItem>
							<MenuItem value="HIGH">High</MenuItem>
							<MenuItem value="CRITICAL">Critical</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<StyledPaper>
					<TableContainer>
						<Table sx={{ minWidth: 650 }} aria-label="alerts table">
							<TableHead>
								<TableRow sx={{ bgcolor: "primary.main" }}>
									<TableCell>
										<TableSortLabel
											active={orderBy === "id"}
											direction={orderBy === "id" ? order : "asc"}
											onClick={() => handleRequestSort("id")}
											sx={{ color: "white", fontWeight: "bold" }}
										>
											ID
										</TableSortLabel>
									</TableCell>
									<TableCell>
										<TableSortLabel
											active={orderBy === "created_at"}
											direction={orderBy === "created_at" ? order : "asc"}
											onClick={() => handleRequestSort("created_at")}
											sx={{ color: "white", fontWeight: "bold" }}
										>
											Time
										</TableSortLabel>
									</TableCell>
									<TableCell>
										<TableSortLabel
											active={orderBy === "event__hostname"}
											direction={orderBy === "event__hostname" ? order : "asc"}
											onClick={() => handleRequestSort("event__hostname")}
											sx={{ color: "white", fontWeight: "bold" }}
										>
											Hostname
										</TableSortLabel>
									</TableCell>
									<TableCell>
										<TableSortLabel
											active={orderBy === "severity"}
											direction={orderBy === "severity" ? order : "asc"}
											onClick={() => handleRequestSort("severity")}
											sx={{ color: "white", fontWeight: "bold" }}
										>
											Severity
										</TableSortLabel>
									</TableCell>
									<TableCell sx={{ color: "white", fontWeight: "bold" }}>
										Rule
									</TableCell>
									<TableCell sx={{ color: "white", fontWeight: "bold" }}>
										Actions
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{alerts.map((alert) => (
									<StyledTableRow key={alert.id} onClick={() => handleViewDetails(alert)}>
										<TableCell>{alert.id}</TableCell>
										<TableCell>
											{formatDate(alert.created_at)}
										</TableCell>
										<TableCell>{alert.event?.hostname || "N/A"}</TableCell>
										<TableCell>
											<StyledChip
												label={alert.severity}
												color={severityColors[alert.severity]}
												size="small"
											/>
										</TableCell>
										<TableCell>
											<strong>
												{typeof alert.rule === "object"
													? alert.rule.name
													: alert.rule}
											</strong>
										</TableCell>
										<TableCell>
											<Tooltip title="View Details">
												<IconButton onClick={(e) => {
													e.stopPropagation();  // Prevents triggering row click
													handleViewDetails(alert);
												}} size="small">
													<SettingsIcon />
												</IconButton>
											</Tooltip>
										</TableCell>
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 25, 50]}
						component="div"
						count={totalCount}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</StyledPaper>

				<AlertDetailsDialog
					alert={selectedAlert}
					open={openDialog}
					onClose={handleCloseDialog}
					onAssign={handleAssign}
				/>
			</Container >
		</>
	);
};

export default AlertsPage;
