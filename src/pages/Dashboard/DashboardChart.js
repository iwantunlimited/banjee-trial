import "./Dashboard.css";
import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import Chart from "./Chart";
import {Box, Grid, TextField} from "@mui/material";

const DashboardTrial = () => {
	return (
		<div className="App">
			{/* <h1 className="title">MongoDB Charts</h1> */}
			<Grid container xs={12} spacing={2}>
				<Grid item xs={12} sm={2}>
					<Chart
						height={"200px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b4000c-2b11-4994-8ed1-6d176cf7594e"}
					/>
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chart
						height={"200px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b40d62-6664-47ee-8234-11ce073ea022"}
					/>
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chart
						height={"200px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b4220e-7fbe-419e-8e56-f88e65493b91"}
					/>
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chart
						height={"200px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b422f3-cbdc-42d0-8702-ad1b8a19fe70"}
					/>
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chart
						height={"200px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b42c5d-5876-476c-83e4-9d8f2cddf29e"}
					/>
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chart
						height={"200px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b4307c-cbdc-4916-82d6-ad1b8a2009bd"}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Chart
						height={"400px"}
						width={"100%"}
						chartId={"62b40b03-cbdc-483f-86fb-ad1b8a0eda0a"}
						// filter={{createdOn: {$gte: "2022-05-03T07:06:18.579+00:00"}}}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Chart
						height={"400px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b400d4-2b11-415f-8a77-6d176cf7aa3c"}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Chart
						height={"400px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b4115d-2b11-4538-8827-6d176cfe0ac4"}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Chart
						height={"400px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b427e2-852c-47cd-8b42-6e0624ccccda"}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Chart
						height={"400px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b414bc-cbdc-4b4b-83e9-ad1b8a12fcb5"}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Chart
						height={"400px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b4131d-3cb9-494b-853b-411e3c6a2409"}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Chart
						height={"400px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b42db3-2c44-4eda-857c-fdb03c1e0db1"}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<Chart
						height={"600px"}
						width={"100%"}
						// filter={filterCountry}
						chartId={"62b4105b-b622-4303-8a85-e9ffab6f9fe7"}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default DashboardTrial;
{
	/* <TextField
						type="date"
						variant="filled"
						name="date"
						value={date}
						onChange={(event) => {
							setDate(new Date(event.target.value));
						}}
					/> */
}
