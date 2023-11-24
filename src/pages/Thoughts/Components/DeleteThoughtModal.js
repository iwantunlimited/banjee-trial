import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { MainContext } from "../../../context/Context";
import { deleteThought } from "../services/ApiServices";

export default function DeleteThoughtModal({ open, setOpen, deleteThoughtApiCall, thoughtId }) {
	console.log("====================================");
	console.log("thoughtId", thoughtId);
	console.log("====================================");
	return (
		<Modal
			open={open}
			className='delete-modal'
			sx={{
				"& > div": {
					backgroundColor: "rgb(35 35 35 / 8%)",
				},
			}}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					// width: 400,
					minWidth: "320px",
					background: "white !important",
					// boxShadow: 24,
					borderRadius: "10px",
					padding: "40px",
				}}
				className='delete1-modal'>
				<Box>Are You Sure You want to delete this thought?</Box>
				<Box sx={{ marginTop: 2 }}>
					<Button
						variant='outlined'
						onClick={() => {
							setOpen(false);
						}}>
						cancel
					</Button>
					<Button
						variant='contained'
						onClick={() => {
							setOpen(false);
							deleteThoughtApiCall(thoughtId);
						}}
						sx={{ float: "right" }}>
						Delete
					</Button>
				</Box>
			</Box>
		</Modal>
	);
}
