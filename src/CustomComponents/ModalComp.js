import { Box, Modal } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import "./style.css";

function ModalComp(props) {
	const theme = useTheme();
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
					// width: props?.width ? props?.width : 400,
					bgcolor: theme.palette.background.paper,
					// background: "white",
					// border: "2px solid #000",
					borderRadius: "10px",
					boxShadow: 24,
					p: 4,
					m: 2,
				}}>
				<Box sx={{ position: "relative", minWidth: { xs: "240px", sm: "340px" } }}>
					{props?.children}
				</Box>
			</Box>
		</Modal>
	);
}

export default ModalComp;
