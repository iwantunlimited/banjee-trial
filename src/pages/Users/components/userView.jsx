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
	IconButton,
} from "@mui/material";
import { findUserBySystemUserId } from "../User_Services/UserApiService";
import { Male, Female, Transgender, ArrowBack } from "@mui/icons-material";
import "../users.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserLocation from "./UserLocation";
import NeighrbourhoodList from "./NeighbourhoodList";
import BusinessList from "./BusinessList";
import CommunityList from "./CommunityList";
import AlertList from "./AlertList";
import BlogList from "./BlogList";
import { MainContext } from "../../../context/Context";
import moment from "moment";
import TimeSpentList from "./TimeSpentList";

function CustomerView(props) {
	const { setModalOpen, setModalData } = React.useContext(MainContext);
	const params = useParams();

	const { id } = params;

	let navigate = useNavigate();

	const theme = useTheme();

	const [value, setValue] = React.useState(0);

	const [conData, setConData] = React.useState();

	const [blockCon, setBlockCon] = React.useState();

	const [state, setState] = React.useState([]);
	// const [penddingConIds, setpenddingConIds] = React.useState();

	// const [penddingData, setPenddingData] = React.useState();

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

	// ----------------------------------- find user api call --------------------------------------------

	const findByUserApiCall = React.useCallback(() => {
		findUserBySystemUserId(id)
			.then((response) => {
				setState(response);
				// setpenddingConIds(response.pendingConnections);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [id]);

	React.useEffect(() => {
		findByUserApiCall();
	}, [findByUserApiCall, id]);

	if (state) {
		return (
			<div>
				<Box
					sx={{
						marginTop: "1em",
						marginLeft: "1em",
						width: "8em",
						height: "2em",
						textTransform: "none",
					}}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBack color='primary' />
					</IconButton>
				</Box>

				<Container maxWidth='xl'>
					{/* <ViewDetailGrid config='Hello'> */}
					{/* ---------------------------------- This Paper is for Two fields  -------------------------------- */}
					{/* <Paper elevation={1}> */}
					<Grid container style={{ marginTop: "15px" }}>
						<Grid item container xs={12} sm={12} md={12} lg={12} spacing={2}>
							<Grid item xs={12} sm={12} md={12} lg={12} xl={3.5}>
								<Card
									elevation={1}
									sx={{
										boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
										paddingY: { xs: "20px", xl: "40px" },
										paddingX: "10px",
										// background: "white ",
										// minHeight: { lg: "427px" },
										height: { xl: "100%" },
										// width: "100%",
									}}>
									<Box
										sx={{
											display: "flex",
											justifyContent: {
												xs: "center",
												sm: "flex-start",
												lg: "center",
											},
											alignItems: "center",
											flexDirection: { xs: "column", sm: "row", xl: "column" },
											padding: "0 10px 0 10px",
										}}>
										<Avatar
											alt={state?.firstName ? state?.firstName : "A"}
											src={
												"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
												state?.avtarUrl
											}
											sx={{
												width: 150,
												height: 150,
												marginRight: { xs: "0px", sm: "20px", xl: "0px" },
											}}
										/>
										<Box sx={{ textAlign: { xs: "center", sm: "left", xl: "center" } }}>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: { xs: "center", sm: "left", xl: "center" },
													marginTop: "10px",
													fontSize: "10px",
													fontWeight: "400",
												}}>
												{state?.firstName && state?.lastName && (
													<Typography variant='h6' style={{ marginRight: "5px" }}>
														{(state?.firstName ? state?.firstName : "") +
															" " +
															(state?.lastName ? state?.lastName : "")}
													</Typography>
												)}
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
											</Box>
											{state?.email && (
												<Typography
													sx={{
														marginTop: "5px",
														color: "grey",
														textOverflow: "ellipsis",
														whiteSpace: "break-spaces",
													}}
													variant='h6'>
													{state?.email}
												</Typography>
											)}
											{state?.mobile && (
												<Typography sx={{ marginTop: "5px", color: "grey" }} variant='h6'>
													{state?.mcc + " " + state?.mobile}
												</Typography>
											)}
											{state?.lastSeen && (
												<Typography>
													{"lastSeen: " + moment(state?.lastSeen).format("lll")}
												</Typography>
											)}
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
											</Box>
										</Box>
									</Box>
								</Card>
							</Grid>

							{/* -------------------------------------------- Tab Panel ------------------------------------ */}

							<Grid
								item
								xs={12}
								sm={12}
								md={12}
								lg={12}
								xl={8.5}
								sx={
									{
										// background: "#FFF",
										// padding: "5px 5px 5px 20px",
										// boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
									}
								}>
								{/* <>
								<Box sx={{ paddingTop: "5px" }}>
									<h4 style={{ color: "grey", marginBottom: "0rem" }}>User's Current Location</h4>
								</Box>
								<hr style={{ marginTop: "0.2rem" }} />
								{state?.currentLocation && (
									<Box style={{ width: "100%", height: "350px" }}>
										<UserLocation
											data={state}
										/>
									</Box>
								)}
								</> */}
								<Card
									sx={{
										borderRadius: "0px",
										padding: "5px",
										boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
										height: "100%",
									}}>
									<Tabs
										value={value}
										onChange={handleChange}
										indicatorColor='primary'
										textColor='inherit'
										// variant="fullWidth"
										aria-label='full width tabs example'
										style={{ height: "10px!important" }}>
										{/* <Tab label="Profile" {...a11yProps(0)} /> */}
										<Tab label='Neighbourhood' {...a11yProps(0)} />
										<Tab label='Community' {...a11yProps(1)} />
										<Tab label='Alerts' {...a11yProps(2)} />
										<Tab label='Blogs' {...a11yProps(3)} />
										<Tab label='Time Spent' {...a11yProps(4)} />
										{/* <Tab label='Blocked' {...a11yProps(4)} /> */}
									</Tabs>
									{/* </AppBar> */}
									<SwipeableViews
										axis={theme.direction === "rtl" ? "x-reverse" : "x"}
										index={value}
										onChangeIndex={handleChangeIndex}
										// style={{ overflowY: "scroll", height: "355px" }}
									>
										{/* ------------------------- connections ---------------------------- */}
										<TabPanel value={value} index={0} dir={theme.direction}>
											<Grid item xs={12} sx={{ padding: { xs: "0px", sm: "10px" } }}>
												<NeighrbourhoodList data={state?.systemUserId} />
											</Grid>
										</TabPanel>
										{/* ------------------------- pendding connections ---------------------------- */}
										<TabPanel value={value} index={1} dir={theme.direction}>
											<Grid iitem xs={12} sx={{ padding: "10px" }}>
												<CommunityList data={id} />
											</Grid>
										</TabPanel>
										{/* ------------------------- pendding connections ---------------------------- */}
										<TabPanel value={value} index={2} dir={theme.direction}>
											<Grid iitem xs={12} sx={{ padding: "10px" }}>
												<AlertList data={id} />
											</Grid>
										</TabPanel>
										{/* ------------------------- pendding connections ---------------------------- */}
										<TabPanel value={value} index={3} dir={theme.direction}>
											<Grid iitem xs={12} sx={{ padding: "10px" }}>
												<BlogList data={id} />
											</Grid>
										</TabPanel>
										{/* ------------------------- time spent list ---------------------------- */}
										<TabPanel value={value} index={4} dir={theme.direction}>
											<Grid iitem xs={12} sx={{ padding: "10px" }}>
												<TimeSpentList data={id} />
											</Grid>
										</TabPanel>
										{/* ------------------------- blocked list ---------------------------- */}
										{/* <TabPanel value={value} index={4} dir={theme.direction}>
											<Grid item container spacing={2}>
												{blockCon?.content?.length > 0 ? (
													blockCon?.content.map((ele, index) => (
														<Grid
															key={index}
															onClick={() => navigate("/user/" + ele?.user?.id)}
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
															<Avatar
																alt={ele?.name?.length > 0 ? ele?.name.slice(0, 1) : "avatar"}
																src={
																	"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
																	ele?.user?.avtarUrl
																}
																sx={{ width: 50, height: 50 }}
															/>
															<Typography style={{ textAlign: "center" }} variant='h5'>
																{ele?.user?.firstName}
															</Typography>
														</Grid>
													))
												) : (
													<Grid item xs={12}>
														<div style={{ fontSize: "20px" }}>There is no blocked user's</div>
													</Grid>
												)}
											</Grid>
										</TabPanel> */}
									</SwipeableViews>
								</Card>
							</Grid>
						</Grid>
						{/* <Grid item container xs={12}> */}
					</Grid>
					{/* </Grid> */}
					{/* </Paper> */}

					{/* </ViewDetailGrid> */}
				</Container>
			</div>
		);
	} else if (state === null) {
		return (
			<Container maxWidth='xl'>
				<IconButton onClick={() => navigate(-1)}>
					<ArrowBack />
				</IconButton>
				<Box
					sx={{
						marginTop: "20px",
						width: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}>
					<Typography>No data available !</Typography>
				</Box>
			</Container>
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
