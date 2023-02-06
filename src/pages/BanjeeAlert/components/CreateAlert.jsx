import React from "react";
import {
	Card,
	Container,
	Grid,
	Typography,
	Box,
	TextField,
	Button,
	MenuItem,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	CircularProgress,
	Chip,
	Paper,
	RadioGroup,
	FormLabel,
	FormControlLabel,
	Radio,
} from "@mui/material";
// import "../../../Explore/business.css";
import { ArrowBack, Cancel, Done } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { createAlert } from "../api-services/apiServices";
import axios from "axios";
import { MainContext } from "../../../context/Context";
import SnackbarContext from "../../../CustomComponents/SnackbarContext";
import "../alert.css";
import Compressor from "compressorjs";
import MyGoogleMap from "../../Neighbourhoods/Map/GoogleMap";
import { v4 as uuidv4 } from "uuid";
import SuspiciousVehicle from "../../../assets/alerticonset/SuspiciusVehicle.png";
import SuspiciousPerson from "../../../assets/alerticonset/SuspiciusPerson.png";
import HouseBreakIn from "../../../assets/alerticonset/HouseBreak-In.png";
import CarVandalism from "../../../assets/alerticonset/CarVandalism.png";
import TheftRobbery from "../../../assets/alerticonset/Theft-Robbery.png";
import ViolenceAssault from "../../../assets/alerticonset/Violence-Assault.png";
import HitRun from "../../../assets/alerticonset/Hit&Run.png";
import SuspiciousActivity from "../../../assets/alerticonset/SuspiciusActivity.png";
import PoliceRoadblock from "../../../assets/alerticonset/PoliceRoadblock.png";
import fire from "../../../assets/alerticonset/fire.png";
import thunder from "../../../assets/alerticonset/thunder.png";
import pawprint from "../../../assets/alerticonset/pawprint.png";
import edit from "../../../assets/alerticonset/edit.png";
import NewGoogleMap from "../../Neighbourhoods/Map/NewGoogleMap";
import GoogleMapCustom from "../../../CustomComponents/GoogleMap";

const eventData = [
	{
		icon: "tow-truck",
		img: SuspiciousVehicle,
		name: "Suspicious Vehicle",
		select: false,
	},
	{
		icon: "person",
		img: SuspiciousPerson,
		name: "Suspicious Person",
		select: false,
	},
	{
		icon: "pets",
		img: pawprint,
		name: "Lost / Found Pet",
		select: false,
	},
	{
		icon: "robber",
		img: HouseBreakIn,
		name: "House Break-In",
		select: false,
	},
	{
		icon: "car",
		img: CarVandalism,
		name: "Car Vandalism",
		select: false,
	},
	{
		icon: "sound",
		img: TheftRobbery,
		name: "Theft/Robbery",
		select: false,
	},
	{
		icon: "car",
		img: ViolenceAssault,
		name: "Violence/Assault",
		select: false,
	},
	{
		icon: "car",
		img: HitRun,
		name: "Hit & Run",
		select: false,
	},
	{
		icon: "local-activity",
		img: SuspiciousActivity,
		name: "Suspicious Activity",
		select: false,
	},
	{
		icon: "road",
		img: PoliceRoadblock,
		name: "Police Roadblock",
		select: false,
	},
	{
		icon: "fire",
		img: fire,
		name: "Fire",
		select: false,
	},
	{
		icon: "lightning-bolt",
		img: thunder,
		name: "Power Cut",
		select: false,
	},
	{
		icon: "others",
		img: edit,
		name: "Others",
		select: false,
	},
];

function CreateAlert() {
	const context = React.useContext(MainContext);

	const { setModalOpen, setModalData, setNotificationPopup, themeData, locationData } = context;
	const navigate = useNavigate();
	const [submitForm, setSubmitForm] = React.useState(false);
	const [imageUploaded, setImageUploaded] = React.useState(false);
	const [eventTitle, setEventTitle] = React.useState("");

	const [data, setData] = React.useState({
		anonymous: false,
		eventCode: "NEW_ALERT",
		cityName: "",
		eventName: null,
		description: "",
		imageUrl: [],
		videoUrl: [],
		metaInfo: {
			address: "",
		},
		sendTo: "TO_NEARBY",
		location: {
			coordinates: [0, 0],
			type: "Point",
		},
	});

	const [imgShow, setImgShow] = React.useState([]);

	const CreateAlertApiCall = React.useCallback((payloadData) => {
		createAlert(payloadData)
			.then((res) => {
				setNotificationPopup({ open: true, message: "Alert Created Successfully" });
				navigate("/banjee-alert");
				setData({
					anonymous: false,
					eventCode: "NEW_ALERT",
					cityName: "",
					eventName: "",
					description: "",
					imageUrl: [],
					videoUrl: [],
					metaInfo: {
						address: "",
					},
					sendTo: "TO_NEARBY",
					location: {
						coordinates: [0, 0],
						type: "Point",
					},
				});
				setTimeout(() => {
					setNotificationPopup({ open: false, message: "" });
				}, [2000]);
			})
			.catch((err) => console.error(err));
	}, []);

	const handleImageChange = (event) => {
		if (event?.target?.files?.length > 0) {
			for (let index = 0; index < event?.target?.files?.length; index++) {
				const image = event.target.files[index];
				console.log("====================================");
				console.log("image height", image?.size);
				console.log("====================================");
				const imageSize = event.target.files[index]?.size * 0.000001;
				const inputType = image.type.split("/")?.[0];
				if (inputType === "image") {
					var reader = new FileReader();

					//Read the contents of Image File.
					reader.readAsDataURL(image);
					reader.onload = function (e) {
						//Initiate the JavaScript Image object.
						var imageReader = new Image();

						//Set the Base64 string return from FileReader as source.
						imageReader.src = e.target.result;

						//Validate the File Height and Width.
						imageReader.onload = function () {
							var height = this.height;
							var width = this.width;
							if (height > 1024 || width > 1024 || imageSize > 1) {
								if (imageSize > 1) {
									setModalOpen(true);
									setModalData("Size of image is not greater than 1MB", "error");

									document.getElementById("img").value = "";
									return false;
								} else {
									setModalOpen(true);
									setModalData("Height and Width must not exceed 1024px.", "error");

									document.getElementById("img").value = "";
									return false;
								}
								// window.alert("Height and Width must not exceed 1024px.");
							} else {
								new Compressor(image, {
									quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
									convertTypes: ["image/png"],
									success: (compressedResult) => {
										// compressedResult has the compressed file.
										// Use the compressed file to upload the images to your server.
										// setImages(compressedResult);
										// setImgShow(URL.createObjectURL(compressedResult));
										setImgShow((prev) => [
											...prev,
											{
												type: inputType,
												data: URL.createObjectURL(compressedResult),
												id: uuidv4(),
												src: compressedResult,
												loader: false,
												done: false,
											},
										]);
									},
									error: (error) => {
										window.alert(error);
									},
								});
							}

							return true;
						};
					};
				} else {
					setImgShow((prev) => [
						...prev,
						{
							type: inputType,
							data: URL.createObjectURL(image),
							id: uuidv4(),
							src: image,
							loader: false,
							done: false,
						},
					]);
				}
			}
		} else {
			const image = event.target.files[0];
			const inputType = image.type.split("/")?.[0];
			if (inputType === "image") {
				new Compressor(image, {
					quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
					convertTypes: inputType === "video" ? ["video/mp4"] : ["image/png"],
					success: (compressedResult) => {
						setImgShow((prev) => [
							...prev,
							{
								type: inputType,
								data: URL.createObjectURL(compressedResult),
								id: uuidv4(),
								loader: false,
								done: false,
							},
						]);
					},
				});
			} else {
				setImgShow((prev) => [
					...prev,
					{
						type: inputType,
						data: URL.createObjectURL(image),
						id: uuidv4(),
						loader: false,
						done: false,
					},
				]);
			}
		}
	};

	const ImageApiCAll = React.useCallback((data, dataType, notifyMessage) => {
		if (dataType === "video") {
			const mime = "video";
			const formData = new FormData();

			// formData.append("directoryId", "root");

			formData.append("cloud_name", "banjee");
			formData.append("upload_preset", "notification_image");
			formData.append("file", data?.src);
			// { headers: { "Content-Type": "multipart/form-data" }

			const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload/`;

			axios
				.post(url, formData)
				.then((res) => {
					if (notifyMessage === "Images Uploaded") {
						setImageUploaded(true);
						setModalOpen(true);
						setModalData("Image Uploaded", "success");
						setSubmitForm(true);
					}
					setData((prev) => ({
						...prev,
						// imageUrl: res?.data?.data[0]?.data?.id,
						videoUrl: [...prev.videoUrl, res?.data?.public_id],
					}));
					setImgShow((prev) => {
						return prev.map((item) => {
							if (item?.id === data?.id) {
								return {
									...item,
									loader: false,
									done: true,
								};
							} else {
								return item;
							}
						});
					});
				})
				.catch((err) => console.error(err));
		} else {
			const mime = "image";
			const formData = new FormData();

			// formData.append("directoryId", "root");

			formData.append("cloud_name", "banjee");
			formData.append("upload_preset", "notification_image");
			formData.append("file", data.src);
			// { headers: { "Content-Type": "multipart/form-data" }

			const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

			axios
				.post(url, formData)
				.then((res) => {
					if (notifyMessage === "Images Uploaded") {
						setImageUploaded(true);
						setModalOpen(true);
						setModalData("Image Uploaded", "success");
						setSubmitForm(true);
					}
					setData((prev) => ({
						...prev,
						// imageUrl: res?.data?.data[0]?.data?.id,
						imageUrl: [...prev.imageUrl, res?.data?.public_id],
					}));
					setImgShow((prev) => {
						return prev.map((item) => {
							if (item?.id === data?.id) {
								return {
									...item,
									loader: false,
									done: true,
								};
							} else {
								return item;
							}
						});
					});
				})
				.catch((err) => console.error(err));
		}
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		// document.getElementById("form-id").onkeydown = function (e) {
		// 	console.log("e", e);
		// 	var key = e.charCode || e.keyCode || 0;
		// 	if (key == 13) {
		// 		e.preventDefault();
		// 		return false;
		// 	} else {
		// 		e.preventDefault();
		// 	}
		// };
		if (imgShow?.length > 0 && submitForm === false) {
			window.alert("Please upload the selected image first");
		} else {
			if (data?.cityName === "") {
				CreateAlertApiCall({
					...data,
					location: {
						coordinates: [locationData?.lng, locationData?.lat],
						type: "Point",
					},
					cityName: locationData?.address,
				});
			} else {
				if (data?.eventName === "Others") {
					CreateAlertApiCall({
						...data,
						title: eventTitle,
						cityName: locationData?.address,
						location: {
							coordinates: [locationData?.lng, locationData?.lat],
							type: "Point",
						},
					});
				} else {
					CreateAlertApiCall({
						...data,
						cityName: locationData?.address,
						location: {
							coordinates: [locationData?.lng, locationData?.lat],
							type: "Point",
						},
					});
				}
			}
		}
	};

	// console.log("====================================");
	// console.log("locationData", locationData);
	// console.log("====================================");
	// console.log("====================================");
	// console.log("data", data);
	// console.log("====================================");
	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	if (data) {
		return (
			<Container maxWidth='xl'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBack color='primary' />
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "20px" }}>
							<Typography
								sx={{ fontSize: "22px", color: themeData ? "default" : "#666", fontWeight: 500 }}>
								Create Alert
							</Typography>
						</Card>
					</Grid>

					<Grid item xs={12}>
						<Card sx={{ padding: "20px" }}>
							<form id='form-id' onSubmit={handleSubmit}>
								<Grid item container xs={12} spacing={2}>
									{/* <Grid item xs={12}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>Select Event</InputLabel>
											<Select
												required
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='templateId'
												label='Select Template'
												value={data?.eventName}
												onChange={(event, data) => {
													setData((prev) => ({
														...prev,
														eventName: event.target?.value,
													}));
												}}>
												{eventData &&
													eventData?.map((item, index) => {
														return (
															<MenuItem key={index} value={item?.name}>
																<IconButton sx={{ marginRight: "20px" }}>
																	<img
																		src={item?.img}
																		alt={item?.icon}
																		style={{ width: "25px", height: "25px", objectFit: "contain" }}
																	/>
																</IconButton>
																{item?.name}
															</MenuItem>
														);
													})}
											</Select>
										</FormControl>
									</Grid> */}
									<Grid item xs={12}>
										<FormControl fullWidth required>
											<FormLabel id='event-radios'>Select Event</FormLabel>
											<RadioGroup
												aria-labelledby='event-radios'
												name='event-radios'
												value={data?.eventName}
												onChange={(event) => {
													setData((prev) => ({
														...prev,
														eventName: event.target.value,
													}));
												}}>
												<Grid item container xs={12} spacing={0.5}>
													{eventData?.map((item, index) => {
														return (
															<Grid item xs={6} sm={4} md={4} lg={4} xl={2}>
																<FormControlLabel
																	sx={{ width: "100% !important" }}
																	value={item?.name}
																	control={
																		<Radio
																			required
																			className='radio-button-icon'
																			disableRipple
																			color='default'
																			checkedIcon={
																				<Paper
																					sx={{
																						background: themeData
																							? "rgb(209 209 209 / 44%)"
																							: "#e1e1e1",
																						borderRadius: "10px",
																						padding: "10px",
																						display: "flex",
																						justifyContent: "center",
																						alignItems: "center",
																						flexDirection: "column",
																						textAlign: "center",
																						width: "100%",
																						height: "100%",
																					}}>
																					<Box
																						sx={{
																							width: {
																								xs: "20px",
																								sm: "20px",
																								md: "25px",
																								lg: "35px",
																							},
																							height: {
																								xs: "20px",
																								sm: "20px",
																								md: "25px",
																								lg: "35px",
																							},
																						}}>
																						<img
																							src={item?.img}
																							alt={item?.icon}
																							style={{
																								width: "100%",
																								height: "100%",
																								objectFit: "contain",
																							}}
																						/>
																					</Box>
																					<Typography
																						sx={{
																							marginTop: "5px",
																							fontSize: {
																								xs: "10px",
																								sm: "11px",
																								md: "12px",
																								lg: "14px",
																							},
																						}}>
																						{item?.name}
																					</Typography>
																				</Paper>
																			}
																			icon={
																				<Paper
																					sx={{
																						background: themeData
																							? "rgba(255, 255, 255, 0.08)"
																							: "white",
																						borderRadius: "10px",
																						padding: "10px",
																						display: "flex",
																						justifyContent: "center",
																						alignItems: "center",
																						flexDirection: "column",
																						textAlign: "center",
																						width: "100%",
																						height: "100%",
																					}}>
																					<Box
																						sx={{
																							width: {
																								xs: "20px",
																								sm: "20px",
																								md: "25px",
																								lg: "35px",
																							},
																							height: {
																								xs: "20px",
																								sm: "20px",
																								md: "25px",
																								lg: "35px",
																							},
																						}}>
																						<img
																							src={item?.img}
																							alt={item?.icon}
																							style={{
																								width: "100%",
																								height: "100%",
																								objectFit: "contain",
																							}}
																						/>
																					</Box>
																					<Typography
																						sx={{
																							marginTop: "5px",
																							fontSize: {
																								xs: "10px",
																								sm: "11px",
																								md: "12px",
																								lg: "14px",
																							},
																						}}>
																						{item?.name}
																					</Typography>
																				</Paper>
																			}
																		/>
																	}
																	label=''
																/>
															</Grid>
														);
													})}
												</Grid>
											</RadioGroup>
										</FormControl>
									</Grid>
									{data?.eventName === "Others" && (
										<Grid item xs={12}>
											<TextField
												required
												className='neighbourhood-form-textField'
												fullWidth
												label='Title'
												placeholder='Title'
												name='eventTitle'
												value={eventTitle}
												onChange={(event) => {
													setEventTitle(event.target?.value);
												}}
											/>
										</Grid>
									)}
									<Grid item xs={12}>
										<Box>
											<Typography sx={{ marginLeft: "0.3px" }}>Select Image</Typography>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													// justifyContent: "space-around",
													width: "100%",
													height: "100%",
													border: "0.5px solid lightgrey",
													padding: "10px",
													borderRadius: "5px",
												}}>
												<input
													multiple
													className='neighbourhood-form-textField'
													type='file'
													name='logoURL'
													id='img'
													// accept='.jpg, .jpeg, .png .mp4, .mov, .webm'
													accept='video/*, image/*'
													onChange={(event) => {
														handleImageChange(event);
													}}
												/>
												{imgShow &&
													imgShow?.map((item, index) => {
														if (item?.type === "image") {
															return (
																<React.Fragment>
																	<Box
																		key={index}
																		sx={{
																			position: "relative",
																			width: "80px",
																			height: "80px",
																			border: "0.5px solid lightgrey",
																			padding: "5px",
																			borderRadius: "5px",
																		}}>
																		{item?.loader && (
																			<Box
																				sx={{
																					position: "absolute",
																					top: "0px",
																					right: "0px",
																					padding: "0px",
																					width: "100%",
																					height: "100%",
																					display: "flex",
																					justifyContent: "center",
																					alignItems: "center",
																				}}>
																				<CircularProgress />
																			</Box>
																		)}
																		{item?.done && (
																			<Box
																				sx={{
																					position: "absolute",
																					top: "0px",
																					right: "0px",
																					padding: "0px",
																					width: "100%",
																					height: "100%",
																					display: "flex",
																					justifyContent: "center",
																					alignItems: "center",
																				}}>
																				<IconButton disabled>
																					<Done color='secondary' fontSize='large' />
																				</IconButton>
																			</Box>
																		)}
																		<IconButton
																			disabled={item?.done}
																			onClick={() => {
																				imgShow?.map((item, index) => {
																					if (imgShow?.length - 1 === index) {
																						document.getElementById("img").value = "";
																					}
																					return item;
																				});
																				setImgShow((prev) =>
																					prev?.filter((data) => data?.id !== item?.id)
																				);
																			}}
																			sx={{
																				position: "absolute",
																				top: "0px",
																				right: "0px",
																				padding: "0px",
																				background: "white",
																			}}>
																			<Cancel fontSize='small' style={{ color: "brown" }} />
																		</IconButton>
																		<img
																			src={item?.data}
																			alt={item?.id}
																			style={{ width: "100%", height: "100%" }}
																		/>
																	</Box>
																</React.Fragment>
															);
														} else {
															return (
																<Box
																	key={index}
																	sx={{
																		position: "relative",
																		width: "80px",
																		height: "80px",
																		border: "0.5px solid lightgrey",
																		padding: "5px",
																		borderRadius: "5px",
																	}}>
																	{item?.loader && (
																		<Box
																			sx={{
																				position: "absolute",
																				top: "0px",
																				right: "0px",
																				padding: "0px",
																				width: "100%",
																				height: "100%",
																				display: "flex",
																				justifyContent: "center",
																				alignItems: "center",
																			}}>
																			<CircularProgress />
																		</Box>
																	)}
																	{item?.done && (
																		<Box
																			sx={{
																				position: "absolute",
																				top: "0px",
																				right: "0px",
																				padding: "0px",
																				width: "100%",
																				height: "100%",
																				display: "flex",
																				justifyContent: "center",
																				alignItems: "center",
																			}}>
																			<IconButton disabled>
																				<Done color='secondary' fontSize='large' />
																			</IconButton>
																		</Box>
																	)}
																	<IconButton
																		disabled={item?.done}
																		onClick={() => {
																			imgShow?.map((item, index) => {
																				if (imgShow?.length - 1 === index) {
																					document.getElementById("img").value = "";
																				}
																				return item;
																			});
																			setImgShow((prev) =>
																				prev?.filter((data) => data?.id !== item?.id)
																			);
																		}}
																		sx={{
																			position: "absolute",
																			top: "0px",
																			right: "0px",
																			padding: "0px",
																			background: "white",
																		}}>
																		<Cancel fontSize='small' style={{ color: "brown" }} />
																	</IconButton>
																	<iframe
																		title={item?.id}
																		src={item?.data}
																		alt='video'
																		style={{ width: "100%", height: "100%" }}
																	/>
																</Box>
															);
														}
													})}
												{imgShow?.length > 0 && imageUploaded === false && (
													<Box sx={{ marginLeft: "20px" }}>
														<Button
															onClick={() => {
																setImgShow((prev) => {
																	return prev.map((item) => {
																		return {
																			...item,
																			loader: true,
																			done: false,
																		};
																	});
																});
																imgShow?.map((item, index) => {
																	if (imgShow?.length - 1 === index) {
																		ImageApiCAll(item, item?.type, "Images Uploaded");
																	} else {
																		ImageApiCAll(item, item?.type, "");
																	}
																	return item;
																});
															}}>
															upload
														</Button>
													</Box>
												)}
											</Box>
											<label for='img' style={{ color: "rgb(108 108 108)" }}>
												*required image dimension 1024 x 1024px and shoud be less than 1MB
											</label>
										</Box>
									</Grid>
									<Grid item xs={12}>
										<TextField
											required
											className='neighbourhood-form-textField'
											fullWidth
											label='Description'
											rows={3}
											maxRows={5}
											placeholder='Description'
											name='description'
											value={data.description}
											multiline
											onChange={(event) => {
												setData((prev) => ({
													...prev,
													description: event.target.value,
												}));
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<Box sx={{ position: "relative", height: "400px" }}>
											{/* <MyGoogleMap handleGLocation={handleGLocation} /> */}
											<GoogleMapCustom />
										</Box>
									</Grid>
									<Grid item xs={12}>
										<Box>
											<Button
												// disabled={imgShow?.length === 0 ? false : submitForm ? false : true}
												type='submit'
												variant='contained'>
												Submit
											</Button>
										</Box>
									</Grid>
								</Grid>
							</form>
						</Card>
						<SnackbarContext />
					</Grid>
				</Grid>
			</Container>
		);
	} else {
		return (
			<Box
				sx={{
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default CreateAlert;
