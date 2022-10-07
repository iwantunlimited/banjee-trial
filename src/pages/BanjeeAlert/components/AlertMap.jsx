import React from "react";
import ".././alert.css";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { Box, Card, CircularProgress, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
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
	const data = [
		{
			lat: 23.4546,
			lon: 72.8564,
			title: "first",
		},
		{
			lat: 23.9546,
			lon: 72.8564,
			title: "second",
		},
		{
			lat: 23.4546,
			lon: 72.4564,
			title: "third",
		},
	];
	const {
		currentLocation: { lat, lon },
	} = props;
	console.log("userLocation-------", lat, lon);

	const [state, setState] = React.useState("");

	if (lat && lon) {
		return (
			<GoogleMap
				defaultZoom={8}
				defaultCenter={{ lat: lat ? lat : 23.75, lng: lon ? lon : -73.85 }}>
				{data?.map((item, index) => {
					return (
						<React.Fragment>
							<Marker
								onClick={() => {
									setState(index);
								}}
								className='marker'
								icon={{
									url: "https://maps.google.com/mapfiles/kml/paddle/stop.png",
									// size: { width: "200px", height: "200px" },
									scaledSize: new window.google.maps.Size(35, 35),
								}}
								position={{ lat: item?.lat, lng: item?.lon }}
								options={{}}
								// label={{
								// 	text: item?.title,
								// 	color: "black",
								// 	backgroundColor: "white",
								// 	className: "markerCssForAlert",
								// }}
								// labelStyle={{
								// 	backgroundColor: "white",
								// 	color: "black",
								// 	fontSize: "14px",
								// 	padding: "5px",
								// }}
							/>
							{index === state && (
								<InfoWindow
									// children={
									// 	<Box>
									// 		<p>{item.title}</p>
									// 	</Box>
									// }
									defaultOptions={{ pixelOffset: "0" }}
									position={{ lat: item?.lat + 0.2, lng: item?.lon + 0.01 }}>
									<Box sx={{ display: "flex", flexDirection: "column" }}>
										<span>{item.title}</span>
										<a href='www.banjee.org'>www.banjee.org</a>
									</Box>
								</InfoWindow>
							)}
						</React.Fragment>
					);
				})}
			</GoogleMap>
		);
	} else {
		return (
			<div
				sx={{
					width: "100%",
					height: "80vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</div>
		);
	}
});

export default UserLocation;
