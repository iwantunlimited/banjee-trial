import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";
import FullScreenImageModal from "../pages/Social_Feeds/Components/FullScreenImageModal";
import { Avatar, Box, CircularProgress, IconButton, Typography, useTheme } from "@mui/material";
import { AccessTime, Fullscreen } from "@mui/icons-material";
import "./style.css";
import { convertTime } from "./ConvertTime";
import { useContext } from "react";
import { MainContext } from "../context/Context";

function SwiperComp({ data }) {
	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});
	const { themeData } = useContext(MainContext);
	const theme = useTheme();
	const [collabVisible, setCollabVisible] = React.useState([]);
	console.log("====================================");
	console.log("collabVisible compo", collabVisible);

	console.log("====================================");

	function CollaborateItem(data, index) {
		if (data?.mediaContent) {
			if (collabVisible?.includes(index)) {
				return null;
			} else {
				return (
					<Box
						sx={{
							paddingY: { xs: "5px", md: "10px" },
							paddingX: { xs: "10px", md: "20px" },
							borderRadius: "10px",
							background: "rgba(0,0,0,0.5)",
							position: "absolute",
							bottom: 0,
							left: 0,
							marginX: "10px",
							width: "-webkit-fill-available",
							color: "white",
						}}>
						<Box
							sx={{
								// width: "fit-content",
								flexDirection: "column",
								display: "flex",
								justifyContent: "center",
							}}>
							<Avatar
								alt={data?.user?.firstName}
								// src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${ele?.author?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
								src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${data?.user?.systemUserId}`}
								style={{
									height: "40px",
									width: "40px",
									objectFit: "contain",
									borderRadius: "50%",
									// marginRight: "20px",
									marginTop: "-30px",
									// alignSelf: "center",
									border: "0.5px solid black",
									marginBottom: "5px",
								}}
							/>
							<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
								<Typography>{data?.user?.firstName}</Typography>
								<Box sx={{ flexDirection: "row", display: "flex", alignItems: "center" }}>
									<AccessTime
										sx={{
											color: themeData ? "#A6A6A6" : "rgba(255,255,255,0.8)",
											fontSize: { xs: "14px", md: "16px", lg: "18px" },
											marginRight: "5px",
										}}
									/>
									<Typography
										sx={{
											fontSize: { xs: "10px", md: "12px", lg: "14px" },
											color: themeData ? "#A6A6A6" : "rgba(255,255,255,0.8)",
										}}>
										{convertTime(data?.createdOn)}
									</Typography>
								</Box>
							</Box>
						</Box>
						<Typography lineHeight={2}>{data?.text}</Typography>
					</Box>
				);
			}
		} else {
			return null;
		}
	}

	if (data?.length > 0) {
		return (
			<React.Fragment>
				<Swiper
					pagination={
						data?.length > 1
							? {
									type: "fraction",
							  }
							: false
					}
					modules={[Pagination]}
					className='mySwiper'>
					{data?.map((item, iIndex) => {
						if (item?.type === "video" || item?.mimeType?.startsWith("video")) {
							return (
								<SwiperSlide>
									<Box
										onClick={() =>
											setCollabVisible((prev) => {
												if (prev?.includes(item?.src)) {
													if (collabVisible?.length === 1) {
														setCollabVisible([]);
													} else {
														setCollabVisible((prev) => prev?.filter((ele, index) => ele !== item?.src));
													}
												} else {
													if (collabVisible?.length === 0) {
														setCollabVisible([item?.src]);
													} else {
														setCollabVisible((prev) => [...prev, item?.src]);
													}
												}
											})
										}
										key={iIndex}
										sx={{
											height: "400px",
											width: "100%",
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
										{data?.length > 1 && iIndex + 1 + "/" + data?.length}
									</Box> */}
										<video width='100%' height='100%' id={`video${iIndex}`} controls>
											<source
												src={`https://res.cloudinary.com/banjee/video/upload/br_128,q_auto/v1/${item?.src}.mp4`}
												type='video/mp4'
											/>
											Your browser does not support HTML video.
										</video>
										{CollaborateItem(item, item?.src)}
									</Box>
								</SwiperSlide>
							);
						} else if (item?.type === "audio" || item?.mimeType?.startsWith("audio")) {
							return (
								<SwiperSlide>
									<Box
										onClick={() =>
											setCollabVisible((prev) => {
												if (prev?.includes(item?.src)) {
													if (collabVisible?.length === 1) {
														setCollabVisible([]);
													} else {
														setCollabVisible((prev) => prev?.filter((ele, index) => ele !== item?.src));
													}
												} else {
													if (collabVisible?.length === 0) {
														setCollabVisible([item?.src]);
													} else {
														setCollabVisible((prev) => [...prev, item?.src]);
													}
												}
											})
										}
										key={iIndex}
										sx={{
											height: "400px",
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
										{data?.length > 1 && iIndex + 1 + "/" + data?.length}
									</Box> */}
										<audio width='100%' height='200px' id={`video${iIndex}`} controls>
											<source
												src={`https://res.cloudinary.com/banjee/video/upload/br_128,q_auto/v1/${item?.src}.mp4`}
												type='video/mp4'
											/>
											Your browser does not support HTML video.
										</audio>
										{CollaborateItem(item, item?.src)}
									</Box>
								</SwiperSlide>
							);
						} else if (item?.type === "image" || item?.mimeType?.startsWith("image")) {
							return (
								<Box key={iIndex}>
									<SwiperSlide>
										<Box
											onClick={() =>
												setCollabVisible((prev) => {
													if (prev?.includes(item?.src)) {
														if (collabVisible?.length === 1) {
															setCollabVisible([]);
														} else {
															setCollabVisible((prev) => prev?.filter((ele, index) => ele !== item?.src));
														}
													} else {
														if (collabVisible?.length === 0) {
															setCollabVisible([item?.src]);
														} else {
															setCollabVisible((prev) => [...prev, item?.src]);
														}
													}
												})
											}
											sx={{
												position: "relative",
												height: "400px",
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
												loading='eager'
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
											{CollaborateItem(item, item?.src)}
										</Box>
									</SwiperSlide>
								</Box>
							);
						} else {
							return (
								<SwiperSlide>
									<Box
										finalData
										key={iIndex}
										sx={{
											// height: "400px",
											width: "100%",
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
										{data?.length > 1 && iIndex + 1 + "/" + data?.length}
									</Box> */}
										<Typography>{item?.text}</Typography>
									</Box>
								</SwiperSlide>
							);
						}
					})}
				</Swiper>
				{fullScreenState.imageModal && (
					<FullScreenImageModal
						state={fullScreenState}
						handleClose={() => setFullScreenState({ imageModal: false })}
					/>
				)}
			</React.Fragment>
		);
	} else {
		return (
			<Box
				sx={{
					width: "100%",
					height: "50vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default SwiperComp;
