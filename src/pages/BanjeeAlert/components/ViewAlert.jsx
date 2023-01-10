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
	useTheme,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router";
import {
	deleteAlert,
	listAlert,
	listMyAlert,
	reportedByUserAlertList,
} from "../api-services/apiServices";
import AlertLocation from "./AlertMap";
import { ArrowBack, RemoveRedEye, Visibility } from "@mui/icons-material";
import ModalComp from "../../../CustomComponents/ModalComp";
import { MainContext } from "../../../context/Context";

import SwiperComp from "../../../CustomComponents/SwiperComp";
import GoogleMapCustom from "../../../CustomComponents/GoogleMap";
import { DataGrid } from "@mui/x-data-grid";

function ViewAlert() {
	const params = useParams();
	const location = useLocation();
	const theme = useTheme();
	const navigate = useNavigate();
	const context = React.useContext(MainContext);
	const [data, setData] = React.useState("");
	const [finalData, setFinalData] = React.useState([]);
	const [reportedList, setReportedList] = React.useState([]);
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});
	const [totalElement, setTotalElement] = React.useState(0);
	const [state, setState] = React.useState(false);
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

	function handlePagination(item) {
		setPagination((prev) => ({
			...prev,
			page: item?.page,
			pageSize: item?.pageSize,
		}));
	}

	const deleteAlertApiCall = React.useCallback((id) => {
		deleteAlert(id)
			.then((res) => {
				context?.setModalOpen(true);
				context?.setModalData("Alert Deleted Successfully", "success");
				navigate("/banjee-alert", {
					state: { reportedDetail: location?.state?.reported ? true : false },
				});
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
						setFinalData((prev) => [...prev, { src: item, mimeType: "image/jpg", type: "image" }]);
						return item;
					});
				}
				if (res?.videoUrl?.length > 0) {
					res?.videoUrl?.map((item) => {
						setFinalData((prev) => [...prev, { src: item, mimeType: "video/mp4", type: "video" }]);
						return item;
					});
				}
				if (res?.audioSrc) {
					setFinalData((prev) => [
						...prev,
						{ src: res?.audioSrc, mimeType: "audio/mp3", type: "audio" },
					]);
				}
				setData(res);
			})
			.catch((err) => console.error(err));
	}, []);

	const reportedAlertByUserApiCall = React.useCallback(() => {
		reportedByUserAlertList(params?.id)
			.then((res) => {
				const resp = res?.map((item) => {
					return {
						...item,
						rId: item?.reportedByUser?.id,
						rFirstName: item?.reportedByUser?.firstName,
						rLastName: item?.reportedByUser?.lastName,
						rUserName: item?.reportedByUser?.userName,
						rEmail: item?.reportedByUser?.email,
						rMcc: item?.reportedByUser?.mcc,
						rMobile: item?.reportedByUser?.mobile,
						rAvatarId: item?.reportedByUser?.avtarImageUrl,
					};
				});
				setTotalElement(res?.length);
				setReportedList(resp);
			})
			.catch((err) => console.log(err));
	}, []);

	let rows = reportedList ? reportedList : [];

	const columns = [
		{
			id: 1,
			field: "rFirstName",
			// headerClassName: "app-header",
			headerName: "Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
			renderCell: (params) => {
				const fullName = params?.row?.rFirstName + " " + params?.row?.rLastName;
				return fullName;
			},
		},
		{
			id: 2,
			field: "rEmail",
			headerName: "Email",
			flex: 0.5,
		},
		{
			id: 3,
			field: "rMobile",
			headerName: "Mobile No",
			flex: 0.4,
			renderCell: (params) => {
				const number = params?.row?.rMcc + " " + params?.row?.rMobile;
				return number;
			},
		},
		{
			id: 4,
			field: "comment",
			headerName: "Comment",
			flex: 0.5,
		},
		{
			id: 5,
			field: "rId",
			headerName: "View",
			flex: 0.2,
			renderCell: (params) => {
				return (
					<IconButton onClick={() => navigate("/user/" + params?.row?.rId)}>
						<Visibility />
					</IconButton>
				);
			},
		},
	];

	console.log("====================================");
	console.log("reportedList", reportedList);
	console.log("====================================");
	console.log("====================================");
	console.log("data", data);
	console.log("====================================");

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
		params?.id && reportedAlertByUserApiCall();
	}, [alertApiCall, reportedAlertByUserApiCall]);

	if (currentLocation && data) {
		return (
			<Container maxWidth='lg'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<IconButton
								onClick={() =>
									navigate("/banjee-alert", {
										state: { reportedDetail: location?.state?.reported ? true : false },
									})
								}>
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
								<Grid item xs={12} md={finalData?.length > 0 ? 6 : 12}>
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
										{data?.description && data?.description?.length < 700 && (
											<Typography>
												<span>
													<b>Description: </b>
												</span>
												{data?.description}
											</Typography>
										)}
										{data?.description && data?.description?.length > 700 && (
											<Typography>
												<span>
													<b>Description: </b>
												</span>
												{state === false ? (
													<React.Fragment>
														{data?.description?.slice(0, 701)}{" "}
														<a
															onClick={() => setState(!state)}
															style={{ cursor: "pointer", color: theme?.palette?.primary?.main }}>
															...more
														</a>
													</React.Fragment>
												) : (
													<React.Fragment>
														{data?.description}{" "}
														<a
															onClick={() => setState(!state)}
															style={{ cursor: "pointer", color: theme?.palette?.primary?.main }}>
															...less
														</a>
													</React.Fragment>
												)}
											</Typography>
										)}
									</Box>
								</Grid>
								{finalData?.length > 0 && (
									<Grid item xs={12} md={6}>
										<Box sx={{ position: "relative", marginLeft: "20px", height: "420px" }}>
											<SwiperComp data={finalData} />
										</Box>
									</Grid>
								)}
								{data?.reportCount > 0 && (
									<Grid item xs={12}>
										<Box>
											<Typography variant='h6'>Reported By:</Typography>
										</Box>
										<Divider sx={{ marginY: "10px" }} />
										<Box className='root'>
											<DataGrid
												autoHeight
												page={pagination?.page}
												pageSize={pagination?.pageSize}
												onPageSizeChange={(event) => {
													handlePagination({
														page: pagination?.page,
														pageSize: event,
													});
												}}
												rowCount={totalElement}
												rows={rows}
												columns={columns}
												paginationMode='server'
												// autoPageSize
												pagination
												onPageChange={(event) => {
													handlePagination({
														page: event,
														pageSize: pagination?.pagination?.page,
													});
												}}
												rowsPerPageOptions={[5, 10, 20]}
												className='dataGridFooter'
											/>
										</Box>
									</Grid>
								)}
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
							<Box sx={{ height: "350px" }}>
								<GoogleMapCustom
									view={true}
									data={{
										lat: data?.location?.coordinates[1],
										lng: data?.location?.coordinates[0],
										zoom: 16,
									}}
									prevLocation={{
										lat: data?.location?.coordinates[1],
										lng: data?.location?.coordinates[0],
									}}
								/>
							</Box>
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
