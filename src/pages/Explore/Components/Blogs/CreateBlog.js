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
} from "@mui/material";
import "../../business.css";
import { CategoryList } from "../../../Users/User_Services/UserApiService";
import axios from "axios";
import { ArrowBack, Cancel } from "@mui/icons-material";
import { createBlog } from "../../services/ApiServices";
import { useNavigate } from "react-router";
import SnackBarComp from "../../../../CustomComponents/SnackBarComp";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Compressor from "compressorjs";

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

	const [state, setState] = React.useState("");

	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "",
		duration: 3000,
		severity: "",
	});

	const [finalData, setFinalData] = React.useState("");

	const [imgShow, setImgShow] = React.useState("");
	const [categoryList, setCategoryList] = React.useState("");

	const ImageApiCAll = React.useCallback((data) => {
		const mime = "image";
		const formData = new FormData();

		// formData.append("directoryId", "root");

		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "blog_image");
		formData.append("file", data);
		// { headers: { "Content-Type": "multipart/form-data" }

		const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

		axios
			.post(url, formData)
			.then((res) => {
				setData((prev) => ({
					...prev,
					// imageUrl: res?.data?.data[0]?.data?.id,
					bannerImageUrl: res?.data?.public_id,
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
				setSnackbar({
					open: true,
					message: "Blog Created Successfully",
					severity: "success",
					duration: 3000,
				});

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

	const handleSnackbar = (data) => {
		setSnackbar((prev) => ({
			...prev,
			open: data,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		// setFinalData(data);
		CreateBlogApiCall(data);
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
													// newImageFunc(event.target.files[0]);
													const image = event.target.files[0];
													new Compressor(image, {
														quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
														convertTypes: ["image/png"],
														success: (compressedResult) => {
															// compressedResult has the compressed file.
															// Use the compressed file to upload the images to your server.
															// setImages(compressedResult);
															// setImgShow(URL.createObjectURL(compressedResult));

															setImgShow(URL.createObjectURL(compressedResult));
															ImageApiCAll(compressedResult);
														},
													});
													// setData((prev) => ({
													// 	...prev,
													// 	logoURL: event.target.files[0],
													// }));
												}}
											/>
											{imgShow && (
												<Box
													sx={{
														position: "relative",
														width: "80px",
														height: "80px",
														border: "0.5px solid lightgrey",
														padding: "5px",
														borderRadius: "5px",
													}}>
													<IconButton
														onClick={() => {
															document.getElementById("img").value = "";
															setImgShow("");
															setData((prev) => ({
																...prev,
																bannerImageUrl: "",
															}));
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
														src={imgShow}
														alt='photo'
														style={{ width: "100%", height: "100%" }}
													/>
												</Box>
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
					<SnackBarComp data={snackbar} handleSnackbar={handleSnackbar} />
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
