import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
	Container,
	Box,
	Card,
	Grid,
	Typography,
	Avatar,
	CircularProgress,
	Button,
	Tab,
	Tabs,
	Hidden,
	Stack,
	Autocomplete,
	TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
	ReportedUserAction,
	ReportedUserList,
	findReportedCustomer,
} from "../User_Services/UserApiService";
import { Male, Female, Transgender } from "@mui/icons-material";
import PropTypes from "prop-types";
import "../users.css";
import SwipeableViews from "react-swipeable-views";
import { getReportedFeedDetail } from "../../Social_Feeds/services/ApiServices";

function ViewReportedUser(props) {
	const navigate = useNavigate();
	const { state } = useLocation();

	const params = useParams();

	const theme = useTheme();

	const UserId = params.id;

	const [value, setValue] = React.useState(0);

	const [reportList, setReportList] = React.useState({
		data: [],
		totalElements: 0,
	});

	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});
	const [reportedDataAvailable, setReportedDataAvailable] = React.useState(false);

	const [temporaryBtnClick, setTemporaryBtnClick] = React.useState(false);
	const [btnError, setBtnError] = React.useState(false);
	const [suspendDuration, setSuspendDuration] = React.useState(null);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	// console.log("====================================");
	// console.log("repotrtList", reportList);
	// console.log("====================================");

	const rows = reportList?.data?.length > 0 ? reportList?.data : [];

	const columns = [
		{
			id: "1",
			field: "mavatarUrl",
			headerClassName: "app-header",
			headerName: "Avatar",
			flex: 0.15,
			align: "center",
			renderCell: (params) => {
				return (
					<Avatar
						src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${params?.row?.reportedBy?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						alt={params?.row?.reportedBy?.avtarUrl}
					/>
				);
			},
		},
		{
			id: "2",
			field: "firstName",
			headerClassName: "app-header",
			headerName: "Name",
			flex: 0.3,
			renderCell: (params) => params?.row?.reportedBy?.firstName,
		},
		// {
		// 	id: "3",
		// 	field: "email",
		// 	headerClassName: "app-header",
		// 	headerName: "Email",
		// 	flex: 0.4,
		// },
		// {
		// 	id: "4",
		// 	field: "mobile",
		// 	headerClassName: "app-header",
		// 	headerName: "Mobile",
		// 	flex: 0.4,
		// },
		{
			id: "5",
			field: "remark",
			headerClassName: "app-header",
			headerName: "Remark",
			flex: 0.4,
			renderCell: (params) => params?.row?.remark,
		},
	];

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

	// ------------------------------------ find Reported Customer Api Call ---------------------------------------

	const findReportedCustomerApiCall = React.useCallback(() => {
		ReportedUserList({
			page: pagination?.page,
			pageSize: pagination?.pageSize,
			reportedUserId: params?.id,
		})
			.then((response) => {
				console.log("====================================");
				console.log("respo", response);
				console.log("====================================");
				setReportedDataAvailable(true);
				setReportList({
					data: response?.content,
					totalElements: response?.totalElements,
				});
			})
			.catch((err) => {
				console.error(err);
			});
	}, [pagination, params?.id]);

	const ReportActionApiCall = React.useCallback((data) => {
		ReportedUserAction({
			systemUserId: data?.userId,
			warning: data?.warning,
			temporarilySuspend: data?.temporarilySuspend,
			permanentSuspend: data?.permanentSuspend,
			...(data?.temporarilySuspend ? { suspensionDays: data?.duration } : {}),
		})
			.then((res) => {
				console.log("====================================");
				console.log("res", res);
				console.log("====================================");
			})
			.catch((err) => console.error("error", err));
	}, []);

	React.useEffect(() => {
		findReportedCustomerApiCall();
	}, [findReportedCustomerApiCall]);

	return (
		<div>
			<Button
				variant='contained'
				onClick={() => {
					navigate(-1);
				}}
				sx={{
					marginTop: "1em",
					marginLeft: "1em",
					width: "8em",
					height: "2em",
					textTransform: "none",
				}}>
				Go Back
			</Button>
			<Container maxWidth='lg' sx={{ marginY: { xs: 1, md: 2 } }}>
				<Grid item container xs={12} sm={12} md={12} lg={12} spacing={2}>
					<Grid
						item
						xs={12}
						sm={12}
						md={12}
						lg={12}
						style={{ display: "flex", justifyContent: "center" }}>
						<Card className='main-card' style={{ display: "flex", flexDirection: "column" }}>
							<Grid
								item
								xs={12}
								sm={12}
								md={12}
								lg={12}
								style={{ display: "flex", justifyContent: "center" }}>
								<Avatar
									src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${state?.userObject?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
									alt={state?.userObject?.firstName}
									style={{ height: "100px", width: "100px" }}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={12}
								md={12}
								lg={12}
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									marginTop: "10px",
								}}>
								{/* <div style={{display:'flex',alignItems:'center',marginTop:'10px'}}> */}
								<Typography variant='h5'>{state?.userObject?.firstName}</Typography>
								{state?.userObject?.gender && (
									<div>
										{state?.userObject?.gender.toLowerCase() === "male" ? (
											<Male style={{ color: "blue" }} />
										) : state?.userObject?.gender.toLowerCase() === "female" ? (
											<Female style={{ color: "#B73BA4" }} />
										) : (
											<Transgender style={{ color: "rgb(246,191,188)" }} />
										)}
									</div>
								)}
								{/* </div> */}
							</Grid>
							<Grid
								item
								container
								xs={12}
								sm={12}
								md={12}
								lg={12}
								style={{ marginTop: "10px", textAlign: "left" }}>
								<Grid item xs={12} sm={12} md={12} lg={12} style={{ display: "flex" }}>
									<Typography variant='h6'>Mobile:</Typography>
									{/* </Grid>
                                        <Grid item xs={6} sm={8} md={9} lg={9}> */}
									<Typography variant='h6' style={{ color: "#666", marginLeft: "15px" }}>
										{state?.userObject?.mobile}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={12} md={12} lg={12} style={{ display: "flex" }}>
									<Typography variant='h6'> {state?.userObject?.email && "Email:"}</Typography>
									{/* </Grid>
                                        <Grid item xs={6} sm={8} md={10} lg={10}> */}
									<Typography variant='h6' style={{ color: "#666", marginLeft: "15px" }}>
										{state?.userObject?.email}
									</Typography>
								</Grid>
								<Grid item xs={12} sm={12} md={12} lg={12}>
									<Typography variant='h6' style={{ marginTop: "2px" }}>
										Reported By: {state?.userObject?.length}
									</Typography>
								</Grid>
								<Grid
									item
									xs={12}
									sx={{
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
									}}>
									{temporaryBtnClick && (
										<Autocomplete
											size='small'
											disablePortal
											id='combo-box-demo'
											onChange={(event, newEvent) => {
												console.log("newEvent", newEvent);
												setSuspendDuration(newEvent);
											}}
											options={["1 Day", "3 Days", "7 Days"]}
											sx={{ width: 300, marginBottom: { xs: 1, md: 2 } }}
											renderInput={(params) => (
												<TextField error={btnError} focused={btnError} {...params} label='Time Duration' />
											)}
										/>
									)}
									<Stack columnGap={2} flexDirection={"row"} alignItems={"center"}>
										<Button color='info' variant='outlined' sx={{ textTransform: "none" }}>
											Send Warning
										</Button>
										<Button
											color='inherit'
											onClick={() => {
												if (temporaryBtnClick) {
													if (suspendDuration === null) {
														setBtnError(true);
													} else {
														ReportActionApiCall({
															userId: state?.userObject?.id,
															warning: true,
															temporarilySuspend: false,
															permanentSuspend: false,
															suspensionDays: "",
														});
													}
												} else {
													setTemporaryBtnClick(true);
												}
											}}
											variant='contained'
											sx={{ textTransform: "none" }}>
											Temporary Suspend
										</Button>
										<Button color='error' variant='contained' sx={{ textTransform: "none" }}>
											Permenant Suspend
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</Card>
					</Grid>

					{/* -------------------------------------------- Tab Panel ------------------------------------ */}

					<Grid
						item
						xs={12}
						sm={12}
						md={12}
						lg={12}
						style={{ background: "transparent", paddingTop: "10px", paddingLeft: "20px" }}>
						{reportedDataAvailable ? (
							<Box sx={{ bgcolor: "background.paper", background: "white", padding: "10px" }}>
								<Tabs
									value={value}
									onChange={handleChange}
									indicatorColor='primary'
									textColor='inherit'
									// variant="fullWidth"
									aria-label='full width tabs example'
									style={{ height: "10px!important" }}>
									<Tab label='Reported By' {...a11yProps(0)} />
								</Tabs>
								<SwipeableViews
									axis={theme.direction === "rtl" ? "x-reverse" : "x"}
									index={value}
									onChangeIndex={handleChangeIndex}>
									<TabPanel value={value} index={0} dir={theme.direction}>
										<Grid item container xs={12} sm={12} md={12} lg={12} spacing={2}>
											{/* <div> */}
											{/* <Hidden xsUp>
												{reportList?.data &&
													reportList?.data?.length > 0 &&
													reportList?.data?.map((ele, index) => {
														return (
															<Grid item xs={6} sm={4} md={4} lg={4} id={index}>
																<Card
																	// onClick={() => {props.history.push( '/reporteduser/view/' + ele.fromUserId)}}
																	style={{
																		display: "flex",
																		justifyContent: "center",
																		alignItems: "center",
																		flexDirection: "column",
																		padding: "15px 5px 15px 5px",
																		boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
																		width: "100%",
																	}}>
																	<Avatar
																		src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${ele?.byUser?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
																		alt={ele?.byUser?.firstName}
																	/>
																	<div
																		style={{
																			display: "flex",
																			alignItems: "center",
																			marginTop: "10px",
																		}}>
																		<Typography variant='h5'>{ele?.byUser?.firstName}</Typography>
																		{ele?.byUser && ele?.byUser?.gender && (
																			<div>
																				{ele?.byUser?.gender?.toLowerCase() === "male" ? (
																					<Male style={{ color: "blue" }} />
																				) : ele?.byUser?.gender?.toLowerCase() === "female" ? (
																					<Female style={{ color: "#B73BA4" }} />
																				) : (
																					<Transgender style={{ color: "rgb(246,191,188)" }} />
																				)}
																			</div>
																		)}
																	</div>
																	<Typography style={{ color: "#666" }}>{ele?.byUser?.email}</Typography>
																	<Typography style={{ color: "#666" }}>{ele?.byUser?.mobile}</Typography>
																</Card>
															</Grid>
														);
													})}
											</Hidden> */}
											{/* </div> */}
											{/* <Hidden xsDown> */}
											<Grid item xs={12}>
												<div
													style={{
														width: "100%",
														background: "white",
														marginTop: "10px",
														padding: "10px",
													}}>
													<div className='root'>
														<DataGrid
															autoHeight
															page={pagination.page}
															pageSize={pagination.pageSize}
															onPageSizeChange={(event) => {
																setPagination((prev) => ({
																	...prev,
																	pageSize: event,
																}));
															}}
															rowCount={reportList?.totalElements}
															rows={rows}
															columns={columns}
															paginationMode='server'
															// autoPageSize
															pagination
															onPageChange={(event) => {
																setPagination((prev) => ({
																	...prev,
																	page: event,
																}));
															}}
															rowsPerPageOptions={[5, 10, 20]}
															// className={classes.dataGridFooter}
														/>
													</div>
												</div>
											</Grid>
											{/* </Hidden> */}
										</Grid>
									</TabPanel>
								</SwipeableViews>
							</Box>
						) : (
							<div className='d-flex justify-content-center' style={{ margin: "25%" }}>
								<CircularProgress />
							</div>
						)}
					</Grid>
				</Grid>
			</Container>
		</div>
	);
}

export default ViewReportedUser;
