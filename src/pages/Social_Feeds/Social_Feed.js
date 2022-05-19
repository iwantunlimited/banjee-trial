import React from "react";
import {
	Container,
	Grid,
	Typography,
	Box,
	CircularProgress,
	IconButton,
	Card,
	TextField,
	Tooltip,
	TablePagination,
} from "@mui/material";
import {
	FavoriteBorder,
	ChatBubbleOutline,
	Fullscreen,
	Search,
	Delete,
	Report,
} from "@mui/icons-material";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { filterSocialFeeds } from "./services/ApiServices";

import FullScreenImageModal from "./Components/FullScreenImageModal";
import DetailsModal from "./Components/DetailsModal";
import { useNavigate } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";
import DeleteFeedSnackBar from "./Components/SnackBar";
import DeleteFeedModal from "./Components/DeleteFeedModal";

export default function Social_Feeds(props) {
	const navigate = useNavigate();

	const [data, setData] = React.useState([]);
	const [modal, setModal] = React.useState({ open: false });
	//delete menu ------
	const [openDModal, setOpenDModal] = React.useState(false);
	const [dFeedData, setDFeedData] = React.useState({
		feedId: "",
		remark: "",
	});

	// pagination state
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 12,
	});
	const [totalEle, setTotalEle] = React.useState();

	console.log("delete modal data", dFeedData);

	const [startDate, setStartDate] = React.useState();
	const [endDate, setEndDate] = React.useState();

	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});

	const [openSnackBar, setOpenSnackBar] = React.useState(false);

	const filterSocialFeedsApiCall = React.useCallback(
		(page, pageSize) => {
			setData();
			filterSocialFeeds({
				deleted: null,
				domain: null,
				fields: null,
				finishDate: endDate,
				inactive: null,
				keywords: null,
				page: page,
				pageSize: pageSize,
				sortBy: null,
				startDate: startDate,
			})
				.then((res) => {
					setData(res);
					setTotalEle(res.totalElements);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[startDate, endDate]
	);

	React.useEffect(() => {
		filterSocialFeedsApiCall(0, 12);
	}, [filterSocialFeedsApiCall]);

	console.log("data----------", data);

	// function playPause(index) {
	// 	if (document.getElementById(`video${index}`).paused)
	// 		document.getElementById(`video${index}`).play();
	// 	else document.getElementById(`video${index}`).pause();
	// }

	if (data) {
		return (
			<Container sx={{ p: "0px !important", margin: "auto" }} maxWidth='xl'>
				<Card
					sx={{
						p: 2,
						mb: 2,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: { xs: "column", sm: "row" },
					}}>
					<Box sx={{ mb: { xs: 2, sm: 0 } }}>
						<Typography
							sx={{ color: "#6b778c", fontSize: "20px", fontWeight: "500", textAlign: "left" }}>
							Feeds({totalEle})
						</Typography>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Box>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									label='Start Date'
									value={startDate}
									onChange={(newValue) => {
										setStartDate(moment(newValue).format());
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
						</Box>
						<Box sx={{ px: 2 }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									label='End Date'
									value={endDate}
									onChange={(newValue) => {
										setEndDate(moment(newValue).format());
									}}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
						</Box>
						<Box sx={{ px: 1 }}>
							<Tooltip title='Search'>
								<IconButton
									style={{
										borderRadius: "50px",
										background: "#1976D2",
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: "white",
									}}
									onClick={() => {
										filterSocialFeedsApiCall(0, 12);
									}}>
									<Search />
								</IconButton>
							</Tooltip>
						</Box>
						<Box sx={{ ml: 1 }}>
							<Tooltip title='Reported Feeds'>
								<IconButton
									onClick={() => navigate("reported-feeds")}
									style={{
										borderRadius: "50px",
										background: "#1976D2",
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: "white",
									}}>
									<Report />
								</IconButton>
							</Tooltip>
						</Box>
					</Box>
				</Card>
				{/* <Typography variant="h3">Social Feeds</Typography> */}
				{data?.content?.length > 0 ? (
					<Grid container spacing={2}>
						{data?.content?.map((ele, index) => (
							<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
								<Box
									sx={{
										padding: "7px 14px",
										width: "100%",
										// height: "100%",
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
											onClick={() => setModal({ open: true, data: ele })}
											style={{
												display: "flex",
												alignItems: "center",
												paddingLeft: "10px",
											}}>
											<img
												alt='#'
												src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${ele?.author?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
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
													ele?.author?.username || ele?.author?.userName || "userName"
												}`}</span>
												<span style={{ fontSize: "12px" }}>
													{moment(ele?.createdOn).format("lll")}
												</span>
											</Typography>
										</Box>
										<IconButton
											onClick={() => {
												setDFeedData({ feedId: ele.id });
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
											socialFilterApi={filterSocialFeedsApiCall}
										/>
									</Box>

									<Box
										sx={{ my: 1, height: "200px" }}
										// onClick={() => setModal({ open: true, data: ele })}
									>
										<Swiper
											onClick={() => setModal({ open: true, data: ele })}
											pagination={true}
											modules={[Pagination]}
											className='mySwiper'>
											{ele?.mediaContent?.length > 0 ? (
												ele?.mediaContent?.map((item, iIndex) => {
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
																	<video width='100%' height='200px' id={`video${index}`} controls>
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
																	<audio width='100%' height='200px' id={`video${index}`} controls>
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
																	<Typography>{ele?.text}</Typography>
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
														<Typography>{ele?.text}</Typography>
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
										}}
										onClick={() => setModal({ open: true, data: ele })}>
										{ele?.text && ele?.mediaContent?.length > 0 ? (
											<Typography noWrap={true}>
												{ele?.text || <p style={{ height: "16px" }}> </p>}
											</Typography>
										) : (
											<Box style={{ height: "24px" }}></Box>
										)}
										<Box sx={{ display: "flex", pt: 2, pb: 1 }}>
											<Box style={{ display: "flex", alignItems: "center" }}>
												<FavoriteBorder />
												<span style={{ marginLeft: "5px" }}>
													{ele?.totalReactions || ele?.reactions?.length || 0}
												</span>
											</Box>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													ml: "20px",
												}}>
												<ChatBubbleOutline />
												<span style={{ marginLeft: "5px" }}>{ele?.totalComments || 0}</span>
											</Box>
										</Box>
									</Box>
								</Box>
							</Grid>
						))}
						<Grid item xs={12}>
							{/* <Card> */}
							<Box
								className='root'
								sx={{
									"& > div > div": {
										display: "flex",
										alignItems: "baseline !important",
									},
								}}>
								<TablePagination
									component='div'
									count={totalEle}
									page={pagination.page}
									rowsPerPage={pagination.pageSize}
									rowsPerPageOptions={[12, 16, 20]}
									onPageChange={(event, data) => {
										console.log("event--------", data);
										setPagination((prev) => ({
											...prev,
											page: data,
										}));
										filterSocialFeedsApiCall(data, pagination.pageSize);
									}}
									onRowsPerPageChange={(event) => {
										console.log("pagesizedfddv", event, data);
										setPagination((prev) => ({
											...prev,
											pageSize: event.target.value,
										}));
										filterSocialFeedsApiCall(pagination.page, event.target.value);
									}}
								/>
							</Box>
							{/* </Card> */}
						</Grid>
					</Grid>
				) : (
					<Box
						style={{
							height: "100vh",
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: " center",
						}}>
						<CircularProgress />
					</Box>
				)}

				{fullScreenState.imageModal && (
					<FullScreenImageModal
						state={fullScreenState}
						handleClose={() => setFullScreenState({ imageModal: false })}
					/>
				)}
				{modal.open && (
					<DetailsModal
						state={modal}
						handleClose={() => setModal({ open: false })}
						filterApi={filterSocialFeedsApiCall}
					/>
				)}
				<DeleteFeedSnackBar open={openSnackBar} openFun={(e) => setOpenSnackBar(e)} />
			</Container>
		);
	} else {
		return (
			<Box
				style={{
					height: "100vh",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: " center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}
