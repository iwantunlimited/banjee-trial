import React from "react";
import { Box, Card, Divider, Grid, Tabs, Tab } from "@mui/material";
import NotificationList from "./components/Notification/NotificationList";
import SnackbarContext from "../../CustomComponents/SnackbarContext";

function Notification() {
	return (
		<Box>
			<NotificationList />
			{/* <SnackbarContext /> */}
		</Box>
	);
}

export default Notification;
