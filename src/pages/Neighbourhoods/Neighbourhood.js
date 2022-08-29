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
} from "@mui/material";
import axios from "axios";
import React from "react";
import { Helmet } from "react-helmet";
import ChipComp from "./CardChipComp";
import { MyMapComponent } from "./Map/MAp";
import Autocomplete from "react-google-autocomplete";
import LocationComp from "./Map/MapComp";
import "./neighbourhood.css";
import { createNeighbourhood, findCity, findCountry, findState } from "./services/apiServices";
import Map from "./Trial/MeraComp";

function Neighbourhood() {
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
	const [finalLocation, setFinalLocation] = React.useState();

	const [loc, setLoc] = React.useState({
		lat: -34.59,
		lng: 150.66,
	});
	console.log("====================================");
	console.log("data", data);
	console.log("====================================");

	const handleLocation = (lat, lon) => {
		console.log(lat, lon, "---------------->");
		setFinalLocation(() => ({
			lat: lat,
			lng: lon,
		}));
		setData((prev) => ({
			...prev,
			lat: lat,
			lon: lon,
		}));
	};

	console.log("finalLocation", finalLocation);

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
				console.log("api response", res);
			})
			.catch((err) => console.log(err));
	}, []);

	function handleSubmit(event) {
		console.log("final data-------", data);
		createApiCall(data);
		event.preventDefault();
	}

	return (
		<Container maxWidth='xl' style={{ padding: "0px", margin: "auto" }}>
			<Helmet>
				<title>Neighbourhood | Banjee Admin</title>
			</Helmet>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<ChipComp />
				</Grid>
				<Grid item xs={12}>
					<Card sx={{ p: 2 }}>
						<form onSubmit={handleSubmit}>
							<Grid item container xs={12} spacing={2}>
								<Grid item xs={6}>
									<TextField
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
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='cityId'
												label='City'
												value={data?.cityId}
												onChange={(event) => {
													console.log("event", event.target);
													const defaultLatLon = city.filter((item) => {
														if (item.id === event.target.value) {
															console.log("cities", item);
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
										className='neighbourhood-form-textField'
										fullWidth
										label='Description'
										rows={3}
										maxRows={5}
										placeholder='Description'
										name='description'
										value={data.desciption}
										multiline
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<Map
										handleLocation={handleLocation}
										zoom={12}
										height={"400px"}
										center={{
											lat: -34.59,
											lng: 150.66,
										}}
									/>
								</Grid>
								{/* <Grid item xs={6}>
									<Box sx={{ my: 2, width: "100%" }}>
										<Autocomplete
											style={{ width: "100%", padding: "5px" }}
											apiKey={"AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk"}
											onPlaceSelected={(place) => {
												setLoc();
												console.log(
													"place---------",
													place?.geometry?.location?.lat(),
													place?.geometry?.location?.lng()
												);
												setLoc((prev) => ({
													lat: place?.geometry?.location?.lat(),
													lng: place?.geometry?.location?.lng(),
												}));
												setData((prev) => ({
													...prev,
													lat: place?.geometry?.location?.lat(),
													lon: place?.geometry?.location?.lng(),
												}));
											}}
										/>
									</Box>
									<Box>
										<MyMapComponent data={loc} handleLocation={handleLocation} />
									</Box>
								</Grid> */}
								<Grid item xs={12}>
									<Box sx={{ my: 1 }}>
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

export default Neighbourhood;
