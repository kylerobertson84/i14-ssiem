// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1565c0",
			light: "#5e92f3",
			dark: "#003c8f",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#f50057",
			light: "#ff5983",
			dark: "#bb002f",
			contrastText: "#ffffff",
		},
		background: {
			default: "#f5f5f5",
			paper: "#ffffff",
		},
		text: {
			primary: "#333333",
			secondary: "#666666",
		},
	},
	typography: {
		fontFamily: "'Roboto', Arial, sans-serif",
		h4: {
			fontWeight: 700,
			fontSize: "2rem",
			"@media (max-width:600px)": {
				fontSize: "1.5rem",
			},
		},
		h5: {
			fontWeight: 600,
			fontSize: "1.5rem",
			"@media (max-width:600px)": {
				fontSize: "1.25rem",
			},
		},
		h6: {
			fontWeight: 600,
			fontSize: "1.25rem",
			"@media (max-width:600px)": {
				fontSize: "1.1rem",
			},
		},
		body1: {
			fontSize: "1rem",
			"@media (max-width:600px)": {
				fontSize: "0.9rem",
			},
		},
		body2: {
			fontSize: "0.875rem",
			"@media (max-width:600px)": {
				fontSize: "0.8rem",
			},
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 500,
					borderRadius: 4,
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 4,
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						borderRadius: 4,
					},
				},
			},
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},
});

export default theme;
