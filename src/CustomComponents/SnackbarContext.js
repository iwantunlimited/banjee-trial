import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { MainContext } from "../context/Context";

function SnackbarContext(props) {
	const context = React.useContext(MainContext);

	const { modalOpen, modalData, setModalOpen } = context;

	const handleClose = () => {
		setModalOpen(false);
	};

	return (
		<Snackbar
			open={modalOpen}
			autoHideDuration={5000}
			onClose={handleClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
			<Alert
				variant='filled'
				onClose={handleClose}
				severity={modalData.severity ? modalData.severity : "success"}
				sx={{ width: "100%" }}>
				{modalData?.message}
			</Alert>
		</Snackbar>
	);
}

export default SnackbarContext;
