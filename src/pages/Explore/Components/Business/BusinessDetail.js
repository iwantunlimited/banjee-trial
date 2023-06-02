import React, { useContext, useState } from "react";
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
import { useNavigate, useParams, useLocation } from "react-router";
import moment from "moment";
import { ArrowBack, Fullscreen } from "@mui/icons-material";
import { deleteBusiness, findByIdBusiness } from "../../services/ApiServices";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";

import ".././component.css";
import ModalComp from "../../../../CustomComponents/ModalComp";
import { useTheme } from "@mui/material/styles";
import { MainContext } from "../../../../context/Context";
import FullScreenImageModal from "../../../Social_Feeds/Components/FullScreenImageModal";
import GoogleMapCustom from "../../../../CustomComponents/GoogleMap";

function BusinessDetail() {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const theme = useTheme();
	const context = useContext(MainContext);
	const { setModalOpen, setModalData } = context;

	const [modal, setModal] = useState({
		open: false,
		data: "",
	});
	// console.log("====================================");
	// console.log("location detail", location);
	// console.log("====================================");

	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});

	const [dExpand, setDExpand] = React.useState(false);

	const [state, setState] = React.useState();

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
			.catch((err) => console.error(err));
	}, []);

	const DeleteBusinessApiCall = React.useCallback(() => {
		deleteBusiness(params?.id)
			.then((res) => {
				setModalOpen(true);
				setModalData("Business Deleted Successfully", "success");
				navigate("/explore", { state: { approved: location?.state?.inApprove ? false : true } });
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
					<IconButton
						onClick={() =>
							navigate("/explore", {
								state: { approved: location?.state?.inApprove ? false : true },
							})
						}>
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
							<Box sx={{ display: "flex" }}>
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
								<Box sx={{ marginLeft: { xs: "10px", sm: "10px", md: "20px" } }}>
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
															position: "relative",
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
													<IconButton
														sx={{ position: "absolute", bottom: "5px", right: "5px" }}
														onClick={() => {
															setFullScreenState({
																imageModal: true,
																src:
																	item &&
																	`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${item}.png`,
															});
														}}>
														<Fullscreen
															style={{
																color: "#000",
																fontSize: "30px",
															}}
														/>
													</IconButton>
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
									<Box sx={{ position: "relative", height: "400px" }}>
										<GoogleMapCustom
											view={true}
											prevLocation={{
												lat: state?.geoLocation?.coordinates[0],
												lng: state?.geoLocation?.coordinates[1],
											}}
											data={{
												lat: state?.geoLocation?.coordinates[0],
												lng: state?.geoLocation?.coordinates[1],
												text: state?.name,
												zoom: 15,
											}}
										/>
									</Box>
								)}
							</Box>
						</Grid>
					</Grid>
				</Card>
				<ModalComp data={modal} handleModal={handleModal}>
					<Typography
						sx={{
							fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
							fontWeight: 400,
						}}>
						Are you sure to delete this business ?
					</Typography>
					<Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
						<Button variant='outlined' onClick={() => handleModal(false)}>
							cancel
						</Button>
						<Button color='primary' variant='contained' onClick={() => DeleteBusinessApiCall()}>
							Confirm
						</Button>
					</Box>
				</ModalComp>
				{fullScreenState.imageModal && (
					<FullScreenImageModal
						state={fullScreenState}
						handleClose={() => setFullScreenState({ imageModal: false })}
					/>
				)}
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
