import React from "react";
import { ChatBubbleOutline, Delete, FavoriteBorder, Fullscreen } from "@mui/icons-material";
import {
	Container,
	Grid,
	Card,
	Box,
	IconButton,
	Typography,
	Avatar,
	CircularProgress,
} from "@mui/material";
import moment from "moment";

import FullScreenImageModal from "../FullScreenImageModal";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";
import DeleteFeedSnackBar from "../SnackBar";
import DeleteFeedModal from "../DeleteFeedModal";
import { useParams } from "react-router";
import { getReportedFeedDetail, getSocialFeedDetails } from "../../services/ApiServices";

function ViewRFeed() {
	const [rData, setRData] = React.useState("");

	const [data, setData] = React.useState([]);
	//ddatate menu ------
	const [openDModal, setOpenDModal] = React.useState(false);
	const [dFeedData, setDFeedData] = React.useState({
		feedId: "",
		remark: "",
	});
	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});
	const [openSnackBar, setOpenSnackBar] = React.useState(false);

	const { id } = useParams();

	console.log("data", data);

	const apiCall = React.useCallback(() => {
		getReportedFeedDetail(id)
			.then((res) => {
				console.log(res);
				setRData(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [id]);

	const filterFeedApiCall = React.useCallback(() => {
		getSocialFeedDetails(id)
			.then((res) => {
				console.log("feed response", res);
				setData(res);
			})
			.catch((err) => console.log(err));
	}, [id]);

	React.useEffect(() => {
		apiCall();
		filterFeedApiCall();
	}, [apiCall, filterFeedApiCall]);

	if (rData?.length > 0) {
		return (
			<Container maxWidth='lg'>
				<Grid container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Container maxWidth='sm'>
							{/* <Card> */}
							<Box
								sx={{
									padding: "7px 14px",
									width: "100%",
									// minHeight: "250px",
									boxShadow:
										"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
									borderRadius: "8px",
									background: "#FFF",
									cursor: "pointer",
									"&:hover": {
										background: "#E0E0e0",
									},
								}}>
								<Box
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}>
									<Box
										style={{
											display: "flex",
											alignItems: "center",
											paddingLeft: "10px",
										}}>
										<Avatar
											alt='#'
											src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${data?.author?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
											style={{
												height: "40px",
												width: "40px",
												objectFit: "contain",
												borderRadius: "50%",
											}}
										/>
										<Typography
											style={{
												padding: "10px 10px",
												display: "flex",
												flexDirection: "column",
											}}>
											<span>{`${
												data?.author?.username || data?.author?.userName || "userName"
											}`}</span>
											<span style={{ fontSize: "12px" }}>
												{moment(data?.createdOn).format("lll")}
											</span>
										</Typography>
									</Box>
									<IconButton
										onClick={() => {
											setDFeedData({ feedId: data.id });
											setOpenDModal(true);
										}}
										style={{ width: "40px", height: "40px" }}>
										<Delete />
									</IconButton>
									<DeleteFeedModal
										open={openDModal}
										openModalfun={setOpenDModal}
										dFeedData={dFeedData}
										FeedDataFun={setDFeedData}
										// socialFilterApi={filterSocialFeedsApiCall}
									/>
								</Box>

								<Box sx={{ my: 1, height: "200px" }}>
									<Swiper pagination={true} modules={[Pagination]} className='mySwiper'>
										{data?.mediaContent?.length > 0 ? (
											data?.mediaContent?.map((item, iIndex) => {
												if (item?.mimeType === "video/mp4") {
													return (
														<SwiperSlide>
															<Box
																key={iIndex}
																sx={{
																	height: "200px",
																	width: "100%",
																	display: "flex",
																	justifyContent: "center",
																	alignItems: "center",
																}}>
																<video width='100%' height='200px' id={`video${0}`} controls>
																	<source
																		src={`https://res.cloudinary.com/banjee/video/upload/br_128,q_auto/v1/${item?.src}.mp4`}
																		type='video/mp4'
																	/>
																	Your browser does not support HTML video.
																</video>
															</Box>
														</SwiperSlide>
													);
												} else if (item?.mimeType === "audio/mp3") {
													return (
														<SwiperSlide>
															<Box
																key={iIndex}
																sx={{
																	height: "200px",
																	display: "flex",
																	justifyContent: "center",
																	alignItems: "center",
																}}>
																<audio width='100%' height='200px' id={`video${0}`} controls>
																	<source
																		src={`https://res.cloudinary.com/banjee/video/upload/br_128,q_auto/v1/${item?.src}.mp4`}
																		type='video/mp4'
																	/>
																	Your browser does not support HTML video.
																</audio>
															</Box>
														</SwiperSlide>
													);
												} else if (item?.mimeType === "image/jpg") {
													return (
														<SwiperSlide>
															<Box
																sx={{
																	position: "relative",
																	height: "200px",
																	width: "100%",
																	display: "flex",
																	justifyContent: "center",
																	alignItems: "center",
																	"&:hover": {
																		"& > .btnFullScreen": {
																			display: "block",
																			position: "absolute",
																			left: "93%",
																			top: "85%",
																			transform: "translate(-50%, -50%)",
																		},
																	},
																	"& > .btnFullScreen": {
																		display: "none",
																	},
																}}
																key={iIndex}>
																<img
																	alt=''
																	src={
																		item?.src &&
																		`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:best/v1/${item?.src}.webp`
																	}
																	style={{
																		height: "100%",
																		width: "100%",
																		objectFit: "contain",
																	}}
																/>
																<IconButton
																	className='btnFullScreen'
																	onClick={() => {
																		setFullScreenState({
																			imageModal: true,
																			src:
																				item?.src &&
																				`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:best/v1/${item?.src}.webp`,
																		});
																	}}>
																	<Fullscreen style={{ color: "#000", fontSize: "30px" }} />
																</IconButton>
															</Box>
														</SwiperSlide>
													);
												} else {
													return (
														<SwiperSlide>
															<Box
																key={iIndex}
																sx={{
																	height: "200px",
																	width: "100%",
																	display: "flex",
																	justifyContent: "center",
																	alignItems: "center",
																}}>
																<Typography>{data?.text}</Typography>
															</Box>
														</SwiperSlide>
													);
												}
											})
										) : (
											<SwiperSlide>
												<Box
													sx={{
														height: "200px",
														width: "100%",
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
													}}>
													<Typography>{data?.text}</Typography>
												</Box>
											</SwiperSlide>
										)}
									</Swiper>
								</Box>
								<Box
									style={{
										marginTop: "15px",
										padding: "0 10px",
										display: "flex",
										flexDirection: "column",
									}}>
									{data?.text && data?.mediaContent?.length > 0 ? (
										<Typography noWrap={true}>
											{data?.text || <p style={{ height: "16px" }}> </p>}
										</Typography>
									) : (
										<Box style={{ height: "24px" }}></Box>
									)}
									<Box sx={{ display: "flex", pt: 2, pb: 1 }}>
										<Box style={{ display: "flex", alignItems: "center" }}>
											<FavoriteBorder />
											<span style={{ marginLeft: "5px" }}>
												{data?.totalReactions || data?.reactions?.length || 0}
											</span>
										</Box>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												ml: "20px",
											}}>
											<ChatBubbleOutline />
											<span style={{ marginLeft: "5px" }}>{data?.totalComments || 0}</span>
										</Box>
									</Box>
								</Box>
							</Box>
							{/* </Card> */}
							{fullScreenState.imageModal && (
								<FullScreenImageModal
									state={fullScreenState}
									handleClose={() => setFullScreenState({ imageModal: false })}
								/>
							)}
							<DeleteFeedSnackBar open={openSnackBar} openFun={(e) => setOpenSnackBar(e)} />
						</Container>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ p: 2 }}>
							<Grid item container xs={12}>
								<Grid item xs={12}>
									<Typography sx={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
										Reported By
									</Typography>
									<hr />
								</Grid>
							</Grid>
						</Card>
					</Grid>
				</Grid>
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
					height: "100vh",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default ViewRFeed;
