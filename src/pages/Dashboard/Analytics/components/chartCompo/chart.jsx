import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CircularProgress } from "@mui/material";
import "../../Analytics.css";

function ChartComp(props) {
	const { data } = props;

	const [state, setState] = React.useState({
		series: [0, 0, 0],
		options: {
			chart: {
				width: 350,
			},
			labels: ["Male", "Female", "Other"],
		},
	});

	React.useEffect(() => {
		setState((prev) => ({
			...prev,
			series: [
				data?.content?.filter((ele) => ele.gender === "Male").length,
				data?.content?.filter((ele) => ele.gender === "Female").length,
				data?.content?.filter((ele) => ele.gender === "I'd rather not to say" || ele.gender === "")
					.length,
			],
		}));
	}, [data]);

	return (
		<Card
			className='main-card'
			style={{
				display: "flex",
				justifyContent: "center",
				padding: "10px",
				width: "100%",
				height: "100%",
			}}>
			<div id='chart'>
				{data?.content?.length > 0 ? (
					<ReactApexChart
						options={state?.options}
						series={state?.series}
						type='pie'
						width={window.innerWidth < 769 ? 370 : window.innerWidth < 1442 ? 400 : 450}
					/>
				) : (
					<CircularProgress />
				)}
			</div>
		</Card>
	);
}

export default ChartComp;
