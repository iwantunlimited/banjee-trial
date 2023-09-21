import React, { useEffect, useState } from "react";
import { WebSocketContext } from "../../context/WebSocketContext";
import LiveAlertMap from "./components/LiveAlertMap";
import { Box } from "@mui/material";

export default function LiveAlerts() {
	return (
		<div>
			LiveAlerts
			<Box style={{ height: "100vh" }}>
				<LiveAlertMap data={{ lat: 23, lng: 72 }} />
			</Box>
		</div>
	);
}
