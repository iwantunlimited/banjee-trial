import React from "react";
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
	Typography,
	Select,
	Input,
	Button,
	IconButton,
} from "@mui/material";
import axios from "axios";
import MyGoogleMap from "../Map/GoogleMap";
import "../neighbourhood.css";
import {
	createNeighbourhood,
	findCity,
	findCountry,
	findNeighbourhood,
	findState,
	updateNeighbourhood,
} from "../services/apiServices";
import SnackBarComp from "../../../CustomComponents/SnackBarComp";
import { useNavigate, useParams } from "react-router";

function EditNeighbourhood() {
	const params = useParams();
	const navigate = useNavigate();
	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "",
		duration: 3000,
		severity: "success,",
	});

	const [data, setData] = React.useState({
		name: "",
		approvalType: "",
		bannerImageUrls: [],
		cityId: "",
		countryId: "",
		lat: "",
		lon: "",
		description: "",
		imageUrl: "",
		type: "",
		approvalType: "BY_ADMIN",
	});

	console.log("form data", data);

	const [country, setCountry] = React.useState();
	const [state, setState] = React.useState();
	const [city, setCity] = React.useState();
	const [sState, setSState] = React.useState();
	const [defaultLocation, setDefaultLocation] = React.useState();

	const [images, setImages] = React.useState("");
	const [imgShow, setImgShow] = React.useState("");

	const handleGLocation = (lat, lng, address) => {
		setData((prev) => ({
			...prev,
			lat: lat,
			lon: lng,
			address: address,
		}));
	};

	const handleSnackbar = (data) => {
		setSnackbar((prev) => ({
			...prev,
			open: data,
		}));
	};

	const CityApi = React.useCallback((id) => {
		findCity({ cityId: id })
			.then((res) => {
				console.log("city -----------", res);
				setCity(res.content);
			})
			.catch((err) => console.log(err));
	});

	const StateApi = React.useCallback((countryId) => {
		findState({ countryId: countryId })
			.then((res) => {
				setState(res.content);
				console.log("State", res);
			})
			.catch((err) => console.log(err));
	}, []);

	const CountryApi = React.useCallback(() => {
		findCountry()
			.then((res) => {
				setCountry(res);
				setData((prev) => ({
					...prev,
					countryId: res.length > 0 ? res?.[0]?.id : false,
				}));
				StateApi(res?.[0]?.id || "");
				console.log("COuntry", res);
			})
			.catch((err) => console.log(err));
	}, []);

	console.log("defaultLocation", defaultLocation);

	const ImageApiCAll = React.useCallback((data) => {
		const mime = "image";
		// console.log("====================================");
		// console.log("image api data", data);
		// console.log("====================================");
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
				setData((prev) => ({
					...prev,
					// imageUrl: res?.data?.data[0]?.data?.id,
					imageUrl: res?.data?.public_id,
				}));
			})
			.catch((err) => console.log(err));
	}, []);

	const ApiCall = React.useCallback(() => {
		findNeighbourhood(params?.id)
			.then((res) => {
				setData((prev) => ({
					...prev,
					name: res?.name ? res?.name : "",
					approvalType: "",
					bannerImageUrls: res?.bannerImageUrl ? res?.bannerImageUrl : [],
					cityId: res?.cityId ? res.cityId : "",
					countryId: res?.countryId ? res.countryId : "",
					lat: res?.geoLocation?.coordinates ? res?.geoLocation?.coordinates[0] : "",
					lon: res?.geoLocation?.coordinates ? res?.geoLocation?.coordinates[1] : "",
					description: res?.description ? res?.description : "",
					imageUrl: res?.imageUrl ? res?.imageUrl : "",
					type: res?.cloudType ? res?.cloudType : "",
					approvalType: "BY_ADMIN",
				}));
				setImgShow(res?.imageUrl);
				console.log("====================================");
				console.log("find neighbour api call", res);
				console.log("====================================");
			})
			.catch((err) => console.log(err));
	}, []);

	React.useEffect(() => {
		CountryApi();
		ApiCall();
	}, [CountryApi]);

	function handleChange(event) {
		const { name, value } = event.target;

		setData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	}

	const EditApiCall = React.useCallback((data) => {
		updateNeighbourhood(data)
			.then((res) => {
				setSnackbar({
					open: true,
					duration: 3000,
					severity: "success",
					message: "Neighbourhood updated successfully",
				});
				setImages("");
				setImgShow("");
				setData({
					name: "",
					approvalType: "",
					bannerImageUrls: [],
					cityId: "",
					lat: "",
					lon: "",
					description: "",
					imageUrl: "",
					type: "",
					approvalType: "BY_ADMIN",
				});

				document.getElementById("img").value = "";
			})
			.catch((err) => console.log(err));
	}, []);

	function handleSubmit(event) {
		console.log("final data-------", data);
		EditApiCall(data);
		event.preventDefault();
	}

	return (
		<Container maxWidth='xl'>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBack />
					</IconButton>
					<Card sx={{ padding: "30px" }}>
						<Typography
							sx={{ color: "#6b778c", fontSize: "20px", fontWeight: "500", textAlign: "left" }}>
							Edit Neighbourhood
						</Typography>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<Card sx={{ padding: "30px" }}>
						<form onSubmit={handleSubmit}>
							<Grid item container xs={12} spacing={2}>
								<Grid item xs={6}>
									<TextField
										required
										value={data.name}
										name='name'
										className='neighbourhood-form-textField'
										fullWidth
										label='Enter Neighbourhood Name'
										placeholder='Enter Neighbourhood Name'
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<FormControl fullWidth>
										<InputLabel id='demo-simple-select-label'>Neighbourhood Type</InputLabel>
										<Select
											required
											labelId='demo-simple-select-label'
											id='demo-simple-select'
											name='type'
											label='Neighbourhood Type'
											value={data?.type}
											onChange={handleChange}>
											<MenuItem value={"PRIVATE"}>Private</MenuItem>
											<MenuItem value={"PUBLIC"}>Public</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								{data.countryId && (
									<Grid item xs={4}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>Country</InputLabel>
											<Select
												required
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='countryId'
												label='Country'
												value={data?.countryId}
												onChange={handleChange}>
												{country?.map((item, index) => (
													<MenuItem value={item.id} key={index}>
														{item.name}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Grid>
								)}
								{data.countryId && (
									<Grid item xs={4}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>State</InputLabel>
											<Select
												required
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='state'
												label='State'
												value={sState}
												onChange={(event) => {
													setSState(event.target.value);
													// setData((prevData) => {
													// 	return {
													// 		...prevData,
													// 		state: event.target.value,
													// 	};
													// });
													CityApi(event.target.value);
												}}>
												{state?.length > 0 &&
													state?.map((item, index) => (
														<MenuItem value={item.id} key={index}>
															{item.name}
														</MenuItem>
													))}
											</Select>
										</FormControl>
									</Grid>
								)}
								{sState && (
									<Grid item xs={4}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>City</InputLabel>
											<Select
												required
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='cityId'
												label='City'
												value={data?.cityId}
												onChange={(event) => {
													// console.log("event", event.target);
													const defaultLatLon = city.filter((item) => {
														if (item.id === event.target.value) {
															setDefaultLocation({
																...item?.gpsLocation,
																lng: item?.gpsLocation?.lon,
															});
															// setLoc({
															// 	...item?.gpsLocation,
															// 	lng: item?.gpsLocation?.lon,
															// });
														} else return null;
													});
													console.log("defaultLatLon", defaultLatLon);
													setData((prevData) => {
														return {
															...prevData,
															cityId: event.target.value,
														};
													});
												}}>
												{city?.length > 0 &&
													city?.map((item, index) => (
														<MenuItem value={item.id} lat={item?.gpsLocation} key={index}>
															{item.name}
														</MenuItem>
													))}
											</Select>
										</FormControl>
									</Grid>
								)}

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
								<Grid item xs={6}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											// justifyContent: "space-around",
											width: "80%",
											height: "100%",
											border: "0.5px solid lightgrey",
											padding: "10px",
											borderRadius: "5px",
										}}>
										<input
											className='neighbourhood-form-textField'
											type='file'
											name='imageUrl'
											id='img'
											accept='.jpg, .jpeg, .png'
											onChange={(event) => {
												// newImageFunc(event.target.files[0]);
												setImages(event?.target?.files[0]);
												setImgShow(URL.createObjectURL(event?.target?.files[0]));
												ImageApiCAll(event?.target?.files[0]);
												// setData((prev) => ({
												// 	...prev,
												// 	imageUrl: event.target.files[0],
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
															imageUrl: "",
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
								</Grid>
								<Grid item xs={12}>
									<Box sx={{ position: "relative" }}>
										<MyGoogleMap
											handleGLocation={handleGLocation}
											prevLocation={{ lat: data?.lat, lng: data?.lon }}
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
			<SnackBarComp handleSnackbar={handleSnackbar} data={snackbar} />
		</Container>
	);
}

export default EditNeighbourhood;
