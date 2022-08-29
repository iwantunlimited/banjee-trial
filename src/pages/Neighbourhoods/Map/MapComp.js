import { MyLocation } from "@mui/icons-material";
import { Box, TextField, InputAdornment, IconButton, List, ListItem } from "@mui/material";
import React, { PureComponent } from "react";
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
// import Autocomplete from 'react-google-autocomplete';
import axios from "axios";
Geocode.setApiKey("AIzaSyBqW8iaz-_qlaTMc1ynbj9f7mpfmbVUcW4");
Geocode.enableDebug();

class LocationComp extends PureComponent {
	state = {
		address: "",
		zoom: 15,
		anchorEl: null,
		data: [],
		height: 400,
		mapPosition: {
			lat: 0,
			lng: 0,
		},
		markerPosition: {
			lat: 0,
			lng: 0,
		},
	};
	getCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.setState(
					{
						mapPosition: {
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						},
						markerPosition: {
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						},
					},
					() => {
						Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
							(response) => {
								this.searchForLocation(response.results[0]);
								const address = response.results[0].formatted_address;
								this.setState({
									address: address ? address : "",
								});
							},
							(error) => {
								console.error(error);
							}
						);
					}
				);
			});
		} else {
			console.error("Geolocation is not supported by this browser!");
		}
	}
	componentDidMount() {
		this.getCurrentLocation();
	}
	onInfoWindowClose = (event) => {};
	onMarkerDragEnd = (event) => {
		let newLat = event.latLng.lat(),
			newLng = event.latLng.lng();
		Geocode.fromLatLng(newLat, newLng).then(
			(response) => {
				const address = response.results[0].formatted_address;
				this.setState({
					address: address ? address : "",
					markerPosition: {
						lat: newLat,
						lng: newLng,
					},
					mapPosition: {
						lat: newLat,
						lng: newLng,
					},
				});
			},
			(error) => {
				console.error(error);
			}
		);
	};
	onPlaceSelected = (place) => {
		const address = place.formatted_address,
			latValue = place.geometry.location.lat(),
			lngValue = place.geometry.location.lng();
		this.setState({
			address: address ? address : "",
			markerPosition: {
				lat: latValue,
				lng: lngValue,
			},
			mapPosition: {
				lat: latValue,
				lng: lngValue,
			},
		});
	};
	dataFunction(keywords) {
		let url = "https://znxmcz8e57.execute-api.ap-southeast-1.amazonaws.com/dev/" + keywords;
		axios.get(url).then((res) => {
			this.setState({
				data: res.data.data.predictions,
			});
		});
	}
	searchForLocation(data) {
		const url =
			"https://znxmcz8e57.execute-api.ap-southeast-1.amazonaws.com/dev/loc-id/" + data.place_id;
		axios
			.get(url)
			.then((res) => {
				this.setState({
					address: data.description,
					mapPosition: res.data.data.result.geometry.location,
					markerPosition: res.data.data.result.geometry.location,
				});
				this.props.handleChange("location", res.data.data.result.url);
			})
			.catch((err) => {
				console.error(err);
			});
		this.setState({
			data: [],
		});
	}
	handleClose = () => {
		this.setState({ anchorEl: null });
	};
	render() {
		const AsyncMap = withScriptjs(
			withGoogleMap((props) => (
				<>
					<GoogleMap
						defaultZoom={this.state.zoom}
						onClick={this.onMarkerDragEnd}
						defaultCenter={{
							lat: this.state.mapPosition.lat,
							lng: this.state.mapPosition.lng,
						}}>
						<Marker
							google={this.props.google}
							name={"Dolores park"}
							draggable={true}
							clickable={true}
							onDragEnd={this.onMarkerDragEnd}
							position={{
								lat: this.state.markerPosition.lat,
								lng: this.state.markerPosition.lng,
							}}
						/>
						{/* {this.state.address && (
							<InfoWindow
								onClose={this.onInfoWindowClose}
								position={{
									lat: this.state.markerPosition.lat + 0.0018,
									lng: this.state.markerPosition.lng,
								}}>
								<div>
									<span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
								</div>
							</InfoWindow>
						)} */}
						{/* <Marker /> */}
					</GoogleMap>
				</>
			))
		);
		return (
			<div style={{ padding: "20px" }}>
				<Box>
					<TextField
						fullWidth
						value={this.state.address}
						onChange={(event) => {
							const {
								target: { value },
							} = event;
							this.setState({
								address: value,
							});
							this.dataFunction(value);
						}}
						InputProps={{
							type: "search",
							endAdornment: (
								<InputAdornment position='end'>
									<IconButton
										onClick={() => {
											this.getCurrentLocation();
										}}>
										<MyLocation />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					{this.state.data.length > 0 && (
						<List
							style={{
								zIndex: 999,
								position: "absolute",
								backgroundColor: "white",
								width: "100%",
							}}>
							{this.state.data.map((ele, index) => (
								<ListItem
									key={index}
									onClick={() => this.searchForLocation(ele)}
									style={{ cursor: "pointer" }}>
									{ele.description}
								</ListItem>
							))}
						</List>
					)}
				</Box>
				<AsyncMap
					googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyBqW8iaz-_qlaTMc1ynbj9f7mpfmbVUcW4&libraries=places'
					loadingElement={<div style={{ height: `100%` }} />}
					containerElement={<div style={{ height: this.state.height }} />}
					mapElement={<div style={{ height: `360px` }} />}
				/>
			</div>
		);
	}
}
export default LocationComp;
