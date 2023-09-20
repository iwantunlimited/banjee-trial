import React, { useState } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import StandaloneSearchBox from "react-google-maps/lib/components/places/StandaloneSearchBox";

const MapWithSearch = () => {
	const [searchBox, setSearchBox] = useState(null);
	const [selectedPlace, setSelectedPlace] = useState(null);

	const onSearchBoxLoad = (searchBox) => {
		setSearchBox(searchBox);
	};

	const onPlacesChanged = () => {
		const places = searchBox.getPlaces();
		if (places.length === 0) return;

		const selectedPlace = places[0];
		setSelectedPlace(selectedPlace);
	};

	console.log("selected place", selectedPlace);

	const onMapClick = (event) => {
		const lat = event.latLng.lat();
		const lng = event.latLng.lng();

		const fakePlace = {
			name: `Custom Place (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
			geometry: {
				location: { lat, lng },
			},
		};

		setSelectedPlace(fakePlace);
		// setSearchValue(fakePlace.name);
	};
	return (
		<GoogleMap defaultZoom={3} defaultCenter={{ lat: 0, lng: 0 }}>
			<StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
				<input
					type='text'
					placeholder='Search for a place'
					style={{
						boxSizing: "border-box",
						border: "1px solid transparent",
						width: "240px",
						height: "32px",
						padding: "0 12px",
						borderRadius: "3px",
						boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
						fontSize: "14px",
						outline: "none",
						textOverflow: "ellipsis",
					}}
				/>
			</StandaloneSearchBox>

			{selectedPlace && (
				<Marker
					position={{
						lat: selectedPlace.geometry.location.lat(),
						lng: selectedPlace.geometry.location.lng(),
					}}
				/>
			)}
		</GoogleMap>
	);
};

const WrappedMap = withScriptjs(withGoogleMap(MapWithSearch));

const MapContainer = () => {
	return (
		<div style={{ height: "400px", width: "100%" }}>
			<WrappedMap
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={<div style={{ height: "100%" }} />}
				containerElement={<div style={{ height: "100%" }} />}
				mapElement={<div style={{ height: "100%" }} />}
			/>
		</div>
	);
};

export default MapContainer;
