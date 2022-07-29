import React, {useEffect, useRef, useState} from "react";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import {Box, IconButton} from "@mui/material";
import {Filter1Outlined, Refresh} from "@mui/icons-material";
import "./Dashboard.css";

const Chart = ({filter, chartId, height, width}) => {
	const sdk = new ChartsEmbedSDK({
		baseUrl: "https://charts.mongodb.com/charts-banjee-wegnz",
	});
	const chartDiv = useRef(null);
	const [rendered, setRendered] = useState(false);
	const [data, setData] = React.useState(null);
	const [chart] = useState(
		sdk.createChart({
			chartId: chartId,
			height: height,
			width: width,
			theme: "dark",
			showAttribution: false,

			// filter: {gender: {$eq: "Male"}},
			// filter={{createdOn: {$gte: "2022-05-03T07:06:18.579+00:00"}}}
		})
	);

	useEffect(() => {
		chart
			.render(chartDiv.current)
			.then(() => setRendered(true))
			.catch((err) => console.log("Error during Charts rendering.", err));
	}, [chart]);

	useEffect(() => {
		console.log("filtered data from chart.js", filter);
		// if (rendered) {
		chart
			.setFilter(filter ? filter : {})
			.catch((err) => console.log("Error while filtering.", err));
		// }
		chart.getData().then((data) => {
			setData(data);
			console.log("data", data);
		});
	}, [chart, filter, rendered]);

	return (
		<Box sx={{position: "relative"}}>
			{/* <div ref={chartDiv} /> */}
			<div
				className="custom-chart"
				style={{
					position: "relative",
				}}
				ref={chartDiv}
			></div>
			{data && (
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
			)}
		</Box>
	);
};

export default Chart;
