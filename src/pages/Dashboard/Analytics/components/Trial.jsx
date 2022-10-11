import { CircularProgress } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";

function Trial(props) {
	const { chart, dataType } = props;

	const monthData = {
		Jan: 0,
		Feb: 0,
		Mar: 0,
		Apr: 0,
		May: 0,
		Jun: 0,
		Jul: 0,
		Aug: 0,
		Sep: 0,
		Oct: 0,
		Nov: 0,
		Dec: 0,
	};

	const { Female, Male } = chart;
	// console.log(chart);
	// console.log("data type for date", dataType);

	// typeData === 'month' ? console.log('month done') : console.log('year,done');;

	// console.log(Object.keys({...month,...Female}));
	// console.log(Object.values({...month , ...Female}));

	if (chart) {
		return (
			<div id='chart' style={{ width: "100%", display: "flex", justifyContent: "center" }}>
				<ReactApexChart
					options={{
						chart: {
							type: "bar",
							height: 300,
						},
						plotOptions: {
							bar: {
								horizontal: false,
								columnWidth: "55%",
								endingShape: "rounded",
							},
						},
						dataLabels: {
							enabled: false,
						},
						stroke: {
							show: true,
							width: 2,
							colors: ["transparent"],
						},
						xaxis: {
							// categories: Object.keys(monthData) ,
							categories:
								dataType === "month" ? Object.keys(monthData) : Object.keys({ ...Male, ...Female }),
						},
						yaxis: {
							title: {
								text: "Users  ",
							},
						},
						fill: {
							opacity: 1,
						},
						tooltip: {
							y: {
								formatter: function (val) {
									return " " + val + " users";
								},
							},
						},
					}}
					series={[
						{
							name: "Male",
							// data:  [0,25,52],
							data: Object.values({ ...monthData, ...Male }),
						},
						{
							name: "Female",
							// data:  [0,52,52,52],
							data: Object.values({ ...monthData, ...Female }),
						},
						// {
						//   name: 'Total User',
						//   data: []
						// },
					]}
					type='bar'
					width={window.innerWidth > 1442 ? 650 : 450}
					height={window.innerWidth > 1442 ? 300 : 200}
				/>
			</div>
		);
	} else {
		return (
			<div style={{ display: "flex", justifyContent: "center" }}>
				<CircularProgress />
			</div>
		);
	}
}

export default Trial;
