import React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Box } from "@mui/material";
import CustomMap from "./customMap";

function Map() {
	const render = (Status) => {
		return <h1>{Status}</h1>;
	};
	return (
		<Box>
			<Wrapper apiKey={"YOUR_API_KEY"} render={render}>
				<CustomMap></CustomMap>
			</Wrapper>
		</Box>
	);
}

export default Map;
