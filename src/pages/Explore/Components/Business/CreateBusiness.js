import { Cancel, Upload } from "@mui/icons-material";
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
} from "@mui/material";
import axios from "axios";
import React from "react";
import MyGoogleMap from "../../../Neighbourhoods/Map/GoogleMap";
import "../../business.css";
import SnackBarComp from "../../../../CustomComponents/SnackBarComp";
import { createBusiness } from "../../services/ApiServices";
import { CategoryList } from "../../../Users/User_Services/UserApiService";
import { filterNeighbourhood } from "../../../Neighbourhoods/services/apiServices";

function CreateBusiness({ listApiCall, handleExpanded }) {
	const [snackbar, setSnackbar] = React.useState({
		open: false,
		duration: 3000,
		severity: "",
		message: "",
	});

	const [data, setData] = React.useState({
		name: "",
		address: "",
		approvalType: "",
		categoryId: "",
		categoryName: "",
		cloudId: "",
		cloudName: "",
		bannerImageUrls: [],
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

	const [images, setImages] = React.useState("");
	const [imgShow, setImgShow] = React.useState("");
	const [businessImgShow, setBusinessImgShow] = React.useState([]);

	console.log("businessImgShow", businessImgShow);
	console.log("data", data);

	const handleGLocation = (lat, lng, address) => {
		setData((prev) => ({
			...prev,
			geoLocation: {
				coordinates: [lng, lat],
			},
			// address: address,
		}));
	};

	const handleSnackbar = (data) => {
		setSnackbar((prev) => ({
			...prev,
			open: data,
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

		console.log("imageType", imageType);
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
						bannerImageUrls: [...prev.bannerImageUrls, res?.data?.public_id],
					}));
				}
			})
			.catch((err) => console.log(err));
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
			.catch((err) => console.log(err));
	}, []);

	const NeighbourhoodListApiCall = React.useCallback(() => {
		filterNeighbourhood({ page: 0, pageSize: 100 })
			.then((res) => {
				setCloudList(res.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const createApiCall = React.useCallback((data) => {
		createBusiness(data)
			.then((res) => {
				setSnackbar({
					open: true,
					duration: 3000,
					severity: "success",
					message: "Business created successfully",
				});
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
					bannerImageUrls: [],
					geoLocation: {
						coordinates: [0, 0],
					},
					description: "",
					logoURL: "",
					approvalType: "BY_ADMIN",
				});
				setImages("");
				setImgShow("");
				document.getElementById("img").value = "";
				listApiCall(0, 10);
			})
			.catch((err) => console.log(err));
	}, []);

	function handleSubmit(event) {
		createApiCall(data);
		event.preventDefault();
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
												setImages(event?.target?.files[0]);
												setImgShow(URL.createObjectURL(event?.target?.files[0]));
												ImageApiCAll(event?.target?.files[0], "logo");
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
											accept='.jpg, .jpeg, .png'
											onChange={(event) => {
												// newImageFunc(event.target.files[0]);

												if (event?.target?.files?.length > 0) {
													for (let index = 0; index < event?.target?.files?.length; index++) {
														const data = event?.target?.files[index].type.split("/")?.[0];
														setBusinessImgShow((prev) => [
															...prev,
															URL.createObjectURL(event?.target?.files[index]),
														]);
														ImageApiCAll(
															event?.target?.files[index],
															"image"
															// event?.target?.files[index].type,
														);
													}
												} else {
													setBusinessImgShow((prev) => [
														...prev,
														URL.createObjectURL(event?.target?.files[0]),
													]);
													ImageApiCAll(event?.target?.files[0], "image");
												}
											}}
										/>
										{businessImgShow?.length > 0 &&
											businessImgShow?.map((item, index) => {
												console.log("value", document.getElementById("businessImage").value);
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
																setBusinessImgShow((prev) => prev?.filter((data) => data !== item));
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
									<MyGoogleMap handleGLocation={handleGLocation} />
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
			<SnackBarComp handleSnackbar={handleSnackbar} data={snackbar} />
		</Grid>
	);
}

export default CreateBusiness;
