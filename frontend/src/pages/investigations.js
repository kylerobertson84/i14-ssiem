import React, { useState, useEffect, useCallback } from "react";
import {
	Container,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	Select,
	MenuItem,
	Grid,
	Box,
	Chip,
	IconButton,
	Tooltip,
	LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	Refresh as RefreshIcon,
	Sort as SortIcon,
	Visibility as VisibilityIcon,
	Description as DescriptionIcon,
} from "@mui/icons-material";
import {
	fetchInvestigations,
	updateInvestigationStatus,
	fetchRules,
	fetchRelatedLogs,
} from "../services/apiService";
import { useAuth } from "../services/AuthContext";
import SEO from "../Design/SEO";
import ReportGenerator from "../components/Reports/ReportGenerator";

const StyledPaper = styled(Paper)(({ theme }) => ({
	marginBottom: theme.spacing(3),
	"& .MuiTableHead-root": {
		backgroundColor: theme.palette.primary.main,
		"& .MuiTableCell-root": {
			color: theme.palette.common.white,
			fontWeight: "bold",
		},
	},
	"& .MuiTableBody-root .MuiTableRow-root:hover": {
		backgroundColor: theme.palette.action.hover,
	},
	"& .MuiTablePagination-root": {
		borderTop: `1px solid ${theme.palette.divider}`,
	},
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogTitle-root": {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
		marginBottom: theme.spacing(2),
	},
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(2),
		borderTop: `1px solid ${theme.palette.divider}`,
	},
}));

const statusColors = {
	OPEN: "error",
	"IN PROGRESS": "warning",
	CLOSED: "success",
};

const InvestigationPage = () => {
	const [investigations, setInvestigations] = useState({
		results: [],
		count: 0,
	});
	const [loading, setLoading] = useState(true);
	const [alertStatus, setAlertStatus] = useState("OPEN");
	const [notes, setNotes] = useState("");
	const [page, setPage] = useState(0);
	const { user, hasRole } = useAuth();
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedAlert, setSelectedAlert] = useState(null);
	const [relatedLogs, setRelatedLogs] = useState([]);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
	const [openReportGenerator, setOpenReportGenerator] = useState(false);
	const [selectedInvestigationId, setSelectedInvestigationId] = useState(null);
	const [rules, setRules] = useState([]);

	const loadInvestigations = useCallback(async () => {
		setLoading(true);
		try {
			const fetchedInvestigations = await fetchInvestigations();
			const openInvestigations = fetchedInvestigations.results.filter(
				investigation => investigation.status !== "CLOSED"
			);
			setInvestigations({
				results: openInvestigations,
				count: openInvestigations.length,
			});
		} catch (error) {
			console.error("Error loading investigations data", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadInvestigations();
	}, [loadInvestigations]);

	const loadRules = useCallback(async () => {
		try {
			const fetchedRules = await fetchRules();
			setRules(fetchedRules);
		} catch (error) {
			console.error("Error loading rules", error);
		}
	}, []);

	const handleOpenDialog = async (alert) => {
		setSelectedAlert(alert);
		setAlertStatus(alert.status);
		setNotes(alert.notes || "");

		const logs = await fetchRelatedLogs(alert);
		setRelatedLogs(logs);

		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedAlert(null);

		setRelatedLogs([]);
	};

	const handleStatusChange = (event) => {
		setAlertStatus(event.target.value);
	};

	const handleNotesChange = (event) => {
		setNotes(event.target.value);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleUpdateStatus = async () => {
		if (selectedAlert) {
			setLoading(true);
			try {
				await updateInvestigationStatus(selectedAlert.id, {
					status: alertStatus,
					notes,
				});
				handleCloseDialog();
				await loadInvestigations();
			} catch (error) {
				console.error("Error updating status", error);
			} finally {
				setLoading(false);
			}
		}
	};

	const canManageInvestigation = (investigation) => {
		return (
			hasRole("ADMIN") ||
			(hasRole("ANALYST") && investigation.assigned_to.id === user?.id)
		);
	};

	const handleSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const sortedInvestigations = React.useMemo(() => {
		let sortableItems = [...investigations.results];
		if (sortConfig.key !== null) {
			sortableItems.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableItems;
	}, [investigations.results, sortConfig]);

	const renderTableHeader = (label, key) => (
		<TableCell onClick={() => handleSort(key)}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				{label}
				{sortConfig.key === key && (
					<SortIcon
						sx={{
							ml: 1,
							fontSize: 18,
							transform:
								sortConfig.direction === "desc" ? "rotate(180deg)" : "none",
						}}
					/>
				)}
			</Box>
		</TableCell>
	);

	const handleOpenReport = async (investigationId) => {
		setSelectedInvestigationId(investigationId);
		await loadRules();
		setOpenReportGenerator(true);
	};

	const handleCloseReportGenerator = () => {
		setOpenReportGenerator(false);
		setSelectedInvestigationId(null);
	};

	//updated time format
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
			<SEO title="Investigations" />
			<Container maxWidth="xlg" sx={{ mt: 4, mb: 4 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 3,
					}}
				>
					<Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
						Investigations
					</Typography>
					<Tooltip title="Refresh Investigations">
						<IconButton onClick={loadInvestigations} disabled={loading}>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
				</Box>

				<StyledPaper elevation={3}>
					{loading && <LinearProgress />}
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									{renderTableHeader("ID", "id")}
									{renderTableHeader("Device", "alert.event.hostname")}
									{renderTableHeader("Alert Type", "alert.rule")}
									{renderTableHeader("Status", "status")}
									{renderTableHeader("Timestamp", "alert.created_at")}
									{renderTableHeader("Assigned To", "assigned_to.email")}
									<TableCell>Action</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{sortedInvestigations.length > 0 ? (
									sortedInvestigations
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((result) => (
											<TableRow key={result.id} hover>
												<TableCell>{result.id}</TableCell>
												<TableCell>
													{result.alert?.event?.hostname || "N/A"}
												</TableCell>
												<TableCell>{result.alert?.rule || "N/A"}</TableCell>
												<TableCell>
													<Chip
														label={result.status}
														color={statusColors[result.status]}
														size="small"
													/>
												</TableCell>
												<TableCell>
													{formatDate(result.alert?.created_at)}
												</TableCell>
												<TableCell>
													{result.assigned_to?.email || "Unassigned"}
												</TableCell>
												<TableCell>
													{canManageInvestigation(result) && (
														<Tooltip title="Investigate">
															<IconButton
																color="primary"
																onClick={() => handleOpenDialog(result)}
																size="small"
															>
																<VisibilityIcon />
															</IconButton>
														</Tooltip>
													)}
													<Tooltip title="Open Report">
														<IconButton
															color="secondary"
															onClick={() => handleOpenReport(result.id)}
															size="small"
														>
															<DescriptionIcon />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										))
								) : (
									<TableRow>
										<TableCell colSpan={7} align="center">
											No investigations found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={investigations.count}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</StyledPaper>

				<StyledDialog
					open={openReportGenerator}
					onClose={handleCloseReportGenerator}
					maxWidth="md"
					fullWidth
				>
					<DialogTitle>Generate Report for Investigation</DialogTitle>
					<DialogContent>
						{selectedInvestigationId && (
							<ReportGenerator
								investigationId={selectedInvestigationId}
								onClose={handleCloseReportGenerator}
								isFromInvestigationPage={true}
								rules={rules}
								onReportCreated={() => {
									handleCloseReportGenerator();
									loadInvestigations();
								}}
							/>
						)}
					</DialogContent>
				</StyledDialog>

				<StyledDialog
					open={openDialog}
					onClose={handleCloseDialog}
					maxWidth="md"
					fullWidth
				>
					<DialogTitle>Investigate Alert</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<Typography variant="subtitle2" color="text.secondary">
									Alert ID
								</Typography>
								<Typography variant="body1">
									{selectedAlert?.alert?.id || "N/A"}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="subtitle2" color="text.secondary">
									Severity
								</Typography>
								<Typography variant="body1">
									{selectedAlert?.alert?.severity || "N/A"}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="subtitle2" color="text.secondary">
									Created At
								</Typography>
								<Typography variant="body1">
									{selectedAlert?.alert?.created_at ? formatDate(selectedAlert.alert.created_at) : "N/A"}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="subtitle2" color="text.secondary">
									Updated At
								</Typography>
								<Typography variant="body1">
									{selectedAlert?.alert?.updated_at ? formatDate(selectedAlert.alert.updated_at) : "N/A"}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="subtitle2" color="text.secondary">
									Hostname
								</Typography>
								<Typography variant="body1">
									{selectedAlert?.alert?.event?.hostname || "N/A"}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="subtitle2" color="text.secondary">
									Rule
								</Typography>
								<Typography variant="body1">
									{selectedAlert?.alert?.rule || "N/A"}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="subtitle2" color="text.secondary">
									Related Logs
								</Typography>
								{relatedLogs.length > 0 ? (
									relatedLogs.map((log, index) => (
										<Box key={index} sx={{ mb: 2 }}>
											<Typography variant="body2">
												<strong>Log {index + 1}:</strong> {log.message}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Hostname: {log.hostname}, Event ID: {log.event_id}, Account Name: {log.AccountName}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Timestamp: {new Date(log.iso_timestamp).toLocaleString()}
											</Typography>
										</Box>
									))
								) : (
									<Typography variant="body2">No related logs found.</Typography>
								)}
							</Grid>
						</Grid>

						<Typography variant="subtitle2" color="text.secondary">
							Assigned Analyst: {selectedAlert?.assigned_to?.email || "Unassigned"}
						</Typography>


						<FormControl fullWidth sx={{ mt: 2 }}>
							<Typography variant="subtitle1" sx={{ mb: 2 }}>
								Change Status
							</Typography>
							<Select value={alertStatus} onChange={handleStatusChange}>
								<MenuItem value="OPEN">Open</MenuItem>
								<MenuItem value="IN PROGRESS">In Progress</MenuItem>
								<MenuItem value="CLOSED">Closed</MenuItem>
							</Select>
						</FormControl>

						<FormControl fullWidth sx={{ mt: 4 }}>
							<Typography variant="subtitle1" sx={{ mb: 2 }}>
								Notes
							</Typography>
							<TextField
								multiline
								minRows={3}
								value={notes}
								onChange={handleNotesChange}
								placeholder="Add investigation notes here"
							/>
						</FormControl>
					</DialogContent>

					<DialogActions>
						<Button onClick={handleCloseDialog} color="primary">
							Cancel
						</Button>
						<Button
							onClick={handleUpdateStatus}
							color="primary"
							variant="contained"
							disabled={loading}
						>
							Update
						</Button>
					</DialogActions>
				</StyledDialog>
			</Container>
		</>
	);
};

export default InvestigationPage;