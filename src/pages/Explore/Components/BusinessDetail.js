import React from "react";
import { Card, Container, Typography, Box, Grid, Divider, Avatar, IconButton } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import UserLocation from "../../Users/components/UserLocation";
import moment from "moment";
import { ArrowBack } from "@mui/icons-material";
import { findByIdBusiness } from "../services/ApiServices";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";

import "./component.css";

function BusinessDetail() {
	const params = useParams();
	const navigate = useNavigate();

	console.log("====================================");
	console.log("detail params", params);
	console.log("====================================");

	const [state, setState] = React.useState();

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

	return (
		<Container maxWidth='lg' style={{ padding: "0px", margin: "auto" }}>
			<IconButton onClick={() => navigate(-1)}>
				<ArrowBack style={{ color: "#1976d2" }} />
			</IconButton>
			<Card sx={{ p: 2 }}>
				<Grid item container xs={12}>
					<Grid item xs={12} sm={6}>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Box>
								<Avatar
									src={state?.imageUrl}
									alt={state?.name}
									style={{ width: "150px", height: "150px" }}
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
								<Typography>{state?.description}</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Swiper
							// pagination={
							// 	ele?.mediaContent?.length > 1
							// 		? {
							// 				type: "fraction",
							// 		  }
							// 		: false
							// }
							modules={[Pagination]}
							className='mySwiper'>
							{state?.imageUrls &&
								state.imageUrls?.map((item, index) => {
									return (
										<SwiperSlide>
											<Box sx={{ width: "100%", height: "100%", maxHeight: "400px" }}>
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
		</Container>
	);
}

export default BusinessDetail;
