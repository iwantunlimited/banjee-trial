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
import MyGoogleMap from "../../../Neighbourhoods/Map/GoogleMap";
import "../../business.css";
import { findByIdBusiness, updateBusiness } from "../../services/ApiServices";
import { CategoryList } from "../../../Users/User_Services/UserApiService";
import { filterNeighbourhood } from "../../../Neighbourhoods/services/apiServices";

import { useNavigate, useParams } from "react-router";
import { MainContext } from "../../../../context/Context";
import Compressor from "compressorjs";

import { v4 as uuidv4 } from "uuid";
import NewGoogleMap from "../../../Neighbourhoods/Map/NewGoogleMap";

function EditBusiness() {
	const { setModalData, setModalOpen, locationData } = React.useContext(MainContext);
	const params = useParams();
	const navigate = useNavigate();

	const [businessData, setBusinessData] = React.useState("");
	const [data, setData] = React.useState({
		name: "",
		address: "",
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
		sponsored: false,
		approvalType: "BY_ADMIN",
	});

	const [categoryList, setCategoryList] = React.useState([]);
	const [cloudList, setCloudList] = React.useState([]);
	const [submitForm, setSubmitForm] = React.useState(false);
	const [imageUploaded, setImageUploaded] = React.useState(false);
	const [businessImgShow, setBusinessImgShow] = React.useState([]);

	const [images, setImages] = React.useState("");
	const [imgShow, setImgShow] = React.useState("");

	const handleGLocation = (lat, lng, address) => {
		setData((prev) => ({
			...prev,
			geoLocation: {
				coordinates: [lat, lng],
			},
			// address: address,
		}));
	};

	function handleChange(event) {
		const { name, value } = event.target;

		setData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	}

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
							setBusinessImgShow((prev) => [
								...prev,
								{
									update: true,
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
							update: true,
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
					convertTypes: ["image/png"],
					success: (compressedResult) => {
						// compressedResult has the compressed file.
						// Use the compressed file to upload the images to your server.
						setBusinessImgShow((prev) => [
							...prev,
							{
								update: true,
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
						update: true,
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
						setSubmitForm(true);
					}
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
							setSubmitForm(true);
						}
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

	const BusinessDetailApiCall = React.useCallback(() => {
		findByIdBusiness(params?.id)
			.then((res) => {
				setBusinessData(res);
				setData((prev) => ({
					id: res?.id,
					name: res?.name ? res?.name : "",
					address: res?.address ? res?.address : "",
					sponsored: false,
					approvalType: "",
					categoryId: res?.categoryId ? res?.categoryId : "",
					categoryName: res?.categoryName ? res?.categoryName : "",
					cloudId: res?.cloudId ? res?.cloudId : "",
					cloudName: res?.cloudName ? res?.cloudName : "",
					imageUrls: res?.imageUrls ? res?.imageUrls : [],
					geoLocation: {
						coordinates: res?.geoLocation?.coordinates ? res?.geoLocation?.coordinates : [0, 0],
					},
					description: res?.description ? res?.description : "",
					logoURL: res?.logoURL ? res?.logoURL : "",
					approvalType: "BY_ADMIN",
				}));
				setImgShow(
					`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${res?.logoURL}.png`
				);
				if (res?.imageUrls?.length > 0) {
					for (let index = 0; index < res?.imageUrls?.length; index++) {
						setBusinessImgShow((prev) => [
							...prev,
							{
								update: false,
								type: "image",
								id: uuidv4(),
								data: `https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${res?.imageUrls[index]}.png`,
								src: "",
								loader: false,
								done: false,
							},
						]);
					}
				}
				if (res?.videoUrls?.length > 0) {
					for (let index = 0; index < res?.videoUrls?.length; index++) {
						setBusinessImgShow((prev) => [
							...prev,
							{
								update: false,
								type: "video",
								id: uuidv4(),
								data: `https://res.cloudinary.com/banjee/video/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${res?.videoUrls[index]}.mp4`,
								src: "",
								loader: false,
								done: false,
							},
						]);
					}
				}
			})
			.catch((err) => console.error(err));
	}, []);

	const CategoryListApiCall = React.useCallback(() => {
		CategoryList({ type: "LOCALBUSINESS" })
			.then((response) => {
				setCategoryList(response?.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const NeighbourhoodListApiCall = React.useCallback(() => {
		filterNeighbourhood({ page: 0, pageSize: 1000, online: true })
			.then((res) => {
				setCloudList(res.content);
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		CategoryListApiCall();
		NeighbourhoodListApiCall();
		BusinessDetailApiCall();
	}, [CategoryListApiCall, BusinessDetailApiCall, NeighbourhoodListApiCall]);

	const EditApiCall = React.useCallback((payload) => {
		updateBusiness({
			...businessData,
			...payload,
		})
			.then((res) => {
				setModalOpen(true);
				setModalData("Business updated");

				setImages("");
				setImgShow("");
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
				setImages("");
				setImgShow("");
				navigate("/explore/detail/" + params.id);
				document.getElementById("img").value = "";
			})
			.catch((err) => console.error(err));
	}, []);

	function handleSubmit(event) {
		event.preventDefault();
		const result = businessImgShow?.filter((item) => item?.update === true);
		if (result?.length > 0 && submitForm === false) {
			window.alert("Please upload the selected image first");
		} else {
			EditApiCall({
				...data,
				geoLocation: {
					coordinates: [locationData?.lng, locationData?.lat],
				},
			});
		}
	}

	console.log("====================================");
	console.log("data", data);
	console.log("====================================");
	console.log("====================================");
	console.log("locationdata", locationData);
	console.log("====================================");

	if (businessData && cloudList && categoryList) {
		return (
			<Container maxWidth='xl'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<IconButton onClick={() => navigate("/explore/detail/" + params.id)}>
							<ArrowBack color='primary' />
						</IconButton>
						<Card sx={{ padding: "30px" }}>
							<Typography
								sx={{ color: "#6b778c", fontSize: "20px", fontWeight: "500", textAlign: "left" }}>
								Edit Business
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "30px" }}>
							<form onSubmit={handleSubmit}>
								<Grid item container xs={12} spacing={2}>
									<Grid item xs={4}>
										<Box>
											{/* <Typography sx={{ mb: 0.5, ml: 0.2 }}>Business Name :</Typography> */}
											<TextField
												required
												value={data.name}
												name='name'
												className='neighbourhood-form-textField2'
												fullWidth
												// label='Enter Business Name'
												placeholder='Enter Business Name'
												onChange={handleChange}
											/>
										</Box>
									</Grid>

									<Grid item xs={4}>
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
									<Grid item xs={4}>
										<FormControl fullWidth>
											<InputLabel id='cloud-select-label'>Cloud Type</InputLabel>
											<Select
												required
												labelId='cloud-select-label'
												id='cloud-select'
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
									<Grid item xs={6}>
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
									<Grid item xs={6}>
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
													width: "100%",
													height: "100%",
													border: "0.5px solid lightgrey",
													p: 1,
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
																const data = {
																	src: compressedResult,
																};
																setImages(compressedResult);
																setImgShow(URL.createObjectURL(compressedResult));
																ImageApiCAll(data, "logo", "");
															},
														});
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
																setImages("");
																setImgShow("");
																setData((prev) => ({
																	...prev,
																	logoURL: "",
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
													accept='.jpg, .jpeg, .png'
													onChange={(event) => {
														// newImageFunc(event.target.files[0]);
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
																			marginRight: "5px",
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
																		marginRight: "5px",
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
																		if (item?.update) {
																			return {
																				...item,
																				loader: true,
																				done: false,
																			};
																		} else {
																			return item;
																		}
																	});
																});
																businessImgShow?.map((item, index) => {
																	if (item?.update) {
																		if (businessImgShow?.length - 1 === index) {
																			ImageApiCAll(item, item?.type, "Images Uploaded");
																		} else {
																			ImageApiCAll(item, item?.type, "");
																		}
																		return item;
																	} else {
																		return item;
																	}
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
											{/* <MyGoogleMap
												handleGLocation={handleGLocation}
												prevLocation={{
													lat: data?.geoLocation?.coordinates[0],
													lng: data?.geoLocation?.coordinates[1],
												}}
											/> */}
											<NewGoogleMap
												prevLocation={{
													lat: data?.geoLocation?.coordinates[0],
													lng: data?.geoLocation?.coordinates[1],
												}}
											/>
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
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default EditBusiness;
