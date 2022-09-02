import { Alert, Snackbar } from "@mui/material";
import React from "react";

export function SnackBarComp(props) {
	const {
		handleSnackbar,
		data: { open, message },
	} = props;

	const handleClose = () => {
		handleSnackbar(false);
	};

	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={handleClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
			<Alert onClose={handleClose} severity='success' sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
}
