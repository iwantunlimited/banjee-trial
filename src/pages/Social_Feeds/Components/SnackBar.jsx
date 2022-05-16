import { Alert, Snackbar } from "@mui/material";
import React from "react";

function DeleteFeedSnackBar({ open, openFun }) {
	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				open={open}
				autoHideDuration={3000}
				onClose={() => openFun(false)}>
				<Alert onClose={() => openFun(false)} severity='success' sx={{ width: "100%" }}>
					Feed Deleted Successfully!
				</Alert>
			</Snackbar>
		</>
	);
}
export default DeleteFeedSnackBar;
