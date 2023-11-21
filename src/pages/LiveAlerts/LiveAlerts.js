import React, { useCallback, useEffect, useState } from "react";
import LiveAlertMap from "./components/LiveAlertMap";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { listAlert } from "../BanjeeAlert/api-services/apiServices";
import AlertCard from "./components/AlertCard";
import { Navigation, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import moment from "moment";
export default function LiveAlerts() {
	const [alertList, setAlertList] = useState();
	const [selectedCard, setSelectedCard] = useState();
	const currentLat = localStorage?.getItem("lat");
	const currentLng = localStorage?.getItem("lng");
	const getLiveAlerts = useCallback(() => {
		listAlert({
			eventCode: ["PANIC_EMERGENCY", "NEW_ALERT"],
		})
			.then((res) => {
				const date = new Date();
				const content = res.content.filter((alert) => {
					const today = moment(date).format("L");
					return (
						today === moment(alert.createdOn).format("L") &&
						alert.createdBy !== "61111e42bcc68b2a1fa3432c"
					);
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

	if (alertList?.length > 0) {
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
						right: "0px",
						bottom: 0,
						// left: 0,
						zIndex: 1,
						backgroundColor: "rgba(0, 0, 0, 0.10)",
						width: "100%",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							paddingY: "20px",
							width: "auto",
							overflowX: "auto",
							overflowY: "hidden",
						}}
					>
						<Swiper
							spaceBetween={20}
							slidesPerView={4}
							modules={[Navigation, A11y]}
							navigation
							style={{ width: "100%" }}
						>
							{alertList?.map((alert, index) => {
								return (
									<SwiperSlide
										key={index}
										virtualIndex={index}
									>
										<AlertCard
											handleData={handleData}
											alert={alert}
										/>
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Box>
				</Box>
			</Box>
		);
	} else if (alertList?.length === 0) {
		return (
			<Box sx={{ position: "relative" }}>
				<Box sx={{ height: "90vh", position: "relative" }}>
					<LiveAlertMap
						openModal={false}
						data={{
							lat: currentLat,
							lng: currentLng,
						}}
					/>
				</Box>
				<Box
					sx={{
						position: "absolute",
						right: "0px",
						bottom: 0,
						zIndex: 1,
						backgroundColor: "rgba(0, 0, 0, 0.10)",
						width: "100%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Paper
						sx={{
							padding: "10px",
							ml: "20px",
							cursor: "pointer",
							transition: "background-color 0.5s ease",
							"&:hover": {
								backgroundColor: "#f0f0f0",
							},
						}}
					>
						<Typography
							variant="h4"
							sx={{ textAlign: "center", fontWeight: "bold" }}
						>
							No live alert today
						</Typography>
					</Paper>
				</Box>
			</Box>
		);
	} else {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "80vh",
				}}
			>
				<CircularProgress />
			</div>
		);
	}
}
