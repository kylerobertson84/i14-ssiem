import React from "react";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Grid,
	Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
}));

const DetailItem = styled(Box)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

const LogDetailDialog = ({ log, open, onClose, isComputerLog }) => {
	const renderLogDetail = (label, value, testId) => (
		<DetailItem data-testid={testId}>
			<Typography variant="subtitle2" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="body1">
				{value != null && value !== "" ? value.toString() : "N/A"}
			</Typography>
		</DetailItem>
	);

	if (!log) {
		return null;
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth data-testid="log-detail-dialog">
			<DialogTitle>Log Details</DialogTitle>
			<DialogContent>
				<StyledPaper>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							{renderLogDetail("Log ID", log.id, "log-id")}
							{renderLogDetail("Timestamp", log.iso_timestamp || log.date_time, "log-timestamp")}
							{renderLogDetail("Hostname", log.hostname, "log-hostname")}
						</Grid>
						<Grid item xs={12} md={6}>
							{isComputerLog ? (
								<>
									{renderLogDetail("Event Type", log.EventType, "log-event-type")}
									{renderLogDetail("Event ID", log.EventID, "log-event-id")}
									{renderLogDetail("Account Name", log.AccountName, "log-account-name")}
								</>
							) : (
								renderLogDetail("Process", log.process, "log-process")
							)}
						</Grid>
						<Grid item xs={12}>
							{renderLogDetail("Message", log.message, "log-message")}
						</Grid>
					</Grid>
				</StyledPaper>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary" data-testid="close-button">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

LogDetailDialog.propTypes = {
	log: PropTypes.shape({
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		iso_timestamp: PropTypes.string,
		date_time: PropTypes.string,
		hostname: PropTypes.string,
		EventType: PropTypes.string,
		EventID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		AccountName: PropTypes.string,
		process: PropTypes.string,
		message: PropTypes.string,
	}),
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	isComputerLog: PropTypes.bool.isRequired,
};

export default LogDetailDialog;
