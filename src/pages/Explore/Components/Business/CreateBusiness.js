import { Cancel, Done, Upload } from "@mui/icons-material";
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
import MyGoogleMap from "../../../Neighbourhoods/Map/GoogleMap";
import "../../business.css";
import { createBusiness } from "../../services/ApiServices";
import { CategoryList } from "../../../Users/User_Services/UserApiService";
import { filterNeighbourhood } from "../../../Neighbourhoods/services/apiServices";
import { MainContext } from "../../../../context/Context";
import Compressor from "compressorjs";
import { v4 as uuidv4 } from "uuid";
import NewGoogleMap from "../../../Neighbourhoods/Map/NewGoogleMap";

function CreateBusiness({ listApiCall, handleExpanded }) {
	const { setModalOpen, setModalData, locationData } = React.useContext(MainContext);

	const [data, setData] = React.useState({
		name: "",
		address: "",
		approvalType: "",
		categoryId: "",
		categoryName: "",
		cloudId: "",
		cloudName: "",
		imageUrls: [],
		videoUrls: [],
		geoLocation: {
			coordinates: [0, 0],
		},
		description: "",
		logoURL: "",
		sponsored: false,
		approvalType: "BY_ADMIN",
	});

	const [categoryList, setCategoryList] = React.useState([]);
	const [cloudList, setCloudList] = React.useState([]);
	const [submitForm, setSubmitForm] = React.useState(false);
	const [imageUploaded, setImageUploaded] = React.useState(false);
	const [imgShow, setImgShow] = React.useState("");
	const [businessImgShow, setBusinessImgShow] = React.useState([]);

	const handleGLocation = (lat, lng, address) => {
		setData((prev) => ({
			...prev,
			geoLocation: {
				coordinates: [lng, lat],
			},
			// address: address,
		}));
	};

	const handleImageChange = (event) => {
		if (event?.target?.files?.length > 0) {
			for (let index = 0; index < event?.target?.files?.length; index++) {
				const image = event.target.files[index];
				const inputType = image.type.split("/")?.[0];
				if (inputType === "image") {
					new Compressor(image, {
						quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
						convertTypes: ["image/png"],
						success: (compressedResult) => {
							// compressedResult has the compressed file.
							// Use the compressed file to upload the images to your server.
							// setImages(compressedResult);
							setBusinessImgShow((prev) => [
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
				} else {
					setBusinessImgShow((prev) => [
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
			console.log("====================================");
			console.log("inputType", inputType);
			console.log("====================================");
			if (inputType === "image") {
				new Compressor(image, {
					quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
					convertTypes: ["image/png"],
					success: (compressedResult) => {
						// compressedResult has the compressed file.
						// Use the compressed file to upload the images to your server.
						setBusinessImgShow((prev) => [
							...prev,
							{
								type: inputType,
								data: URL.createObjectURL(compressedResult),
								id: uuidv4(),
								src: image,
								loader: true,
								done: false,
							},
						]);
					},
				});
			} else {
				setBusinessImgShow((prev) => [
					...prev,
					{
						type: inputType,
						data: URL.createObjectURL(image),
						id: uuidv4(),
						src: image,
						loader: true,
						done: false,
					},
				]);
			}
		}
	};

	const ImageApiCAll = React.useCallback((data, imageType, notifyMessage) => {
		if (imageType === "video") {
			const mime = "video";
			const formData = new FormData();

			formData.append("cloud_name", "banjee");
			formData.append("upload_preset", "business_images");
			formData.append("file", data?.src);

			const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload/`;

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
						videoUrls: [...prev.videoUrls, res?.data?.public_id],
					}));
					setBusinessImgShow((prev) => {
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

			formData.append("cloud_name", "banjee");
			formData.append("upload_preset", "business_images");
			formData.append("file", data?.src);

			const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;
			axios
				.post(url, formData)
				.then((res) => {
					if (imageType === "logo") {
						setData((prev) => ({
							...prev,
							logoURL: res?.data?.public_id,
						}));
					} else {
						if (notifyMessage === "Images Uploaded") {
							setImageUploaded(true);
							setModalOpen(true);
							setModalData("Image Uploaded", "success");
						}
						setSubmitForm(true);
						setData((prev) => ({
							...prev,
							imageUrls: [...prev.imageUrls, res?.data?.public_id],
						}));
						setBusinessImgShow((prev) => {
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
					}
				})
				.catch((err) => console.error(err));
		}
	}, []);

	function handleChange(event) {
		const { name, value } = event.target;

		setData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	}

	const CategoryListApiCall = React.useCallback(() => {
		CategoryList({ type: "LOCALBUSINESS" })
			.then((response) => {
				setCategoryList(response?.content);
				// console.log(response);
			})
			.catch((err) => console.error(err));
	}, []);

	const NeighbourhoodListApiCall = React.useCallback(() => {
		filterNeighbourhood({ page: 0, pageSize: 100, online: true })
			.then((res) => {
				setCloudList(res.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const createApiCall = React.useCallback((payload) => {
		createBusiness(payload)
			.then((res) => {
				setModalOpen(true);
				setModalData("Business created successfully", "success");
				handleExpanded();
				setData({
					name: "",
					address: "",
					sponsored: false,
					approvalType: "",
					categoryId: "",
					categoryName: "",
					cloudId: "",
					cloudName: "",
					imageUrls: [],
					geoLocation: {
						coordinates: [0, 0],
					},
					description: "",
					logoURL: "",
					approvalType: "BY_ADMIN",
				});
				setImgShow("");
				setBusinessImgShow("");
				document.getElementById("img").value = "";
				document.getElementById("businessImage").value = "";
				listApiCall(0, 10);
			})
			.catch((err) => console.error(err));
	}, []);

	function handleSubmit(event) {
		event.preventDefault();
		if (businessImgShow?.length > 0 && submitForm === false) {
			window.alert("PLease upload the selected image first");
		} else {
			createApiCall({
				...data,
				geoLocation: {
					coordinates: [locationData?.lng, locationData?.lat],
				},
			});
		}
	}

	function blobToBase64(blob) {
		return new Promise((resolve, _) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	}

	const newImageFunc = async (data) => {
		const base64 = await blobToBase64(data);
		// console.log(base64);
	};

	React.useEffect(() => {
		CategoryListApiCall();
		NeighbourhoodListApiCall();
	}, [CategoryListApiCall, NeighbourhoodListApiCall]);

	return (
		<Grid item container xs={12} spacing={2}>
			<Grid item xs={12}>
				<Box sx={{ padding: "20px" }}>
					<form onSubmit={handleSubmit}>
						<Grid item container xs={12} spacing={2}>
							<Grid item xs={12} sm={4}>
								<Box>
									{/* <Typography sx={{ mb: 0.5, ml: 0.2 }}>Business Name :</Typography> */}
									<TextField
										required
										value={data.name}
										name='name'
										className='neighbourhood-form-textField2'
										fullWidth
										label='Enter Business Name'
										placeholder='Enter Business Name'
										onChange={handleChange}
									/>
								</Box>
							</Grid>

							<Grid item xs={12} sm={4}>
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
							<Grid item xs={12} sm={4}>
								<FormControl fullWidth>
									<InputLabel id='demo-simple-select-label'>Cloud Type</InputLabel>
									<Select
										required
										labelId='demo-simple-select-label'
										id='demo-simple-select'
										name='type'
										label='Cloud Type'
										value={data?.cloudId}
										onChange={(event, data) => {
											setData((prev) => ({
												...prev,
												cloudId: event.target.value,
												cloudName: data?.props?.children,
											}));
										}}>
										{cloudList &&
											cloudList?.map((item, index) => {
												return (
													<MenuItem key={index} value={item?.id}>
														{item?.name}
													</MenuItem>
												);
											})}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									className='neighbourhood-form-textField'
									fullWidth
									label='Address'
									rows={3}
									maxRows={5}
									placeholder='Address'
									name='address'
									value={data?.address}
									multiline
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
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
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<Box>
									<Typography sx={{ marginLeft: "0.3px" }}>Choose Logo</Typography>
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

														// setImgShow(URL.createObjectURL(compressedResult));

														setImgShow(URL.createObjectURL(compressedResult));
														const data = {
															src: compressedResult,
														};
														ImageApiCAll(data, "logo", "");
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
												<img src={imgShow} alt='photo' style={{ width: "100%", height: "100%" }} />
											</Box>
										)}
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Box>
									<Typography sx={{ marginLeft: "0.3px" }}>Choose Images</Typography>
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
											multiple
											id='businessImage'
											accept='video/*, image/*'
											onChange={(event) => {
												handleImageChange(event);
											}}
										/>
										{businessImgShow &&
											businessImgShow?.map((item, index) => {
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
																		businessImgShow?.map((item, index) => {
																			if (businessImgShow?.length - 1 === index) {
																				document.getElementById("businessImage").value = "";
																			}
																			return item;
																		});
																		setBusinessImgShow((prev) =>
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
																	businessImgShow?.map((item, index) => {
																		if (businessImgShow?.length - 1 === index) {
																			document.getElementById("businessImage").value = "";
																		}
																		return item;
																	});
																	setBusinessImgShow((prev) =>
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
										{businessImgShow?.length > 0 && imageUploaded === false && (
											<Box sx={{ marginLeft: "20px" }}>
												<Button
													color={imageUploaded ? "secondary" : "primary"}
													onClick={() => {
														setBusinessImgShow((prev) => {
															return prev.map((item) => {
																return {
																	...item,
																	loader: true,
																	done: false,
																};
															});
														});
														businessImgShow?.map((item, index) => {
															if (businessImgShow?.length - 1 === index) {
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
							</Grid>
							<Grid item xs={12}>
								<Box sx={{ position: "relative" }}>
									{/* <MyGoogleMap handleGLocation={handleGLocation} /> */}
									<NewGoogleMap />
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Box sx={{ marginY: "10px", display: "flex", justifyContent: "flex-end" }}>
									<Button variant='contained' type='submit'>
										Submit
									</Button>
								</Box>
							</Grid>
						</Grid>
					</form>
				</Box>
			</Grid>
		</Grid>
	);
}

export default CreateBusiness;
