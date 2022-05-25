import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import {
	Grid,
	Typography,
	Tab,
	Tabs,
	Box,
	Card,
	CircularProgress,
	Avatar,
	Container,
	Button,
	Badge,
} from "@mui/material";
import {
	findCustomer,
	findCustomerConnection,
	findBlockedCustomers,
	penddingConnectionsList,
} from "../User_Services/UserApiService";
import { Male, Female, Transgender } from "@mui/icons-material";
import "../users.css";
import { useNavigate, useParams } from "react-router-dom";
import UserLocation from "./UserLocation";

function CustomerView(props) {
	console.log(props);

	const { id } = useParams();

	let navigate = useNavigate();

	const theme = useTheme();

	const [value, setValue] = React.useState(0);

	const [conData, setConData] = React.useState();

	const [blockCon, setBlockCon] = React.useState();

	const [state, setState] = React.useState([]);
	const [penddingConIds, setpenddingConIds] = React.useState();

	// const { currentLocation } = state;

	console.log("state data---------", state);

	const [penddingData, setPenddingData] = React.useState();

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	const TabPanel = (props) => {
		const { children, value, index, ...other } = props;

		return (
			<div
				role='tabpanel'
				hidden={value !== index}
				id={`full-width-tabpanel-${index}`}
				aria-labelledby={`full-width-tab-${index}`}
				{...other}>
				{value === index && (
					<Box sx={{ p: 3 }}>
						<Typography>{children}</Typography>
					</Box>
				)}
			</div>
		);
	};

	TabPanel.propTypes = {
		children: PropTypes.node,
		index: PropTypes.number.isRequired,
		value: PropTypes.number.isRequired,
	};

	const a11yProps = (index) => {
		return {
			id: `full-width-tab-${index}`,
			"aria-controls": `full-width-tabpanel-${index}`,
		};
	};

	// ------------------------------------ find customer connection api call-------------------------------------//

	const findCustomerConnectionApiCall = React.useCallback(() => {
		findCustomerConnection(id)
			.then((response) => {
				setConData(response);
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	// ----------------------------------- find user api call --------------------------------------------

	const findByUserApiCall = React.useCallback(() => {
		findCustomer(id)
			.then((response) => {
				setState(response);
				setpenddingConIds(response.pendingConnections);
				penddingConnectionsListApiCall(response.pendingConnections);
				// console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	// ----------------------------------- find blocked user api call ---------------------------------------

	const findBlockedCustomerApiCall = React.useCallback(() => {
		findBlockedCustomers(id)
			.then((response) => {
				setBlockCon(response);
				console.log("bloecked list users", response);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	// --------------------------------- pendding connections api call --------------------------------------

	const penddingConnectionsListApiCall = React.useCallback((data) => {
		penddingConnectionsList(data)
			.then((response) => {
				setPenddingData(response);
				console.log("pending con res", response);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	React.useEffect(() => {
		findByUserApiCall();
		findCustomerConnectionApiCall();
		findBlockedCustomerApiCall();
	}, [findByUserApiCall, findCustomerConnectionApiCall, findBlockedCustomerApiCall, id]);

	console.log(state);
	if (state && conData) {
		return (
			<div>
				<Button
					variant='contained'
					onClick={() => navigate(-1)}
					sx={{
						mt: "1em",
						ml: "1em",
						width: "8em",
						height: "2em",
						textTransform: "none",
					}}>
					Go Back
				</Button>
				<Container maxWidth='xl'>
					{/* <ViewDetailGrid config='Hello'> */}
					{/* ---------------------------------- This Paper is for Two fields  -------------------------------- */}
					{/* <Paper elevation={1}> */}
					<Grid container spacing={2} style={{ marginTop: "15px" }}>
						<Grid item container xs={12} sm={12} md={12} lg={12}>
							<Grid
								item
								xs={12}
								sm={5}
								md={4}
								lg={4}
								xl={3}
								style={{
									height: "auto",
									paddingRight: "10px",
								}}>
								<Box
									elevation={1}
									style={{
										boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
										padding: "40px 10px 40px 10px",
										background: "white ",
										minHeight: "420px",
									}}>
									<Box
										style={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											flexDirection: "column",
											padding: "0 10px 0 10px",
										}}>
										<Avatar
											alt={state?.name?.length > 0 ? state?.name?.slice(0, 1) : "A"}
											src={
												"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
												state?.avtarUrl
											}
											sx={{ width: 150, height: 150 }}
										/>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												marginTop: "10px",
												fontSize: "10px",
												fontWeight: "400",
											}}>
											<Typography variant='h6' style={{ marginRight: "5px" }}>
												{state?.name}
											</Typography>
											{state?.gender && (
												<div>
													{state?.gender.toLowerCase() === "male" ? (
														<Male style={{ color: "blue" }} />
													) : state?.gender.toLowerCase() === "female" ? (
														<Female style={{ color: "#B73BA4" }} />
													) : (
														<Transgender style={{ color: "rgb(246,191,188)" }} />
													)}
												</div>
											)}
										</div>
										<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
											{window.innerWidth > 1282
												? state?.email
												: state?.email && state?.email.slice(0, 20)}
										</Typography>
										{window.innerWidth < 1282 && state && state.email.length > 10 && (
											<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
												{state?.email?.slice(20, state.email.length + 1)}
											</Typography>
										)}
										<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
											{state?.userObject?.mcc + " " + state?.userObject?.mobile}
										</Typography>
										<Box style={{ margin: "10px 0px 10px 0px" }}>
											{state?.inactive ? (
												<Button size='small' variant='outlined'>
													Activate
												</Button>
											) : (
												<Button size='small' variant='outlined'>
													Deactivate
												</Button>
											)}
											{/* <Button size="small" color='secondary' variant="outlined">View</Button> */}
										</Box>
									</Box>
								</Box>
							</Grid>

							{/* -------------------------------------------- Tab Panel ------------------------------------ */}

							<Grid
								item
								xs={12}
								sm={7}
								md={8}
								lg={8}
								xl={9}
								sx={{
									background: "#FFF",
									padding: "5px 5px 5px 20px",
								}}>
								{/* <Box sx={{ bgcolor: 'background.paper', width: 500 }}> */}
								{/* <AppBar position="static"> */}
								<Tabs
									value={value}
									onChange={handleChange}
									indicatorColor='primary'
									textColor='inherit'
									// variant="fullWidth"
									aria-label='full width tabs example'
									style={{ height: "10px!important" }}>
									{/* <Tab label="Profile" {...a11yProps(0)} /> */}
									<Tab label='Connection' {...a11yProps(0)} />
									<Tab label='Pending Connection' {...a11yProps(1)} />
									<Tab label='Blocked' {...a11yProps(2)} />
								</Tabs>
								{/* </AppBar> */}
								<SwipeableViews
									axis={theme.direction === "rtl" ? "x-reverse" : "x"}
									index={value}
									onChangeIndex={handleChangeIndex}
									style={{ overflowY: "scroll", height: "355px" }}>
									{/* ------------------------- connections ---------------------------- */}
									<TabPanel value={value} index={0} dir={theme.direction}>
										<Grid container spacing={2}>
											{conData?.content?.length > 0 ? (
												conData?.content.map((ele, index) => (
													<Grid
														item
														xs={4}
														sm={4}
														md={3}
														lg={3}
														xl={2}
														key={index}
														onClick={() => {
															navigate("/user/view/" + ele?.systemUserId);
															window.location.reload();
														}}
														style={{
															display: "flex",
															justifyContent: "center",
															alignItems: "center",
															flexDirection: "column",
														}}>
														{/* <Grid item xs={2} sm={2} md={2} lg={2}> */}
														<Badge
															badgeContent={
																ele?.connections?.length > 0 ? ele?.connections?.length : 0
															}
															max='9'
															color='primary'
															s
															className='badge-css'>
															<Avatar
																alt={ele?.name?.length > 0 ? ele?.name?.slice(0, 1) : "avatar"}
																src={
																	"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
																	ele?.avtarUrl
																}
																sx={{ width: 50, height: 50 }}
															/>
														</Badge>
														{/* </Grid> */}
														{/* <Grid item xs={10} sm={10} md={10} lg={10} > */}
														<Typography
															style={{ textAlign: "left", marginTop: "5px", fontSize: "15px" }}>
															{ele?.name?.slice(0, 20)}
														</Typography>
														{/* </Grid> */}
													</Grid>
												))
											) : (
												<div>User is not Connected to Anyone</div>
											)}
										</Grid>
									</TabPanel>
									{/* ------------------------- pendding connections ---------------------------- */}
									<TabPanel value={value} index={1} dir={theme.direction}>
										<Grid container spacing={2}>
											{penddingData?.content?.length > 0 ? (
												penddingData?.content.map((ele, index) => (
													<Grid
														key={index}
														onClick={() => {
															navigate("/user/view/" + ele?.systemUserId);
															window.location.reload();
														}}
														item
														xs={4}
														sm={4}
														md={2}
														lg={2}
														style={{
															display: "flex",
															justifyContent: "center",
															alignItems: "center",
															flexDirection: "column",
														}}>
														{/* <Grid item xs={4} sm={4} md={4} lg={4}>/ */}
														<Avatar
															alt={ele?.name?.length > 0 ? ele?.name?.slice(0, 1) : "avatar"}
															src={
																"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
																ele?.avtarUrl
															}
															sx={{ width: 50, height: 50 }}
														/>
														{/* </Grid>/ */}
														{/* <Grid item xs={8} sm={8} md={8} lg={8} >/ */}
														<Typography
															style={{ textAlign: "left", marginTop: "5px", fontSize: "15px" }}>
															{ele?.name}
														</Typography>
														{/* </Grid> */}
													</Grid>
												))
											) : (
												<div style={{ fontSize: "20px" }}>There is no pendding Connections</div>
											)}
										</Grid>
									</TabPanel>
									{/* ------------------------- blocked list ---------------------------- */}
									<TabPanel value={value} index={2} dir={theme.direction}>
										<Grid container spacing={2}>
											{blockCon?.content?.length > 0 ? (
												blockCon?.content.map((ele, index) => (
													<Grid
														key={index}
														onClick={() => navigate("/user/view/" + ele?.user?.id)}
														item
														xs={4}
														sm={4}
														md={2}
														lg={2}
														style={{
															display: "flex",
															justifyContent: "center",
															alignItems: "center",
															flexDirection: "column",
														}}>
														{/* <Grid item xs={4} sm={4} md={4} lg={4}>/ */}
														<Avatar
															alt={ele?.name?.length > 0 ? ele?.name.slice(0, 1) : "avatar"}
															src={
																"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
																ele?.user?.avtarUrl
															}
															sx={{ width: 50, height: 50 }}
														/>
														{/* </Grid>/ */}
														{/* <Grid item xs={8} sm={8} md={8} lg={8} >/ */}
														<Typography style={{ textAlign: "center" }} variant='h5'>
															{ele?.user?.firstName}
														</Typography>
														{/* </Grid> */}
													</Grid>
												))
											) : (
												<div style={{ fontSize: "20px" }}>There is no blocked user's</div>
											)}
										</Grid>
									</TabPanel>
								</SwipeableViews>
								{/* </Box> */}
							</Grid>
						</Grid>
						{/* <Grid item container xs={12}> */}
						<Grid item xs={12}>
							<Card style={{ background: "white", padding: "20px", marginBottom: "20px" }}>
								<Box>
									<h4 style={{ color: "grey" }}>User's Current Location</h4>
								</Box>
								<hr />
								{state?.currentLocation && (
									<Box style={{ width: "100%", height: "400px" }}>
										<UserLocation
											// googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3.exp&libraries=geometry,drawing,places"
											// loadingElement={<div style={{ height: `100%` }} />}
											// containerElement={<div style={{ height: `300px` }} />}
											// mapElement={<div style={{ height: `100%` }} />}
											data={state}
										/>
									</Box>
								)}
							</Card>
						</Grid>
					</Grid>
					{/* </Grid> */}
					{/* </Paper> */}

					{/* </ViewDetailGrid> */}
				</Container>
			</div>
		);
	} else {
		return (
			<div className='d-flex justify-content-center' style={{ margin: "25%" }}>
				<CircularProgress />
			</div>
		);
	}
}

export default CustomerView;
