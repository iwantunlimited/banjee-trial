import { Avatar, Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { PaginationContext } from "../../../context/PaginationContext";
import { MainContext } from "../../../context/Context";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";
import { ChatBubbleOutline, Delete, FavoriteBorder, Fullscreen } from "@mui/icons-material";
import FullScreenImageModal from "./FullScreenImageModal";
import moment from "moment";

function FeedCard(props) {
	const navigate = useNavigate();
	const theme = useTheme();
	const { themeData } = React.useContext(MainContext);
	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});

	const { ele, handleFeedPagination, handleDeleteModal, index } = props;

	if (props?.ele) {
		return (
			<React.Fragment>
				<Box
					sx={{
						// paddingX: "14px",
						// paddingBottom: "7px",
						width: "100%",
						// height: "100%",
						// minHeight: "250px",
						boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
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
									handleFeedPagination();
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
											}}>{`${ele?.author?.firstName}`}</span>
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
										<span style={{ fontSize: "12px" }}>{moment(ele?.createdOn).format("lll")}</span>
									)}
								</Typography>
							</Box>
							<IconButton
								onClick={() => {
									// setDFeedData({ feedId: ele.id });
									// setOpenDModal(true);
									handleDeleteModal({ open: true, feedId: ele?.id });
								}}
								style={{ width: "40px", height: "40px" }}>
								<Delete />
							</IconButton>
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
									handleFeedPagination();
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
										} else if (item?.type === "audio" || item?.mimeType === "audio/mpeg") {
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
													<span style={{ textTransform: "none", color: "blue" }}>more</span>
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
								handleFeedPagination();
								navigate("/social-feeds/" + ele?.id);
								// setModal({ open: true, data: ele })
							}}>
							{ele?.text && ele?.mediaContent?.length > 0 ? (
								<Typography noWrap={true}>{ele?.text || <p style={{ height: "16px" }}> </p>}</Typography>
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
					{!props?.groupFeed && (
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
					)}
				</Box>
				{fullScreenState.imageModal && (
					<FullScreenImageModal
						state={fullScreenState}
						handleClose={() => setFullScreenState({ imageModal: false })}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default FeedCard;
