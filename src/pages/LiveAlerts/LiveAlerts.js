import React, { useCallback, useEffect, useState } from "react";
import LiveAlertMap from "./components/LiveAlertMap";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { listAlert } from "../BanjeeAlert/api-services/apiServices";
import AlertCard from "./components/AlertCard";

export default function LiveAlerts() {
	const [alertList, setAlertList] = useState([]);
	const [selectedCard, setSelectedCard] = useState();
	const currentLat = localStorage?.getItem("lat");
	const currentLng = localStorage?.getItem("lng");

	const getLiveAlerts = useCallback(() => {
		listAlert({
			eventCode: ["PANIC_EMERGENCY", "NEW_ALERT"],
		})
			.then((res) => {
				const content = res.content.filter((alert) => {
					return alert.createdBy != "61111e42bcc68b2a1fa3432c";
				});
				setAlertList(content);
				setSelectedCard(content?.[0]);
			})
			.catch((err) => console.error(err));
	}, []);

	function handleData(data) {
		setSelectedCard(data);
	}

	useEffect(() => {
		getLiveAlerts();
	}, []);

	if (alertList) {
		return (
			<Box sx={{ position: "relative" }}>
				<Box sx={{ height: "90vh", position: "relative" }}>
					<LiveAlertMap
						alertData={selectedCard}
						openModal={true}
						data={{
							lat: selectedCard?.location?.coordinates?.[1]
								? selectedCard?.location?.coordinates?.[1]
								: currentLat,
							lng: selectedCard?.location?.coordinates?.[0]
								? selectedCard?.location?.coordinates?.[0]
								: currentLng,
						}}
					/>
				</Box>
				<Box
					sx={{
						position: "absolute",
						// right: "0px",
						bottom: 0,
						left: 0,
						zIndex: 1,
						backgroundColor: "rgba(0, 0, 0, 0.10)",
						width: "100%",
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-evenly",
							alignItems: "center",
							paddingY: "20px",
							width: "auto",
							flexDirection: "row",
							overflowX: "auto",
							overflowY: "hidden",
						}}
					>
						{alertList?.map((alert, index) => {
							return (
								<AlertCard
									handleData={handleData}
									key={index}
									alert={alert}
								/>
							);
						})}
					</Box>
				</Box>
			</Box>
		);
	} else {
		return (
			<Box>
				<CircularProgress />
			</Box>
		);
	}
}
