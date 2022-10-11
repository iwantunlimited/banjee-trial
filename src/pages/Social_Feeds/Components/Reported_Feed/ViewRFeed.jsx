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
	Button,
} from "@mui/material";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import FullScreenImageModal from "../FullScreenImageModal";
import { findCustomer } from "../../../Users/User_Services/UserApiService";
import { makeStyles } from "@mui/styles";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";
import DeleteFeedSnackBar from "../SnackBar";
import DeleteFeedModal from "../DeleteFeedModal";
import { useNavigate, useParams } from "react-router";
import { getReportedFeedDetail, getSocialFeedDetails } from "../../services/ApiServices";

const useStyles = makeStyles({
	root: {
		width: "100%",
		marginTop: "30px",
	},
	container: {
		maxHeight: "440px",
	},
	dataGridFooter: {
		"& > div > .MuiDataGrid-footerContainer > .MuiTablePagination-root > .MuiTablePagination-toolbar":
			{
				alignItems: "baseline !important",
			},
	},
	DataGridBackground: {
		"& .app-header": {
			backgroundColor: "#b9d5ff91",
		},
	},
});

function ViewRFeed() {
	const navigate = useNavigate();
	const classes = useStyles();
	const [rData, setRData] = React.useState("");

	const [data, setData] = React.useState([]);
	const [reportedId, setReportedId] = React.useState([]);
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
	const [pRData, setPRData] = React.useState([]);

	const { id } = useParams();

	const reportedProfile = React.useCallback((item) => {
		findCustomer(item)
			.then((res) => {
				setPRData((prev) => [...prev, res.userObject]);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const apiCall = React.useCallback(() => {
		getReportedFeedDetail(id)
			.then((res) => {
				// setReportedId(() => {
				// 	const data = res.map((item) => {
				// 		return item?.reportedBy;
				// 	});
				// 	return data;
				// });
				res?.map((item) => {
					reportedProfile(item?.reportedBy);
					return null;
				});
				setRData(res);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [id, reportedProfile]);

	const filterFeedApiCall = React.useCallback(() => {
		getSocialFeedDetails(id)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.error(err));
	}, [id]);

	React.useEffect(() => {
		apiCall();
		filterFeedApiCall();
	}, [apiCall, filterFeedApiCall]);

	const rows = pRData ? pRData : [];

	const columns = [
		{
			id: "1",
			field: "firstName",
			headerClassName: "app-header",
			headerName: "FirstName",
			flex: 0.3,
			// align: "center",
			// renderCell: (params) => (
			// 	<Avatar src={params.row.toUser.avtarUrl} alt={params.row.toUser.name} />
			// ),
		},
		{
			id: "2",
			field: "lastName",
			headerClassName: "app-header",
			headerName: "LastName",
			flex: 0.3,
		},
		{
			id: "3",
			field: "email",
			headerClassName: "app-header",
			headerName: "Email",
			flex: 0.5,
		},
		{
			id: "4",
			field: "mobile",
			headerClassName: "app-header",
			headerName: "Mobile",
			flex: 0.5,
			// align: "center",
		},
		{
			id: "5",
			field: "view",
			headerClassName: "app-header",
			headerName: "View",
			align: "center",
			flex: 0.3,
			renderCell: (params) => (
				<strong>
					<IconButton
						onClick={() => {
							navigate("/user/view/" + params.row.id);
						}}>
						<VisibilityIcon />
					</IconButton>
				</strong>
			),
		},
	];

	if (rData?.length > 0) {
		return (
			<>
				<Button
					variant='contained'
					onClick={() => navigate(-1)}
					sx={{
						marginTop: "1em",
						marginLeft: "1em",
						width: "8em",
						height: "2em",
						textTransform: "none",
					}}>
					Go Back
				</Button>
				<Container maxWidth='xl'>
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
										`
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

									<Box sx={{ marginY: "10px", height: "200px" }}>
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
										<Box sx={{ display: "flex", paddingTop: "20px", paddingBottom: "10px" }}>
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
													marginLeft: "20px",
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
										<Typography
											sx={{
												color: "#6b778c",
												fontSize: "20px",
												fontWeight: "500",
											}}>
											Reported By
										</Typography>
										<hr />
									</Grid>
									<Grid item xs={12}>
										<div style={{ width: "100%" }}>
											<div className={classes.DataGridBackground}>
												<DataGrid
													autoHeight
													// page={pagination.page}
													// pageSize={pagination.pageSize}
													// onPageSizeChange={(event) => {
													// 	setPagination((prev) => ({
													// 		...prev,
													// 		pageSize: event,
													// 	}));
													// 	feedListApiCall(pagination.page, event);
													// }}
													// rowCount={totalEle}
													rows={rows}
													columns={columns}
													// paginationMode='server'
													// // autoPageSize
													// pagination
													// onPageChange={(event) => {
													// 	feedListApiCall(event, pagination.pageSize);
													// }}
													// rowsPerPageOptions={[5, 10, 20]}
													className={classes.dataGridFooter}
												/>
											</div>
										</div>
									</Grid>
									{/* {rData.map((ele, index) => {
										return (
											<Grid item xs={12}>
												<Typography>{ele.reportedBy}</Typography>
											</Grid>
										);
									})} */}
								</Grid>
							</Card>
						</Grid>
					</Grid>
				</Container>
			</>
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
