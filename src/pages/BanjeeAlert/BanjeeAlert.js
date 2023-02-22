import { Box, Card, Grid, Tabs, Tab, IconButton, Typography, Tooltip } from "@mui/material";
import React from "react";
import { listAlert } from "./api-services/apiServices";
import AlertListTable from "./components/AlertListTable";
import { useCallback } from "react";
import PropTypes from "prop-types";
import ReportedAlertList from "./components/ReportedAlertList";
import { Add, Refresh } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";
import { MainContext } from "../../context/Context";
import { PaginationContext } from "../../context/PaginationContext";

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
	const navigate = useNavigate();
	const location = useLocation();
	const { themeData } = React.useContext(MainContext);
	const { alertPagination, setAlertPagination } = React.useContext(PaginationContext);
	const [value, setValue] = React.useState(location?.state?.reportedDetail ? 1 : 0);

	const [data, setData] = React.useState("");

	const [totalElements, setTotalElements] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		page: alertPagination?.page ? alertPagination?.page : 0,
		pageSize: alertPagination?.pageSize ? alertPagination?.pageSize : 10,
	});

	const handlePagination = (data) => {
		setPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleAlertListApiCall = () => {
		ListAlertApiCall();
	};

	const ListAlertApiCall = useCallback(() => {
		// if (currentLocation?.lat && currentLocation?.lon) {
		listAlert({
			// latitude: currentLocation?.lat,
			// longitude: currentLocation?.lon,
			page: pagination?.page,
			pageSize: pagination?.pageSize,
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
				setTotalElements(res.totalElements);
			})
			.catch((err) => console.error(err));
		// }
	}, [pagination]);

	// const listAllData = React.useCallback(() => {
	// 	if (navigator.geolocation) {
	// 		navigator.geolocation.getCurrentPosition((position) => {
	// 			setCurrentLocation(() => ({
	// 				lat: position.coords.latitude,
	// 				lon: position.coords.longitude,
	// 			}));
	// 		});
	// 	} else {
	// 		console.error("Geolocation is not supported by this browser.");
	// 	}
	// }, []);

	React.useEffect(() => {
		ListAlertApiCall();
	}, [ListAlertApiCall]);

	return (
		<Box>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
						<Box>
							<Typography
								sx={{
									fontWeight: 500,
									color: themeData ? "default" : "#6b778c",
									fontSize: "22px",
								}}>
								Alerts({totalElements ? totalElements : 0})
							</Typography>
						</Box>
						<Box>
							<Tooltip title='Create Alert' arrow sx={{ bacground: "white", color: "black" }}>
								<IconButton onClick={() => navigate("/banjee-alert/create")}>
									<Add color='primary' />
								</IconButton>
							</Tooltip>
							<Tooltip title='Refresh Alerts' arrow sx={{ bacground: "white", color: "black" }}>
								<IconButton
									onClick={() => {
										setAlertPagination({ page: undefined, pageSize: undefined });
										setPagination({ page: 0, pageSize: 10 });
									}}>
									<Refresh color='primary' />
								</IconButton>
							</Tooltip>
						</Box>
					</Card>
				</Grid>
				{/* <Grid item xs={12}>
					<Card sx={{ padding: "20px", borderRadius: "0px" }}>
						<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
							Banjee Alert
						</div>
						<Box sx={{ marginY: "10px" }}>
							<Divider />
						</Box>
						<AlertLocation currentLocation={currentLocation} zoom={10} data={data} type={"array"} />
					</Card>
				</Grid> */}
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
								handleAlertListApiCall={handleAlertListApiCall}
								listApiCall={ListAlertApiCall}
								pagination={pagination}
								handlePagination={handlePagination}
								data={data}
								totalElement={totalElements}
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
