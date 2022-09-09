import { Box, Modal } from "@mui/material";
import React from "react";

function ModalComp(props) {
	const { handleModal, data } = props;

	return (
		<Modal
			open={data?.open}
			onClose={() => handleModal(false)}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: props?.width ? props?.width : 400,
					bgcolor: "background.paper",
					// border: "2px solid #000",
					boxShadow: 24,
					p: 4,
				}}>
				<Box sx={{ position: "relative" }}>{props?.children}</Box>
			</Box>
		</Modal>
	);
}

export default ModalComp;
