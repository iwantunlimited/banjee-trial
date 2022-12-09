// MyGoogleMaps.js
import React, { Component } from "react";

import GoogleMapReact from "google-map-react";

import styled from "styled-components";

import AutoComplete from "./AutoComplete";
import Marker from "./Marker";
import "./map.css";
import { Box } from "@mui/material";

const Wrapper = styled.main`
	width: 100%;
	height: 100%;
`;

class MyGoogleMap extends Component {
	state = {
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
	};

	constructor(props) {
		super(props);
	}
	componentWillMount() {
		this.setCurrentLocation();
	}

	onMarkerInteraction = (childKey, childProps, mouse) => {
		this.setState({
			draggable: false,
			lat: mouse.lat,
			lng: mouse.lng,
		});
		this.props.handleGLocation(
			mouse?.lat,
			mouse?.lng,
			this?.state?.address,
			this?.state?.places[0]
		);
	};
	onMarkerInteractionMouseUp = (childKey, childProps, mouse) => {
		this.setState({ draggable: true });
		this._generateAddress();
	};

	_onChange = ({ center, zoom }) => {
		this.setState({
			center: center,
			newCenter: center,
			zoom: zoom,
		});
	};

	_onClick = (value) => {
		this.setState({
			lat: value.lat,
			lng: value.lng,
		});

		this.props.handleGLocation(
			value?.lat,
			value?.lng,
			this?.state?.address,
			this?.state?.places[0]
		);
	};

	apiHasLoaded = (map, maps) => {
		if (this?.props?.prevLocation) {
			this.setState({
				mapApiLoaded: true,
				mapInstance: map,
				mapApi: maps,
				lat: this?.props?.prevLocation?.lat,
				lng: this?.props?.prevLocation?.lng,
			});
		} else {
			this.setState({
				mapApiLoaded: true,
				mapInstance: map,
				mapApi: maps,
			});
		}

		this._generateAddress();
	};

	addPlace = (place) => {
		this.setState({
			places: [place],
			lat: place.geometry.location.lat(),
			lng: place.geometry.location.lng(),
		});
		this.props.handleGLocation(
			place.geometry.location.lat(),
			place.geometry.location.lng(),
			this?.state?.address,
			place
		);
		this._generateAddress();
	};

	_generateAddress() {
		const { mapApi } = this.state;

		const geocoder = new mapApi.Geocoder();

		geocoder.geocode(
			{ location: { lat: this.state.lat, lng: this.state.lng } },
			(results, status) => {
				// console.log(results);
				// console.log(status);
				if (status === "OK") {
					if (results[0]) {
						this.zoom = 12;
						this.setState({ address: results[0].formatted_address });
						this.props.handleGLocation(
							this?.state?.lat,
							this?.state?.lng,
							results[0].formatted_address,
							this?.state?.places[0]
						);
					} else {
						window.alert("No results found");
					}
				} else {
					window.alert("Geocoder failed due to: " + status);
				}
			}
		);
	}

	// Get Current Location Coordinates
	setCurrentLocation() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				console.log("====================================");
				console.log("position", position);
				console.log("====================================");
				this.setState({
					center: [position.coords.latitude, position.coords.longitude],
					newCenter: [position.coords.latitude, position.coords.longitude],
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
				this.props.handleGLocation(
					position.coords.latitude,
					position.coords.longitude,
					this?.state?.address,
					this?.state?.places[0]
				);
			});
		}
	}

	render() {
		console.log("====================================");
		console.log("map state", this.state);
		console.log("====================================");
		const { places, mapApiLoaded, mapInstance, mapApi } = this.state;

		return (
			<Wrapper>
				{mapApiLoaded && (
					<div>
						<AutoComplete
							required={false}
							map={mapInstance}
							mapApi={mapApi}
							addplace={this.addPlace}
						/>
					</div>
				)}
				<Box sx={{ position: "relative" }}>
					<GoogleMapReact
						style={{ width: "100%", height: "500px" }}
						center={this.state.newCenter}
						defaultCenter={{ lat: this?.state?.center[0], lng: this?.state?.center[1] }}
						zoom={this.state.zoom}
						draggable={this.state.draggable}
						onChange={this._onChange}
						onChildMouseDown={this.onMarkerInteraction}
						onChildMouseUp={this.onMarkerInteractionMouseUp}
						onChildMouseMove={this.onMarkerInteraction}
						onChildClick={() => console.log("child click")}
						onClick={this._onClick}
						bootstrapURLKeys={{
							key: "AIzaSyAM9uE4Sy2nWFfP-Ha6H8ZC6ghAMKJEKps",
							libraries: ["places", "geometry", "drawing", "visualization"],
						}}
						yesIWantToUseGoogleMapApiInternals
						onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}>
						{/* <Box sx={{ p: 2, maxWidth: "200px", background: "grey" }}>
							<p>{this.state.address}</p>
						</Box> */}
						<Marker text={this.state.address} lat={this.state.lat} lng={this.state.lng} />
					</GoogleMapReact>
				</Box>

				{/* <div className='info-wrapper'>
					<div className='map-details'>
						Latitude: <span>{this.state.lat}</span>, Longitude: <span>{this.state.lng}</span>
					</div>
					<div className='map-details'>
						Zoom: <span>{this.state.zoom}</span>
					</div>
					<div className='map-details'>
						Address: <span>{this.state.address}</span>
					</div>
				</div> */}
			</Wrapper>
		);
	}
}

export default MyGoogleMap;
