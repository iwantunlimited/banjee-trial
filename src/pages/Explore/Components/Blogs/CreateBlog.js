import React from "react";
import {
	Card,
	Container,
	Grid,
	Typography,
	Box,
	TextField,
	FormControl,
	InputLabel,
	Select,
	Button,
	MenuItem,
	IconButton,
	CircularProgress,
} from "@mui/material";
import "../../business.css";
import { CategoryList } from "../../../Users/User_Services/UserApiService";
import axios from "axios";
import { ArrowBack, Cancel, Done } from "@mui/icons-material";
import { createBlog } from "../../services/ApiServices";
import { useNavigate } from "react-router";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Compressor from "compressorjs";
import { MainContext } from "../../../../context/Context";

function CreateBlog() {
	const navigate = useNavigate();
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
	const { setModalOpen, setModalData } = React.useContext(MainContext);

	const [state, setState] = React.useState("");

	const [submitForm, setSubmitForm] = React.useState(false);
	const [imgShow, setImgShow] = React.useState("");
	const [categoryList, setCategoryList] = React.useState("");

	const handleImageChange = (event) => {
		// newImageFunc(event.target.files[0]);

		const imageSize = event.target.files[0]?.size * 0.000001;
		const image = event.target.files[0];

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

							setImgShow({
								data: URL.createObjectURL(compressedResult),
								src: compressedResult,
								loader: false,
								done: false,
							});
							// ImageApiCAll(compressedResult);
						},
						error: (error) => {
							window.alert(error);
						},
					});
				}

				return true;
			};
		};
	};

	const ImageApiCAll = React.useCallback((data) => {
		const mime = "image";
		const formData = new FormData();

		// formData.append("directoryId", "root");

		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "blog_image");
		formData.append("file", data?.src);
		// { headers: { "Content-Type": "multipart/form-data" }

		const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

		axios
			.post(url, formData)
			.then((res) => {
				setModalOpen(true);
				setModalData("Image Uploaded", "success");
				setSubmitForm(true);
				setData((prev) => ({
					...prev,
					// imageUrl: res?.data?.data[0]?.data?.id,
					bannerImageUrl: res?.data?.public_id,
				}));
				setImgShow((prev) => ({
					...prev,
					loader: false,
					done: true,
				}));
			})
			.catch((err) => console.error(err));
	}, []);

	const CategoryApiCall = React.useCallback(() => {
		CategoryList({ type: "BLOG" })
			.then((res) => {
				setCategoryList(res?.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const CreateBlogApiCall = React.useCallback((data) => {
		createBlog(data)
			.then((res) => {
				setModalOpen(true);
				setModalData("Blog Created Successfully", "success");

				navigate("/explore/blogs");
				setData({
					title: "",
					bannerImageUrl: "",
					categoryId: "",
					categoryName: "",
					description: "",
					shortDescription: "",
					publishOnFeed: true,
					slug: "",
				});
				setImgShow("");
			})
			.catch((err) => console.error(err));
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (imgShow && submitForm === false) {
			window.alert("Please upload the selected image first");
		} else {
			CreateBlogApiCall(data);
		}
		// setFinalData(data);
	};

	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	React.useEffect(() => {
		CategoryApiCall();
	}, [CategoryApiCall]);

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
							Create Blog
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
												title: event.target.value,
												slug: event.target.value.replace(/[ ,]+/g, "-"),
											}));
										}}
										placeholder='Enter Title'
										label='Enter Title'
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
													categoryId: event.target.value,
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
										value={data.shortDescription}
										multiline
										onChange={(event) => {
											setData((prev) => ({
												...prev,
												shortDescription: event.target.value,
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
													{imgShow?.done === false && (
														<Box sx={{ marginLeft: "20px" }}>
															<Button
																onClick={() => {
																	setImgShow((prev) => ({
																		...prev,
																		loader: true,
																	}));
																	ImageApiCAll(imgShow);
																}}>
																upload
															</Button>
														</Box>
													)}
												</React.Fragment>
											)}
										</Box>
									</Box>

									<label for='img' style={{ color: "rgb(108 108 108)" }}>
										*Required image dimension 1024 x 1024px and shoud be less than 1MB
									</label>
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
}

export default CreateBlog;
