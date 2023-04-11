import React, { Component } from "react";

import GoogleMapReact from "google-map-react";

import styled from "styled-components";

import AutoComplete from "./AutoComplete";
import Marker from "./Marker";
import "./map.css";
import { Box, CircularProgress } from "@mui/material";
import { MainContext } from "../../../context/Context";

const Wrapper = styled.main`
	width: 100%;
	height: 100%;
`;

function NewGoogleMap(props) {
	const { locationData, setLocationData } = React.useContext(MainContext);
	const [state, setState] = React.useState({
		mapApiLoaded: false,
		mapInstance: null,
		mapApi:
			"https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&libraries=places",
		geoCoder: null,
		places: [],
		center: [-24.6587, 25.9161],
		zoom: 9,
		address: "",
		draggable: true,
		lat: null,
		lng: null,
		newCenter: [],
	});

	const onMarkerInteraction = (childKey, childProps, mouse) => {
		setState((prev) => ({
			...prev,
			draggable: false,
			lat: mouse.lat,
			lng: mouse.lng,
			newCenter: {
				lat: mouse.lat,
				lng: mouse.lng,
			},
		}));
		generateAddress(mouse.lat, mouse.lng);
	};

	const onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
		setState((prev) => ({
			...prev,
			draggable: true,
		}));
	};

	const onChange = ({ center, zoom }) => {
		setState((prev) => ({
			...prev,
			center: center,
			newCenter: center,
			zoom: zoom,
		}));
	};

	const onClick = (value) => {
		setState((prev) => ({
			...prev,
			lat: value.lat,
			lng: value.lng,
			newCenter: {
				lat: value.lat,
				lng: value.lng,
			},
		}));
		generateAddress(value.lat, value.lng);
	};

	const apiHasLoaded = (map, maps) => {
		// console.log("====================================");
		// console.log("new api called", map, maps);
		// console.log("lat lng", map?.center?.lat(), map?.center?.lng());
		// console.log("====================================");
		if (props?.prevLocation && locationData?.updated === false) {
			setState((prev) => ({
				...prev,
				mapApiLoaded: true,
				mapInstance: map,
				mapApi: maps,
				lat: props?.prevLocation?.lat,
				lng: props?.prevLocation?.lng,
				center: [props?.prevLocation?.lat, props?.prevLocation?.lng],
				newCenter: [props?.prevLocation?.lat, props?.prevLocation?.lng],
			}));

			generateAddress(props?.prevLocation?.lat, props?.prevLocation?.lng);
		} else {
			setState((prev) => ({
				...prev,
				mapApiLoaded: true,
				mapInstance: map,
				mapApi: maps,
				lat: state?.lat,
				lng: state?.lng,
			}));
			generateAddress(state?.lat, state?.lng);
		}
	};

	const addPlace = (place) => {
		// console.log("====================================");
		// console.log("place", place, place.geometry.location.lat());
		// console.log("====================================");
		setState((prev) => ({
			...prev,
			places: [place],
			lat: place.geometry.location.lat(),
			lng: place.geometry.location.lng(),
		}));

		generateAddress(place.geometry.location.lat(), place.geometry.location.lng());
	};

	const generateAddress = React.useCallback(
		(glat, glng) => {
			const { mapApi } = state;

			const geocoder = new mapApi.Geocoder();

			geocoder.geocode(
				{ location: { lat: glat ? glat : state.lat, lng: glng ? glng : state.lng } },
				(results, status) => {
					// console.log(results);
					// console.log(status);
					if (status === "OK") {
						if (results[0]) {
							// console.log("====================================");
							// console.log("result call", results);
							// console.log("====================================");

							const filteredCity = results?.filter((item, index) => {
								if (index === 0) {
									return item?.address_components?.filter((ele, inde) => {
										if (
											ele?.types[0] === "administrative_area_level_1" &&
											ele?.types[1] === "political"
										) {
											return ele?.long_name;
										} else if (
											ele?.types[0] === "administrative_area_level_3" &&
											ele?.types[1] === "political"
										) {
											return ele?.long_name;
										}
									});
								}
							});
							const newData = filteredCity[0].address_components?.filter((ele) => {
								if (
									ele?.types[0] === "administrative_area_level_1" &&
									ele?.types[1] === "political"
								) {
									return ele?.long_name;
								} else if (
									ele?.types[0] === "administrative_area_level_3" &&
									ele?.types[1] === "political"
								) {
									return ele?.long_name;
								}
							});
							// this.zoom = 12;
							setLocationData({
								lat: glat ? glat : state.lat,
								lng: glng ? glng : state.lng,
								address: newData?.length > 0 ? newData[0]?.long_name : results[0].formatted_address,
								updated: true,
							});
							setState((prev) => ({
								...prev,
								address: results[0].formatted_address,
							}));
						} else {
							window.alert("No results found");
						}
					} else {
						console.warn("Geocoder failed due to: " + status);
					}
				}
			);
		},
		[setLocationData, state]
	);

	// Get Current Location Coordinates
	const setCurrentLocation = React.useCallback(() => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				setState((prev) => ({
					...prev,
					center: [position.coords.latitude, position.coords.longitude],
					newCenter: [position.coords.latitude, position.coords.longitude],
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}));
				if (props?.prevLocation && locationData?.updated === false) {
					generateAddress(props?.prevLocation?.lat, props?.prevLocation?.lng);
				} else {
					generateAddress(position.coords.latitude, position.coords.longitude);
				}
				// setLocationData({
				// 	lat: position.coords.latitude,
				// 	lng: position.coords.longitude,
				// 	address: state?.address,
				// });
			});
		}
	}, [generateAddress]);

	React.useEffect(() => {
		setCurrentLocation();
	}, [setCurrentLocation]);

	if (props?.view === true && props?.data) {
		if (props?.data?.lat && props?.data?.lng) {
			return (
				<Box sx={{ position: "relative" }}>
					<GoogleMapReact
						// key={"AIzaSyAM9uE4Sy2nWFfP-Ha6H8ZC6ghAMKJEKps"}
						options={{
							streetViewControl: true,
							mapTypeControl: true,
						}}
						style={{ width: "100%", height: "500px" }}
						center={{ lat: props?.data?.lat, lng: props?.data?.lng }}
						defaultCenter={{ lat: props?.data?.lat, lng: props?.data?.lng }}
						zoom={props?.data?.zoom ? props?.data?.zoom : 12}
						// draggable={state.draggable}
						// bootstrapURLKeys={{
						// 	key: "AIzaSyAM9uE4Sy2nWFfP-Ha6H8ZC6ghAMKJEKps",
						// 	libraries: "places",
						// 	// libraries: ["geocoding", "Routes", "places", "geometry", "drawing", "visualization"],
						// }}
					>
						{/* <Box sx={{ p: 2, maxWidth: "200px", background: "grey" }}>
							<p>{this.state.address}</p>
						</Box> */}
						<Marker text={props?.data?.text} lat={props?.data?.lat} lng={props?.data?.lng} />
					</GoogleMapReact>
				</Box>
			);
		} else {
			return (
				<Box
					sx={{
						height: "30vh",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<CircularProgress />
				</Box>
			);
		}
	} else {
		if (state?.lat && state?.lng) {
			return (
				<Wrapper>
					{state?.mapApiLoaded && (
						<div>
							<AutoComplete
								required={false}
								map={state?.mapInstance}
								mapApi={state?.mapApi}
								addplace={addPlace}
							/>
						</div>
					)}
					<Box sx={{ position: "relative" }}>
						<GoogleMapReact
							options={{
								streetViewControl: true,
								mapTypeControl: true,
							}}
							style={{ width: "100%", height: "500px" }}
							center={state.newCenter}
							defaultCenter={{ lat: state?.center[0], lng: state?.center[1] }}
							zoom={state.zoom}
							draggable={state.draggable}
							onChange={onChange}
							onChildMouseDown={onMarkerInteraction}
							onChildMouseUp={onMarkerInteractionMouseUp}
							onChildMouseMove={onMarkerInteraction}
							onChildClick={() => console.log("child click")}
							onClick={onClick}
							key={"AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk"}
							bootstrapURLKeys={{
								key: "AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk",
								libraries: "geometry",
								// libraries: ["places", "geometry", "drawing", "visualization"],
							}}
							yesIWantToUseGoogleMapApiInternals
							onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}>
							{/* <Box sx={{ p: 2, maxWidth: "200px", background: "grey" }}>
							<p>{this.state.address}</p>
						</Box> */}
							<Marker text={state.address} lat={state.lat} lng={state.lng} />
						</GoogleMapReact>
					</Box>
				</Wrapper>
			);
		} else {
			return (
				<Box
					sx={{
						height: "30vh",
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<CircularProgress />
				</Box>
			);
		}
	}
}

export default NewGoogleMap;
