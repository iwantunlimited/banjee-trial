import React, {useEffect, useRef, useState} from "react";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import {Box, IconButton} from "@mui/material";
import {Filter1Outlined, Refresh} from "@mui/icons-material";

const Chart = ({filter, chartId, height, width}) => {
	const sdk = new ChartsEmbedSDK({
		baseUrl: "https://charts.mongodb.com/charts-banjee-wegnz",
	});
	const chartDiv = useRef(null);
	const [rendered, setRendered] = useState(false);
	const [chart] = useState(
		sdk.createChart({
			chartId: chartId,
			height: height,
			width: width,
			theme: "dark",
			showAttribution: false,
		})
	);

	useEffect(() => {
		chart
			.render(chartDiv.current)
			.then(() => setRendered(true))
			.catch((err) => console.log("Error during Charts rendering.", err));
	}, [chart]);

	// useEffect(() => {
	// 	if (rendered) {
	// 		chart
	// 			.setFilter(filter)
	// 			.catch((err) => console.log("Error while filtering.", err));
	// 	}
	// }, [chart, filter, rendered]);

	return (
		<Box sx={{position: "relative"}}>
			{/* <div ref={chartDiv} /> */}
			<div style={{position: "relative"}} ref={chartDiv}></div>
			<IconButton
				onClick={() => chart.refresh()}
				sx={{
					position: "absolute",
					top: "1px",
					right: "1px",
				}}
			>
				<Refresh style={{color: "white"}} />
			</IconButton>
		</Box>
	);
};

export default Chart;
