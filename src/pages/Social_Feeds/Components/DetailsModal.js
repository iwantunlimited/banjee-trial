import * as React from "react";
import {
	Modal,
	Typography,
	Box,
	Button,
	IconButton,
	makeStyles,
	Grid,
	Tab,
	Tabs,
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { getSocialFeedsComments } from "../services/ApiServices";

import AngryEmoji from "../../../assets/emojis/Angry.svg";
import LaughEmoji from "../../../assets/emojis/Laugh.svg";
import LikeEmoji from "../../../assets/emojis/Like.svg";
import LoveEmoji from "../../../assets/emojis/Love.svg";
import SadEmoji from "../../../assets/emojis/Sad.svg";
import WowEmoji from "../../../assets/emojis/Wow.svg";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { EffectCube, Pagination } from "swiper";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	height: "80%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 2,
	borderRadius: "12px",
};
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
				<Box sx={{ p: 3 }}>
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
export default function CommentsModal(props) {
	const {
		state: { open, data },
		handleClose,
	} = props;

	const [result, setResult] = React.useState([]);
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
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

	React.useEffect(() => {
		getSocialFeedsComments(data?.id)
			.then((res) => {
				console.log(res);
				setResult(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box sx={style}>
				<Grid container spacing={2}>
					<Grid item container xs={6} md={6}>
						<Grid item xs={12}>
							<Box
								style={{
									display: "flex",
									alignItems: "center",
									paddingLeft: "10px",
									marginBottom: "20px",
								}}>
								<img
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
									<span>{`${data?.author?.username || data?.author?.userName || "userName"}`}</span>
									<span style={{ fontSize: "14px" }}>{moment(data?.createdOn).format("lll")}</span>
								</Typography>
							</Box>
							<Box>
								<Swiper
									effect={"cube"}
									grabCursor={true}
									cubeEffect={{
										shadow: true,
										slideShadows: true,
										shadowOffset: 20,
										shadowScale: 0.94,
									}}
									pagination={true}
									modules={[EffectCube, Pagination]}
									className='mySwiper'>
									{data?.mediaContent?.length > 0 ? (
										data?.mediaContent?.map((item, iIndex) => {
											if (item?.mimeType === "video/mp4") {
												return (
													<SwiperSlide>
														<Box
															key={iIndex}
															sx={{
																height: "350px",
																width: "100%",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
															}}>
															<video width='100%' height='200px' controls>
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
																height: "350px",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
															}}>
															<audio width='100%' height='200px' controls>
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
															key={iIndex}
															sx={{
																height: "350px",
																width: "100%",
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
															}}>
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
														</Box>
													</SwiperSlide>
												);
											} else {
												return (
													<SwiperSlide>
														<Box
															key={iIndex}
															sx={{
																height: "350px",
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
													height: "350px",
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
									marginTop: "5px",
									padding: "0 10px",
									display: "flex",
									flexDirection: "column",
								}}>
								{data?.text && data?.mediaContent?.length > 0 && (
									<Typography>{data?.text}</Typography>
								)}
							</Box>
						</Grid>
					</Grid>
					<Grid item container xs={12} md={6}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
						<TabPanel value={value} index={0}>
							<Box
								style={{
									height: "310px",
									width: "440px",
									overflowY: data?.reactions?.length > 5 && "scroll",
									overflowX: "hidden",
								}}>
								<Grid item container xs={12} spacing={2}>
									{data?.reactions &&
										data?.reactions?.length > 0 &&
										data?.reactions?.map((ele, index) => (
											<React.Fragment key={index}>
												<Grid item xs={4}>
													<span
														style={{
															height: "100%",
															width: "100%",
															display: "flex",
															alignItems: "center",
														}}>
														{ele?.user?.username}
													</span>
												</Grid>
												<Grid item xs={8}>
													<img
														src={getEmoji(ele?.reactionType)}
														alt=''
														style={{
															height: "35px",
															width: "35px",
															objectFit: "contain",
														}}
													/>
												</Grid>
											</React.Fragment>
										))}
								</Grid>
							</Box>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Box
								style={{
									height: "310px",
									width: "440px",
									overflowY: data?.reactions?.length > 5 && "scroll",
									overflowX: "hidden",
								}}>
								<Grid container spacing={1}>
									{result &&
										result?.length > 0 &&
										result?.map((ele, index) => (
											<React.Fragment key={index}>
												<Grid item xs={4}>
													<span>{ele?.createdByUser?.username}</span>
												</Grid>
												<Grid item xs={8}>
													<span>{ele?.text}</span>
												</Grid>
											</React.Fragment>
										))}
								</Grid>
							</Box>
						</TabPanel>
					</Grid>
				</Grid>
			</Box>
		</Modal>
	);
}
