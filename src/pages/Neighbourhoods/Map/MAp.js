import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

export const MyMapComponent = compose(
	withProps({
		/**
		 * Note: create and replace your own key in the Google console.
		 * https://console.developers.google.com/apis/dashboard
		 * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
		 */
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
)((props) => {
	const [data, setData] = React.useState({
		lat: -34.59,
		lng: 150.66,
	});
	const { finalLocation, handleFinalLocation } = props;
	// console.log("====================================");
	// console.log("data", data, props);
	// console.log("====================================");

	// useEffect(() => {
	// 	if (finalLocation) {
	// 		setData(finalLocation);
	// 	}
	// }, [finalLocation]);
	return (
		<Box sx={{ positoin: "relative" }}>
			<GoogleMap
				// onClick={(e) => {
				// 	setData(() => ({
				// 		lat: e.latLng.lat(),
				// 		lng: e.latLng.lng(),
				// 	}));
				// 	props.handleLocation(e.latLng.lat(), e.latLng.lng());
				// 	console.log(e);
				// 	console.log(e.latLng.lat());
				// 	console.log(e.latLng.lng());
				// }}
				defaultZoom={8}
				position={finalLocation}
				defaultCenter={finalLocation ? finalLocation : { lat: -34.68, lng: 159.66 }}>
				{props.isMarkerShown && <Marker position={finalLocation} />}
			</GoogleMap>
		</Box>
	);
});
