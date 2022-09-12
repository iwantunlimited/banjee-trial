import React from "react";
import "../../../index.css";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
const UserLocation = compose(
	withProps({
		/**
		 * Note: create and replace your own key in the Google console.
		 * https://console.developers.google.com/apis/dashboard
		 * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
		 */
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: window.innerWidth < 500 ? `250px` : `400px` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withScriptjs,
	withGoogleMap
)((props) => {
	const {
		currentLocation: { lat, lon },
		name,
	} = props.data;
	// console.log("userLocation-------", lat, lon);
	return (
		<GoogleMap defaultZoom={8} defaultCenter={{ lat: lat, lng: lon }}>
			<Marker
				position={{ lat: lat, lng: lon }}
				options={
					{
						// anchorPoint: new google.maps.Point(102, 10)
					}
				}
				label={{
					text: name,
					color: "white",
					className: "markerCss",
				}}
				labelStyle={{
					backgroundColor: "yellow",
					fontSize: "32px",
					padding: "16px",
				}}
			/>
		</GoogleMap>
	);
});

export default UserLocation;
