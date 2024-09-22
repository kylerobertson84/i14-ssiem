import React from "react";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
	return (
		<div style={{ padding: "20px" }}>
			<Outlet />
		</div>
	);
};

export default ProtectedLayout;
