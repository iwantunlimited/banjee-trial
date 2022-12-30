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
import { deleteSocialFeed, getSocialFeedDetails } from "../../services/ApiServices";
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
				<Box sx={{ padding: "30px" }}>
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
	});

	const [result, setResult] = React.useState([]);
	const [reaction, setReaction] = React.useState([]);
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleCloseModal = () => {
		setDeleteModal((prev) => ({
			open: false,
			remark: "",
		}));
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
			.catch((err) => console.log(err));
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
									onClick={() => navigate("/user/" + data?.authorId)}
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
										style={{
											padding: "0 15px",
											display: "flex",
											flexDirection: "column",
											fontSize: "18px",
										}}>
										{data?.author?.firstName ? (
											<span>{`${
												data?.author?.firstName +
												" " +
												(data?.author?.lastName ? data?.author?.lastName : "")
											}`}</span>
										) : (
											<span>{`${data?.author?.userName || "userName"}`}</span>
										)}
										<span style={{ fontSize: "14px" }}>
											{moment(data?.createdOn).format("lll")}
										</span>
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
							<Box sx={{ marginY: "10px" }}>
								<SwiperComp data={data?.mediaContent} />
							</Box>
							<Box>
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
							<Box
								sx={{ borderBottom: 1, borderColor: "divider", width: "100%", marginTop: "10px" }}>
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
														<React.Fragment key={index}>
															<Grid item xs={6}>
																<span
																	style={{
																		height: "100%",
																		width: "100%",
																		display: "flex",
																		alignItems: "center",
																	}}>
																	{userLength > 15
																		? ele?.user?.username.slice(0, 15) + " ..."
																		: ele?.user?.username}
																</span>
															</Grid>
															<Grid item xs={6}>
																<img
																	src={getEmoji(ele?.reactionType)}
																	alt=''
																	style={{
																		height: "25px",
																		width: "25px",
																		objectFit: "contain",
																	}}
																/>
															</Grid>
														</React.Fragment>
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

												return (
													<React.Fragment key={index}>
														<Grid item xs={12}>
															{/* <span>{ele?.createdByUser?.username}</span> */}
															<Card
																sx={{
																	width: "100%",
																	p: 1,
																	background: "#f2eeee",
																	boxShadow: 0,
																}}>
																<Box sx={{ width: "100%" }}>
																	<Typography sx={{ fontSize: "12px" }}>
																		{userLength > 20
																			? ele?.createdByUser?.username.slice(0, 20) + "... :"
																			: ele?.createdByUser?.username}
																	</Typography>
																	<Typography>{ele?.text}</Typography>
																</Box>
															</Card>
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
				<ModalComp data={deleteModal} handleModal={handleCloseModal}>
					<form
						onSubmit={(event) => {
							event?.preventDefault();
							deleteFeedApiCall();
						}}>
						<Typography
							id='modal-modal-title'
							style={{
								fontSize: window.innerWidth < 500 ? "14px" : "24px",
							}}>
							<b>Are you sure to delete this feed ?</b>
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
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<Button variant='outlined' onClick={() => handleCloseModal()}>
								Cancel
							</Button>
							<Button
								variant='contained'
								type='submit'
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
