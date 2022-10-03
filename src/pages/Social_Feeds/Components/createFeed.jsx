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
} from "@mui/material";
import "../SocialFeed.css";
import axios from "axios";
import { ArrowBack, Cancel } from "@mui/icons-material";
import { createSocialFeeds } from "../services/ApiServices";
import { useNavigate } from "react-router";
import SnackBarComp from "../../../CustomComponents/SnackBarComp";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill-emoji/dist/quill-emoji";

function CreateFeed() {
	const navigate = useNavigate();
	const [data, setData] = React.useState({
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

	const [state, setState] = React.useState("");
	console.log("data", data);

	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "",
		duration: 3000,
		severity: "",
	});

	const [uploadData, setUploadData] = React.useState([]);
	const [finalPayload, setFinalPayload] = React.useState({
		geoLocation: {
			x: 0,
			y: 0,
		},
		mediaContent: [],
		text: "",
		pageName: "Anyone",
		visibility: "PUBLIC",
	});

	console.log("====================================");
	console.log("uploadData", finalPayload);
	console.log("====================================");

	const [imgShow, setImgShow] = React.useState([]);

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

	const ImageApiCAll = React.useCallback((imgData, mime) => {
		const type = mime.split("/")?.[0];
		// const mime = "image";
		const formData = new FormData();
		console.log("mime", mime);

		// formData.append("directoryId", "root");

		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "business_images");
		formData.append("file", imgData);
		// { headers: { "Content-Type": "multipart/form-data" }

		if (type === "audio") {
			const url = `https://api.cloudinary.com/v1_1/banjee/video/upload`;
			console.log("--------------", url);

			axios
				.post(url, formData)
				.then((res) => {
					console.log("====================================");
					console.log("image upload response", res);
					console.log("====================================");
					// setData((prev) => ({
					// 	...prev,
					// 	// imageUrl: res?.data?.data[0]?.data?.id,
					// 	src: res?.data?.public_id,
					// }));
					setUploadData((prev) => [
						...prev,
						{
							...data,
							src: res?.data?.public_id,
							// url: renderType(type, res?.data?.public_id),
							type: type,
							mimeType: mime,
						},
					]);
					setImgShow((prev) => [
						...prev,
						{ url: renderType(type, res?.data?.public_id), type: type, mimeType: mime },
					]);
				})
				.catch((err) => console.log(err));
		} else {
			const url = `https://api.cloudinary.com/v1_1/banjee/${type}/upload`;
			console.log("--------------", url);

			axios
				.post(url, formData)
				.then((res) => {
					console.log("====================================");
					console.log("image upload response", res);
					console.log("====================================");
					setUploadData((prev) => [
						...prev,
						{
							...data,
							src: res?.data?.public_id,
							type: type,
							mimeType: mime,
						},
					]);
					setImgShow((prev) => [
						...prev,
						{ url: renderType(type, res?.data?.public_id), type: type, mimeType: mime },
					]);

					// setData((prev) => ({
					// 	...prev,
					// 	// imageUrl: res?.data?.data[0]?.data?.id,
					// 	src: res?.data?.public_id,
					// }));
				})
				.catch((err) => console.log(err));
		}
	}, []);

	const CreateFeedApiCall = React.useCallback((data) => {
		createSocialFeeds(data)
			.then((res) => {
				setSnackbar({
					open: true,
					message: "Feed Created Successfully",
					severity: "success",
					duration: 3000,
				});

				navigate("/social-feeds");
				console.log("====================================");
				console.log("create api response", res);
				console.log("====================================");
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
			})
			.catch((err) => console.log(err));
	}, []);

	const handleSnackbar = (data) => {
		setSnackbar((prev) => ({
			...prev,
			open: data,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setFinalPayload((prev) => ({
			...prev,
			mediaContent: uploadData?.length > 0 ? uploadData : data,
		}));
		CreateFeedApiCall(finalPayload);
	};

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
										<Typography sx={{ marginLeft: "0.3px" }}>upload image</Typography>
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
												onChange={(event) => {
													console.log("event", event);
													if (event?.target?.files?.length > 0) {
														for (let index = 0; index < event?.target?.files?.length; index++) {
															const data = event?.target?.files[index].type.split("/")?.[0];
															ImageApiCAll(
																event?.target?.files[index],
																event?.target?.files[index].type
															);
														}
													} else {
														ImageApiCAll(event?.target?.files[0], event?.target?.files[0].type);
													}
													// newImageFunc(event.target.files[0]);
													// setImgShow(URL.createObjectURL(event?.target?.files[0]));
													// ImageApiCAll(event?.target?.files[0]);
													// setData((prev) => ({
													// 	...prev,
													// 	logoURL: event.target.files[0],
													// }));
												}}
											/>
											{imgShow?.length > 0 &&
												imgShow?.map((item, index) => {
													if (item?.type === "image") {
														return (
															<Box
																sx={{
																	position: "relative",
																	width: "150px",
																	height: "150px",
																	border: "0.5px solid lightgrey",
																	padding: "5px",
																	borderRadius: "5px",
																	marginRight: "5px",
																}}>
																<IconButton
																	onClick={() => {
																		document.getElementById("img").value = "";
																		setImgShow((prev) =>
																			prev?.filter((data) => data?.url !== item?.url)
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
																	src={item?.url}
																	alt='photo'
																	style={{ width: "100%", height: "100%" }}
																/>
															</Box>
														);
													} else {
														return (
															<Box
																sx={{
																	position: "relative",
																	width: "150px",
																	height: "150px",
																	border: "0.5px solid lightgrey",
																	padding: "5px",
																	borderRadius: "5px",
																}}>
																<IconButton
																	onClick={() => {
																		document.getElementById("img").value = "";
																		setImgShow((prev) =>
																			prev?.filter((data) => data?.url !== item?.url)
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
																	src={item?.url}
																	alt='photo'
																	style={{ width: "100%", height: "100%" }}
																/>
															</Box>
														);
													}
												})}
										</Box>
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
												mediaContent: uploadData?.length > 0 ? uploadData : data,
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
						<SnackBarComp data={snackbar} handleSnackbar={handleSnackbar} />
					</Grid>
				</Grid>
			</Card>
		</Container>
	);
}

export default CreateFeed;
