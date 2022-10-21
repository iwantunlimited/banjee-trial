import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import "./style.css";
import animationData from "../assets/lottie animation/96673-success.json";
import Lottie from "react-lottie";
import { MainContext } from "../context/Context";

function NotificationPopup(props) {
	const theme = useTheme();
	const { notificationPopup, setNotificationPopup } = React.useContext(MainContext);

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	return (
		<Modal
			open={notificationPopup}
			onClose={() => setNotificationPopup(false)}
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
					background: "transparent",
					// background: "white",
					// border: "2px solid #000",
					// boxShadow: 2,
				}}>
				<Box
					sx={{
						position: "relative",
						background: "white",
						paddingX: { xs: "30px", sm: "60px", md: "80px", lg: "100px" },
						paddingY: "20px",
					}}>
					<Lottie options={defaultOptions} height={200} width={200} />
					<Typography sx={{ textAlign: "center", color: "#208354", marginTop: "10px" }}>
						<b>Notification Sent Successfully</b>{" "}
					</Typography>
				</Box>
			</Box>
		</Modal>
	);
}

export default NotificationPopup;
