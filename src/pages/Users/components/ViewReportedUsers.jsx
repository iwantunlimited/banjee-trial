import React from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { findReportedCustomer } from "../User_Services/UserApiService";
import { Male, Female, Transgender } from "@mui/icons-material";
import PropTypes from "prop-types";
import "../users.css";
import SwipeableViews from "react-swipeable-views";

function ViewReportedUser(props) {
	const navigate = useNavigate();

	const params = useParams();

	const theme = useTheme();

	const UserId = params.id;

	const [value, setValue] = React.useState(0);

	const [data, setData] = React.useState();

	const [reportList, setReportList] = React.useState([]);

	const [pageSize, setPageSize] = React.useState(5);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (index) => {
		setValue(index);
	};

	const rows = reportList ? reportList : [];

	const columns = [
		{
			id: "1",
			field: "avatarurl",
			headerClassName: "app-header",
			headerName: "Avatar",
			flex: 0.2,
			align: "center",
			renderCell: (params) => (
				<Avatar src={params.row.fromUser.avtarUrl} alt={params.row.fromUser.name} />
			),
		},
		{
			id: "2",
			field: "name",
			headerClassName: "app-header",
			headerName: "User Name",
			flex: 0.3,
		},
		{
			id: "3",
			field: "email",
			headerClassName: "app-header",
			headerName: "Email",
			flex: 0.4,
		},
		{
			id: "4",
			field: "mobile",
			headerClassName: "app-header",
			headerName: "Mobile",
			flex: 0.4,
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
		findReportedCustomer(UserId)
			.then((response) => {
				setData(response);
				console.log(response);
				const res = response.reports.map((ele) => {
					return {
						...ele,
						...ele.fromUser,
					};
				});
				setReportList(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [UserId]);

	React.useEffect(() => {
		findReportedCustomerApiCall();
	}, [findReportedCustomerApiCall]);

	console.log(reportList);

	if (data) {
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
				<Container maxWidth='lg'>
					<Grid container style={{ margin: "20px 0px 20px 0px" }}>
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
											alt={data.toUser.name}
											src={data.toUser.avtarUrl}
											style={{ width: "100px", height: "100px" }}
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
										<Typography variant='h5'>{data.toUser.name}</Typography>
										{data.toUser.gender && (
											<div>
												{data.toUser.gender.toLowerCase() === "male" ? (
													<Male style={{ color: "blue" }} />
												) : data.toUser.gender.toLowerCase() === "female" ? (
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
												{data.toUser.mobile}
											</Typography>
										</Grid>
										<Grid item xs={12} sm={12} md={12} lg={12} style={{ display: "flex" }}>
											<Typography variant='h6'>
												{" "}
												{data.toUser && data.toUser.email && "mail:"}
											</Typography>
											{/* </Grid>
                                        <Grid item xs={6} sm={8} md={10} lg={10}> */}
											<Typography variant='h6' style={{ color: "#666", marginLeft: "15px" }}>
												{data.toUser.email}
											</Typography>
										</Grid>
										<Grid item xs={12} sm={12} md={12} lg={12}>
											<Typography variant='h6' style={{ marginTop: "2px" }}>
												Reported By: {data.reports.length}
											</Typography>
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
								style={{ background: "transparent", paddingTop: "0px", paddingLeft: "20px" }}>
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
												<Hidden xsUp>
													{data &&
														data.reports.length > 0 &&
														data.reports.map((ele, index) => {
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
																		<Avatar alt={ele.fromUser.name} src={ele.fromUser.avtarUrl} />
																		<div
																			style={{
																				display: "flex",
																				alignItems: "center",
																				marginTop: "10px",
																			}}>
																			<Typography variant='h5'>{ele.fromUser.name}</Typography>
																			{ele.fromUser && ele.fromUser.gender && (
																				<div>
																					{ele.fromUser.gender.toLowerCase() === "male" ? (
																						<Male style={{ color: "blue" }} />
																					) : ele.fromUser.gender.toLowerCase() === "female" ? (
																						<Female style={{ color: "#B73BA4" }} />
																					) : (
																						<Transgender style={{ color: "rgb(246,191,188)" }} />
																					)}
																				</div>
																			)}
																		</div>
																		<Typography style={{ color: "#666" }}>
																			{ele.fromUser.email}
																		</Typography>
																		<Typography style={{ color: "#666" }}>
																			{ele.fromUser.mobile}
																		</Typography>
																	</Card>
																</Grid>
															);
														})}
												</Hidden>
												{/* </div> */}
												<Hidden xsDown>
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
																	pageSize={pageSize}
																	onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
																	rowsPerPageOptions={[5, 10, 20]}
																	pagination
																	rows={rows}
																	columns={columns}
																	className='dataGridFooter'
																	autoHeight
																/>
															</div>
														</div>
													</Grid>
												</Hidden>
											</Grid>
										</TabPanel>
									</SwipeableViews>
								</Box>
							</Grid>
						</Grid>
					</Grid>
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

export default ViewReportedUser;
