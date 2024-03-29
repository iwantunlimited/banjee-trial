import { Avatar, Box, Card, Grid, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { PaginationContext } from "../../../context/PaginationContext";
import { MainContext } from "../../../context/Context";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";
import { ChatBubbleOutline, Delete, FavoriteBorder, Fullscreen, Group } from "@mui/icons-material";
import FullScreenImageModal from "./FullScreenImageModal";
import moment from "moment";
import "../SocialFeed.css";

function FeedCard(props) {
	const navigate = useNavigate();
	const theme = useTheme();
	const { themeData } = React.useContext(MainContext);
	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});
	const [collabVisible, setCollabVisible] = React.useState(true);

	const {
		data: { author, mainMedia, collaborate, pageName, text },
		ele,
		handleDeleteModal,
		index,
	} = props;

	function CollaborateItem(data) {
		if (data?.mediaContent) {
			return (
				<Box
					sx={{
						padding: { xs: "5px", md: "10px" },
						borderRadius: "10px",
						background: "rgba(0,0,0,0.5)",
						position: "absolute",
						bottom: 0,
						left: 0,
						margin: "10px",
						width: "-webkit-fill-available",
						display: collabVisible ? "flex" : "none",
						flexDirection: "row",
						alignItems: "center",
						color: "white",
					}}>
					<Avatar
						alt={data?.user?.firstName}
						// src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${ele?.author?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${data?.user?.systemUserId}`}
						sx={{
							height: { xs: "20px", md: "30px" },
							width: { xs: "20px", md: "30px" },
							objectFit: "contain",
							borderRadius: "50%",
							marginRight: "20px",
						}}
					/>
					<Typography lineHeight={2} noWrap sx={{ fontSize: { xs: "10px", sm: "12px", md: "14px" } }}>
						{data?.text}
					</Typography>
				</Box>
			);
		} else {
			return null;
		}
	}

	if (props?.ele) {
		// const mainMedia =
		// 	ele?.collaboration && ele?.collaborateFeeds?.length > 0
		// 		? [
		// 				...ele?.mediaContent,
		// 				...ele?.collaborateFeeds?.map((item) => ({
		// 					...item,
		// 					...item?.mediaContent,
		// 				})),
		// 		  ]
		// 		: ele?.mediaContent;

		return (
			<React.Fragment>
				<Card
					// onClick={() => {
					// 	navigate("/social-feeds/" + ele?.id);
					// 	// setModal({ open: true, data: ele });
					// }}
					sx={{
						// paddingX: "14px",
						// paddingBottom: "7px",
						position: "relative",
						width: "100%",
						height: "100%",
						// minHeight: "250px",
						boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
						borderRadius: "8px",
						background: themeData === false ? "#FFF" : "default",
						cursor: "pointer",
						"&:hover": {
							background: themeData === false ? theme.palette.grey.A700 : "#323232",
						},
						paddingBottom: "22px",
					}}>
					<Box
						sx={{
							paddingX: "14px",
							width: "100%",
							height: "100%",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						}}>
						<Box
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<Box
								onClick={() => {
									if (props?.reported) {
										navigate("/social-feeds/" + ele?.feed?.id, {
											state: { reported: true, collaborateId: ele?.collaborateId },
										});
									} else {
										navigate("/social-feeds/" + ele?.id);
									}
									// setModal({ open: true, data: ele });
								}}
								style={{
									display: "flex",
									alignItems: "center",
									paddingLeft: "10px",
								}}>
								<Avatar
									alt={author?.userName}
									// src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${ele?.author?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
									src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${author?.id}`}
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
									{author?.firstName ? (
										<span
											style={{
												display: "-webkit-box",
												overflow: "hidden",
												WebkitBoxOrient: "vertical",
												WebkitLineClamp: 1,
											}}>{`${author?.firstName}`}</span>
									) : (
										<span
											style={{
												display: "-webkit-box",
												overflow: "hidden",
												WebkitBoxOrient: "vertical",
												WebkitLineClamp: 1,
											}}>
											{author?.username ? author?.username : "username"}
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
									if (props?.reported) {
										handleDeleteModal({
											open: true,
											feedId: ele?.feedId,
											collaborateId: ele?.collaborateId ? ele?.collaborateId : null,
											report: true,
											pageId: ele?.feed?.pageId,
											pageName: ele?.feed?.pageName,
											authorName: author?.firstName,
											authorId: author?.id,
										});
									} else {
										handleDeleteModal({
											open: true,
											feedId: ele?.id,
											report: false,
											pageId: ele?.feed?.pageId,
											pageName: ele?.feed?.pageName,
											authorName: author?.firstName,
											authorId: author?.id,
										});
									}
								}}
								style={{ width: "40px", height: "40px" }}>
								<Delete />
							</IconButton>
						</Box>

						<Box
							sx={{ marginY: "10px", height: "200px", position: "relative" }}
							// onClick={() => setModal({ open: true, data: ele })}
						>
							{/* swiper for media */}
							<Swiper
								onClick={() => {
									if (props?.reported) {
										navigate("/social-feeds/" + ele?.feed?.id, {
											state: { reported: true, collaborateId: ele?.collaborateId },
										});
									} else {
										navigate("/social-feeds/" + ele?.id);
									} // setModal({ open: true, data: ele });
								}}
								pagination={
									mainMedia?.length > 1
										? {
												type: "fraction",
										  }
										: false
								}
								modules={[Pagination]}
								className='mySwiper'
								style={{ position: "relative", width: "100%" }}>
								{mainMedia?.length > 0 ? (
									mainMedia?.map((item, iIndex) => {
										if (item?.type === "video" || item?.mimeType?.startsWith("video")) {
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
														{CollaborateItem(item)}
													</Box>
												</SwiperSlide>
											);
										} else if (item?.type === "audio" || item?.mimeType?.startsWith("audio")) {
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
														{CollaborateItem(item)}
													</Box>
												</SwiperSlide>
											);
										} else if (item?.type === "image" || item?.mimeType?.startsWith("image")) {
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

															{CollaborateItem(item)}
														</Box>
													</SwiperSlide>
												</Box>
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
												justifyContent: text?.length > 200 ? "left" : "center",
												alignItems: "center",
												// textAlign: "center",
											}}>
											{text?.length > 200 ? (
												<Typography>
													{text?.slice(0, 200) + "... "}
													<span style={{ textTransform: "none", color: "blue" }}>more</span>
												</Typography>
											) : (
												<Typography
													sx={{
														display: "-webkit-box",
														WebkitLineClamp: "3",
														WebkitBoxOrient: "vertical",
														overflow: "hidden",
														textOverflow: "ellipsis",
													}}>
													{text}
												</Typography>
											)}
											{/* <Typography
												style={{
													display: "-webkit-box",
													WebkitLineClamp: "3",
													WebkitBoxOrient: "vertical",
													overflow: "hidden",
													textOverflow: "ellipsis",
												}}>
												{ele?.text}
											</Typography> */}
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
								if (props?.reported) {
									navigate("/social-feeds/" + ele?.feed?.id, {
										state: { reported: true, collaborateId: ele?.collaborateId },
									});
								} else {
									navigate("/social-feeds/" + ele?.id);
								} // setModal({ open: true, data: ele })
							}}>
							{text && mainMedia?.length > 0 ? (
								<Typography noWrap={true}>{text || <p style={{ height: "16px" }}> </p>}</Typography>
							) : (
								<Box style={{ height: "24px" }}></Box>
							)}
							<Box sx={{ display: "flex", paddingTop: "20px", paddingBottom: "10px" }}>
								<Box style={{ display: "flex", alignItems: "center" }}>
									<FavoriteBorder />
									<span style={{ marginLeft: "5px" }}>
										{props?.reported
											? ele?.feed?.totalReactions
											: ele?.totalReactions || ele?.reactions?.length || 0}
									</span>
								</Box>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										marginLeft: "20px",
									}}>
									<ChatBubbleOutline />
									<span style={{ marginLeft: "5px" }}>
										{props?.reported ? ele?.feed?.totalComments : ele?.totalComments || 0}
									</span>
								</Box>
								{!props?.reported && ele?.collaborateFeeds?.length > 0 ? (
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											marginLeft: "20px",
										}}>
										<Group />
										<span style={{ marginLeft: "5px" }}>{ele?.collaborateFeeds?.length}</span>
									</Box>
								) : null}
								{props?.reported && ele?.feed?.collaborateFeeds?.length > 0 ? (
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											marginLeft: "20px",
										}}>
										<Group />
										<span style={{ marginLeft: "5px" }}>{ele?.feed?.collaborateFeeds?.length}</span>
									</Box>
								) : null}
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
							height: "22px",
						}}>
						<Typography
							sx={{
								fontSize: { xs: "14px", md: "14px", lg: "14px" },
								display: "-webkit-box",
								overflow: "hidden",
								WebkitBoxOrient: "vertical",
								WebkitLineClamp: 1,
								textAlign: "center",
								paddingX: { xs: 1, md: 2 },
							}}>
							{pageName}
						</Typography>
					</Box>
				</Card>

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
