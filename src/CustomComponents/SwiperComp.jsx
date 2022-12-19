import React from "react";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";
import FullScreenImageModal from "../pages/Social_Feeds/Components/FullScreenImageModal";
import { Box, IconButton, Typography } from "@mui/material";
import { Fullscreen } from "@mui/icons-material";
import "./style.css";

function SwiperComp({ data }) {
	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});
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
					if (item?.mimeType === "video/mp4") {
						return (
							<SwiperSlide>
								<Box
									key={iIndex}
									sx={{
										height: "400px",
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
										{data?.length > 1 && iIndex + 1 + "/" + data?.length}
									</Box>
									<video width='100%' height='100%' id={`video${iIndex}`} controls>
										<source
											src={`https://res.cloudinary.com/banjee/video/upload/br_128,q_auto/v1/${item?.src}.mp4`}
											type='video/mp4'
										/>
										Your browser does not support HTML video.
									</video>
								</Box>
							</SwiperSlide>
						);
					} else if (item?.mimeType === "audio/mp3" || item?.mimeType === "audio/mpeg") {
						return (
							<SwiperSlide>
								<Box
									key={iIndex}
									sx={{
										height: "400px",
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
										{data?.length > 1 && iIndex + 1 + "/" + data?.length}
									</Box>
									<audio width='100%' height='200px' id={`video${iIndex}`} controls>
										<source
											src={`https://res.cloudinary.com/banjee/video/upload/br_128,q_auto/v1/${item?.src}.mp4`}
											type='video/mp4'
										/>
										Your browser does not support HTML video.
									</audio>
								</Box>
							</SwiperSlide>
						);
					} else if (item?.mimeType === "image/jpg" || item?.mimeType === "image/png") {
						return (
							<Box key={iIndex}>
								<SwiperSlide>
									<Box
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
											loading='lazy'
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
					} else {
						return (
							<SwiperSlide>
								<Box
									key={iIndex}
									sx={{
										height: "400px",
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
										{data?.length > 1 && iIndex + 1 + "/" + data?.length}
									</Box>
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
}

export default SwiperComp;
