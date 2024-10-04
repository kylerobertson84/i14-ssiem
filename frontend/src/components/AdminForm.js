import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import apiRequest from "../services/apiRequest";
import API_ENDPOINTS from "../services/apiConfig";

const AdminForm = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		role_id: "",
	});
	const [roles, setRoles] = useState([]);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [fetchingRoles, setFetchingRoles] = useState(true); // For roles loading state

	useEffect(() => {
		// Fetch roles from API and set available roles
		apiRequest(API_ENDPOINTS.roles)
			.then((response) => {
				setRoles(response);
				setFetchingRoles(false);
			})
			.catch((err) => {
				setError("Failed to fetch roles");
				console.error(err); // Log the error details
				setFetchingRoles(false);
			});
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (loading) return; // Prevent multiple submissions
		setLoading(true);

		if (!formData.role_id) {
			setError("Please select an employee role");
			setLoading(false);
			return;
		}

		const userData = {
			email: formData.email,
			password: formData.password,
			role_id: formData.role_id,
		};

		try {
			// Create the user
			const userResponse = await apiRequest(
				API_ENDPOINTS.auth.createUser,
				"POST",
				userData
			);
			const userId = userResponse?.user_id;

			if (!userId) {
				throw new Error("User ID not returned from API");
			}

			// Create the employee profile
			const employeeData = {
				user_id: userId,
				first_name: formData.firstName,
				last_name: formData.lastName,
			};
			await apiRequest(API_ENDPOINTS.employee.create, "POST", employeeData);

			setSuccess("User created successfully");
			setError("");
			setFormData({
				email: "",
				password: "",
				firstName: "",
				lastName: "",
				role_id: "",
			});

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			setError("Failed to create analyst user");
			console.error(err); // Log the error details
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				maxWidth: "600px",
				margin: "0 auto",
				padding: "2rem",
				backgroundColor: "#f9f9f9",
				boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Typography
				variant="h4"
				sx={{ textAlign: "center", mb: 4, fontWeight: "bold", color: "#333" }}
			>
				Employee User Registration
			</Typography>

			<Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
				<TextField
					type="text"
					variant="outlined"
					color="secondary"
					label="First Name"
					name="firstName"
					onChange={handleInputChange}
					value={formData.firstName}
					fullWidth
					required
					sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
				/>
				<TextField
					type="text"
					variant="outlined"
					color="secondary"
					label="Last Name"
					name="lastName"
					onChange={handleInputChange}
					value={formData.lastName}
					fullWidth
					required
					sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
				/>
			</Stack>

			<TextField
				type="email"
				variant="outlined"
				color="secondary"
				label="Email"
				name="email"
				onChange={handleInputChange}
				value={formData.email}
				fullWidth
				required
				sx={{ backgroundColor: "#fff", mb: 4, borderRadius: "4px" }}
			/>

			<TextField
				type="password"
				variant="outlined"
				color="secondary"
				label="Password"
				name="password"
				onChange={handleInputChange}
				value={formData.password}
				required
				fullWidth
				sx={{ backgroundColor: "#fff", mb: 4, borderRadius: "4px" }}
			/>

			<FormLabel
				id="employee-role"
				sx={{ color: "#333", fontWeight: "bold", mb: 1 }}
			>
				Employee Role
			</FormLabel>

			{fetchingRoles ? (
				<CircularProgress />
			) : roles.length > 0 ? (
				<RadioGroup
					aria-labelledby="employee-role"
					name="role_id"
					onChange={handleInputChange}
					value={formData.role_id}
					sx={{ mb: 3 }}
				>
					{roles.map((role) => (
						<FormControlLabel
							key={role.role_id}
							value={role.role_id}
							control={<Radio color="secondary" />}
							label={role.name}
						/>
					))}
				</RadioGroup>
			) : (
				<Typography color="error">No roles available</Typography>
			)}

			{error && (
				<FormHelperText
					sx={{
						color: "red",
						fontSize: "14px",
						fontWeight: "bold",
						marginBottom: "16px",
					}}
				>
					{error}
				</FormHelperText>
			)}

			{success && (
				<FormHelperText
					sx={{
						color: "green",
						fontSize: "14px",
						fontWeight: "bold",
						marginBottom: "16px",
					}}
				>
					{success}
				</FormHelperText>
			)}

			<Button
				variant="contained"
				color="primary"
				type="submit"
				fullWidth
				disabled={loading}
				sx={{
					backgroundColor: loading ? "#ccc" : "#007bff",
					":hover": loading ? null : { backgroundColor: "#0056b3" },
					padding: "12px 0",
					fontSize: "16px",
					fontWeight: "bold",
				}}
			>
				{loading ? "Submitting..." : "Submit"}
			</Button>
		</Box>
	);
};

export default AdminForm;
