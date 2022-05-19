import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { compose } from "recompose";

const MapComponent = compose(
	withScriptjs,
	withGoogleMap
)((props) => {
	console.log(props.data);
	return (
		<GoogleMap defaultZoom={2} defaultCenter={{ lat: 23.0498721, lng: 72.5015208 }}>
			{props &&
				props.data &&
				props.data.map((ele) => {
					return (
						<GoogleMap defaultZoom={2} defaultCenter={{ lat: 23.0498721, lng: 72.5015208 }}>
							<Marker
								position={{
									lat: ele.currentLocation && ele.currentLocation.lat,
									lng: ele.currentLocation && ele.currentLocation.lon,
								}}
								options={
									{
										// anchorPoint: new google.maps.Point(102, 10)
									}
								}
								label={{
									text: ele.name,
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
				})}
		</GoogleMap>
	);
});

export default MapComponent;
