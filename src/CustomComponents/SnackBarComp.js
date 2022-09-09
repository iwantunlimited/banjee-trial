import { Alert, Snackbar } from "@mui/material";
import React from "react";

function SnackBarComp(props) {
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
			autoHideDuration={props?.data?.duration ? props?.data?.duration : 3000}
			onClose={handleClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
			<Alert
				onClose={handleClose}
				severity={props?.data?.severity ? props?.data?.severity : "success"}
				sx={{ width: "100%" }}>
				{message}
			</Alert>
		</Snackbar>
	);
}

export default SnackBarComp;
