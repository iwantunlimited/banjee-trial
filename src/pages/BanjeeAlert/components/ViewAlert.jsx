import React from "react";
import {
	Container,
	Typography,
	Grid,
	Card,
	Box,
	CircularProgress,
	Divider,
	IconButton,
	Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { deleteAlert, listAlert, listMyAlert } from "../api-services/apiServices";
import AlertLocation from "./AlertMap";
import { ArrowBack } from "@mui/icons-material";
import ModalComp from "../../../CustomComponents/ModalComp";
import { MainContext } from "../../../context/Context";

import SwiperComp from "../../../CustomComponents/SwiperComp";

function ViewAlert() {
	const params = useParams();
	const navigate = useNavigate();
	const context = React.useContext(MainContext);
	const [data, setData] = React.useState("");
	const [finalData, setFinalData] = React.useState([]);
	const [currentLocation, setCurrentLocation] = React.useState({
		lat: "",
		lon: "",
	});
	const [modalData, setModalData] = React.useState({
		open: false,
		id: "",
	});

	function handleModal(data) {
		setModalData((prev) => ({
			...prev,
			open: data,
		}));
	}

	console.log("====================================");
	console.log("data---", finalData);
	console.log("====================================");

	const deleteAlertApiCall = React.useCallback((id) => {
		deleteAlert(id)
			.then((res) => {
				context?.setModalOpen(true);
				context?.setModalData("Alert Deleted Successfully", "success");
				navigate(-1);
			})
			.catch((err) => console.log(err));
	}, []);

	const alertApiCall = React.useCallback(() => {
		listMyAlert(params?.id)
			.then((res) => {
				console.log("====================================");
				console.log(res);
				console.log("====================================");
				if (res?.imageUrl?.length > 0) {
					res?.imageUrl?.map((item) => {
						setFinalData((prev) => [...prev, { src: item, mimeType: "image/jpg" }]);
						return item;
					});
				}
				if (res?.videoUrl?.length > 0) {
					res?.videoUrl?.map((item) => {
						setFinalData((prev) => [...prev, { src: item, mimeType: "video/mp4" }]);
						return item;
					});
				}
				if (res?.audioSrc) {
					setFinalData((prev) => [...prev, { src: res?.audioSrc, mimeType: "audio/mp3" }]);
				}
				setData(res);
			})
			.catch((err) => console.error(err));
	}, []);

	const getCurrentLocation = React.useCallback(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setCurrentLocation(() => ({
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				}));
			});
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}, []);

	React.useEffect(() => {
		getCurrentLocation();
		params?.id && alertApiCall();
	}, [alertApiCall]);

	if (currentLocation && data) {
		return (
			<Container maxWidth='lg'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<IconButton onClick={() => navigate(-1)}>
								<ArrowBack color='primary' />
							</IconButton>
							<Button
								onClick={() =>
									setModalData({
										open: true,
										id: params?.id,
									})
								}>
								delete
							</Button>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px" }}>
							<Grid item container xs={12} spacing={1}>
								<Grid item xs={12}>
									<Typography sx={{ fontSize: "22px", fontWeight: 600, color: "gray" }}>
										Alert Information
									</Typography>
									<Box sx={{ marginY: "5px" }}>
										<Divider />
									</Box>
								</Grid>
								<Grid item xs={6}>
									<Box sx={{ width: "100%" }}>
										<Typography sx={{ fontSize: "22px", fontWeight: 600 }}>
											{data?.eventName}
										</Typography>
										{data?.cloudName && <Typography>{data?.cloudName}</Typography>}

										{data?.metaInfo?.address && (
											<Typography>
												<span>
													<b>Address: </b>
												</span>
												{data?.metaInfo?.address}
											</Typography>
										)}
										{data?.createdByUser && (
											<Typography>
												<span>
													<b>Created By: </b>
												</span>
												{data?.createdByUser?.firstName + " " + data?.createdByUser?.lastName}
											</Typography>
										)}
										{data?.description && (
											<Typography>
												<span>
													<b>Description: </b>
												</span>
												{data?.description}
											</Typography>
										)}
									</Box>
								</Grid>
								<Grid item xs={6}>
									{data?.imageUrl?.length > 0 && (
										<Box sx={{ position: "relative", marginLeft: "20px", height: "420px" }}>
											<SwiperComp data={finalData} />
										</Box>
									)}
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px" }}>
							<Typography sx={{ fontSize: "22px", fontWeight: 600, color: "gray" }}>
								Alert Location
							</Typography>
							<Box sx={{ marginBottom: "10px" }}>
								<Divider />
							</Box>
							<AlertLocation
								zoom={15}
								currentLocation={currentLocation}
								data={data}
								type={"object"}
							/>
						</Card>
					</Grid>
				</Grid>
				<ModalComp data={modalData} handleModal={handleModal}>
					<Box>
						<Typography>
							<b>Are you sure to delete the alert ?</b>
						</Typography>
						<Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
							<Button variant='outlined' onClick={() => handleModal(false)}>
								Cancel
							</Button>
							<Button
								variant='contained'
								sx={{ marginLeft: "20px" }}
								onClick={() => {
									deleteAlertApiCall(modalData?.id);
								}}>
								Confirm
							</Button>
						</Box>
					</Box>
				</ModalComp>
			</Container>
		);
	} else {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					height: "80vh",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default ViewAlert;
