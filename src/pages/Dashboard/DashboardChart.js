import "./Dashboard.css";
import React from "react";
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
import { FilterAlt } from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { MobileDateRangePicker } from "@mui/x-date-pickers-pro/MobileDateRangePicker";
import { MainContext } from "../../context/Context";

const DashboardTrial = () => {
	const context = React.useContext(MainContext);
	const { setModalOpen, setModalData } = context;
	const [open, setOpen] = React.useState(false);
	const [state, setState] = React.useState([null, null]);
	const [filterDate, setFilterDate] = React.useState(null);

	// console.log("sdtate------------date", state);
	return (
		<div
			className='App'
			style={{ position: "relative", display: "flex", justifyContent: "center" }}>
			<Grid container xs={12} spacing={1}>
				{/* Total User */}
				<Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
					<Box sx={{ position: "relative" }}>
						<Chart
							height={window?.innerWidth < 426 ? "120px" : "160px"}
							width={"100%"}
							// filter={{
							// 	createdOn: {$gte: new Date("2022-06-23T07:06:18.579+00:00")},
							// }}
							filter={filterDate !== null ? filterDate : null}
							chartId={"62b4000c-2b11-4994-8ed1-6d176cf7594e"}
						/>
					</Box>
				</Grid>
				{/* total feeds */}
				<Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
					<Chart
						height={window?.innerWidth < 426 ? "120px" : "160px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b42c5d-5876-476c-83e4-9d8f2cddf29e"}
					/>
				</Grid>
				{/* total business */}
				<Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
					<Chart
						height={window?.innerWidth < 426 ? "120px" : "160px"}
						width={"100%"}
						chartId={"63118227-acdd-4bc8-8d7e-64b97216c5ab"}
					/>
				</Grid>
				{/* total neighbourhood */}
				<Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
					<Chart
						height={window?.innerWidth < 426 ? "120px" : "160px"}
						width={"100%"}
						chartId={"63118421-e4c6-4de3-82b9-da1bc3db7866"}
					/>
				</Grid>
				{/* total alerts */}
				<Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
					<Chart
						height={window?.innerWidth < 426 ? "120px" : "160px"}
						width={"100%"}
						chartId={"638db40c-855f-40eb-838c-f9480c35449e"}
					/>
				</Grid>
				{/* total live rooms */}
				<Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
					<Chart
						height={window?.innerWidth < 426 ? "120px" : "160px"}
						width={"100%"}
						chartId={"62b4307c-cbdc-4916-82d6-ad1b8a2009bd"}
					/>
				</Grid>
				{/* total live users */}
				<Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
					<Chart
						height={window?.innerWidth < 426 ? "120px" : "160px"}
						width={"100%"}
						chartId={"62b567a0-2b11-484e-8773-6d176c8ba08e"}
					/>
				</Grid>
				{/* total blog */}
				<Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
					<Chart
						height={window?.innerWidth < 426 ? "120px" : "160px"}
						width={"100%"}
						chartId={"631182b2-5381-4cdc-87d4-5f38f430a48d"}
					/>
				</Grid>
				{/* gender wise count */}
				<Grid item xs={12} sm={12}>
					<Chart
						height={"400px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b400d4-2b11-415f-8a77-6d176cf7aa3c"}
					/>
				</Grid>
				{/* monthly user registrations */}
				<Grid item xs={12} sm={12} md={12} lg={8.5} xl={9}>
					<Box sx={{ position: "relative" }}>
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

				{/* monthly feed */}
				<Grid item xs={12} sm={5} md={5.5} lg={3.5} xl={3}>
					<Chart
						height={"400px"}
						width={"100%"}
						filter={filterDate !== null ? filterDate : null}
						chartId={"62b42db3-2c44-4eda-857c-fdb03c1e0db1"}
						chartname='feed'
					/>
				</Grid>
				{/* city wise alert today */}
				<Grid item xs={12} sm={7} md={6.5} lg={4.5} xl={4.5}>
					<Box sx={{ position: "relative" }}>
						<Chart
							height={"400px"}
							width={"100%"}
							filter={filterDate !== null ? filterDate : null}
							chartId={"638db526-6b6e-47ef-8aac-43649de6b297"}
							chartname='userChart'
						/>
					</Box>
				</Grid>
				{/* recently registered user */}
				<Grid item xs={12} sm={12} md={12} lg={7.5} xl={7.5}>
					<Box sx={{ position: "relative" }}>
						<Chart
							height={"400px"}
							width={"100%"}
							filter={filterDate !== null ? filterDate : null}
							chartId={"62b427e2-852c-47cd-8b42-6e0624ccccda"}
							chartname='userChart'
						/>
					</Box>
				</Grid>

				{/* alerts map */}
				<Grid item xs={12} sm={12}>
					<Chart height={"600px"} width={"100%"} chartId={"638db3b2-d3fc-4d29-862f-fc2e3d5b4de5"} />
				</Grid>
			</Grid>
			<Box sx={{ position: "fixed", bottom: "5px", right: "5px" }}>
				<IconButton
					sx={{
						background: "#21313C",
						"&:hover": {
							background: "#21313c",
						},
					}}>
					<FilterAlt
						fontSize='large'
						sx={{ color: "white" }}
						id='basic-button'
						aria-controls={open ? "basic-menu" : undefined}
						aria-haspopup='true'
						aria-expanded={open ? "true" : undefined}
						onClick={() => setOpen(true)}
					/>
					<Modal
						open={open}
						onClose={() => setOpen(false)}
						aria-labelledby='modal-modal-title'
						aria-describedby='modal-modal-description'>
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
							}}>
							<Box>
								<Typography sx={{ fontWeight: "600" }}>Select Date</Typography>
							</Box>
							<Divider sx={{ mb: 1 }} />
							<Box sx={{ display: "flex", justifyContent: "center" }}>
								<LocalizationProvider
									dateAdapter={AdapterDateFns}
									localeText={{ start: "From Date", end: "To Date" }}>
									<MobileDateRangePicker
										value={state}
										onChange={(newValue) => {
											setState(newValue);
										}}
										renderInput={(startProps, endProps) => (
											<React.Fragment>
												<Box sx={{ display: "flex", flexDirection: "column" }}>
													<TextField {...startProps} />
													<Box sx={{ textAlign: "center" }}> to </Box>
													<TextField sx={{ my: 1 }} {...endProps} />
												</Box>
											</React.Fragment>
										)}
									/>
								</LocalizationProvider>
							</Box>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Button
									onClick={() => {
										setFilterDate(null);
										setState([null, null]);
										setModalOpen(true);
										setModalData("filter removed", "success");
										setOpen(false);
									}}>
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
										setModalOpen(true);
										setModalData("filter applied", "success");
										setOpen(false);
									}}>
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
