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

function ViewAlert() {
	const params = useParams();
	const navigate = useNavigate();
	const context = React.useContext(MainContext);
	const [data, setData] = React.useState("");
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
			<Container maxWidth='xl'>
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
							<Typography sx={{ fontSize: "22px", fontWeight: 600, color: "gray" }}>
								Alert Information
							</Typography>
							<Box sx={{ marginY: "5px" }}>
								<Divider />
							</Box>
							<Box>
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
							<AlertLocation currentLocation={currentLocation} data={data} type={"object"} />
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
