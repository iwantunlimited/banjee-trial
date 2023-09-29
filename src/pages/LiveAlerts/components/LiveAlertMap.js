import { Avatar, Box, Typography, Grid, Button } from "@mui/material";
import React, { useEffect } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router";
import moment from "moment";
const _ = require("lodash");
const { compose, withProps } = require("recompose");
const {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
	InfoWindow,
} = require("react-google-maps");

const LiveAlertMap = compose(
	withProps({
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: (
			<div
				style={{ height: `100%` }}
				id="map-container-margin"
			/>
		),
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
)((props) => {
	const refs = {};
	const localLat = localStorage?.getItem("lat");
	const localLng = localStorage?.getItem("lng");
	const [searchValue, setSearchValue] = React.useState(null);
	const [openModal, setOpenModal] = React.useState(false);
	const navigate = useNavigate();
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

	function handleModal() {
		setOpenModal((prev) => !prev);
	}

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

	const generateAddress = React.useCallback(
		(currentLat, currentLng, fullName) => {
			const geocoder = new window.google.maps.Geocoder();
			geocoder.geocode(
				{ location: { lat: currentLat, lng: currentLng } },
				(results, status) => {
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
										if (ele?.types[0] === "locality" && ele?.types[1] === "political") {
											return ele?.long_name;
										}
									});
								}
							});
							const newData = filteredCity[0].address_components?.filter((ele) => {
								if (ele?.types[0] === "locality" && ele?.types[1] === "political") {
									return ele?.long_name;
								} else if (
									ele?.types[0] === "administrative_area_level_3" &&
									ele?.types[1] === "political"
								) {
									return ele?.long_name;
								}
							});
							setState((prev) => ({
								...prev,
								address:
									newData?.length > 0
										? newData[0]?.long_name
										: results[0].formatted_address,
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
		[]
	);

	const onClick = async (event) => {
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

		generateAddress(nextCenter?.lat(), nextCenter?.lng(), fullName);
	};

	const setCurrentLocation = React.useCallback(() => {
		document.getElementById("map-container-margin").style.marginTop = "0px";
		generateAddress(props?.data?.lat, props?.data?.lng);
	}, [generateAddress, props?.data?.lat, props?.data?.lng]);

	React.useEffect(() => {
		setCurrentLocation();
		setOpenModal(props?.openModal);
	}, [setCurrentLocation]);

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
				onClick={(event) => {
					onClick(event);
				}}
			>
				{state?.markers.map((marker, index) =>
					props?.alertData?.eventCode === "NEW_ALERT" ? (
						<Box style={{ position: "relative" }}>
							<Marker
								key={index}
								position={marker.position}
								onClick={handleModal}
							>
								{openModal && (
									<InfoWindow onCloseClick={handleModal}>
										<Box style={{ width: "350px", height: "170px" }}>
											<Typography
												variant="h6"
												sx={{ textAlign: "center" }}
											>
												{props?.alertData?.eventName.startsWith("Test") ||
												props?.alertData?.eventName.startsWith("test")
													? "Other"
													: props?.alertData?.eventName}
											</Typography>
											<Grid container>
												<Grid
													item
													sm={2}
													xs={2}
													md={2}
													sx={{ my: 1 }}
												>
													<Avatar
														src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${props?.alertData?.createdBy}`}
														alt={props?.alertData?.createdByUser?.firstName}
														variant="circular"
														sx={{ height: "40px", width: "40px" }}
													/>
												</Grid>
												<Grid
													item
													sx={{ display: "flex", alignItems: "center" }}
													xs={10}
													sm={10}
												>
													<Grid container>
														<Grid
															item
															xs={7}
															sm={7}
															md={7}
														>
															<Typography sx={{ fontSize: "22px", textAlign: "left" }}>
																{props?.alertData?.createdByUser?.firstName}
															</Typography>
														</Grid>
														<Grid
															item
															xs={5}
															sm={5}
															md={5}
														>
															<Button
																color="secondary"
																variant="outlined"
																sx={{ float: "right" }}
																onClick={() => {
																	navigate("/banjee-alert/" + props?.alertData?.id);
																}}
															>
																View Alert
															</Button>
														</Grid>
													</Grid>
												</Grid>
												<Grid item></Grid>
											</Grid>
											<Box sx={{ mt: 2 }}>
												<Typography
													id="transition-modal-description"
													sx={{ mt: 1 }}
												>
													<LocationOnIcon
														fontSize="small"
														sx={{ ml: 0 }}
													/>
													{props?.alertData?.metaInfo?.address
														? props?.alertData?.metaInfo?.address
														: " No address added"}
												</Typography>
											</Box>
										</Box>
									</InfoWindow>
								)}
							</Marker>
						</Box>
					) : (
						<Box style={{ position: "relative" }}>
							<Marker
								key={index}
								position={marker.position}
								onClick={handleModal}
							>
								{openModal && (
									<InfoWindow onCloseClick={handleModal}>
										<Box sx={{ height: "200px", width: "370px" }}>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Typography variant="h6">
													<strong>
														{props?.alertData?.eventName.startsWith("Test") ||
														props?.alertData?.eventName.startsWith("test")
															? "Other"
															: props?.alertData?.eventName}
													</strong>
												</Typography>
											</Box>

											<Grid container>
												<Grid
													item
													md={3}
													sm={3}
													xs={3}
												>
													<Avatar
														src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${props?.alertData?.createdBy}`}
														alt={props?.alertData?.createdByUser?.firstName}
														variant="circular"
														sx={{ height: "100px", width: "100px" }}
													/>
												</Grid>
												<Grid
													item
													md={9}
													sm={9}
													xs={9}
													mt={1}
													sx={{ mt: 3 }}
												>
													<Grid container>
														<Grid
															item
															md={6}
															xs={6}
															sm={6}
														>
															<Typography sx={{ fontSize: "22px", textAlign: "center" }}>
																{props?.alertData?.createdByUser?.firstName}
															</Typography>
														</Grid>
														<Grid
															md={6}
															sm={6}
															xs={6}
														>
															<Button
																color="secondary"
																variant="outlined"
																sx={{ float: "right" }}
																onClick={() => {
																	navigate("/banjee-alert/" + props?.alertData?.id);
																}}
															>
																View Panic
															</Button>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
											<Grid
												container
												sx={{ display: "flex", alignItems: "center" }}
											>
												<Grid
													item
													sx={{ marginLeft: 2 }}
													md={12}
													sm={12}
													xs={12}
												>
													<Box sx={{ mt: 2 }}>
														<Typography
															id="transition-modal-description"
															sx={{ mt: 1 }}
														>
															<LocationOnIcon
																fontSize="small"
																sx={{ ml: 0 }}
															/>
															{props?.alertData?.metaInfo?.address}
														</Typography>
													</Box>
												</Grid>
											</Grid>
										</Box>
									</InfoWindow>
								)}
							</Marker>
						</Box>
					)
				)}
			</GoogleMap>
		</Box>
	);
});

export default LiveAlertMap;
