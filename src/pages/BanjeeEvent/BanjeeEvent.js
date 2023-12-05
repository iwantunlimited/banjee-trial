import { Box, Card, Grid, Tabs, Tab, IconButton, Typography, Tooltip } from "@mui/material";
import React from "react";
import { useCallback } from "react";
import PropTypes from "prop-types";
import { Add, Refresh } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";
import { MainContext } from "../../context/Context";
import { PaginationContext } from "../../context/PaginationContext";
import { listEvent } from "./api-services/apiServices";
import EventList from "./components/EventList";
import ReportedEventList from "./components/ReportedEventList";

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

function BanjeeEvent() {
	const navigate = useNavigate();
	const location = useLocation();
	const { themeData } = React.useContext(MainContext);
	const { eventPagination, setEventPagination } = React.useContext(PaginationContext);
	const [value, setValue] = React.useState(location?.state?.reportedDetail ? 1 : 0);

	const [data, setData] = React.useState("");

	const [totalElements, setTotalElements] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleEventListApiCall = () => {
		ListEventApiCall();
	};

	const ListEventApiCall = useCallback(() => {
		// if (currentLocation?.lat && currentLocation?.lon) {
		listEvent({
			// latitude: currentLocation?.lat,
			// longitude: currentLocation?.lon,
			type: "EVENT",
			page: eventPagination?.page,
			pageSize: eventPagination?.pageSize,
		})
			.then((res) => {
				console.log("res", res);
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
	}, [eventPagination]);

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
		ListEventApiCall();
	}, [ListEventApiCall]);

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
								Events({totalElements ? totalElements : 0})
							</Typography>
						</Box>
						<Box>
							{/* <Tooltip title='Create Event' arrow sx={{ bacground: "white", color: "black" }}>
								<IconButton onClick={() => navigate("/banjee-event/create")}>
									<Add color='primary' />
								</IconButton>
							</Tooltip> */}
							<Tooltip title='Refresh Events' arrow sx={{ bacground: "white", color: "black" }}>
								<IconButton
									onClick={() => {
										setEventPagination({ page: 0, pageSize: 10 });
									}}>
									<Refresh color='primary' />
								</IconButton>
							</Tooltip>
						</Box>
					</Card>
				</Grid>
				<Grid item xs={12}>
					<Card sx={{ padding: "10px", borderRadius: "0px" }}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<Tabs
								indicatorColor='primary'
								textColor='primary'
								value={value}
								onChange={handleChange}
								aria-label='basic tabs example'>
								<Tab label='Event List' {...a11yProps(0)} />
								<Tab label='Reported List' {...a11yProps(1)} />
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							<EventList
								handleEventListApiCall={handleEventListApiCall}
								listApiCall={ListEventApiCall}
								data={data}
								totalElement={totalElements}
							/>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<ReportedEventList />
						</TabPanel>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}

export default BanjeeEvent;
