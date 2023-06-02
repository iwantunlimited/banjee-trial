import React from "react";
import {
	Card,
	Container,
	Grid,
	Typography,
	Box,
	TextField,
	Button,
	IconButton,
	Divider,
	Autocomplete,
	FormLabel,
	FormControl,
	FormGroup,
	FormControlLabel,
	Checkbox,
	CircularProgress,
} from "@mui/material";
import "../SocialFeed.css";
import axios from "axios";
import { ArrowBack, Cancel, Done } from "@mui/icons-material";
import { createSocialFeeds } from "../services/ApiServices";
import { useNavigate } from "react-router";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill-emoji/dist/quill-emoji";
import { MainContext } from "../../../context/Context";
import Compressor from "compressorjs";
import { filterNeighbourhood } from "../../Neighbourhoods/services/apiServices";
import { v4 as uuidv4 } from "uuid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import moment from "moment";

function CreateFeed() {
	const navigate = useNavigate();
	const [cloudinaryData, setCloudinaryData] = React.useState({
		type: "image",
		src: "",
		caption: "",
		sequenceNumber: 0,
		tags: null,
		mimeType: "image/jpg",
		sizeInBytes: 0,
		length: 0,
		width: 0,
		height: 0,
		aspectRatio: null,
		title: null,
		subTitle: null,
		description: null,
		base64Content: null,
		mediaSource: null,
	});

	const lat = localStorage?.getItem("lat");
	const lng = localStorage?.getItem("lng");

	const { setModalData, setModalOpen } = React.useContext(MainContext);
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 100,
	});
	const [postType, setPostType] = React.useState({
		global: false,
		neighbourhood: false,
	});
	const [scheduled, setScheduled] = React.useState(false);
	const [scheduleTime, setScheduleTime] = React.useState(null);
	const [submitForm, setSubmitForm] = React.useState(false);
	const [imageUploaded, setImageUploaded] = React.useState(false);
	const [listData, setListData] = React.useState([]);
	const [finalPayload, setFinalPayload] = React.useState({
		geoLocation: {
			x: lng ? lng : 0,
			y: lat ? lat : 0,
		},
		mediaContent: [],
		text: "",
		pageId: "",
		pageName: "Anyone",
		visibility: "PUBLIC",
		scheduled: false,
	});

	const [imgShow, setImgShow] = React.useState([]);
	const userType = localStorage?.getItem("merchant");

	const renderType = (type, src) => {
		switch (type) {
			case "image":
				return `https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${src}.png`;

			case "video":
				return `https://res.cloudinary.com/banjee/video/upload/br_128,q_auto:low/v1/${src}.mp4`;

			case "audio":
				return `https://res.cloudinary.com/banjee/video/upload/br_128,q_auto:low/v1/${src}.mp3`;

			default:
				return `https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${src}.png`;
		}
	};

	const listNeighbourApiCAll = React.useCallback((data) => {
		const payload =
			data?.keyword !== ""
				? {
						page: pagination?.page,
						pageSize: pagination?.pageSize,
						online: true,
						keywords: data?.keyword,
				  }
				: { page: pagination?.page, pageSize: pagination?.pageSize, online: true };
		filterNeighbourhood(payload)
			.then((res) => {
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						...ele,
					};
				});
				setListData(resp);
			})
			.catch((err) => console.error(err));
	}, []);

	const CreateFeedApiCall = React.useCallback(
		(data) => {
			createSocialFeeds(data)
				.then((res) => {
					setModalOpen(true);
					setModalData("Feed Created Successfully", "success");
					// setData({
					// 	title: "",
					// 	bannerImageUrl: "",
					// 	categoryId: "",
					// 	categoryName: "",
					// 	description: "",
					// 	shortDescription: "",
					// 	publishOnFeed: true,
					// 	slug: "",
					// });
					setImgShow("");
					if (localStorage?.getItem("userType") === "merchant") {
						navigate("/");
					} else {
						navigate("/social-feeds");
					}
				})
				.catch((err) => console.error(err));
		},
		[navigate]
	);

	const handleImageChange = (event) => {
		if (event?.target?.files?.length > 0) {
			for (let index = 0; index < event?.target?.files?.length; index++) {
				const image = event.target.files[index];

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
									// convertTypes: ["image/png"],
									success: (compressedResult) => {
										// compressedResult has the compressed file.
										// Use the compressed file to upload the images to your server.
										// ImageApiCAll(compressedResult, compressedResult.type);
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
								});
							}

							return true;
						};
					};
				} else {
					// ImageApiCAll(image, image.type);
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
		}
	};

	const ImageApiCAll = React.useCallback((imgData, imageType, notifyMessage) => {
		// console.log(":1111", imgData);
		const mimeTypeFun = () => {
			switch (imgData?.type) {
				case "image":
					return "image/jpg";
				case "audio":
					return "audio/mp3";
				case "video":
					return "video/mp4";
				default:
					break;
			}
		};
		const formData = new FormData();

		formData.append("cloud_name", "banjee");
		if (imageType === "image") {
			formData.append("upload_preset", "feed_image");
			formData.append("resource_type", "image");
		} else if (imageType === "audio") {
			formData.append("upload_preset", "feed_audio");
			formData.append("resource_type", "video");
		} else if (imageType === "video") {
			formData.append("upload_preset", "feed_video");
			formData.append("resource_type", "video");
		}
		formData.append("file", imgData?.src);
		if (imageType === "audio") {
			const url = `https://api.cloudinary.com/v1_1/banjee/video/upload/`;
			axios
				.post(url, formData)
				.then((res) => {
					if (notifyMessage === "Images Uploaded") {
						setImageUploaded(true);
						setModalOpen(true);
						setModalData("audio Uploaded", "success");
					}
					setSubmitForm(true);
					setFinalPayload((prev) => ({
						...prev,
						mediaContent: [
							...prev.mediaContent,
							{
								...cloudinaryData,
								src: res?.data?.public_id,
								type: imgData?.type,
								mimeType: mimeTypeFun(),
							},
						],
					}));
					setImgShow((prev) => {
						return prev.map((item) => {
							if (item?.id === imgData?.id) {
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
			const url = `https://api.cloudinary.com/v1_1/banjee/${imageType}/upload/`;
			axios
				.post(url, formData)
				.then((res) => {
					if (notifyMessage === "Images Uploaded") {
						setImageUploaded(true);
						setModalOpen(true);
						setModalData(imageType === "image" ? "Image Uploaded" : "Video Uploaded", "success");
					}
					setSubmitForm(true);
					setFinalPayload((prev) => ({
						...prev,
						mediaContent: [
							...prev.mediaContent,
							{
								...cloudinaryData,
								src: res?.data?.public_id,
								type: imgData?.type,
								mimeType: mimeTypeFun(),
							},
						],
					}));
					setImgShow((prev) => {
						return prev.map((item) => {
							if (item?.id === imgData?.id) {
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
		if (imgShow?.length > 0 && submitForm === false) {
			window.alert("PLease upload the selected image first");
		} else {
			CreateFeedApiCall(finalPayload);
		}
	};

	React.useEffect(() => {
		listNeighbourApiCAll();
	}, [listNeighbourApiCAll]);

	// const descriptionText = <div dangerouslySetInnerHTML={{ __html: state }} />;

	return (
		<Container maxWidth='xl'>
			<Box>
				<IconButton onClick={() => navigate("/social-feeds")}>
					<ArrowBack color='primary' />
				</IconButton>
			</Box>
			<Card sx={{ padding: "20px" }}>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Typography
							sx={{
								color: "#6b778c",
								fontSize: "20px",
								fontWeight: "500",
								textAlign: "left",
							}}>
							Create Feed
						</Typography>
						<Box sx={{ marginY: "10px" }}>
							<Divider />
						</Box>
					</Grid>
					<Grid item xs={12}>
						<form onSubmit={handleSubmit}>
							<Grid item container xs={12} spacing={2}>
								<Grid item xs={12}>
									<Box>
										<FormControl component='fieldset' variant='standard'>
											<FormLabel component='legend'>Select Post Type</FormLabel>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															checked={postType?.global}
															onChange={(event) => {
																setPostType((prev) => ({
																	...prev,
																	global: event?.target?.checked,
																	neighbourhood: false,
																}));
																setFinalPayload((prev) => ({
																	...prev,
																	pageId: "62401d53e3a009309544d3e8",
																	pageName: "Global-Feeds",
																}));
															}}
															name={postType?.global}
														/>
													}
													label='Global Feed'
												/>
												<FormControlLabel
													control={
														<Checkbox
															checked={postType?.neighbourhood}
															onChange={(event) => {
																setPostType((prev) => ({
																	...prev,
																	global: false,
																	neighbourhood: event?.target?.checked,
																}));
															}}
															name={postType?.neighbourhood}
														/>
													}
													label='Neighbourhood'
												/>
											</FormGroup>
										</FormControl>
									</Box>
								</Grid>
								{postType?.neighbourhood === true && (
									<Grid item xs={12}>
										<Autocomplete
											id='neightbourhood Id'
											options={listData}
											getOptionLabel={(option) => option.name}
											renderOption={(props, option) => (
												<Box component='li' {...props}>
													{option.name}
												</Box>
											)}
											onChange={(event, newValue) => {
												setFinalPayload((prev) => ({
													...prev,
													pageId: newValue?.routingId,
													pageName: newValue?.name,
												}));
											}}
											sx={{ width: "100%" }}
											renderInput={(params) => {
												// console.log("params", params);
												return (
													<TextField
														onChange={(event) => {
															listNeighbourApiCAll({ keyword: event?.target?.value });
														}}
														required={postType?.neighbourhood}
														{...params}
														label='Neighbourhood'
													/>
												);
											}}
										/>
									</Grid>
								)}
								<Grid item xs={12}>
									<Box>
										<FormControl component='fieldset' variant='standard'>
											<FormLabel component='legend'>Schedule</FormLabel>
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															checked={scheduled}
															onChange={(event) => {
																setScheduled(event?.target?.checked);
																setFinalPayload((prev) => ({
																	...prev,
																	scheduled: event?.target?.checked,
																}));
															}}
															name={scheduled}
														/>
													}
													label='scheduled'
												/>
											</FormGroup>
										</FormControl>
									</Box>
								</Grid>
								{scheduled === true && (
									<Grid item xs={12}>
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DateTimePicker
												// ampm={false}
												// ampmInClock={false}
												disablePast
												maxDate={new Date().setDate(new Date().getDate() + 30)}
												inputFormat='DD/MM/YYYY HH:mm:ss'
												renderInput={(props) => <TextField size='small' fullWidth {...props} />}
												label='DateTimePicker'
												value={scheduleTime}
												onChange={(newValue) => {
													// console.log("newdate", newValue.toISOString());
													const da = new Date(newValue);
													const date = moment(da).format("DD/MM/YYYY").split("/").join("-");
													const time = moment(da).format("HH:mm:ss");
													// console.log("date", date);
													// console.log("time", time);
													setScheduleTime(newValue);
													if (scheduled) {
														setFinalPayload((prev) => ({
															...prev,
															dateTime: date + " " + time,
														}));
													}
												}}
											/>
										</LocalizationProvider>
									</Grid>
								)}
								<Grid item xs={12}>
									<Box>
										<Typography sx={{ marginLeft: "0.3px" }}>Upload Image</Typography>
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
												name='uploadData'
												multiple
												id='img'
												// accept='.jpg, .jpeg, .png'
												accept='image/*, video/*, audio/*'
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
																				document.getElementById("businessImage").value = "";
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
										<label for='img' style={{ color: "rgb(108 108 108)" }}>
											*Required image dimension 1024 x 1024px and shoud be less than 1MB
										</label>
									</Box>
								</Grid>
								<Grid item xs={12}>
									<TextField
										required
										fullWidth
										multiline
										rows={4}
										name='text'
										placeholder='Enter Description'
										label='Enter Description'
										className='neighbourhood-form-textField'
										value={finalPayload?.text}
										onChange={(event) => {
											setFinalPayload((prev) => ({
												...prev,
												text: event.target.value,
											}));
										}}
									/>
									{/* <Box>
										<ReactQuill
											placeholder='Enter Description'
											theme='snow'
											formats={[
												"header",
												"font",
												"size",
												"bold",
												"italic",
												"underline",
												"strike",
												"blockquote",
												"list",
												"bullet",
												"indent",
												"link",
												"image",
												"video",
											]}
											modules={{
												toolbar: [
													[{ header: "1" }, { header: "2" }, { font: [] }],
													[{ size: [] }],
													["bold", "italic", "underline", "strike", "blockquote", "emoji"],
													[
														{ list: "ordered" },
														{ list: "bullet" },
														{ indent: "-1" },
														{ indent: "+1" },
													],
													["link", "image", "video"],
													["clean"],
												],
												clipboard: {
													// toggle to add extra line breaks when pasting HTML:
													matchVisual: false,
												},
											}}
											value={state}
											onChange={(content, delta, source, editor) => {
												// console.log(editor.getHTML(content));
												setState(content);
												setFinalPayload((prev) => ({
													...prev,
													mediaContent: uploadData?.length > 0 ? uploadData : data,
													text: editor.getText(content),
												}));
											}}
										/>
									</Box> */}
								</Grid>
								<Grid item xs={12}>
									<Box>
										<Button type='submit' variant='contained'>
											Submit
										</Button>
									</Box>
								</Grid>
							</Grid>
						</form>
					</Grid>
				</Grid>
			</Card>
		</Container>
	);
}

export default CreateFeed;
