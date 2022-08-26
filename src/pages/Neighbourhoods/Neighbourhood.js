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
import "./neighbourhood.css";
import { findCity, findCountry, findState } from "./services/apiServices";

function Neighbourhood() {
	const [data, setData] = React.useState({
		neighbourhoodName: "",
		approvalType: "",
		bannerImageUrls: [],
		cityId: "",
		country: "",
		state: "",
		lat: "",
		lon: "",
		description: "",
		imageUrl: "",
		neighbourhoodType: "",
	});

	console.log("form data", data);

	const [country, setCountry] = React.useState();
	const [state, setState] = React.useState();
	const [city, setCity] = React.useState();

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
					country: res.length > 0 ? res?.[0]?.id : false,
				}));
				StateApi(res?.[0]?.id || "");
				console.log("COuntry", res);
			})
			.catch((err) => console.log(err));
	}, []);

	console.log(data.country.name);

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

	function handleSubmit() {
		const formData = new FormData();

		formData.append("type", data?.neighbourhoodType);
		formData.append("lat", data?.lat);
		formData.append("lon", data?.lon);
		formData.append("name", data?.neighbourhoodName);
		formData.append("description", data?.description);
		formData.append("cityId", data?.cityId);
		formData.append("countryId", data?.country);

		console.log("final data-------", formData);
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
										value={data.neighbourhoodName}
										name='neighbourhoodName'
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
											name='neighbourhoodType'
											label='Neighbourhood Type'
											value={data?.neighbourhoodType}
											onChange={handleChange}>
											<MenuItem value={"private"}>Private</MenuItem>
											<MenuItem value={"public"}>Public</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								{data.country && (
									<Grid item xs={6}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>Country</InputLabel>
											<Select
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='country'
												label='Country'
												value={data?.country}
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
								{data.country && (
									<Grid item xs={6}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>State</InputLabel>
											<Select
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='state'
												label='State'
												value={data?.state}
												onChange={(event) => {
													setData((prevData) => {
														return {
															...prevData,
															state: event.target.value,
														};
													});
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
								{data?.state && (
									<Grid item xs={6}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>City</InputLabel>
											<Select
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='city'
												label='City'
												value={data?.city}
												onChange={handleChange}>
												{city?.length > 0 &&
													city?.map((item, index) => (
														<MenuItem value={item.id} key={index}>
															{item.name}
														</MenuItem>
													))}
											</Select>
										</FormControl>
									</Grid>
								)}
								<Grid item xs={3}>
									<TextField
										fullWidth
										placeholder='lat'
										label='lat'
										value={data.lat}
										name='lat'
										onChange={handleChange}
									/>
								</Grid>
								<Grid item xs={3}>
									<TextField
										fullWidth
										placeholder='lon'
										label='lon'
										value={data.lon}
										name='lon'
										onChange={handleChange}
									/>
								</Grid>
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
							</Grid>
							<Button variant='contained' type='submit'>
								Submit
							</Button>
						</form>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Neighbourhood;
