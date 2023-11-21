import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { MainContext } from "../../../context/Context";
import { deleteThought } from "../services/ApiServices";

export default function DeleteThoughtModal({
	open,
	setOpen,
	deleteThoughtId,
	getThoughtsApiCall,
}) {
	const { setModalData, setModalOpen } = React.useContext(MainContext);
	const deleteThoughtApiCall = () => {
		deleteThought({
			id: deleteThoughtId,
			cloudId: "62401d53e3a009309544d3e8",
			cloudname: "Global-Feeds",
		})
			.then(() => {
				setOpen(false);
				setModalOpen(true);
				setModalData("Thought Deleted Successfully", "success");
				getThoughtsApiCall();
			})
			.catch((err) => {
				console.log("====================================");
				console.log(err);
				console.log("====================================");
			});
	};
	return (
		<Modal
			open={open}
			className="delete-modal"
			sx={{
				"& > div": {
					backgroundColor: "rgb(35 35 35 / 8%)",
				},
			}}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
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
				className="delete1-modal"
			>
				<Box>Are You Sure You want to delete this thought?</Box>
				<Box sx={{ marginTop: 2 }}>
					<Button
						variant="outlined"
						onClick={() => {
							setOpen(false);
						}}
					>
						cancel
					</Button>
					<Button
						variant="contained"
						onClick={() => {
							deleteThoughtApiCall();
						}}
						sx={{ float: "right" }}
					>
						Delete
					</Button>
				</Box>
			</Box>
		</Modal>
	);
}
