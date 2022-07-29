import React, {useEffect, useRef, useState} from "react";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import {Box, IconButton, Button, Typography} from "@mui/material";
import {Download, Filter1Outlined, Refresh} from "@mui/icons-material";
// import "./Dashboard.css";
import {ExportToCsv} from "export-to-csv";

const ReportChart = ({filter, chartId, height, width, chartname}) => {
	const sdk = new ChartsEmbedSDK({
		baseUrl: "https://charts.mongodb.com/charts-banjee-wegnz",
	});
	const chartDiv = useRef(null);
	const [rendered, setRendered] = useState(false);
	const [reportData, setReportData] = React.useState();
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
	function chartHeaders() {
		switch (chartname) {
			case "feed":
				return ["Date", "Type", "TotalFeed"];
			case "userChart":
				return ["Name", "Email", "MobileNumber", "Date", "Gender"];
			default:
				return [];
		}
	}

	const options = {
		fieldSeparator: ",",
		quoteStrings: '"',
		decimalSeparator: ".",
		showLabels: true,
		showTitle: true,
		title: "Report Data",
		useTextFile: false,
		useBom: true,
		// useKeysAsHeaders: true,
		headers: chartHeaders(),
	};

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
			console.log("data", data);
			setReportData(data);
		});
	}, [chart, filter, rendered]);

	return (
		<Box sx={{position: "relative"}}>
			{/* <div ref={chartDiv} /> */}
			<div
				// className="custom-chart"
				style={{
					position: "relative",
				}}
				ref={chartDiv}
			></div>
			{reportData && (
				<Box
					sx={{
						position: "absolute",
						top: "1px",
						right: "5px",
						display: "flex",
					}}
				>
					<IconButton onClick={() => chart.refresh()}>
						<Refresh style={{color: "white"}} />
					</IconButton>
					<Button
						// variant="outlined"
						sx={{
							textTransform: "none",
							mx: 1,
							borderColor: "white",
							p: 1,
							color: "white",
							display: "flex",
							alignItems: "center",
						}}
						onClick={() => {
							const csvExporter = new ExportToCsv(options);
							csvExporter.generateCsv(reportData.documents);
						}}
					>
						<Download />
						<Typography>CSV</Typography>
					</Button>
				</Box>
			)}
		</Box>
	);
};

export default ReportChart;
