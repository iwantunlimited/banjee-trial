import "./Dashboard.css";
import React from "react";
import {useEffect, useState} from "react";
import axios from "axios";
import Chart from "./Chart";
import {
	Box,
	Grid,
	IconButton,
	TextField,
	Modal,
	Button,
	Typography,
	Divider,
} from "@mui/material";
import {FilterAlt} from "@mui/icons-material";

import {LocalizationProvider} from "@mui/x-date-pickers-pro";
import {AdapterDateFns} from "@mui/x-date-pickers-pro/AdapterDateFns";
import {MobileDateRangePicker} from "@mui/x-date-pickers-pro/MobileDateRangePicker";
import {DateRange} from "@mui/x-date-pickers-pro/DateRangePicker";

const DashboardTrial = () => {
	const [open, setOpen] = React.useState(false);
	const [state, setState] = React.useState([null, null]);
	const [totalUser, setTotalUser] = React.useState([null, null]);
	const [filterDate, setFilterDate] = React.useState(null);
	const [customDate, setCustomDate] = React.useState(null);
	const [chartType, setChartType] = React.useState("");

	function handleCustomDate(event) {
		setCustomDate(new Date(event.target.value));
	}

	console.log("sdtate------------date", state);
	return (
		<div className="App" style={{position: "relative"}}>
			{/* <h1 className="title">MongoDB Charts</h1> */}
			<Grid container xs={12} spacing={1}>
				{/* Total User */}
				<Grid item xs={12} sm={1.71428}>
					<Box sx={{position: "relative"}}>
						<Chart
							height={"160px"}
							width={"100%"}
							// filter={{
							// 	createdOn: {$gte: new Date("2022-06-23T07:06:18.579+00:00")},
							// }}
							filter={filterDate !== null ? filterDate : null}
							chartId={"62b4000c-2b11-4994-8ed1-6d176cf7594e"}
						/>
					</Box>
				</Grid>
				<Grid item xs={12} sm={1.71428}>
					<Chart
						height={"160px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b40d62-6664-47ee-8234-11ce073ea022"}
					/>
				</Grid>
				<Grid item xs={12} sm={1.71428}>
					<Chart
						height={"160px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b4220e-7fbe-419e-8e56-f88e65493b91"}
					/>
				</Grid>
				<Grid item xs={12} sm={1.71428}>
					<Chart
						height={"160px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b422f3-cbdc-42d0-8702-ad1b8a19fe70"}
					/>
				</Grid>
				<Grid item xs={12} sm={1.71428}>
					<Chart
						height={"160px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b42c5d-5876-476c-83e4-9d8f2cddf29e"}
					/>
				</Grid>
				<Grid item xs={12} sm={1.71428}>
					<Chart
						height={"160px"}
						width={"100%"}
						chartId={"62b567a0-2b11-484e-8773-6d176c8ba08e"}
					/>
				</Grid>
				<Grid item xs={12} sm={1.71428}>
					<Chart
						height={"160px"}
						width={"100%"}
						chartId={"62b4307c-cbdc-4916-82d6-ad1b8a2009bd"}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Box sx={{position: "relative"}}>
						<Chart
							height={"400px"}
							width={"100%"}
							chartId={"62b40b03-cbdc-483f-86fb-ad1b8a0eda0a"}
							// filter={{
							// 	createdOn: {$gt: new Date("2022-05-24T07:24:32.207+00:00")},
							// }}
							filter={filterDate !== null ? filterDate : null}
						/>
					</Box>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Chart
						height={"400px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b400d4-2b11-415f-8a77-6d176cf7aa3c"}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Chart
						height={"400px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b4115d-2b11-4538-8827-6d176cfe0ac4"}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Box sx={{position: "relative"}}>
						<Chart
							height={"400px"}
							width={"100%"}
							filter={filterDate !== null ? filterDate : null}
							chartId={"62b427e2-852c-47cd-8b42-6e0624ccccda"}
						/>
					</Box>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Chart
						height={"400px"}
						width={"100%"}
						// filter={{
						// 	createdOn: {$gte: new Date("2022-05-23T07:06:18.579+00:00")},
						// }}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b414bc-cbdc-4b4b-83e9-ad1b8a12fcb5"}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Chart
						height={"400px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b4131d-3cb9-494b-853b-411e3c6a2409"}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Chart
						height={"400px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b42db3-2c44-4eda-857c-fdb03c1e0db1"}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<Chart
						height={"600px"}
						width={"100%"}
						chartId={"62b4105b-b622-4303-8a85-e9ffab6f9fe7"}
					/>
				</Grid>
			</Grid>
			<Box sx={{position: "fixed", bottom: "5px", right: "5px"}}>
				<IconButton sx={{background: "#21313C"}}>
					<FilterAlt
						fontSize="large"
						sx={{color: "white"}}
						id="basic-button"
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						onClick={() => setOpen(true)}
					/>
					<Modal
						open={open}
						onClose={() => setOpen(false)}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box
							sx={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								width: 400,
								bgcolor: "background.paper",
								boxShadow: 24,
								p: 4,
							}}
						>
							<Box>
								<Typography sx={{fontWeight: "600"}}>Select Date</Typography>
							</Box>
							<Divider sx={{mb: 1}} />
							<Box sx={{display: "flex", justifyContent: "center"}}>
								<LocalizationProvider
									dateAdapter={AdapterDateFns}
									localeText={{start: "From Date", end: "To Date"}}
								>
									<MobileDateRangePicker
										value={state}
										onChange={(newValue) => {
											setState(newValue);
										}}
										renderInput={(startProps, endProps) => (
											<React.Fragment>
												<Box sx={{display: "flex", flexDirection: "column"}}>
													<TextField {...startProps} />
													<Box sx={{textAlign: "center"}}> to </Box>
													<TextField sx={{my: 1}} {...endProps} />
												</Box>
											</React.Fragment>
										)}
									/>
								</LocalizationProvider>
							</Box>
							<Box sx={{display: "flex", justifyContent: "space-between"}}>
								<Button
									onClick={() => {
										setFilterDate(null);
										setOpen(false);
									}}
								>
									Reset
								</Button>
								<Button
									onClick={() => {
										setFilterDate({
											createdOn: {
												$gte: new Date(state[0]),
												$lte: new Date(state[1]),
											},
										});
										setOpen(false);
									}}
								>
									Filter
								</Button>
							</Box>
						</Box>
					</Modal>
				</IconButton>
			</Box>
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
