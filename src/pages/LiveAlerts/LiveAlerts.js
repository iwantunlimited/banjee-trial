import React, { useCallback, useEffect, useState } from "react";
import LiveAlertMap from "./components/LiveAlertMap";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { listAlert } from "../BanjeeAlert/api-services/apiServices";
import AlertCard from "./components/AlertCard";
import { Navigation, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import moment from "moment";
import { WebSocketContext } from "../../context/WebSocketContext";

export default function LiveAlerts() {
	const [alertList, setAlertList] = useState();
	const [selectedCard, setSelectedCard] = useState();
	const currentLat = localStorage?.getItem("lat");
	const currentLng = localStorage?.getItem("lng");

	const socket = React.useContext(WebSocketContext).socketData;

	const getLiveAlerts = useCallback(() => {
		listAlert({
			eventCode: ["PANIC_EMERGENCY", "NEW_ALERT"],
			resolved: false,
		})
			.then((res) => {
				// const date = new Date();
				// const content = res.content.filter((alert) => {
				// 	const today = moment(date).format("L");
				// 	console.log(today === moment(alert.createdOn).format("L"));
				// 	return (
				// 		today === moment(alert.createdOn).format("L") &&
				// 		alert.createdBy !== "61111e42bcc68b2a1fa3432c"
				// 	);
				// });
				setAlertList(res?.content);
				setSelectedCard(res?.content?.[0]);
			})
			.catch((err) => console.error(err));
	}, []);

	function handleData(data) {
		setSelectedCard(data);
	}

	const socketListener = React.useCallback(() => {
		if (socket) {
			console.log("socket.readyState", socket?.readyState);

			socket?.addEventListener("message", ({ data }) => {
				// console.log(data);
				// const { action, data: mData } = JSON.parse(data);
				// console.log("====================================");
				// console.log("action", action);
				// console.log("n", mData);
				// console.log("====================================");
				// if (mData?.type === "ALERT" || mData?.type === "PANIC") {
				// 	// setAlertData({ open: true, data: mData });
				// 	getLiveAlerts();
				// }
				// console.log("Socket Data------------->", JSON.parse(data));
			});
		}
	}, [socket]);

	// useEffect(() => {
	// 	setInterval(() => {
	// 		socket.send(JSON.stringify({ action: "PING", data: {} }));
	// 	}, 1000);
	// }, []);
	React.useEffect(() => {
		socketListener();
	}, []);

	React.useEffect(() => {
		getLiveAlerts();
	}, [getLiveAlerts]);

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
					}}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							paddingY: "20px",
							width: "auto",
							overflowX: "auto",
							overflowY: "hidden",
						}}>
						<Swiper
							spaceBetween={20}
							slidesPerView={4}
							modules={[Navigation, A11y]}
							navigation
							style={{ width: "100%" }}>
							{alertList?.map((alert, index) => {
								return (
									<SwiperSlide key={index} virtualIndex={index}>
										<AlertCard handleData={handleData} alert={alert} />
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
						bottom: "10px",
						zIndex: 1,
						width: "100%",
						display: "flex",
						justifyContent: "center",
					}}>
					<Paper
						sx={{
							padding: "10px",
							// backgroundColor: "rgba(0, 0, 0, 0.10)",
							ml: "20px",
							cursor: "pointer",
							transition: "background-color 0.5s ease",
							"&:hover": {
								backgroundColor: "#f0f0f0",
							},
						}}>
						<Typography
							variant='h4'
							sx={{
								fontSize: { xs: "18px", md: "24px", lg: "26px" },
								textAlign: "center",
							}}>
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
				}}>
				<CircularProgress />
			</div>
		);
	}
}
