import { ArrowBack, Delete } from "@mui/icons-material";
import {
	Avatar,
	Card,
	CircularProgress,
	Container,
	IconButton,
	Typography,
	Grid,
	Box,
	Divider,
	Tab,
	Tabs,
	Button,
	TextField,
	useTheme,
} from "@mui/material";
import React from "react";
import SwiperComp from "../../../../CustomComponents/SwiperComp";
import {
	deleteSocialFeed,
	deleteSocialFeedsComments,
	getSocialFeedDetails,
} from "../../services/ApiServices";
import moment from "moment";
import PropTypes from "prop-types";
import { getSocialFeedsComments, getSocialFeedsReactions } from "../../services/ApiServices";
import { useLocation, useNavigate, useParams } from "react-router";
import ModalComp from "../../../../CustomComponents/ModalComp";

import AngryEmoji from "../../../../assets/emojis/Angry.svg";
import LaughEmoji from "../../../../assets/emojis/Laugh.svg";
import LikeEmoji from "../../../../assets/emojis/Like.svg";
import LoveEmoji from "../../../../assets/emojis/Love.svg";
import SadEmoji from "../../../../assets/emojis/Sad.svg";
import WowEmoji from "../../../../assets/emojis/Wow.svg";
import { MainContext } from "../../../../context/Context";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && (
				<Box sx={{ padding: "10px" }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function FeedDetail(props) {
	const params = useParams();
	const theme = useTheme();
	const navigate = useNavigate();
	const { setModalData, setModalOpen } = React.useContext(MainContext);
	const { pathname } = useLocation();
	const [data, setData] = React.useState("");
	const [textState, setTextState] = React.useState(false);
	const [deleteModal, setDeleteModal] = React.useState({
		open: false,
		feedId: params?.id,
		remark: "",
		commentId: "",
	});

	const [modalType, setModalType] = React.useState("feed");
	const [result, setResult] = React.useState([]);
	const [reaction, setReaction] = React.useState([]);
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleCloseModal = () => {
		setDeleteModal((prev) => ({
			...prev,
			open: false,
			remark: "",
			commentId: "",
		}));
		setModalType("feed");
	};

	const getEmoji = (type) => {
		switch (type) {
			case "LIKE":
				return LikeEmoji;
			case "SAD":
				return SadEmoji;
			case "CELEBRATING":
				return LaughEmoji;
			case "LOVING":
				return LoveEmoji;
			case "NICE":
				return WowEmoji;
			case "ANGRY":
				return AngryEmoji;
			default:
				return LikeEmoji;
		}
	};

	const feedCommentApiCall = React.useCallback(() => {
		getSocialFeedsComments(params?.id)
			.then((res) => {
				setResult(res);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const feedReactionApiCall = React.useCallback(() => {
		getSocialFeedsReactions(params?.id)
			.then((res) => {
				setReaction(res);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const ApiCall = React.useCallback(() => {
		getSocialFeedDetails(params?.id)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.error(err));
	}, []);

	const deleteFeedApiCall = React.useCallback(() => {
		deleteSocialFeed({
			feedId: deleteModal.feedId,
			remark: deleteModal.remark,
		})
			.then((res) => {
				setModalOpen(true);
				setModalData("Feed Deleted", "success");
				// setOpenSnackBar(true);
				// if (pathname === "/social-feeds/reported-feeds/" + deleteModal.feedId) {
				// 	navigate("/social-feeds/reported-feeds");
				// }
				navigate("/social-feeds");
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const deleteFeedCommentsApiCall = React.useCallback((payload) => {
		deleteSocialFeedsComments(payload)
			.then((res) => {
				setModalOpen(true);
				setModalData("Comment Deleted", "success");
				setDeleteModal((prev) => ({
					...prev,
					open: false,
				}));
				feedCommentApiCall();
				setModalType("feed");
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const textFun = (text) => {
		if (text?.length > 550) {
			if (textState) {
				return (
					<Typography>
						{text + " "}
						<a
							style={{ color: theme?.palette?.primary?.main, cursor: "pointer" }}
							onClick={() => setTextState(!textState)}>
							...less
						</a>
					</Typography>
				);
			} else {
				return (
					<Typography>
						{text.slice(0, 550) + " "}
						<a
							style={{ color: theme?.palette?.primary?.main, cursor: "pointer" }}
							onClick={() => setTextState(!textState)}>
							...more
						</a>
					</Typography>
				);
			}
		} else {
			return <Typography>{text}</Typography>;
		}
	};

	const modalHandler = () => {
		switch (modalType) {
			case "feed":
				return (
					<ModalComp data={deleteModal} handleModal={handleCloseModal}>
						<form
							onSubmit={(event) => {
								event?.preventDefault();
								deleteFeedApiCall();
							}}>
							<Typography
								id='modal-modal-title'
								sx={{
									fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
									fontWeight: 400,
								}}>
								Are you sure to delete this feed ?
							</Typography>
							<Box sx={{ my: 2 }}>
								<Typography sx={{ fontSize: { xs: "12px", sm: "14px" } }}>Give Remark to feed</Typography>
								<TextField
									fullWidth
									label='remark'
									name='remark'
									value={deleteModal?.remark}
									onChange={(event) => {
										setDeleteModal((prev) => ({
											...prev,
											remark: event?.target?.value,
										}));
									}}
									required
									variant='outlined'
								/>
							</Box>
							<Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
								<Button variant='outlined' onClick={() => handleCloseModal()}>
									Cancel
								</Button>
								<Button
									variant='contained'
									type='submit'
									sx={{ marginLeft: { xs: "10px", md: "20px" } }}
									// onClick={() => {
									// 	deleteFeedApiCall();
									// 	filterSocialFeedsApiCall();
									// }}
								>
									Submit
								</Button>
							</Box>
						</form>
					</ModalComp>
				);
			case "comment":
				return (
					<ModalComp data={deleteModal} handleModal={handleCloseModal}>
						<form
							onSubmit={(event) => {
								event?.preventDefault();
								deleteFeedCommentsApiCall(deleteModal?.commentId);
							}}>
							<Typography
								id='modal-modal-title'
								sx={{
									fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
									fontWeight: 400,
								}}>
								Are you sure to delete this Comment ?
							</Typography>
							<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
								<Button variant='outlined' onClick={() => handleCloseModal()}>
									Cancel
								</Button>
								<Button
									variant='contained'
									type='submit'
									sx={{
										marginLeft: { xs: "10px", md: "20px" },
									}}
									// onClick={() => {
									// 	deleteFeedApiCall();
									// 	filterSocialFeedsApiCall();
									// }}
								>
									Submit
								</Button>
							</Box>
						</form>
					</ModalComp>
				);
			default:
				return (
					<ModalComp data={deleteModal} handleModal={handleCloseModal}>
						<form
							onSubmit={(event) => {
								event?.preventDefault();
								deleteFeedApiCall();
							}}>
							<Typography
								id='modal-modal-title'
								sx={{
									fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
									fontWeight: 400,
								}}>
								Are you sure to delete this feed ?
							</Typography>
							<Box sx={{ my: 2 }}>
								<Typography style={{ fontSize: window.innerWidth < 500 ? "12px" : "14px" }}>
									Give Remark to feed
								</Typography>
								<TextField
									fullWidth
									label='remark'
									name='remark'
									value={deleteModal?.remark}
									onChange={(event) => {
										setDeleteModal((prev) => ({
											...prev,
											remark: event?.target?.value,
										}));
									}}
									required
									variant='outlined'
								/>
							</Box>
							<Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 1, md: 2 } }}>
								<Button variant='outlined' onClick={() => handleCloseModal()}>
									Cancel
								</Button>
								<Button
									variant='contained'
									type='submit'
									sx={{ marginLeft: { xs: "10px", md: "20px" } }}
									// onClick={() => {
									// 	deleteFeedApiCall();
									// 	filterSocialFeedsApiCall();
									// }}
								>
									Submit
								</Button>
							</Box>
						</form>
					</ModalComp>
				);
		}
	};

	// console.log("====================================");
	// console.log("data", data);
	// console.log("====================================");

	React.useEffect(() => {
		ApiCall();
		feedCommentApiCall();
		feedReactionApiCall();
	}, [ApiCall, feedReactionApiCall, feedCommentApiCall]);

	if (data) {
		return (
			<Container maxWidth='md' sx={{ marginTop: "10px" }}>
				<Grid item container xs={12} spacing={2}>
					<Grid iitem xs={12}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBack color='primary' />
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px" }}>
							<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
								<Box
									onClick={() => {
										if (
											data?.authorId === "61111e42bcc68b2a1fa3432c" ||
											data?.authorId === "63f75ffa4c16dbbb155fc380"
										) {
											// setModalOpen(true);
											// setModalData("Admin User", "warning");
										} else {
											if (localStorage?.getItem("userType") !== "merchant") {
												navigate("/user/" + data?.authorId);
											}
										}
									}}
									style={{
										width: "100%",
										display: "flex",
										alignItems: "center",
										paddingLeft: "10px",
										// marginBottom: "20px",
									}}>
									<Avatar
										alt='#'
										src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${data?.author?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
										style={{
											height: "60px",
											width: "60px",
											objectFit: "contain",
											borderRadius: "50%",
										}}
									/>
									<Typography
										noWrap
										style={{
											padding: "0 15px",
											display: "flex",
											flexDirection: "column",
											fontSize: "18px",
										}}>
										{data?.author?.firstName ? (
											<span>{`${data?.author?.firstName}`}</span>
										) : (
											<span>{`${data?.author?.userName || "userName"}`}</span>
										)}
										{data?.scheduled === true ? (
											<span style={{ fontSize: "14px" }}>
												{/* scheduled */}
												{"Scheduled at " + moment(data?.dateTime).format("dddd")}
											</span>
										) : (
											<span style={{ fontSize: "14px" }}>{moment(data?.createdOn).format("lll")}</span>
										)}
									</Typography>
								</Box>
								<Box>
									<IconButton
										onClick={() => {
											setDeleteModal((prev) => ({
												...prev,
												open: true,
											}));
										}}
										style={{ width: "40px", height: "40px" }}>
										<Delete />
									</IconButton>
								</Box>
							</Box>
							{data?.mediaContent?.length > 0 && (
								<Box sx={{ marginY: "10px" }}>
									<SwiperComp data={data?.mediaContent} />
								</Box>
							)}
							<Box sx={{ marginY: "10px" }}>
								{textFun(data?.text)}
								{/* {data?.text?.length < 350 && textState === false ? (
									<Typography>
										{data?.text.slice(0, 350) + " "}
										<a>more</a>
									</Typography>
								) : (
									<Typography>
										{data?.text + ""}
										<a>less</a>
									</Typography>
								)} */}
							</Box>
							<Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", marginTop: "10px" }}>
								<Tabs
									value={value}
									onChange={handleChange}
									indicatorColor='primary'
									textColor='primary'
									aria-label='basic tabs example'>
									<Tab label='Reactions' {...a11yProps(0)} />
									<Tab label='Comments' {...a11yProps(0)} />
								</Tabs>
							</Box>
							<TabPanel value={value} index={0} style={{ width: "100%" }}>
								<div>
									<Box
										style={{
											height: "310px",
											width: "100%",
											// minWidth: "440px",
											overflowY: data?.reactions?.length > 5 && "scroll",
											overflowX: "hidden",
										}}>
										<Grid item container xs={12} spacing={1}>
											{reaction?.length > 0 ? (
												reaction?.map((ele, index) => {
													const userLength = ele?.user?.username.length;
													return (
														<Grid item xs={12}>
															<Box
																sx={{
																	display: "flex",
																	justifyContent: data?.authorId === ele?.userId ? "flex-end" : "flex-start",
																}}>
																<Box
																	sx={{
																		background: theme?.palette?.grey?.A700,
																		boxShadow: 0,
																		maxWidth: "90%",
																		borderRadius: "10px",
																		padding: "5px",
																		paddingX: "10px",
																		// textAlign:
																		// 	blogData?.authorId === item?.author?.id ? "right" : "left",
																	}}>
																	<Typography noWrap sx={{ fontSize: "10px" }}>
																		{ele?.user?.firstName ? (
																			<span>{`${ele?.user?.firstName}`}</span>
																		) : (
																			<span>{`${ele?.user?.userName || "userName"}`}</span>
																		)}
																	</Typography>
																	<Box
																		sx={{
																			display: "flex",
																			justifyContent: data?.authorId === ele?.userId ? "flex-start" : "flex-end",

																			marginLeft: data?.authorId === ele?.userId ? "0px" : "20px",
																			marginRight: data?.authorId === ele?.userId ? "20px" : "0px",
																		}}>
																		<Typography>{ele?.reactionType}</Typography>
																		{/* <img
																			src={getEmoji(ele?.reactionType)}
																			alt=''
																			style={{
																				height: "25px",
																				width: "25px",
																				objectFit: "contain",
																			}}
																		/> */}
																	</Box>
																</Box>
															</Box>
														</Grid>
													);
												})
											) : (
												<Grid item xs={12}>
													<Typography>No Reactions !</Typography>
												</Grid>
											)}
										</Grid>
									</Box>
								</div>
							</TabPanel>
							<TabPanel value={value} index={1} style={{ width: "100%" }}>
								<Box
									style={{
										height: "310px",
										width: "100%",
										// minWidth: "440px",
										overflowY: data?.reactions?.length > 5 && "scroll",
										overflowX: "hidden",
									}}>
									<Grid item container xs={12} spacing={1}>
										{result?.length > 0 ? (
											result?.map((ele, index) => {
												const userLength = ele?.createdByUser?.username.length;
												const commentId = ele?.id;
												return (
													<React.Fragment key={index}>
														<Grid item xs={12}>
															{/* <span>{ele?.createdByUser?.username}</span> */}
															<Box
																sx={{
																	display: "flex",
																	justifyContent: data?.authorId === ele?.createdBy ? "flex-end" : "flex-start",
																}}>
																<Box
																	sx={{
																		background: theme?.palette?.grey?.A700,
																		boxShadow: 0,
																		maxWidth: "90%",
																		borderRadius: "10px",
																		padding: "5px",
																		paddingX: "10px",
																		// textAlign:
																		// 	blogData?.authorId === item?.author?.id ? "right" : "left",
																	}}>
																	<Box
																		sx={{
																			display: "flex",
																			justifyContent: "space-between",
																			alignItems: "center",
																		}}>
																		<Typography noWrap sx={{ fontSize: "10px" }}>
																			{ele?.createdByUser?.firstName ? (
																				<span>{`${ele?.createdByUser?.firstName}`}</span>
																			) : (
																				<span>{`${ele?.createdByUser?.userName || "userName"}`}</span>
																			)}
																		</Typography>
																		<IconButton
																			sx={{ padding: "2.5px" }}
																			onClick={() => {
																				setModalType("comment");
																				setDeleteModal((prev) => ({
																					...prev,
																					open: true,
																					commentId: commentId,
																				}));
																			}}>
																			<Delete sx={{ fontSize: "12px" }} />
																		</IconButton>
																	</Box>

																	<Typography>{ele?.text}</Typography>
																</Box>
															</Box>
														</Grid>
														{/* <Grid item xs={8}>
													<span>{ele?.text}</span>
												</Grid> */}
													</React.Fragment>
												);
											})
										) : (
											<Grid item xs={12}>
												<Typography>No Comments !</Typography>
											</Grid>
										)}
									</Grid>
								</Box>
							</TabPanel>
						</Card>
					</Grid>
				</Grid>
				{modalHandler()}
			</Container>
		);
	} else {
		return (
			<Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<CircularProgress />
			</Box>
		);
	}
}

export default FeedDetail;
