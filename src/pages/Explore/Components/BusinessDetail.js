import React, { useState } from "react";
import {
	Card,
	Container,
	Typography,
	Box,
	Grid,
	Divider,
	Avatar,
	IconButton,
	Button,
	Stack,
	Modal,
	CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import UserLocation from "../../Users/components/UserLocation";
import moment from "moment";
import { ArrowBack } from "@mui/icons-material";
import { deleteBusiness, findByIdBusiness } from "../services/ApiServices";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";

import "./component.css";
import { SnackBarComp } from "../../Neighbourhoods/Components/SnackBar";

function BusinessDetail() {
	const params = useParams();
	const navigate = useNavigate();
	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "",
	});

	const [modal, setModal] = useState(false);

	const [dExpand, setDExpand] = React.useState(false);

	const [state, setState] = React.useState();

	const handleSnackbar = (data) => {
		setSnackbar((prev) => ({
			...prev,
			open: data,
		}));
	};

	const ApiCall = React.useCallback(() => {
		findByIdBusiness(params?.id)
			.then((res) => {
				setState(res);
				console.log("====================================");
				console.log("find neighbour api call", res);
				console.log("====================================");
			})
			.catch((err) => console.log(err));
	}, []);

	const DeleteBusinessApiCall = React.useCallback(() => {
		deleteBusiness(params?.id)
			.then((res) => {
				setSnackbar({
					open: true,
					message: "Business Deleted Successfully",
				});
				navigate("/explore");
			})
			.catch((err) => console.error(err));
	}, []);

	// const filterUserApiCall = React.useCallback((data) => {
	// 	filterNeighbourhood({ userId: data })
	// 		.then((res) => {
	// 			console.log("====================================");
	// 			console.log("filter user by id response", res);
	// 			console.log("====================================");
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);

	React.useEffect(() => {
		ApiCall();
		// filterUserApiCall("62f0aadec22b4848ffc9df16");
	}, [ApiCall]);

	if (state) {
		return (
			<Container maxWidth='lg' style={{ padding: "0px", margin: "auto" }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
					<IconButton onClick={() => navigate("/explore")}>
						<ArrowBack style={{ color: "#1976d2" }} />
					</IconButton>
					<Box style={{ display: "flex", flexDirection: "row" }}>
						<Button
							sx={{ mr: 2 }}
							variant='contained'
							onClick={() => navigate("/explore/detail/update/" + params?.id)}>
							Edit
						</Button>
						<Button variant='contained' onClick={() => setModal(true)}>
							delete
						</Button>
					</Box>
				</Box>
				<Card sx={{ p: 2 }}>
					<Grid item container xs={12}>
						<Grid item xs={12} sm={6}>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<Box>
									<Avatar
										src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${state?.logoURL}.png`}
										alt={state?.name}
										style={{
											width: window.innerWidth < 500 ? "70px" : "150px",
											height: window.innerWidth < 500 ? "70px" : "150px",
										}}
									/>
								</Box>
								<Box sx={{ ml: 2 }}>
									<Box sx={{ mb: 2 }}>
										<Typography sx={{ fontSize: "24px" }}>{state?.name}</Typography>
										<Typography sx={{ fontSize: "12px" }}>
											{moment(state?.createdOn).format("lll")}
										</Typography>
									</Box>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<Typography>Cloud : </Typography>
										<Typography sx={{ fontSize: "18px", ml: 1 }}>{state?.cloudName}</Typography>
									</Box>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<Typography>Category : </Typography>
										<Typography sx={{ fontSize: "18px", ml: 1 }}>{state?.categoryName}</Typography>
									</Box>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<Typography>Created By : </Typography>
										<Typography sx={{ fontSize: "18px", ml: 1 }}>
											{state?.userObject?.firstName + " " + state?.userObject?.lastName}
										</Typography>
									</Box>
									{state?.description?.length > 200 ? (
										<Box>
											{dExpand ? (
												<Typography>
													{state?.description + "...."}{" "}
													<a
														onClick={() => setDExpand(false)}
														style={{ textDecoration: "none", cursor: "pointer", color: "#1976d2" }}>
														read less
													</a>
												</Typography>
											) : (
												<Typography>
													{state?.description?.slice(0, 200) + " ......"}
													<a
														onClick={() => setDExpand(true)}
														style={{ textDecoration: "none", cursor: "pointer", color: "#1976d2" }}>
														read more
													</a>
												</Typography>
											)}
										</Box>
									) : (
										<Box>
											<Typography>{state?.description}</Typography>
										</Box>
									)}
								</Box>
							</Box>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Box sx={{ position: "relative" }}>
								<Swiper
									pagination={
										state?.imageUrls?.length > 1
											? {
													type: "fraction",
											  }
											: false
									}
									modules={[Pagination]}
									className='mySwiper'>
									{state?.imageUrls &&
										state.imageUrls?.map((item, index) => {
											return (
												<SwiperSlide>
													<Box
														key={index}
														sx={{
															width: "100%",
															height: "100%",
															maxHeight: "400px",
															display: "flex",
															justifyContent: "center",
															alignItems: "center",
														}}>
														{/* <Box
														variant='filled'
														sx={{
															position: "absolute",
															top: 2,
															right: 2,
															fontSize: "14px",
															background: "#1976d2",
															color: "white",
															borderRadius: "5px",
															px: 0.5,
														}}>
														{state.imageUrls.length > 1 &&
															index + 1 + "/" + state.imageUrls?.length}
													</Box> */}
														<img
															src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${item}.png`}
															alr='image'
															style={{ width: "100%", height: "100%" }}
														/>
													</Box>
												</SwiperSlide>
											);
										})}
								</Swiper>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Box
								sx={{
									p: 1,
								}}>
								<Box sx={{ p: 1 }}>
									<Typography sx={{ fontSize: "20px", fontWeight: 500, color: "gray" }}>
										Business Location
									</Typography>
									<Divider />
								</Box>
								{state && (
									<Box>
										<UserLocation
											data={{
												name: state?.name,
												currentLocation: {
													lat: state?.geoLocation?.coordinates[0],
													lon: state?.geoLocation?.coordinates[1],
												},
											}}
										/>
									</Box>
								)}
							</Box>
						</Grid>
					</Grid>
				</Card>
				<Modal
					open={modal}
					onClose={() => setModal(false)}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 400,
							bgcolor: "background.paper",
							// border: "2px solid #000",
							boxShadow: 24,
							p: 4,
						}}>
						<Box sx={{ position: "relative" }}>
							<Typography>Are you sure to delete the business ?</Typography>
							<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
								<Button variant='outlined' onClick={() => setModal(false)}>
									cancel
								</Button>
								<Button variant='contained' onClick={() => DeleteBusinessApiCall()}>
									Confirm
								</Button>
							</Box>
						</Box>
					</Box>
				</Modal>
				<SnackBarComp handleSnackbar={handleSnackbar} data={snackbar} />
			</Container>
		);
	} else {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					width: "100%",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default BusinessDetail;
