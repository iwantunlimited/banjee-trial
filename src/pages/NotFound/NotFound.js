import { Box, Button } from "@mui/material";
import React from "react";
import Lottie from "lottie-react";
import notFound from "../../assets/lottie animation/404.json";
import { useNavigate } from "react-router";

function NotFound(props) {
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "80vh",
				flexDirection: "column",
			}}>
			<Lottie animationData={notFound} style={{ height: 300 }} />
			<Box>
				<Button onClick={() => navigate(-1)}>back to homepage</Button>
			</Box>
		</Box>
	);
}

export default NotFound;
