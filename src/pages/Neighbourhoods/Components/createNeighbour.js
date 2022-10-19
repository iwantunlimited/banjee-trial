import { Cancel } from "@mui/icons-material";
import {
	Box,
	Grid,
	TextField,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Button,
	IconButton,
} from "@mui/material";
import axios from "axios";
import React from "react";
import MyGoogleMap from "../Map/GoogleMap";
import "../neighbourhood.css";
import { createNeighbourhood, findCity, findCountry, findState } from "../services/apiServices";
import { MainContext } from "../../../context/Context";

function CreateNeighbour(props) {
	const { listApiCAll, handleExpanded } = props;

	const { setModalOpen, setModalData } = React.useContext(MainContext);

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

	const [country, setCountry] = React.useState();
	const [state, setState] = React.useState();
	const [city, setCity] = React.useState();
	const [sState, setSState] = React.useState();
	const [defaultLocation, setDefaultLocation] = React.useState();

	const [images, setImages] = React.useState("");
	const [imgShow, setImgShow] = React.useState("");

	const [loc, setLoc] = React.useState({
		lat: -34.59,
		lng: 150.66,
	});

	const token = localStorage?.getItem("token");

	const handleGLocation = (lat, lng, address) => {
		setData((prev) => ({
			...prev,
			lat: lat,
			lon: lng,
			address: address,
		}));
	};

	const CityApi = React.useCallback((id) => {
		findCity({ cityId: id })
			.then((res) => {
				setCity(res.content);
			})
			.catch((err) => console.error(err));
	});

	const StateApi = React.useCallback((countryId) => {
		findState({ countryId: countryId })
			.then((res) => {
				setState(res.content);
			})
			.catch((err) => console.error(err));
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
			})
			.catch((err) => console.error(err));
	}, []);

	const ImageApiCAll = React.useCallback((data) => {
		const mime = "image";
		console.log("====================================");
		console.log("image api data", data);
		console.log("====================================");
		const formData = new FormData();

		// formData.append("directoryId", "root");

		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "business_images");
		formData.append("file", data);
		// { headers: { "Content-Type": "multipart/form-data" }

		const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

		// const header = {
		// 	"Content-Type": "multipart/form-data",
		// 	Authorization: `Bearer ${token}`,
		// };

		axios
			.post(url, formData)
			.then((res) => {
				// console.log("====================================");
				// console.log("image upload response", res);
				// console.log("====================================");
				setData((prev) => ({
					...prev,
					// imageUrl: res?.data?.data[0]?.data?.id,
					imageUrl: res?.data?.public_id,
				}));
			})
			.catch((err) => console.log(err));
	}, []);

	React.useEffect(() => {
		CountryApi();
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

	const createApiCall = React.useCallback((data) => {
		createNeighbourhood(data)
			.then((res) => {
				setModalOpen(true);
				setModalData("Neighbourhood created successfully", "success");
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
				handleExpanded();
				listApiCAll();

				document.getElementById("img").value = "";
			})
			.catch((err) => console.error(err));
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

	return (
		<Grid item container xs={12} spacing={2}>
			<Grid item xs={12}>
				<Box sx={{ padding: "20px" }}>
					<form onSubmit={handleSubmit}>
						<Grid item container xs={12} spacing={2}>
							<Grid item xs={12} sm={6}>
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
							<Grid item xs={12} sm={6}>
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
								<Grid item xs={12} sm={4}>
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
								<Grid item xs={12} sm={4}>
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
								<Grid item xs={12} sm={4}>
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
														setLoc({
															...item?.gpsLocation,
															lng: item?.gpsLocation?.lon,
														});
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
							)}

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
							<Grid item xs={12} sm={6}>
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
							{/* <Grid item xs={12}>
								<Map
									handleLocation={handleLocation}
									zoom={8}
									height={"400px"}
									center={{
										lat: -22.1999,
										lng: 23.9989,
									}}
								/>
							</Grid> */}
							<Grid item xs={12}>
								<Box sx={{ position: "relative" }}>
									<MyGoogleMap handleGLocation={handleGLocation} />
								</Box>
							</Grid>
							<Grid item xs={12}>
								<Box sx={{ marginY: "10px", display: "flex", justifyContent: "flex-end" }}>
									<Button variant='contained' type='submit' color='primary'>
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

export default CreateNeighbour;
