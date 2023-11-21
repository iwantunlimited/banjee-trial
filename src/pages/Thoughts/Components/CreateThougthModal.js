import { Box, Modal, TextField, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { MainContext } from "../../../context/Context";
import { createThought } from "../services/ApiServices";

export default function CreateThougthModal({
	openCreateModal,
	setOpenCreateModal,
	getThoughtsApiCall,
}) {
	const { setModalData, setModalOpen } = React.useContext(MainContext);
	const createThoughtApiCall = () => {
		createThought({
			text: thoughtText,
			cloudId: "62401d53e3a009309544d3e8",
			cloudname: "Global-Feeds",
		})
			.then((res) => {
				setOpenCreateModal(false);
				setModalOpen(true);
				setModalData("Thought Created Successfully", "success");
				getThoughtsApiCall();
			})
			.catch((err) => {
				if (err === "-404:You've already shared a thought") {
					setModalOpen(true);
					setModalData("You've already shared a thought", "error");
				}
			});
	};

	const [thoughtText, setThoughtText] = useState();
	return (
		<Modal
			className="delete-modal"
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
			// onClose={() => openModalfun(false)}
			sx={{
				"& > div": {
					backgroundColor: "rgb(35 35 35 / 8%)",
				},
			}}
			open={openCreateModal}
		>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 500,
					minWidth: "320px",
					background: "white !important",
					boxShadow: 24,
					borderRadius: "10px",
					padding: "40px",
				}}
				className="delete1-modal"
			>
				<form
					onSubmit={() => {
						createThoughtApiCall();
						setOpenCreateModal(false);
					}}
				>
					<Typography
						id="modal-modal-title"
						sx={{
							fontSize: { xs: "20px", sm: "22px", lg: "24px", xl: "26px" },
							fontWeight: 400,
						}}
					>
						Create Thought
					</Typography>
					<Box sx={{ my: 2 }}>
						<TextField
							fullWidth
							multiline
							minRows={3}
							label="Add your thought"
							name="thought"
							inputProps={{
								maxLength: 80,
							}}
							helperText={
								<Box sx={{ float: "right", fontSize: "14px" }}>
									{thoughtText ? thoughtText.length : 0}/80
								</Box>
							}
							onChange={(event) => {
								setThoughtText(event.target.value);
							}}
							required
							variant="outlined"
						/>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<Button
							variant="outlined"
							onClick={() => {
								setOpenCreateModal(false);
								setThoughtText("");
							}}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							type="submit"
							disabled={!thoughtText?.length > 0}
						>
							Submit
						</Button>
					</Box>
				</form>
			</Box>
		</Modal>
	);
}
