import React from "react";
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
	Typography,
	Select,
	Input,
	Button,
	IconButton,
	CircularProgress,
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

import Compressor from "compressorjs";
import { useNavigate, useParams } from "react-router";
import { MainContext } from "../../../context/Context";
import NewGoogleMap from "../Map/NewGoogleMap";
import GoogleMapCustom from "../../../CustomComponents/GoogleMap";

function EditNeighbourhood() {
	const params = useParams();
	const navigate = useNavigate();

	const { setModalOpen, setModalData } = React.useContext(MainContext);

	const token = localStorage?.getItem("token");

	const [data, setData] = React.useState({
		// id: params?.id,
		name: "",
		approvalType: "",
		bannerImageUrl: [],
		cityId: "6308a58eea0553e25b9d0a25",
		countryId: "611a116fa2d3c765b9338dad",
		geoLocation: {
			coordinates: [0, 0],
			type: "Point",
		},
		description: "",
		imageUrl: "",
		type: "",
		approvalType: "BY_ADMIN",
	});

	const [country, setCountry] = React.useState();
	const [state, setState] = React.useState();
	const [city, setCity] = React.useState();
	const [sState, setSState] = React.useState();
	const [defaultLocation, setDefaultLocation] = React.useState();
	const [response, setResponse] = React.useState("");
	const [submitForm, setSubmitForm] = React.useState(false);
	const [imgShow, setImgShow] = React.useState("");
	const [prevLocation, setPrevLocation] = React.useState(null);

	// const CityApi = React.useCallback((id) => {
	// 	findCity({ cityId: id })
	// 		.then((res) => {
	// 			setCity(res.content);
	// 		})
	// 		.catch((err) => console.error(err));
	// });

	// const StateApi = React.useCallback((countryId) => {
	// 	findState({ countryId: countryId })
	// 		.then((res) => {
	// 			setState(res.content);
	// 		})
	// 		.catch((err) => console.error(err));
	// }, []);

	// const CountryApi = React.useCallback(() => {
	// 	findCountry()
	// 		.then((res) => {
	// 			setCountry(res);
	// 			setData((prev) => ({
	// 				...prev,
	// 				countryId: res.length > 0 ? res?.[0]?.id : false,
	// 			}));
	// 			StateApi(res?.[0]?.id || "");
	// 		})
	// 		.catch((err) => console.error(err));
	// }, []);

	function handleImageChange(event) {
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
	}

	const ImageApiCAll = React.useCallback((data) => {
		const mime = "image";
		// const header = {
		// 	"Content-Type": "multipart/form-data",
		// 	Authorization: `Bearer ${token}`,
		// };

		const formData = new FormData();
		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "blog_image");
		formData.append("file", data?.src);
		// { headers: { "Content-Type": "multipart/form-data" }

		const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;
		axios
			.post(url, formData)
			.then((res) => {
				console.log("====================================");
				console.log("res", res);
				console.log("====================================");
				setSubmitForm(true);
				setModalOpen(true);
				setModalData("Image Uploaded", "success");
				setData((prev) => ({
					...prev,
					imageUrl: res?.data?.public_id,
					// imageUrl: res?.data[0].data.id,
				}));
				setImgShow((prev) => ({
					...prev,
					loader: false,
					done: true,
				}));
			})
			.catch((err) => console.log(err));
	}, []);

	const ApiCall = React.useCallback(() => {
		findNeighbourhood(params?.id)
			.then((res) => {
				setResponse(res);
				setData((prev) => ({
					...prev,
					name: res?.name ? res?.name : "",
					approvalType: "",
					bannerImageUrl: res?.bannerImageUrl ? res?.bannerImageUrl : [],
					cityId: res?.cityId ? res.cityId : "6308a58eea0553e25b9d0a25",
					countryId: res?.countryId ? res.countryId : "611a116fa2d3c765b9338dad",
					geoLocation: {
						coordinates: [
							res?.geoLocation?.coordinates ? res?.geoLocation?.coordinates[0] : "",
							res?.geoLocation?.coordinates ? res?.geoLocation?.coordinates[1] : "",
						],
						type: "Ponit",
					},
					// lat: res?.geoLocation?.coordinates ? res?.geoLocation?.coordinates[0] : "",
					// lon: res?.geoLocation?.coordinates ? res?.geoLocation?.coordinates[1] : "",
					description: res?.description ? res?.description : "",
					imageUrl: res?.imageUrl ? res?.imageUrl : "",
					type: res?.cloudType ? res?.cloudType : "",
					approvalType: "BY_ADMIN",
				}));
				setPrevLocation({
					lat: res?.geoLocation?.coordinates[1],
					lng: res?.geoLocation?.coordinates[0],
				});
				setImgShow({
					data: res?.imageUrl
						? `https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${res?.imageUrl}.png`
						: "",
					src: "",
					loader: false,
					done: false,
					update: false,
				});
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		// CountryApi();
		// setTimeout(() => {
		ApiCall();
		// }, 2000);
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

	const EditApiCall = (payloadData) => {
		const payload = {
			// categoryId: payloadData?.categoryId,
			// categoryName: payloadData?.categoryName,
			description: payloadData?.description,
			// countryId: payloadData?.countryId,
			// cloudType: payloadData?.cloudType,
			// approvalType: "BY_ANY_MEMBER",
			name: payloadData?.name,
			// lat: payloadData?.geoLocation.coordinates[1],
			// lon: payloadData?.geoLocation.coordinates[0],
			id: payloadData?.id,
			imageUrl: payloadData?.imageUrl,
		};
		updateNeighbourhood(payload)
			.then((res) => {
				navigate(-1);
				setModalOpen(true);
				setModalData("Neighbourhood updated successfully", "success");
				setImgShow("");
				setData({
					name: "",
					approvalType: "",
					bannerImageUrl: [],
					cityId: "6308a58eea0553e25b9d0a25",
					countryId: "611a116fa2d3c765b9338dad",
					geoLocation: {
						coordinates: [0, 0],
						type: "Point",
					},
					description: "",
					imageUrl: "",
					type: "",
					approvalType: "BY_ADMIN",
				});

				document.getElementById("img").value = "";
			})
			.catch((err) => console.error(err));
	};

	function handleSubmit(event) {
		event.preventDefault();
		if (imgShow?.update && submitForm === false) {
			window.alert("please upload selected image first");
		} else {
			EditApiCall({ ...response, ...data });
		}
	}

	// console.log("====================================");
	// console.log("data", data);
	// console.log("====================================");
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
								{/* {data.countryId && (
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
								)} */}

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
												handleImageChange(event);
											}}
										/>
										{imgShow?.data && (
											<React.Fragment>
												<Box
													sx={{
														position: "relative",
														width: "80px",
														height: "80px",
														border: "0.5px solid lightgrey",
														padding: "5px",
														borderRadius: "5px",
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
														src={imgShow.data}
														alt='photo'
														style={{ width: "100%", height: "100%", objectFit: "contain" }}
													/>
												</Box>
												{imgShow?.done === false && imgShow?.update === true && (
													<Box sx={{ marginLeft: "20px" }}>
														<Button
															onClick={() => {
																setImgShow((prev) => ({
																	...prev,
																	loader: true,
																}));
																// if (imgShow) {
																ImageApiCAll(imgShow);
																// } else {
																// 	ImageApiCAll(imgShow);
																// }
															}}>
															upload
														</Button>
													</Box>
												)}
											</React.Fragment>
										)}
									</Box>
								</Grid>
								<Grid item xs={12}>
									<Box sx={{ position: "relative", height: "400px" }}>
										{/* <NewGoogleMap
											view={true}
											data={{
												zoom: 15,
												lat: data?.geoLocation?.coordinates[1],
												lng: data?.geoLocation?.coordinates[0],
											}}
											prevLocation={{
												lat: data?.geoLocation?.coordinates[1],
												lng: data?.geoLocation?.coordinates[0],
											}}
										/> */}
										{prevLocation?.lat && (
											<GoogleMapCustom
												view={true}
												data={{
													zoom: 15,
													lat: prevLocation?.lat,
													lng: prevLocation?.lng,
												}}
												prevLocation={{
													lat: prevLocation?.lat,
													lng: prevLocation?.lng,
												}}
											/>
										)}
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
}

export default EditNeighbourhood;
