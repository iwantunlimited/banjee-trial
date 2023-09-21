import { Box } from "@mui/material";
import React from "react";
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs, withGoogleMap, GoogleMap, Marker } = require("react-google-maps");

const LiveAlertMap = compose(
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
	const localLat = localStorage?.getItem("lat");
	const localLng = localStorage?.getItem("lng");
	const [searchValue, setSearchValue] = React.useState(null);

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

	const generateAddress = React.useCallback((currentLat, currentLng, fullName) => {
		const geocoder = new window.google.maps.Geocoder();
		geocoder.geocode({ location: { lat: currentLat, lng: currentLng } }, (results, status) => {
			if (status === "OK") {
				if (results[0]) {
					// console.log("====================================");
					// console.log("result call", [results[0]]);
					// console.log("====================================");
					setSearchValue(fullName ? fullName : results?.[0]?.formatted_address);
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
					setState((prev) => ({
						...prev,
						address: newData?.length > 0 ? newData[0]?.long_name : results[0].formatted_address,
					}));

					// this.zoom = 12;
					// if (props?.view) {
					// 	return;
					// } else {
					// 	props?.handleLocation({
					// 		lat: currentLat ? currentLat : state.lat,
					// 		lng: currentLng ? currentLng : state.lng,
					// 		address: newData?.length > 0 ? newData[0]?.long_name : results[0].formatted_address,
					// 	});
					// }
				} else {
					window.alert("No results found");
				}
			} else {
				console.warn("Geocoder failed due to: " + status);
			}
		});
	}, []);

	const onClick = async (event) => {
		// console.log("====================================");
		// console.log("click event", event);
		// console.log("====================================");
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
		const fullName = places?.[0]?.name + ", " + places?.[0]?.formatted_address;
		// setSearchValue(places?.[0]?.name + ", " + places?.[0]?.formatted_address);

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

		generateAddress(nextCenter?.lat(), nextCenter?.lng(), fullName);
		// refs.map.fitBounds(bounds);
	};

	// Get Current Location Coordinates
	const setCurrentLocation = React.useCallback(() => {
		// if (props?.prevLocation) {
			console.log("props in current location", props?.data);
			document.getElementById("map-container-margin").style.marginTop = "0px";
			generateAddress(props?.data?.lat, props?.data?.lng);
		// } else {
		// 	document.getElementById("map-container-margin").style.marginTop = "50px";
		// 	// generateAddress(locationData?.lat, locationData?.lng);
		// 	generateAddress(Number(localLat), Number(localLng));
		// }
	}, [generateAddress, props?.data?.lat, props?.data?.lng]);

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
	// console.log("searchValue", searchValue);
	// console.log("====================================");

			// console.log("====================================");
			// console.log("state", state);
			// console.log("props", props);
			// console.log("====================================");
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
						defaultCenter={{ lat: props?.data?.lat, lng: props?.data?.lng }}
						// onBoundsChanged={onBoundsChanged}
						onClick={(event) => {
							// console.log("click", event);
							onClick(event);
						}}>
						{/* <StandaloneSearchBox
							ref={onSearchBoxMounted}
							bounds={state?.bounds}
							onPlacesChanged={onPlacesChanged}>
							<input
								value={searchValue}
								onChange={(event) => setSearchValue(event?.target?.value)}
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
						</StandaloneSearchBox> */}
						{state?.markers.map((marker, index) => (
							<Marker key={index} position={marker.position} />
						))}
					</GoogleMap>
				</Box>
			);
                        
});

export default LiveAlertMap;
