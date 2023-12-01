import { Box, CircularProgress } from "@mui/material";
import React from "react";
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";
import { MainContext } from "../context/Context";
import { LocalActivity, PinDrop } from "@mui/icons-material";
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
	Circle,
	InfoWindow,
} = require("react-google-maps");

const GoogleMapCustom = compose(
	withProps({
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `100%` }} id='map-container-margin' />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
)((props) => {
	const refs = {};
	const { locationData, setLocationData } = React.useContext(MainContext);
	const localLat = localStorage?.getItem("lat");
	const localLng = localStorage?.getItem("lng");

	const [state, setState] = React.useState({
		mapApiLoaded: false,
		mapInstance: null,
		mapApi:
			"https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3.exp&libraries=geometry,drawing,places",

		address: "",
		bounds: null,
		center: {
			lat: 0,
			lng: 0,
		},
		lat: 0,
		lng: 0,
		places: [],
		markers: [],
	});
	const onMapMounted = (ref) => {
		refs.map = ref;
	};
	const onBoundsChanged = () => {
		setState((prev) => ({
			...prev,
			bounds: refs.map.getBounds(),
			center: refs.map.getCenter(),
		}));
	};

	const generateAddress = React.useCallback((currentLat, currentLng) => {
		const geocoder = new window.google.maps.Geocoder();
		geocoder.geocode({ location: { lat: currentLat, lng: currentLng } }, (results, status) => {
			if (status === "OK") {
				if (results[0]) {
					// console.log("====================================");
					// console.log("result call", [results[0]]);
					// console.log("====================================");
					const nextMarkers = [results[0]].map((place) => {
						const data = {
							position: place.geometry.location,
						};
						return data;
					});
					setState((prev) => ({
						...prev,
						mapApiLoaded: true,
						mapInstance: results[0],
						center: {
							lat: currentLat,
							lng: currentLng,
						},
						lat: currentLat,
						lng: currentLng,
						markers: nextMarkers,
					}));
					const filteredCity = results?.filter((item, index) => {
						if (index === 0) {
							return item?.address_components?.filter((ele, inde) => {
								if (
									// ele?.types[0] === "administrative_area_level_1" &&
									ele?.types[0] === "locality" &&
									ele?.types[1] === "political"
								) {
									return ele?.long_name;
								}
								// else if (
								// 	ele?.types[0] === "administrative_area_level_3" &&
								// 	ele?.types[1] === "political"
								// ) {
								// 	return ele?.long_name;
								// }
							});
						}
					});
					const newData = filteredCity[0].address_components?.filter((ele) => {
						if (
							// ele?.types[0] === "administrative_area_level_1"
							ele?.types[0] === "locality" &&
							ele?.types[1] === "political"
						) {
							return ele?.long_name;
						} else if (ele?.types[0] === "administrative_area_level_3" && ele?.types[1] === "political") {
							return ele?.long_name;
						}
					});
					// this.zoom = 12;
					setLocationData({
						lat: currentLat ? currentLat : state.lat,
						lng: currentLng ? currentLng : state.lng,
						address: newData?.length > 0 ? newData[0]?.long_name : results[0].formatted_address,
						updated: true,
					});
					setState((prev) => ({
						...prev,
						address: newData?.length > 0 ? newData[0]?.long_name : results[0].formatted_address,
					}));
				} else {
					window.alert("No results found");
				}
			} else {
				console.warn("Geocoder failed due to: " + status);
			}
		});
	}, []);

	const onClick = (event) => {
		const currentLat = event.latLng.lat();
		const currentLng = event.latLng.lng();
		generateAddress(currentLat, currentLng);
	};

	const onSearchBoxMounted = (ref) => {
		refs.searchBox = ref;
	};
	const onPlacesChanged = () => {
		const places = refs.searchBox.getPlaces();
		const bounds = new window.google.maps.LatLngBounds();

		// console.log("place", places);
		places.forEach((place) => {
			if (place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		const nextMarkers = places.map((place) => {
			const data = {
				position: place.geometry.location,
			};
			return data;
		});
		const nextCenter = _.get(nextMarkers, "0.position", state.center);
		// console.log("nextCenter", nextCenter);

		generateAddress(nextCenter?.lat(), nextCenter?.lng());
		// refs.map.fitBounds(bounds);
	};

	// Get Current Location Coordinates
	const setCurrentLocation = React.useCallback(() => {
		if (props?.prevLocation) {
			document.getElementById("map-container-margin").style.marginTop = "0px";
			generateAddress(props?.prevLocation?.lat, props?.prevLocation?.lng);
		} else {
			document.getElementById("map-container-margin").style.marginTop = "50px";
			// generateAddress(locationData?.lat, locationData?.lng);
			generateAddress(Number(localLat), Number(localLng));
		}
	}, [generateAddress]);

	React.useEffect(() => {
		setCurrentLocation();
	}, [setCurrentLocation]);

	// console.log("====================================");
	// console.log("prevLocation", localLat, localLng);
	// console.log("====================================");
	// console.log("====================================");
	// console.log("locationData", locationData);
	// console.log("====================================");
	// console.log("====================================");
	// console.log("state", state);
	// console.log("====================================");
	if (props?.view) {
		if (props?.data?.lat && props?.data?.lng) {
			return (
				<Box sx={{ position: "relative" }}>
					<GoogleMap
						options={{
							gestureHandling: "auto",
						}}
						defaultZoom={props?.data?.zoom ? props?.data?.zoom : 13}
						center={state.center}
						defaultCenter={{
							lat: props?.data?.lat ? props?.data?.lat : locationData?.lat,
							lng: props?.data?.lng ? props?.data?.lng : locationData?.lng,
						}}
						// onBoundsChanged={onBoundsChanged}
					>
						{state.markers.map((marker, index) => (
							<Marker key={index} position={marker.position} />
						))}
						{props?.nearBymarker && props?.nearBymarker?.length > 0
							? props?.nearBymarker?.map((item, index) => (
									<Marker
										// icon={"http://maps.google.com/mapfiles/ms/icons/yellow.png"}
										icon={"https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png"}
										key={index}
										position={{
											lat: item?.geoLocation?.coordinates?.[1],
											lng: item?.geoLocation?.coordinates?.[0],
										}}
										// title={item?.name}
										// label={item?.name}
										// labelStyle={{
										// 	background: "white",
										// 	borderRadius: "10px",
										// 	padding: "10px",
										// }}
									>
										<InfoWindow>
											<div>{item?.name}</div>
										</InfoWindow>
									</Marker>
							  ))
							: null}

						{props?.circle ? (
							<Circle
								options={{
									strokeColor: "rgba(242, 112, 89, 0.45)",
									strokeOpacity: 0.8,
									strokeWeight: 2,
									fillColor: "rgba(248, 133, 18, 0.45)",
									fillOpacity: 0.3,
								}}
								radius={3000}
								defaultRadius={3000}
								center={{
									lat: props?.data?.lat ? props?.data?.lat : locationData?.lat,
									lng: props?.data?.lng ? props?.data?.lng : locationData?.lng,
								}}
								defaultCenter={{
									lat: props?.data?.lat ? props?.data?.lat : locationData?.lat,
									lng: props?.data?.lng ? props?.data?.lng : locationData?.lng,
								}}
							/>
						) : null}
					</GoogleMap>
				</Box>
			);
		} else {
			return (
				<Box
					sx={{
						height: "20vh",
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
		if (props?.prevLocation) {
			// document.getElementById("map-container-margin").style.marginTop = "0px";
			// generateAddress(props?.prevLocation?.lat, props?.prevLocation?.lng);
			return (
				<Box sx={{ position: "relative" }}>
					<GoogleMap
						options={{
							gestureHandling: "auto",
						}}
						ref={onMapMounted}
						defaultZoom={15}
						center={{ lat: state?.lat, lng: state?.lng }}
						defaultCenter={{ lat: props?.prevLocation?.lat, lng: props?.prevLocation?.lat }}
						// onBoundsChanged={onBoundsChanged}
						onClick={(event) => {
							// console.log("click", event);
							onClick(event);
						}}>
						<StandaloneSearchBox
							ref={onSearchBoxMounted}
							bounds={state?.bounds}
							onPlacesChanged={onPlacesChanged}>
							<input
								type='text'
								placeholder='Search location'
								style={{
									position: "absolute",
									top: "-470px",
									left: "0px",
									boxSizing: `border-box`,
									borderRadius: "0px",
									border: `1px solid transparent`,
									width: `100%`,
									height: `37px`,
									marginTop: `27px`,
									padding: `0 12px`,
									boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
									fontSize: `14px`,
									outline: `none`,
									textOverflow: `ellipses`,
								}}
							/>
						</StandaloneSearchBox>
						{state?.markers.map((marker, index) => (
							<Marker key={index} position={marker.position} />
						))}
					</GoogleMap>
				</Box>
			);
		} else {
			// document.getElementById("map-container-margin").style.marginTop = "50px";
			// localLat && localLng && generateAddress(localLat, localLat);
			if (state?.lat && state?.lng) {
				console.log("state", state?.lat);
				return (
					<Box sx={{ position: "relative" }}>
						<GoogleMap
							options={{
								gestureHandling: "auto",
							}}
							ref={onMapMounted}
							defaultZoom={15}
							center={{ lat: state?.lat, lng: state?.lng }}
							defaultCenter={{ lat: localLat, lng: localLng }}
							// onBoundsChanged={onBoundsChanged}
							onClick={(event) => {
								// console.log("click", event);
								onClick(event);
							}}>
							<StandaloneSearchBox
								ref={onSearchBoxMounted}
								bounds={state?.bounds}
								onPlacesChanged={onPlacesChanged}>
								<input
									type='text'
									placeholder='Search location'
									style={{
										position: "absolute",
										top: "-470px",
										left: "0px",
										boxSizing: `border-box`,
										borderRadius: "0px",
										border: `1px solid transparent`,
										width: `100%`,
										height: `37px`,
										marginTop: `27px`,
										padding: `0 12px`,
										boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
										fontSize: `14px`,
										outline: `none`,
										textOverflow: `ellipses`,
									}}
								/>
							</StandaloneSearchBox>
							{state?.markers.map((marker, index) => (
								<Marker key={index} position={marker.position} />
							))}
						</GoogleMap>
					</Box>
				);
			} else {
				return (
					<Box
						sx={{
							height: "20vh",
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
});

export default GoogleMapCustom;
