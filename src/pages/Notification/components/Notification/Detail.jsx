import React from "react";
import { ArrowBack } from "@mui/icons-material";
import {
	Box,
	Card,
	CircularProgress,
	Container,
	Divider,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { AlertById } from "../../ApiServices/apiServices";
import SwiperComp from "../../../../CustomComponents/SwiperComp";

function NotificationDetail() {
	const params = useParams();
	const navigate = useNavigate();

	const [data, setData] = React.useState("");
	const [imageState, setImageState] = React.useState([]);
	const [videoState, setVideoState] = React.useState([]);
	const [audioState, setAudioState] = React.useState([]);
	const [mediaState, setMediaState] = React.useState([]);

	const DetailApiCall = React.useCallback(() => {
		AlertById(params?.id)
			.then((res) => {
				// console.log("res");
				setData(res);
				if (res?.imageUrl?.length > 0) {
					const images = res?.imageUrl?.map((item) => {
						return {
							src: item,
							mimeType: "image/png",
							type: "image",
						};
					});
					setImageState(images);
					setMediaState((prev) => [...prev, ...images]);
				}
				if (res?.videoUrl?.length > 0) {
					const video = res?.videoUrl?.map((item) => {
						return {
							src: item,
							mimeType: "video/mp4",
							type: "video",
						};
					});
					setVideoState(video);
					setMediaState((prev) => [...prev, ...video]);
				}
				if (res?.audioSrc) {
					setAudioState((prev) => [
						...prev,
						{
							src: res?.audioSrc,
							mimeType: "audio/mp3",
							type: "audio",
						},
					]);
					setMediaState((prev) => [
						...prev,
						{
							src: res?.audioSrc,
							mimeType: "audio/mp3",
							type: "audio",
						},
					]);
				}
			})
			.catch((err) => console.error(err));
	}, [params?.id]);

	React.useEffect(() => {
		DetailApiCall();
	}, [DetailApiCall]);

	if (data) {
		return (
			<Container maxWidth='xl'>
				<Grid item container spacing={2}>
					<Grid item xs={12}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBack color='primary' />
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px", width: "100%", height: "100%" }}>
							<Box>
								<Typography sx={{ fontSize: "22px", fontWeight: 600, color: "gray" }}>
									Notification Information
								</Typography>
								<Box sx={{ marginY: "5px" }}>
									<Divider />
								</Box>
							</Box>
							<Grid item container spacing={2} xs={12}>
								<Grid item xs={8}>
									<Box>
										<Typography sx={{ fontSize: "22px", fontWeight: 600 }}>
											{data?.eventName}
										</Typography>

										{data?.cloudName && <Typography>{data?.cloudName}</Typography>}

										{data?.metaInfo?.address && (
											<Typography>
												<span>
													<b>Address: </b>
												</span>
												{data?.metaInfo?.address}
											</Typography>
										)}
										{data?.createdByUser && (
											<Typography>
												<span>
													<b>Created By: </b>
												</span>
												{data?.createdByUser?.firstName + " " + data?.createdByUser?.lastName}
											</Typography>
										)}
										{data?.metaInfo?.templateName && (
											<Typography>
												<span>
													<b>Template Name: </b>
												</span>
												{data?.metaInfo?.templateName}
											</Typography>
										)}
										{data?.description && (
											<Typography>
												<span>
													<b>Description: </b>
												</span>
												{data?.description}
											</Typography>
										)}
									</Box>
								</Grid>
								{(imageState?.length > 0 || videoState?.length > 0) && (
									<Grid item xs={4}>
										<SwiperComp data={[...imageState, ...videoState, ...audioState]} />
									</Grid>
								)}
							</Grid>
						</Card>
					</Grid>
				</Grid>
			</Container>
		);
	} else {
		return (
			<Box
				sx={{
					width: "100%",
					height: "80vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default NotificationDetail;
