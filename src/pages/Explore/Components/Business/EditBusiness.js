import { ArrowBack, Cancel, Upload } from "@mui/icons-material";
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

function EditBusiness() {
	const { setModalData, setModalOpen } = React.useContext(MainContext);
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

	const ImageApiCAll = React.useCallback((data, imageType) => {
		const mime = "image";
		const formData = new FormData();

		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "business_images");
		formData.append("file", data);

		const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

		// const header = {
		// 	"Content-Type": "multipart/form-data",
		// 	Authorization: `Bearer ${token}`,
		// };

		axios
			.post(url, formData)
			.then((res) => {
				if (imageType === "logo") {
					setData((prev) => ({
						...prev,
						logoURL: res?.data?.public_id,
						// logoURL: res?.data?.data[0]?.data?.id,
						// logoURL: `https://gateway.banjee.org/services/media-service/iwantcdn/resources/${res?.data?.data[0]?.data?.id}?actionCode=ACTION_GET_RESOURCE`,
					}));
				} else {
					setData((prev) => ({
						...prev,
						imageUrls: [...prev.imageUrls, res?.data?.public_id],
					}));
				}
			})
			.catch((err) => console.error(err));
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

	const handleImageChange = (event) => {
		if (event?.target?.files?.length > 0) {
			for (let index = 0; index < event?.target?.files?.length; index++) {
				// const data = event?.target?.files[index].type.split("/")?.[0];
				const image = event.target.files[index];
				new Compressor(image, {
					quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
					convertTypes: ["image/png"],
					success: (compressedResult) => {
						// compressedResult has the compressed file.
						// Use the compressed file to upload the images to your server.
						// setImages(compressedResult);
						// setImgShow(URL.createObjectURL(compressedResult));
						setBusinessImgShow((prev) => [...prev, URL.createObjectURL(compressedResult)]);
						ImageApiCAll(
							compressedResult,
							"image"
							// event?.target?.files[index].type,
						);
					},
				});
			}
		} else {
			const image = event.target.files[0];
			new Compressor(image, {
				quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
				convertTypes: ["image/png"],
				success: (compressedResult) => {
					// compressedResult has the compressed file.
					// Use the compressed file to upload the images to your server.
					// setImages(compressedResult);
					// setImgShow(URL.createObjectURL(compressedResult));
					setBusinessImgShow((prev) => [...prev, URL.createObjectURL(compressedResult)]);
					ImageApiCAll(
						compressedResult,
						"image"
						// event?.target?.files[index].type,
					);
				},
			});
		}
	};

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
							`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${res?.imageUrls[index]}.png`,
						]);
					}
				} else {
					setBusinessImgShow((prev) => [
						...prev,
						"https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${res?.imageUrls[index]}.png",
					]);
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
		filterNeighbourhood({ page: 0, pageSize: 1000 })
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

	const EditApiCall = React.useCallback((data) => {
		updateBusiness({ ...businessData, ...data })
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
		EditApiCall(data);
		event.preventDefault();
	}

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

																setImages(compressedResult);
																setImgShow(URL.createObjectURL(compressedResult));
																ImageApiCAll(compressedResult, "logo");
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
												{businessImgShow?.length > 0 &&
													businessImgShow?.map((item, index) => {
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
																		if (businessImgShow?.length === 1) {
																			document.getElementById("businessImage").value = "";
																		}
																		setBusinessImgShow((prev) =>
																			prev?.filter((data) => data !== item)
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
																	src={item}
																	alt='photo'
																	style={{ width: "100%", height: "100%", objectFit: "contain" }}
																/>
															</Box>
														);
													})}
											</Box>
										</Box>
									</Grid>
									<Grid item xs={12}>
										<Box sx={{ position: "relative" }}>
											<MyGoogleMap
												handleGLocation={handleGLocation}
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
