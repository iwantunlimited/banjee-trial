import { ArrowBack, Cancel, Done, Upload } from "@mui/icons-material";
import {
	Container,
	Box,
	Grid,
	Card,
	TextField,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Input,
	Button,
	IconButton,
	Typography,
	CircularProgress,
} from "@mui/material";
import axios from "axios";
import React from "react";
import "../../business.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router";
import { CategoryList } from "../../../Users/User_Services/UserApiService";
import { findByIdBlog, updateBlog } from "../../services/ApiServices";
import { MainContext } from "../../../../context/Context";
import Compressor from "compressorjs";

function UpdateBlog() {
	const navigate = useNavigate();
	const params = useParams();

	const { setModalData, setModalOpen } = React.useContext(MainContext);

	const [businessData, setBusinessData] = React.useState("");
	const [data, setData] = React.useState({
		title: "",
		bannerImageUrl: "",
		categoryId: "",
		categoryName: "",
		description: "",
		shortDescription: "",
		publishOnFeed: true,
		slug: "",
		blogType: "BLOG",
	});

	const [state, setState] = React.useState("");

	const [submitForm, setSubmitForm] = React.useState(false);
	const [imgShow, setImgShow] = React.useState("");
	const [categoryList, setCategoryList] = React.useState("");

	const CategoryApiCall = React.useCallback(() => {
		CategoryList({ type: "BLOG" })
			.then((res) => {
				setCategoryList(res?.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	const handleImageChange = (event) => {
		const image = event.target.files[0];
		new Compressor(image, {
			quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
			convertTypes: ["image/png"],
			success: (compressedResult) => {
				// compressedResult has the compressed file.
				// Use the compressed file to upload the images to your server.
				setImgShow({
					data: URL.createObjectURL(compressedResult),
					src: compressedResult,
					loader: false,
					done: false,
					update: true,
				});
				// ImageApiCAll(compressedResult);
			},
		});
	};

	const ImageApiCAll = React.useCallback((data) => {
		const mime = "image";
		const formData = new FormData();

		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "blog_image");
		formData.append("file", data?.src);

		const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

		// const header = {
		// 	"Content-Type": "multipart/form-data",
		// 	Authorization: `Bearer ${token}`,
		// };

		axios
			.post(url, formData)
			.then((res) => {
				setSubmitForm(true);
				setModalOpen(true);
				setModalData("Image Uploaded", "success");
				setImgShow((prev) => ({
					...prev,
					loader: false,
					done: true,
				}));
				setData((prev) => ({
					...prev,
					logoURL: res?.data?.public_id,
					// logoURL: res?.data?.data[0]?.data?.id,
					// logoURL: `https://gateway.banjee.org/services/media-service/iwantcdn/resources/${res?.data?.data[0]?.data?.id}?actionCode=ACTION_GET_RESOURCE`,
				}));
			})
			.catch((err) => console.error(err));
	}, []);

	const BlogDetailApiCall = React.useCallback(() => {
		findByIdBlog(params?.id)
			.then((res) => {
				setBusinessData(res);
				setData({
					title: res?.title,
					bannerImageUrl: res?.bannerImageUrl,
					categoryId: res?.categoryId,
					categoryName: res?.categoryName,
					description: res?.description,
					shortDescription: res?.shortDescription,
					publishOnFeed: true,
					slug: res?.slug,
					blogType: "BLOG",
				});
				setImgShow({
					data: `https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${res?.bannerImageUrl}.png`,
					src: "",
					loader: false,
					done: false,
					update: false,
				});
				setState(res?.description);
			})
			.catch((err) => console.error(err));
	}, [params?.id]);

	const UpdateBlogApiCall = React.useCallback((bData, updatedData) => {
		updateBlog({ ...bData, ...updatedData })
			.then(() => {
				setModalOpen(true);
				setModalData("blog updated", "success");
				navigate(-1);
			})
			.catch((err) => console.log(err));
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (imgShow?.update === true && submitForm === false) {
			window.alert("Please upload the selected image first");
		} else {
			UpdateBlogApiCall(businessData, data);
		}
	};

	React.useEffect(() => {
		CategoryApiCall();
		BlogDetailApiCall();
	}, [CategoryApiCall, BlogDetailApiCall]);

	if (CategoryList && businessData) {
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
							<Typography sx={{ fontSize: "22px", color: "#666", fontWeight: 500 }}>
								Update Blog
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
											name='title'
											value={data?.title}
											onChange={(event) => {
												setData((prev) => ({
													...prev,
													title: event?.target?.value,
													slug: event?.target?.value.replace(/[ ,]+/g, "-"),
												}));
											}}
											placeholder='Enter Title'
										/>
									</Grid>
									{/* <Grid item xs={12}>
									<TextField
										required
										fullWidth
										className='neighbourhood-form-textField'
										name='slug'
										value={data?.slug}
										onChange={(event) => {
											setData((prev) => ({
												...prev,
												slug: event.target.value,
											}));
										}}
										placeholder='Enter Slug'
									/>
								</Grid> */}
									<Grid item xs={12}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>Category Type</InputLabel>
											<Select
												required
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='type'
												label='Category Type'
												value={data?.categoryId}
												onChange={(event, data) => {
													setData((prev) => ({
														...prev,
														categoryId: event?.target?.value,
														categoryName: data?.props?.children,
													}));
												}}>
												{categoryList &&
													categoryList?.map((item, index) => {
														return (
															<MenuItem key={index} value={item?.id}>
																{item?.name}
															</MenuItem>
														);
													})}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12}>
										<TextField
											required
											className='neighbourhood-form-textField'
											fullWidth
											label='Short Description'
											rows={3}
											maxRows={5}
											placeholder='Short Description'
											name='shortDescription'
											value={data?.shortDescription}
											multiline
											onChange={(event) => {
												setData((prev) => ({
													...prev,
													shortDescription: event?.target?.value,
												}));
											}}
										/>
									</Grid>
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
													className='neighbourhood-form-textField'
													type='file'
													name='logoURL'
													id='img'
													accept='.jpg, .jpeg, .png'
													onChange={(event) => {
														handleImageChange(event);
													}}
												/>
												{imgShow && (
													<React.Fragment>
														<Box
															sx={{
																position: "relative",
																width: "80px",
																height: "80px",
																border: "0.5px solid lightgrey",
																padding: "5px",
																borderRadius: "5px",
																marginRight: "5px",
															}}>
															{imgShow?.loader && (
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
															{imgShow?.done && (
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
																disabled={imgShow?.done}
																onClick={() => {
																	document.getElementById("img").value = "";
																	setImgShow("");
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
																src={imgShow?.data}
																alt='photo'
																style={{ width: "100%", height: "100%" }}
															/>
														</Box>
														{imgShow?.done === false && imgShow?.update && (
															<Box sx={{ marginLeft: "20px" }}>
																<Button
																	onClick={() => {
																		setImgShow((prev) => ({
																			...prev,
																			loader: true,
																		}));
																		imgShow?.update === true && ImageApiCAll(imgShow);
																	}}>
																	upload
																</Button>
															</Box>
														)}
													</React.Fragment>
												)}
											</Box>
										</Box>
									</Grid>
									<Grid item xs={12}>
										<Box>
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
														["bold", "italic", "underline", "strike", "blockquote"],
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
												onChange={(value) => {
													setState(value);
													setData((prev) => ({
														...prev,
														description: value,
													}));
												}}
											/>
										</Box>
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
						</Card>
					</Grid>
					{/* <Grid item xs={12}>
					<Box>
						<Typography>{descriptionText}</Typography>
					</Box>
				</Grid> */}
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

export default UpdateBlog;
