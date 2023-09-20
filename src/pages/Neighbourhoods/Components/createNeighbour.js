import { Cancel, Done } from "@mui/icons-material";
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
	CircularProgress,
} from "@mui/material";
import axios from "axios";
import React from "react";
import "../neighbourhood.css";
import { createNeighbourhood, findCity, findCountry, findState } from "../services/apiServices";
import { MainContext } from "../../../context/Context";
import Compressor from "compressorjs";
import GoogleMapCustom from "../../../CustomComponents/GoogleMap";
import CustomGoogleMap from "../../../CustomComponents/CustomGoogleMap";

function CreateNeighbour(props) {
	const { listApiCall, pendingListApiCall, handleExpanded } = props;

	const { setModalOpen, setModalData, locationData } = React.useContext(MainContext);
	const [submitForm, setSubmitForm] = React.useState(false);
	const [imageUploaded, setImageUploaded] = React.useState(false);
	const [data, setData] = React.useState({
		name: "",
		bannerImageUrls: [],
		cityId: "6308a58eea0553e25b9d0a25",
		countryId: "611a116fa2d3c765b9338dad",
		lat: "",
		lon: "",
		description: "",
		imageUrl: "",
		type: "",
		approvalType: "BY_ADMIN",
	});
	const [mapData, setMapData] = React.useState({
		lat: null,
		lng: null,
		address: null,
	});
	const [country, setCountry] = React.useState();
	const [state, setState] = React.useState();
	const [city, setCity] = React.useState();
	const [sState, setSState] = React.useState();

	const [imgShow, setImgShow] = React.useState("");

	// const handleGLocation = (lat, lng, address) => {
	// 	setData((prev) => ({
	// 		...prev,
	// 		lat: lat,
	// 		lon: lng,
	// 		address: address,
	// 	}));
	// };

	const locationHandler = (data) => {
		setMapData((prev) => ({
			...prev,
			lat: data?.lat,
			lng: data?.lng,
			address: data?.address,
		}));
	};

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
	// }, [StateApi]);

	const ImageApiCAll = React.useCallback((data, notifyMessage) => {
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
				if (notifyMessage === "Images Uploaded") {
					setImageUploaded(true);
					setModalOpen(true);
					setModalData("Image Uploaded", "success");
				}
				setSubmitForm(true);
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

	const createApiCall = React.useCallback((payload) => {
		console.log("payload", payload);
		createNeighbourhood(payload)
			.then((res) => {
				setModalOpen(true);
				setModalData("Neighbourhood created successfully", "success");
				setImgShow("");
				setData((prev) => ({
					...prev,
					name: "",
					bannerImageUrls: [],
					cityId: "6308a58eea0553e25b9d0a25",
					countryId: "611a116fa2d3c765b9338dad",
					lat: "",
					lon: "",
					description: "",
					imageUrl: "",
					type: "",
					approvalType: "BY_ADMIN",
				}));
				handleExpanded();
				listApiCall();
				pendingListApiCall();

				document.getElementById("img").value = "";
			})
			.catch((err) => console.error(err));
	}, []);

	function handleImageChange(event) {
		const image = event.target.files[0];

		const imageSize = event.target.files[0]?.size * 0.000001;

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
						},
					});
				}

				return true;
			};
		};
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (imgShow && submitForm === false) {
			window.alert("Please upload the selected image first");
		} else {
			createApiCall({ ...data, lat: mapData?.lat, lon: mapData?.lng });
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

	// console.log("====================================");
	// console.log("map data", mapData);
	// console.log("====================================");

	// React.useEffect(() => {
	// 	CountryApi();
	// }, [CountryApi]);

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
							{/* {data.countryId && (
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
											handleImageChange(event);

											// setData((prev) => ({
											// 	...prev,
											// 	imageUrl: event.target.files[0],
											// }));
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
											{imgShow?.done === false && (
												<Box sx={{ marginLeft: "20px" }}>
													<Button
														color={imageUploaded ? "secondary" : "primary"}
														onClick={() => {
															setImgShow((prev) => ({
																...prev,
																loader: true,
															}));
															if (imgShow) {
																ImageApiCAll(imgShow, "Images Uploaded");
															} else {
																ImageApiCAll(imgShow, "");
															}
														}}>
														upload
													</Button>
												</Box>
											)}
										</React.Fragment>
									)}
								</Box>
								<label for='img' style={{ color: "rgb(108 108 108)" }}>
									*Required image dimension 1024 x 1024px and shoud be less than 1MB
								</label>
							</Grid>
							<Grid item xs={12}>
								<Box sx={{ position: "relative", height: "400px" }}>
									{/* <GoogleMapCustom /> */}
									<CustomGoogleMap
										// view={false}
										// data={{ lat: 23, lng: 24 }}
										// prevLocation={true}
										handleLocation={locationHandler}
									/>
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
