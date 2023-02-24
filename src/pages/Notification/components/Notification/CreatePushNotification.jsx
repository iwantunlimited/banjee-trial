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
	Switch,
} from "@mui/material";
import "../../../Explore/business.css";
import { ArrowBack, Cancel, CheckBox, CheckBoxOutlineBlank, Done } from "@mui/icons-material";
import { blogsList } from "../../../Explore/services/ApiServices";
import { useNavigate } from "react-router";
import { createAlert } from "../../ApiServices/apiServices";
import { filterNeighbourhood } from "../../../Neighbourhoods/services/apiServices";
import axios from "axios";
import { MainContext } from "../../../../context/Context";
import SnackbarContext from "../../../../CustomComponents/SnackbarContext";

import Compressor from "compressorjs";
import { v4 as uuidv4 } from "uuid";

function CreatePushNotification() {
	const context = React.useContext(MainContext);

	const { setNotificationPopup, setModalData, setModalOpen, themeData } = context;
	const navigate = useNavigate();
	const [selectTemplate, setSelectTemplate] = React.useState(false);
	const [data, setData] = React.useState({
		anonymous: false,
		eventCode: "ADMIN_NOTIFICATION",
		eventName: "",
		// cloudIds: [],
		description: "",
		audioSrc: "",
		imageUrl: [],
		videoUrl: [],
		metaInfo: {
			detail: false,
		},
		sendTo: "ELSE",
		location: {
			coordinates: [72.51113723963499, 23.069438702322635],
			type: "Point",
		},
	});

	const [imgShow, setImgShow] = React.useState([]);
	const [audioShow, setAudioShow] = React.useState([]);
	const [submitForm, setSubmitForm] = React.useState(false);
	const [imageUploaded, setImageUploaded] = React.useState(false);
	const [audioUploaded, setAudioUploaded] = React.useState(false);
	const [neighbourList, setNeighbourList] = React.useState("");
	const [blogList, setBLogList] = React.useState("");

	const localLat = localStorage.getItem("lat");
	const localLng = localStorage.getItem("lng");

	const NeighbourListApi = React.useCallback(() => {
		filterNeighbourhood({ page: 0, size: 1000, online: true })
			.then((res) => {
				setNeighbourList(res?.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const BlogsListApiCall = React.useCallback((page, pageSize) => {
		blogsList({ page: page, pageSize: pageSize, blogType: "ANNOUNCEMENT" })
			.then((res) => {
				setBLogList(res?.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const CreateAlertApiCall = React.useCallback((payload) => {
		createAlert(payload)
			.then((res) => {
				setNotificationPopup({ open: true, message: "Notification Created Successfully" });
				navigate("/notification");
				setData({
					anonymous: false,
					eventCode: "ADMIN_NOTIFICATION",
					eventName: "",
					// cloudIds: [],
					description: "",
					audioSrc: "",
					imageUrl: [],
					videoUrl: [],
					metaInfo: {
						detail: false,
					},
					sendTo: "ELSE",
					location: {
						coordinates: [localLng, localLat],
						type: "Point",
					},
				});
				setTimeout(() => {
					setNotificationPopup({ open: false, message: "" });
				}, [2000]);
			})
			.catch((err) => console.error(err));
	}, []);

	const handleAudioChange = (event) => {
		for (let index = 0; index < event?.target?.files?.length; index++) {
			const image = event.target.files[index];

			const imageSize = event.target.files[index]?.size * 0.000001;
			const inputType = image.type.split("/")?.[0];
			if (inputType === "audio" && imageSize < 10) {
				setAudioShow((prev) => [
					...prev,
					{
						type: inputType,
						id: uuidv4(),
						data: URL.createObjectURL(image),
						src: image,
						loader: false,
						done: false,
					},
				]);
			} else {
				setModalOpen(true);
				setModalData("Size of audio is not greater than 10MB", "error");
				document.getElementById("audioSrc").value = "";
				return false;
			}
		}
	};
	const handleImageChange = (event) => {
		if (event?.target?.files?.length > 0) {
			for (let index = 0; index < event?.target?.files?.length; index++) {
				const image = event.target.files[index];
				const inputType = image.type.split("/")?.[0];
				const imageSize = event.target.files[index]?.size * 0.000001;
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
									success: (compressedResult) => {
										// compressedResult has the compressed file.
										// Use the compressed file to upload the images to your server.
										setImgShow((prev) => [
											...prev,
											{
												type: inputType,
												id: uuidv4(),
												data: URL.createObjectURL(compressedResult),
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
					if (imageSize > 10) {
						setModalOpen(true);
						setModalData("Size of video is not greater than 10MB", "error");
					} else {
						setImgShow((prev) => [
							...prev,
							{
								type: inputType,
								id: uuidv4(),
								data: URL.createObjectURL(image),
								src: image,
								loader: false,
								done: false,
							},
						]);
					}
				}
			}
		} else {
			const image = event.target.files[0];
			const inputType = image.type.split("/")?.[0];
			if (inputType === "image") {
				new Compressor(image, {
					quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
					convertTypes: ["image/png"],
					success: (compressedResult) => {
						setImgShow((prev) => [
							...prev,
							{
								type: inputType,
								id: uuidv4(),
								data: URL.createObjectURL(compressedResult),
								src: compressedResult,
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
						id: uuidv4(),
						data: URL.createObjectURL(image),
						src: image,
						loader: false,
						done: false,
					},
				]);
			}
		}
	};

	const ImageApiCAll = React.useCallback((data, dataType, notifyMessage) => {
		if (dataType === "video" || dataType === "audio") {
			const mime = "video";
			const formData = new FormData();

			// formData.append("directoryId", "root");

			formData.append("cloud_name", "banjee");
			formData.append("upload_preset", "notification_image");
			formData.append("file", data.src);
			// { headers: { "Content-Type": "multipart/form-data" }

			const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload/`;

			axios
				.post(url, formData)
				.then((res) => {
					if (notifyMessage === "Images Uploaded") {
						setImageUploaded(true);
						setModalOpen(true);
						setModalData("Video Uploaded", "success");
					}
					setSubmitForm(true);
					if (dataType === "audio") {
						if (notifyMessage === "Audio Uploaded") {
							setAudioUploaded(true);
							setModalOpen(true);
							setModalData("Audio Uploaded", "success");
						}
						setData((prev) => ({
							...prev,
							// imageUrl: res?.data?.data[0]?.data?.id,
							audioSrc: res?.data?.public_id,
						}));
						setAudioShow((prev) => {
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
					} else {
						setData((prev) => ({
							...prev,
							// imageUrl: res?.data?.data[0]?.data?.id,
							videoUrl: [...prev.videoUrl, res?.data?.public_id],
						}));
					}
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
					}
					setSubmitForm(true);
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
		// setFinalData(data);
		if (imgShow?.length > 0 && submitForm === false) {
			window.alert("Please upload the selected image or video first");
		} else if (audioShow?.length > 0 && submitForm === false) {
			window.alert("Please upload the selected audio first");
		} else {
			CreateAlertApiCall({
				...data,
				location: {
					coordinates: [localLng, localLat],
					type: "Point",
				},
			});
		}
	};

	React.useEffect(() => {
		NeighbourListApi();
		BlogsListApiCall();
	}, [NeighbourListApi, BlogsListApiCall]);

	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	if (neighbourList && blogList) {
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
								Create Push Notification
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "20px" }}>
							<form onSubmit={handleSubmit}>
								<Grid item container xs={12} spacing={2}>
									<Grid item xs={12}>
										<TextField
											required
											fullWidth
											className='neighbourhood-form-textField'
											name='eventName'
											value={data?.eventName}
											onChange={(event) => {
												setData((prev) => ({
													...prev,
													eventName: event.target.value,
													// slug: event.target.value.replace(/[ ,]+/g, "-"),
												}));
											}}
											placeholder='Enter Title'
											label='Enter Title'
										/>
									</Grid>
									{/* <Grid item xs={12}>
										<Autocomplete
											fullWidth
											multiple
											id='checkboxes-tags-demo'
											options={neighbourList}
											disableCloseOnSelect
											onChange={(event, value) => {
												setData((prev) => ({
													...prev,
													cloudIds: value?.map((item) => item?.id),
												}));
											}}
											getOptionLabel={(option) => option?.name}
											renderOption={(props, option, { selected }) => {
												return (
													<li {...props}>
														<Checkbox
															icon={icon}
															checkedIcon={checkedIcon}
															style={{ marginRight: 8 }}
															checked={selected}
														/>
														{option.name}
													</li>
												);
											}}
											renderInput={(params) => (
												<TextField
													fullWidth
													{...params}
													label='Select Neighbourhood'
													placeholder='Favorites'
												/>
											)}
										/>
									</Grid> */}
									<Grid item xs={12}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												marginBottom: selectTemplate ? "20px" : "0px",
											}}>
											<Switch
												checked={selectTemplate}
												onChange={(event) => {
													setSelectTemplate(!selectTemplate);
												}}
											/>
											<Typography>Select Template</Typography>
										</Box>
										{selectTemplate && (
											<FormControl fullWidth>
												<InputLabel id='demo-simple-select-label'>Select Template</InputLabel>
												<Select
													required
													labelId='demo-simple-select-label'
													id='demo-simple-select'
													name='templateId'
													label='Select Template'
													value={data?.metaInfo.templateId}
													onChange={(event, data) => {
														setData((prev) => ({
															...prev,
															metaInfo: {
																templateId: event.target.value,
																templateName: data?.props?.children,
																detail: true,
															},

															// categoryName: data?.props?.children,
														}));
													}}>
													{blogList &&
														blogList?.map((item, index) => {
															return (
																<MenuItem key={index} value={item?.id}>
																	{item?.title}
																</MenuItem>
															);
														})}
												</Select>
											</FormControl>
										)}
									</Grid>
									<Grid item xs={12}>
										<Box>
											<Typography sx={{ marginLeft: "0.3px" }}>Select Image or Video</Typography>
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
																<Box
																	key={index}
																	sx={{
																		position: "relative",
																		width: "100px",
																		height: "100px",
																		border: "0.5px solid lightgrey",
																		padding: "5px",
																		borderRadius: "5px",
																		marginRight: "10px",
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
																		alt={item.id}
																		style={{ width: "100%", height: "100%" }}
																	/>
																</Box>
															);
														} else {
															return (
																<Box
																	key={index}
																	sx={{
																		position: "relative",
																		width: "100px",
																		height: "100px",
																		border: "0.5px solid lightgrey",
																		padding: "5px",
																		borderRadius: "5px",
																		marginRight: "10px",
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
																		title={item.id}
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
															color={imageUploaded ? "secondary" : "primary"}
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
										</Box>
										<label for='img' style={{ color: "rgb(108 108 108)" }}>
											*Required image dimension 1024 x 1024px and shoud be less than 1MB
										</label>
									</Grid>
									<Grid item xs={12}>
										<Box>
											<Typography sx={{ marginLeft: "0.3px" }}>Select Audio</Typography>
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
													className='neighbourhood-form-textField'
													type='file'
													name='audioSrc'
													id='audioSrc'
													// accept='.jpg, .jpeg, .png .mp4, .mov, .webm'
													accept='audio/*'
													onChange={(event) => {
														handleAudioChange(event);
													}}
												/>
												{audioShow &&
													audioShow?.map((item, index) => {
														if (item?.type === "audio") {
															return (
																<Box
																	key={index}
																	sx={{
																		position: "relative",
																		width: "200px",
																		height: "150px",
																		border: "0.5px solid lightgrey",
																		padding: "5px",
																		borderRadius: "5px",
																		marginRight: "10px",
																		display: "flex",
																		alignItems: "center",
																		justifyContent: "center",
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
																			audioShow?.map((item, index) => {
																				if (audioShow?.length - 1 === index) {
																					document.getElementById("audioSrc").value = "";
																				}
																				return item;
																			});
																			setAudioShow((prev) =>
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
																		title={item.id}
																		src={item?.data}
																		alt='video'
																		style={{ width: "100%", height: "100%" }}
																	/>
																</Box>
															);
														}
													})}
												{audioShow?.length > 0 && audioUploaded === false && (
													<Box sx={{ marginLeft: "20px" }}>
														<Button
															onClick={() => {
																setAudioShow((prev) => {
																	return prev.map((item) => {
																		return {
																			...item,
																			loader: true,
																			done: false,
																		};
																	});
																});
																audioShow?.map((item, index) => {
																	ImageApiCAll(item, item?.type, "Audio Uploaded");
																	return item;
																});
															}}>
															upload
														</Button>
													</Box>
												)}
											</Box>
											<label for='audioSrc' style={{ color: "rgb(108 108 108)" }}>
												*Required audio shoud be less than 10MB
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

export default CreatePushNotification;
