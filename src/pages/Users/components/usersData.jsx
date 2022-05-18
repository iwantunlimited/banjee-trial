import React from "react";
import {
	Card,
	Box,
	CircularProgress,
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	DialogContentText,
} from "@mui/material";
import "../users.css";

function UserData({ data, handleClose, loadComponent }) {
	if (data && data.CustomerData && data.CustomerData.rows.length > 0) {
		return (
			<div style={{ minHeight: "88vh", width: "100%" }}>
				<Card className='main-card space-css'>
					<div style={{ width: "100%" }}>
						<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
							Users ({data.totalElement})
						</div>
						<hr />
						{loadComponent()}
						<Dialog
							open={data.dialougeOpen}
							onClose={handleClose}
							aria-labelledby='alert-dialog-title'
							aria-describedby='alert-dialog-description'>
							<DialogTitle id='alert-dialog-title'>{data.deleteCustomerName}</DialogTitle>
							<DialogContent>
								<DialogContentText id='alert-dialog-description'>
									Are you sure want to delete.
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose} color='primary'>
									Cancel
								</Button>
								{/*<Button onClick={deleteApi} color="secondary" autoFocus>*/}
								{/*Delete*/}
								{/*</Button>*/}
							</DialogActions>
						</Dialog>
					</div>
				</Card>
			</div>
		);
	} else {
		return (
			<Box
				style={{ width: "100%", height: "50vh" }}
				className='d-flex justify-content-center align-items-center'>
				<CircularProgress />
			</Box>
		);
	}
}

export default UserData;
