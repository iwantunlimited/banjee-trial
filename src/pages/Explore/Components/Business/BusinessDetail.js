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
	CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import UserLocation from "../../../Users/components/UserLocation";
import moment from "moment";
import { ArrowBack } from "@mui/icons-material";
import { deleteBusiness, findByIdBusiness } from "../../services/ApiServices";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";

import ".././component.css";
import SnackBarComp from "../../../../CustomComponents/SnackBarComp";
import ModalComp from "../../../../CustomComponents/ModalComp";
import { useTheme } from "@mui/material/styles";

function BusinessDetail() {
	const params = useParams();
	const navigate = useNavigate();
	const theme = useTheme();

	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "",
		duration: 3000,
		severity: "",
	});

	const [modal, setModal] = useState({
		open: false,
		data: "",
	});

	const [dExpand, setDExpand] = React.useState(false);

	const [state, setState] = React.useState();

	const handleSnackbar = (data) => {
		setSnackbar((prev) => ({
			...prev,
			open: data,
		}));
	};

	const handleModal = (data) => {
		setModal((prev) => ({
			...prev,
			open: data,
		}));
	};

	const ApiCall = React.useCallback(() => {
		findByIdBusiness(params?.id)
			.then((res) => {
				setState(res);
			})
			.catch((err) => console.log(err));
	}, []);

	const DeleteBusinessApiCall = React.useCallback(() => {
		deleteBusiness(params?.id)
			.then((res) => {
				setSnackbar({
					open: true,
					duration: 3000,
					severity: "success",
					message: "Business Deleted Successfully",
				});
				navigate("/explore");
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		ApiCall();
	}, [ApiCall]);

	if (state) {
		return (
			<Container maxWidth='lg' style={{ padding: "0px", margin: "auto" }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
					<IconButton onClick={() => navigate("/explore")}>
						<ArrowBack color='primary' />
					</IconButton>
					<Box style={{ display: "flex", flexDirection: "row" }}>
						<Button
							color='primary'
							sx={{ marginRight: "20px" }}
							variant='contained'
							onClick={() => navigate("/explore/detail/update/" + params?.id)}>
							Edit
						</Button>
						<Button
							variant='contained'
							onClick={() => setModal((prev) => ({ ...prev, open: true }))}>
							delete
						</Button>
					</Box>
				</Box>
				<Card sx={{ padding: "20px" }}>
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
								<Box sx={{ marginLeft: "20px" }}>
									<Box sx={{ marginBottom: "20px" }}>
										<Typography sx={{ fontSize: "24px" }}>{state?.name}</Typography>
										{state?.createdOn && (
											<Typography sx={{ fontSize: "12px" }}>
												{moment(state?.createdOn).format("lll")}
											</Typography>
										)}
									</Box>
									{state?.cloudName && (
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<Typography>Cloud : </Typography>
											<Typography sx={{ fontSize: "18px", marginLeft: "10px" }}>
												{state?.cloudName}
											</Typography>
										</Box>
									)}
									{state?.categoryName && (
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<Typography>Category : </Typography>
											<Typography sx={{ fontSize: "18px", marginLeft: "10px" }}>
												{state?.categoryName}
											</Typography>
										</Box>
									)}
									{state?.userObject?.firstName && state?.userObject?.lastName && (
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<Typography>Created By : </Typography>
											<Typography sx={{ fontSize: "18px", marginLeft: "10px" }}>
												{state?.userObject?.firstName + " " + state?.userObject?.lastName}
											</Typography>
										</Box>
									)}
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
									padding: "10px",
								}}>
								<Box sx={{ padding: "10px" }}>
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
				<ModalComp data={modal} handleModal={handleModal}>
					<Typography>Are you sure to delete the business ?</Typography>
					<Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
						<Button variant='outlined' onClick={() => handleModal(false)}>
							cancel
						</Button>
						<Button color='primary' variant='contained' onClick={() => DeleteBusinessApiCall()}>
							Confirm
						</Button>
					</Box>
				</ModalComp>
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
				<CircularProgress color='primary' />
			</Box>
		);
	}
}

export default BusinessDetail;