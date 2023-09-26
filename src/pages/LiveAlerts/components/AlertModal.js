import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LiveAlertMap from "./LiveAlertMap";
import { Avatar, Grid } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import moment from "moment";
import { useNavigate } from "react-router";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	height: 550,
	bgcolor: "background.paper",
	border: "2px solid #000",
	borderRadius: "10px",
	boxShadow: 24,
	p: 4,
};
const dummyData = {
	type: "PANIC",
	id: "650c0e33643f8e3f27c3a03f",
	eventCode: "NEW_ALERT",
	eventName: "Alert",
	createdBy: "642a75b7d5d0641c6f3deb97",
	createdByUser: {
		lastName: "Sparrow",
		userName: "jackekek",
		mobile: "1122334455",
		mcc: "+267",
		type: "CUSTOMER",
		authorities: ["ROLE_CUSTOMER"],
		externalReferenceId: "642a75b63ff05177283a7d92",
		firstName: "Jack",
		domain: "208991",
		id: "642a75b7d5d0641c6f3deb97",
		userType: 0,
		email: "jacksparrow@blackpearl.in",
		domainSsid: "208991",
		locale: "eng",
		timeZoneId: "GMT",
		profileImageUrl: null,
		avtarImageUrl: "642a75fecc217c465e3c8a91",
		realm: "banjee",
	},
	createdOn: "2023-09-21T09:34:43.403+00:00",
	sendTo: "CLOUD",
	location: {
		type: "Point",
		coordinates: [72.5015153, 23.0498009],
	},
	audioSrc: null,
	imageUrl: [],
	videoUrl: [],
	description: "Test",
	metaInfo: {
		address:
			"708, Time Square Arcade, Thaltej - Shilaj Rd, Thaltej, Ahmedabad, Gujarat 380059, India",
	},
	anonymous: true,
	deleted: false,
	reportCount: 0,
	confirmIncidenceCount: 0,
	cityId: null,
	cityName: null,
	confirmIncidence: false,
	totalComments: null,
	emergencyUserIds: null,
	cloudId: "6419756145c92819895d361e",
	distance: null,
	date: "2023-09-21T09:34:40.050+00:00",
	startTime: null,
	endTime: null,
	token: "Fire Fir Test Tes",
	title: null,
	stopEmergency: false,
	confirmByUsers: [],
	usersOnWay: [],
	totalUsersOnWay: 0,
	stopTime: null,
};
const useAudio = (url) => {
	const [audio] = useState(new Audio(url));
	const [playing, setPlaying] = useState(false);
	const toggle = () => setPlaying(!playing);

	useEffect(() => {
		audio.muted = false;
		playing
			? audio.play().catch((error) => {
					console.log(error);
			  })
			: audio.pause();
	}, [playing]);

	useEffect(() => {
		audio.addEventListener("ended", () => setPlaying(false));
		return () => {
			audio.removeEventListener("ended", () => setPlaying(false));
		};
	}, []);

	return [playing, toggle];
};

export default function AlertModal({ open, data, handleClose }) {
	// data = dummyData;
	// open = true;
	const navigate = useNavigate();
	const emergencyUrl =
		"https://banjee.s3.eu-central-1.amazonaws.com/root/sound/emergency.mp3";
	const alertUrl =
		"https://banjee.s3.eu-central-1.amazonaws.com/root/sound/alert.mp3";

	const [emergencyAudio, playEmergencyAudio] = useAudio(emergencyUrl);
	const [alertAudio, playAlertAudio] = useAudio(alertUrl);
	console.log("Data==============>", data, open);

	React.useEffect(() => {
		setTimeout(() => {
			if (open && data?.eventCode === "NEW_ALERT") {
				playAlertAudio();
			}
			if (open && data?.eventCode === "PANIC_EMERGENCY") {
				playEmergencyAudio();
			}
		}, 200);
	}, [data]);

	const eventNames = [
		"Suspiciousactivity",
		"Suspicious person",
		"Missing person",
		"Fire",
		"Accident",
		"Roadblock",
		"Water",
		"Electricity",
		"Petmissing/found",
		"Suspiciousvehicle",
		"General",
	];

	const eventName = eventNames.includes(data?.eventName?.replace(/[\s/]/g, ""))
		? data?.eventName.replace(/[\s/]/g, "")
		: "Other";

	const eventIcon = require(`../../../assets/alertIcons/${eventName}.webp`);

	if (data?.eventCode === "NEW_ALERT") {
		return (
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={open}>
					<Box sx={style}>
						<Box
							sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
						>
							<Typography variant="h4">{data?.eventName}</Typography>
							<Avatar
								// src={require(`../../../assets/alertIcons/${data?.eventName.replace(
								// 	/[\s/]/g,
								// 	""
								// )}.webp`)}
								src={eventIcon}
								alt={data?.eventName}
								sx={{
									height: "30px",
									width: "30px",
									marginLeft: "5px",
									borderRadius: "0px",
								}}
							/>
						</Box>
						<Grid
							container
							sx={{ display: "flex", alignItems: "center" }}
						>
							<Grid
								item
								md={1}
							>
								<Avatar
									src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${data?.createdBy}`}
									alt={data?.eventName}
									variant="circular"
									sx={{ height: "50px", width: "50px" }}
								/>
							</Grid>
							<Grid
								item
								sx={{ marginLeft: 2 }}
								md={7}
							>
								<Typography sx={{ fontSize: "22px" }}>
									{data?.createdByUser?.firstName}
								</Typography>
							</Grid>
							<Grid
								item
								md={3}
							>
								<Button
									color="secondary"
									variant="outlined"
									onClick={() => {
										navigate("/banjee-alert/" + data?.id);
										handleClose();
									}}
								>
									View Alert
								</Button>
							</Grid>
						</Grid>
						<Box sx={{ mt: 2 }}>
							<Grid container>
								<Grid
									item
									md={12}
								>
									<Typography
										id="transition-modal-title"
										component="h6"
									>
										<span style={{ fontWeight: "bold" }}>Description: </span>
										{data?.description}
									</Typography>
								</Grid>
								<Grid
									item
									md={12}
									sx={{ mt: 1 }}
								>
									<span style={{ fontWeight: "bold" }}>Created On: </span>
									{moment(data?.createdOn).format("LLL")}
								</Grid>
							</Grid>
							<Typography
								id="transition-modal-description"
								sx={{ mt: 1 }}
							>
								<LocationOnIcon
									fontSize="small"
									sx={{ ml: 0 }}
								/>
								{data?.metaInfo?.address}
							</Typography>
						</Box>
						<Box sx={{ height: "250px", mt: 1 }}>
							<LiveAlertMap
								openModal={false}
								data={{
									lat: data?.location?.coordinates[1],
									lng: data?.location?.coordinates[0],
								}}
							/>
						</Box>
					</Box>
				</Fade>
			</Modal>
		);
	} else if (data?.eventCode === "PANIC_EMERGENCY") {
		return (
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={open}>
					<Box sx={style}>
						<Box
							sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
						>
							<Typography variant="h4">
								<strong>{data?.eventName}</strong>
							</Typography>
						</Box>

						<Grid container>
							<Grid
								item
								md={3}
								sm={3}
								xs={3}
							>
								<Avatar
									src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${data?.createdBy}`}
									alt={data?.eventName}
									variant="circular"
									sx={{ height: "100px", width: "100px" }}
								/>
							</Grid>
							<Grid
								item
								md={9}
								sm={9}
								xs={9}
								mt={1}
							>
								<Grid container>
									<Grid
										item
										md={6}
										xs={6}
										sm={6}
									>
										<Typography sx={{ fontSize: "22px" }}>
											{data?.createdByUser?.firstName}
										</Typography>
									</Grid>
									<Grid
										md={6}
										sm={6}
										xs={6}
									>
										<Button
											color="secondary"
											variant="outlined"
											sx={{ float: "right" }}
											onClick={() => {
												navigate("/banjee-alert/" + data?.id);
												handleClose();
											}}
										>
											View Panic
										</Button>
									</Grid>
								</Grid>
								<Typography
									id="transition-modal-title"
									component="h6"
								>
									<span style={{ fontWeight: "bold" }}>Description: </span>
									{data?.description?.length > 0
										? data?.description
										: "No Discription Added"}
								</Typography>
								<Typography
									id="transition-modal-title"
									component="h6"
								>
									<span style={{ fontWeight: "bold" }}>Created On: </span>
									{moment(data?.createdOn).format("LLL")}
								</Typography>
							</Grid>
						</Grid>

						<Grid
							container
							sx={{ display: "flex", alignItems: "center" }}
						>
							<Grid
								item
								sx={{ marginLeft: 2 }}
								md={12}
								sm={12}
								xs={12}
							>
								<Box sx={{ mt: 2 }}>
									<Typography
										id="transition-modal-description"
										sx={{ mt: 1 }}
									>
										<LocationOnIcon
											fontSize="small"
											sx={{ ml: 0 }}
										/>
										{data?.metaInfo?.address}
									</Typography>
								</Box>
							</Grid>
						</Grid>
						<Box sx={{ height: "250px", mt: 1, mb: 1 }}>
							<LiveAlertMap
								openModal={false}
								data={{
									lat: data?.location?.coordinates[1],
									lng: data?.location?.coordinates[0],
								}}
							/>
						</Box>
					</Box>
				</Fade>
			</Modal>
		);
	} else {
		return <></>;
	}
}
