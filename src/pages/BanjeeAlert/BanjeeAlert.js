import { Box, Card, Divider, Grid, Tabs, Tab } from "@mui/material";
import React from "react";
import AlertMap from "./components/AlertMap";
import { filterReportList, listAlert } from "./api-services/apiServices";
import AlertListTable from "./components/AlertListTable";
import { useCallback } from "react";
import PropTypes from "prop-types";
import AlertLocation from "./components/AlertMap";
import ReportedAlertList from "./components/ReportedAlertList";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function BanjeeAlert() {
	const [value, setValue] = React.useState(0);
	const [currentLocation, setCurrentLocation] = React.useState({
		lat: "",
		lon: "",
	});

	const [data, setData] = React.useState("");

	const [state, setState] = React.useState({
		totalElement: 0,
		pagination: {
			page: 0,
			pageSize: 10,
		},
	});

	const handlePagination = (data) => {
		setState((prev) => ({
			...prev,
			pagination: data,
		}));
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const ListAlertApiCall = useCallback(
		(page, pageSize) => {
			if (currentLocation?.lat && currentLocation?.lon) {
				listAlert({
					// latitude: currentLocation?.lat,
					// longitude: currentLocation?.lon,
					page: page,
					pageSize: pageSize,
				})
					.then((res) => {
						const resp = res?.content?.map((item) => {
							return {
								routingId: item?.id,
								address: item?.metaInfo?.address,
								cFirstName: item?.createdByUser?.firstName,
								cLastName: item?.createdByUser?.lastName,
								...item,
							};
						});
						setData(resp);
						setState((prev) => ({
							...prev,
							totalElement: res.totalElements,
							pagination: {
								page: res?.pageable?.pageNumber,
								pageSize: res?.pageable?.pageSize,
							},
						}));
					})
					.catch((err) => console.error(err));
			}
		},
		[currentLocation]
	);

	const listAllData = React.useCallback(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				setCurrentLocation(() => ({
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				}));
			});
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}, []);

	React.useEffect(() => {
		listAllData();
	}, [listAllData]);

	React.useEffect(() => {
		ListAlertApiCall(0, 10);
	}, [ListAlertApiCall]);

	return (
		<Box>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<Card sx={{ padding: "20px", borderRadius: "0px" }}>
						<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
							Banjee Alert
						</div>
						<Box sx={{ marginY: "10px" }}>
							<Divider />
						</Box>
						<AlertLocation currentLocation={currentLocation} zoom={10} data={data} type={"array"} />
					</Card>
				</Grid>
				{/* <Grid item xs={12}>
					<Card sx={{ padding: "10px", borderRadius: "0px" }}>
						<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>Alert List</div>
						<Box sx={{ marginY: "10px" }}>
							<Divider />
						</Box>
						<AlertListTable
							listApiCall={ListAlertApiCall}
							pagination={state}
							handlePagination={handlePagination}
							data={data}
						/>
					</Card>
				</Grid> */}
				<Grid item xs={12}>
					<Card sx={{ padding: "10px", borderRadius: "0px" }}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<Tabs
								indicatorColor='primary'
								textColor='primary'
								value={value}
								onChange={handleChange}
								aria-label='basic tabs example'>
								<Tab label='Alert List' {...a11yProps(0)} />
								<Tab label='Reported List' {...a11yProps(1)} />
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							<AlertListTable
								listApiCall={ListAlertApiCall}
								pagination={state}
								handlePagination={handlePagination}
								data={data}
							/>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<ReportedAlertList />
						</TabPanel>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}

export default BanjeeAlert;
