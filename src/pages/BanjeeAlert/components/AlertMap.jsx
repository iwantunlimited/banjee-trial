import React from "react";
import ".././alert.css";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { Box, CircularProgress } from "@mui/material";
const AlertLocation = compose(
	withProps({
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
	// console.log("userLocation-------", lat, lon);

	const [state, setState] = React.useState("");

	if (props?.type === "array" && lat && lon && props?.data) {
		return (
			<GoogleMap
				defaultZoom={8}
				defaultCenter={{ lat: lat ? lat : 23.75, lng: lon ? lon : -73.85 }}>
				{props?.data?.map((item, index) => {
					return (
						<React.Fragment>
							<Marker
								onClick={() => {
									setState(index);
								}}
								key={index}
								className='marker'
								icon={{
									url: "https://maps.google.com/mapfiles/kml/paddle/stop.png",
									// size: { width: "200px", height: "200px" },
									scaledSize: new window.google.maps.Size(35, 35),
								}}
								position={{
									lat: item?.location?.coordinates[1],
									lng: item?.location?.coordinates[0],
								}}
							/>
							{state && index === state && (
								<InfoWindow
									// children={
									// 	<Box>
									// 		<p>{item.title}</p>
									// 	</Box>
									// }
									defaultOptions={{ pixelOffset: "0" }}
									position={{
										lat: item?.location?.coordinates[1] + 0.2,
										lng: item?.location?.coordinates[0] + 0.01,
									}}>
									<Box sx={{ display: "flex", flexDirection: "column" }}>
										<span>{item.eventName}</span>
										<a href={"/banjee-alert/" + item?.id}>view alert</a>
									</Box>
								</InfoWindow>
							)}
						</React.Fragment>
					);
				})}
			</GoogleMap>
		);
	} else if (props?.type === "object" && lat && lon && props?.data) {
		return (
			<GoogleMap
				defaultZoom={8}
				defaultCenter={{
					lat: props?.data?.location?.coordinates[1] ? props?.data?.location?.coordinates[1] : lat,
					lng: props?.data?.location?.coordinates[0] ? props?.data?.location?.coordinates[0] : lon,
				}}>
				<Marker
					key={props?.data?.id}
					onClick={() => {
						setState(props?.data?.id);
					}}
					className='marker'
					icon={{
						url: "https://maps.google.com/mapfiles/kml/paddle/stop.png",
						// size: { width: "200px", height: "200px" },
						scaledSize: new window.google.maps.Size(35, 35),
					}}
					position={{
						lat: props?.data?.location?.coordinates[1],
						lng: props?.data?.location?.coordinates[0],
					}}
				/>
				{state === props?.data?.id && (
					<InfoWindow
						// children={
						// 	<Box>
						// 		<p>{item.title}</p>
						// 	</Box>
						// }
						onCloseClick={() => {
							setState(null);
						}}
						defaultOptions={{ pixelOffset: { height: -30, width: 0 } }}
						position={{
							lat: props?.data?.location?.coordinates[1],
							lng: props?.data?.location?.coordinates[0],
						}}>
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							<span>{props?.data.eventName}</span>
							<a
								href={
									"https://www.google.com/maps/@" +
									props?.data?.location?.coordinates[1] +
									"," +
									props?.data?.location?.coordinates[0] +
									",12.17z"
								}>
								share direction
							</a>
						</Box>
					</InfoWindow>
				)}
			</GoogleMap>
		);
	} else {
		return (
			<div
				style={{
					width: "100%",
					height: "50vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</div>
		);
	}
});

export default AlertLocation;
