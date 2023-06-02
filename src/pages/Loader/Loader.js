import { Box, Button } from "@mui/material";
import React from "react";
import Lottie from "lottie-react";
import loader from "../../assets/lottie animation/loader.json";
import { useNavigate } from "react-router";

function Loader(props) {
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
			<Lottie animationData={loader} style={{ height: 300 }} />
		</Box>
	);
}

export default Loader;
