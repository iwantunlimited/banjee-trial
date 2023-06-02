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
	Avatar,
} from "@mui/material";
import {
	FavoriteBorder,
	ChatBubbleOutline,
	Fullscreen,
	Search,
	Delete,
	Report,
	Add,
	Refresh,
} from "@mui/icons-material";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { filterSocialFeeds } from "./services/ApiServices";

import FullScreenImageModal from "./Components/FullScreenImageModal";
import DetailsModal from "./Components/DetailsModal";
import { useNavigate } from "react-router-dom";
import "./SocialFeed.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";

import DeleteFeedModal from "./Components/DeleteFeedModal";
import { useTheme } from "@mui/material/styles";
import { MainContext } from "../../context/Context";
import { PaginationContext } from "../../context/PaginationContext";

export default function SocialFeed(props) {
	const navigate = useNavigate();
	const theme = useTheme();
	const { feedPagination, setFeedPagination } = React.useContext(PaginationContext);
	const { themeData } = React.useContext(MainContext);
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
		page: feedPagination?.page ? feedPagination?.page : 0,
		pageSize: feedPagination?.pageSize ? feedPagination?.pageSize : 10,
	});
	const [totalEle, setTotalEle] = React.useState();

	const [startDate, setStartDate] = React.useState(null);
	const [endDate, setEndDate] = React.useState(null);
	const [dateFilter, setDateFilter] = React.useState({
		startDate: null,
		endDate: null,
	});

	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});

	const filterSocialFeedsApiCall = React.useCallback(
		() => {
			// setData();
			filterSocialFeeds({
				deleted: null,
				domain: null,
				fields: null,
				finishDate: dateFilter?.endDate,
				inactive: null,
				keywords: null,
				page: pagination?.page,
				pageSize: pagination?.pageSize,
				sortBy: null,
				startDate: dateFilter?.startDate,
			})
				.then((res) => {
					setData(res);
					setTotalEle(res.totalElements);
				})
				.catch((err) => {
					console.error(err);
				});
		},
		// remove dependecies startDate and endDate
		[pagination, dateFilter]
	);

	React.useEffect(() => {
		filterSocialFeedsApiCall();
	}, [filterSocialFeedsApiCall]);

	// function playPause(index) {
	// 	if (document.getElementById(`video${index}`).paused)
	// 		document.getElementById(`video${index}`).play();
	// 	else document.getElementById(`video${index}`).pause();
	// }

	if (data?.content) {
		return (
			<Container sx={{ padding: "0px !important", margin: "auto" }} maxWidth='xl'>
				<Card
					sx={{
						padding: "20px",
						marginBottom: "20px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: { xs: "column", sm: "row" },
					}}>
					<Box sx={{ marginBottom: { xs: "20px", sm: "0px" } }}>
						<Typography
							sx={{
								color: themeData ? "default" : "#6b778c",
								fontSize: "22px",
								fontWeight: "500",
								textAlign: "left",
							}}>
							Feeds({totalEle})
						</Typography>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Box>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									name='startDate'
									label='Start Date'
									value={startDate}
									onChange={(newValue) => {
										setStartDate(moment(newValue).set({ hour: 0, minute: 0, second: 0 }).format());
									}}
									renderInput={(params) => (
										<TextField
											size='small'
											helperText={params?.InputProps?.placeholder}
											{...params}
										/>
									)}
								/>
							</LocalizationProvider>
						</Box>
						<Box sx={{ paddingX: "20px" }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									minDate={startDate !== null && startDate}
									inputFormat='dd/MM/yyyy'
									name='endDate'
									label='End Date'
									value={endDate}
									onChange={(newValue) => {
										// const nowDate = moment(newValue).format("l") === moment().format("l");
										// console.log("now date", nowDate);
										// console.log("now date ---", moment().format());
										setEndDate(moment(newValue).set({ hour: 23, minute: 59, second: 58 }).format());
									}}
									renderInput={(params) => <TextField size='small' {...params} />}
								/>
							</LocalizationProvider>
						</Box>
						<Box>
							<Tooltip title='Search'>
								<IconButton
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}
									onClick={() => {
										setPagination({ page: 0, pageSize: 10 });
										setDateFilter({
											startDate: startDate,
											endDate: endDate,
										});
									}}>
									<Search />
								</IconButton>
							</Tooltip>
						</Box>
						<Box sx={{ marginLeft: "10px" }}>
							<Tooltip title='Create Feed'>
								<IconButton
									onClick={() => navigate("/social-feeds/create")}
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}>
									<Add />
								</IconButton>
							</Tooltip>
						</Box>
						<Box sx={{ marginLeft: "10px" }}>
							<Tooltip title='Refresh Feeds'>
								<IconButton
									onClick={() => {
										setFeedPagination({ page: undefined, pageSize: undefined });
										setPagination({ page: 0, pageSize: 10 });
										setDateFilter({
											startDate: null,
											endDate: null,
										});
									}}
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}>
									<Refresh />
								</IconButton>
							</Tooltip>
						</Box>
						{/* <Box sx={{ marginLeft: "10px" }}>
							<Tooltip title='Reported Feeds'>
								<IconButton
									onClick={() => navigate("reported-feeds")}
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}>
									<Report />
								</IconButton>
							</Tooltip>
						</Box> */}
					</Box>
				</Card>
				{/* <Typography variant="h3">Social Feeds</Typography> */}
				{data?.content?.length > 0 ? (
					<Grid container spacing={2}>
						{data?.content?.map((ele, index) => {
							return (
								<Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
									<Box
										sx={{
											// paddingX: "14px",
											// paddingBottom: "7px",
											width: "100%",
											// height: "100%",
											// minHeight: "250px",
											boxShadow:
												"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
											borderRadius: "8px",
											background: themeData === false ? "#FFF" : "default",
											cursor: "pointer",
											"&:hover": {
												background: themeData === false ? theme.palette.grey.A700 : "#323232",
											},
										}}>
										<Box
											sx={{
												paddingX: "14px",
												// paddingBottom: "7px",
												width: "100%",
											}}>
											<Box
												style={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
												}}>
												<Box
													onClick={() => {
														setFeedPagination({
															page: pagination?.page,
															pageSize: pagination?.pageSize,
														});
														navigate("/social-feeds/" + ele?.id);
														// setModal({ open: true, data: ele });
													}}
													style={{
														display: "flex",
														alignItems: "center",
														paddingLeft: "10px",
													}}>
													<Avatar
														alt={ele?.author?.userName}
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
														{ele?.author?.firstName ? (
															<span
																style={{
																	display: "-webkit-box",
																	overflow: "hidden",
																	WebkitBoxOrient: "vertical",
																	WebkitLineClamp: 1,
																}}>{`${
																ele?.author?.firstName +
																" " +
																(ele?.author?.lastName ? ele?.author?.lastName : "")
															}`}</span>
														) : (
															<span
																style={{
																	display: "-webkit-box",
																	overflow: "hidden",
																	WebkitBoxOrient: "vertical",
																	WebkitLineClamp: 1,
																}}>
																{ele?.author?.username ? ele?.author?.username : "username"}
															</span>
														)}
														{ele?.scheduled === true ? (
															<span style={{ fontSize: "12px" }}>
																{/* scheduled */}
																{"Scheduled at " + moment(ele?.dateTime).format("dddd")}
															</span>
														) : (
															<span style={{ fontSize: "12px" }}>
																{moment(ele?.createdOn).format("lll")}
															</span>
														)}
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
												sx={{ marginY: "10px", height: "200px", position: "relative" }}
												// onClick={() => setModal({ open: true, data: ele })}
											>
												{/* {ele?.mediaContent?.length > 1 && (
											<Box
												sx={{
													position: "absolute",
													top: 2,
													right: 2,
													fontSize: "14px",
													background: "black",
													color: "white",
													borderRadius: "5px",
													zIndex: 100000,
													px: 0.5,
												}}
											>
												{cNumber + "/" + ele?.mediaContent?.length}
											</Box>
										)} */}

												{/* swiper for media */}
												<Swiper
													onClick={() => {
														setFeedPagination({
															page: pagination?.page,
															pageSize: pagination?.pageSize,
														});
														navigate("/social-feeds/" + ele?.id);
														// setModal({ open: true, data: ele });
													}}
													pagination={
														ele?.mediaContent?.length > 1
															? {
																	type: "fraction",
															  }
															: false
													}
													modules={[Pagination]}
													className='mySwiper'>
													{ele?.mediaContent?.length > 0 ? (
														ele?.mediaContent?.map((item, iIndex) => {
															if (item?.type === "video") {
																return (
																	<SwiperSlide>
																		<Box
																			// onClick={() => setModal({ open: true, data: ele })}
																			key={iIndex}
																			sx={{
																				height: "200px",
																				width: "100%",
																				display: "flex",
																				justifyContent: "center",
																				alignItems: "center",
																				position: "relative",
																			}}>
																			<video
																				width='100%'
																				height='200px'
																				id={`video${index}`}
																				controls>
																				<source
																					src={`https://res.cloudinary.com/banjee/video/upload/br_128,q_auto/v1/${item?.src}.mp4`}
																					type='video/mp4'
																				/>
																				Your browser does not support HTML video.
																			</video>
																		</Box>
																	</SwiperSlide>
																);
															} else if (
																item?.type === "audio" ||
																item?.mimeType === "audio/mpeg"
															) {
																return (
																	<SwiperSlide>
																		<Box
																			// onClick={() => setModal({ open: true, data: ele })}
																			key={iIndex}
																			sx={{
																				height: "200px",
																				display: "flex",
																				justifyContent: "center",
																				alignItems: "center",
																				position: "relative",
																			}}>
																			{/* <Box
																		variant='filled'
																		sx={{
																			position: "absolute",
																			top: "20px",
																			right: "20px",
																			fontSize: "14px",
																			background: "black",
																			color: "white",
																			borderRadius: "5px",
																			paddingX: "0.5px",
																		}}>
																		{ele?.mediaContent?.length > 1 &&
																			iIndex + 1 + "/" + ele?.mediaContent?.length}
																	</Box> */}
																			<audio
																				width='100%'
																				height='200px'
																				id={`video${index}`}
																				controls>
																				<source
																					src={`https://res.cloudinary.com/banjee/video/upload/br_128,q_auto/v1/${item?.src}.mp4`}
																					type='video/mp4'
																				/>
																				Your browser does not support HTML video.
																			</audio>
																		</Box>
																	</SwiperSlide>
																);
															} else if (item?.type === "image" || item?.mimeType === "image/png") {
																return (
																	<Box key={iIndex}>
																		<SwiperSlide>
																			<Box
																				// onClick={() =>
																				// 	ele?.mediaContent?.length === 0 &&
																				// 	setModal({ open: true, data: ele })
																				// }
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
																					alt='#'
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
																					<Fullscreen
																						style={{
																							color: "#000",
																							fontSize: "30px",
																						}}
																					/>
																				</IconButton>
																			</Box>
																		</SwiperSlide>
																	</Box>
																);
															}
															{
																/* else {
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
																		position: "relative",
																	}}>
																	<Box
																		variant='filled'
																		sx={{
																			position: "absolute",
																			top: "20px",
																			right: "20px",
																			fontSize: "14px",
																			background: "black",
																			color: "white",
																			borderRadius: "5px",
																			paddingX: "0.5px",
																		}}>
																		{ele?.mediaContent?.length > 1 &&
																			iIndex + 1 + "/" + ele?.mediaContent?.length}
																	</Box>
																	<Typography>{ele?.text}</Typography>
																</Box>
															</SwiperSlide>
														);
													} */
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
																{ele?.text?.length > 200 ? (
																	<Typography>
																		{ele?.text?.slice(0, 200) + "... "}
																		<span style={{ textTransform: "none", color: "blue" }}>
																			more
																		</span>
																	</Typography>
																) : (
																	<Typography>{ele?.text}</Typography>
																)}
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
												onClick={() => {
													setFeedPagination({
														page: pagination?.page,
														pageSize: pagination?.pageSize,
													});
													navigate("/social-feeds/" + ele?.id);
													// setModal({ open: true, data: ele })
												}}>
												{ele?.text && ele?.mediaContent?.length > 0 ? (
													<Typography noWrap={true}>
														{ele?.text || <p style={{ height: "16px" }}> </p>}
													</Typography>
												) : (
													<Box style={{ height: "24px" }}></Box>
												)}
												<Box sx={{ display: "flex", paddingTop: "20px", paddingBottom: "10px" }}>
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
															marginLeft: "20px",
														}}>
														<ChatBubbleOutline />
														<span style={{ marginLeft: "5px" }}>{ele?.totalComments || 0}</span>
													</Box>
												</Box>
											</Box>
										</Box>
										{/* <Box sx={{ display: "flex", justifyContent: "center" }}>
										{ele?.scheduled === true && (
											<Typography
												sx={{
													width: "fitContent",
													background: "skyblue",
													paddingX: "10px",
													borderBottomLeftRadius: "5px",
													borderBottomRightRadius: "5px",
													fontSize: "12px",
												}}>
												scheduled
											</Typography>
										)}
										{ele?.published === true && (
											<Typography
												sx={{
													width: "fitContent",
													background: "skyblue",
													paddingX: "10px",
													borderBottomLeftRadius: "5px",
													borderBottomRightRadius: "5px",
													fontSize: "12px",
												}}>
												published
											</Typography>
										)}
									</Box> */}

										<Box
											sx={{
												background: theme?.palette?.primary?.main,
												color: theme?.palette?.primary?.contrastText,
												borderBottomLeftRadius: "8px",
												borderBottomRightRadius: "8px",
												textAlign: "center",
											}}>
											<Typography
												sx={{
													fontSize: { xs: "14px", md: "14px", lg: "14px" },
													display: "-webkit-box",
													overflow: "hidden",
													WebkitBoxOrient: "vertical",
													WebkitLineClamp: 1,
												}}>
												{ele?.pageName}
											</Typography>
										</Box>
									</Box>
								</Grid>
							);
						})}
						<Grid item xs={12}>
							{/* <Card> */}
							{/* pagination for all feeds */}
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
									rowsPerPageOptions={[10, 15, 20]}
									onPageChange={(event, data) => {
										setPagination((prev) => ({
											...prev,
											page: data,
										}));
									}}
									onRowsPerPageChange={(event) => {
										setPagination((prev) => ({
											...prev,
											pageSize: event.target.value,
										}));
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
						<Typography>No Data Found !</Typography>
					</Box>
				)}

				{/* image model for fullscreen show */}
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
