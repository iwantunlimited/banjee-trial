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
	ReportedUserByUserId,
	findCustomer,
	findReportedCustomer,
	findUserBySystemUserId,
} from "../User_Services/UserApiService";
import { Male, Female, Transgender } from "@mui/icons-material";
import PropTypes from "prop-types";
import "../users.css";
import SwipeableViews from "react-swipeable-views";
import { makeStyles } from "@mui/styles";
import { MainContext } from "../../../context/Context";

const useStyles = makeStyles({
	dataGridFooter: {
		"& > div > .MuiDataGrid-footerContainer > .MuiTablePagination-root > .MuiTablePagination-toolbar":
			{
				alignItems: "baseline !important",
			},
	},
	DataGridBackground: {
		"& .app-header": {
			backgroundColor: "#b9d5ff91",
		},
	},
});

function ViewReportedUser(props) {
	const navigate = useNavigate();
	const classes = useStyles();
	const { setModalData, setModalOpen } = React.useContext(MainContext);

	const params = useParams();

	const theme = useTheme();

	const UserId = params.id;

	const [value, setValue] = React.useState(0);

	const [userData, setUserData] = React.useState("");

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

	const rows = reportList?.data?.length > 0 ? reportList?.data : [];

	const columns = [
		{
			id: 1,
			field: "avtarUrl",
			headerClassName: "app-header",
			headerName: "Avatar",
			flex: 0.15,
			align: "center",
			renderCell: (params) => {
				return (
					<Avatar
						src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${params?.row?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						alt={params?.row?.avtarUrl}
					/>
				);
			},
		},
		{
			id: 2,
			field: "firstName",
			headerClassName: "app-header",
			headerName: "Name",
			flex: 0.3,
		},
		{
			id: 3,
			field: "remark",
			headerClassName: "app-header",
			headerName: "Remark",
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
		ReportedUserByUserId({
			page: pagination?.page,
			pageSize: pagination?.pageSize,
			reportedUserId: params?.id,
		})
			.then((response) => {
				const resp = response?.content?.map((item, index) => ({
					...item,
					...item?.byUser,
				}));
				setReportedDataAvailable(true);
				setReportList({
					data: resp,
					totalElements: response?.totalElements,
				});
			})
			.catch((err) => {
				console.error(err);
			});
	}, [pagination, params?.id]);

	const GetUserDetails = React.useCallback(() => {
		findUserBySystemUserId(params?.id)
			.then((res) => {
				setUserData(res);
				findReportedCustomerApiCall();
			})
			.catch((err) => {
				console.error("err", err);
			});
	}, []);

	const ReportActionApiCall = React.useCallback((data) => {
		ReportedUserAction({
			systemUserId: data?.userId,
			warning: data?.warning ? data?.warning : false,
			temporarilySuspend: data?.temporarilySuspend ? data?.temporarilySuspend : false,
			permanentSuspend: data?.permanentSuspend ? data?.permanentSuspend : false,
			...(data?.temporarilySuspend ? { suspensionDays: data?.suspensionDays } : {}),
		})
			.then((res) => {
				GetUserDetails();
				if (res?.permanentSuspend || res?.temporarilySuspend) {
					setTemporaryBtnClick(false);
					setModalOpen(true);
					setModalData(`${res?.firstName}  has  Suspended Successfully`, "success");
				} else {
					setModalOpen(true);
					setModalData(`${res?.firstName}  has sent warning `, "success");
				}
			})
			.catch((err) => console.error("error", err));
	}, []);

	React.useEffect(() => {
		GetUserDetails();
	}, [GetUserDetails]);

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
				{userData ? (
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
										src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${userData?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
										alt={userData?.firstName}
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
									<Typography variant='h5'>{userData?.firstName}</Typography>
									{userData?.gender && (
										<div>
											{userData?.gender.toLowerCase() === "male" ? (
												<Male style={{ color: "blue" }} />
											) : userData?.gender.toLowerCase() === "female" ? (
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
									{userData?.mobile && (
										<Grid item xs={12} sm={12} md={12} lg={12} style={{ display: "flex" }}>
											<Typography variant='h6'>Mobile:</Typography>

											<Typography variant='h6' style={{ color: "#666", marginLeft: "15px" }}>
												{userData?.mobile}
											</Typography>
										</Grid>
									)}
									<Grid item xs={12} sm={12} md={12} lg={12} style={{ display: "flex" }}>
										<Typography variant='h6'> {userData?.email && "Email:"}</Typography>

										<Typography variant='h6' style={{ color: "#666", marginLeft: "15px" }}>
											{userData?.email}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={12} md={12} lg={12}>
										<Typography variant='h6' style={{ marginTop: "2px" }}>
											Reported By: {reportList?.totalElements}
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
											paddingTop: { xs: 1, md: 2 },
										}}>
										{temporaryBtnClick && (
											<Autocomplete
												size='small'
												disablePortal
												id='combo-box-demo'
												onChange={(event, newEvent) => {
													setSuspendDuration(newEvent?.value);
												}}
												options={[
													{
														label: "1 Day",
														value: 1,
													},
													{
														label: "3 Days",
														value: 3,
													},
													{
														label: "7 Days",
														value: 7,
													},
												]}
												sx={{ width: 300, marginBottom: { xs: 1, md: 2 } }}
												renderInput={(params) => (
													<TextField error={btnError} focused={btnError} {...params} label='Time Duration' />
												)}
											/>
										)}
										<Stack columnGap={2} flexDirection={"row"} alignItems={"center"}>
											<Button
												disabled={userData?.permanentSuspend || userData?.temporarilySuspend}
												color='info'
												variant='outlined'
												onClick={() => {
													ReportActionApiCall({
														userId: userData?.systemUserId ? userData?.systemUserId : params?.id,
														warning: true,
													});
												}}
												sx={{ textTransform: "none" }}>
												Send Warning
											</Button>
											<Button
												disabled={userData?.permanentSuspend || userData?.temporarilySuspend}
												color='inherit'
												onClick={() => {
													if (temporaryBtnClick) {
														if (suspendDuration === null) {
															setBtnError(true);
														} else {
															ReportActionApiCall({
																userId: userData?.systemUserId ? userData?.systemUserId : params?.id,
																warning: false,
																temporarilySuspend: true,
																permanentSuspend: false,
																suspensionDays: suspendDuration,
															});
														}
													} else {
														setTemporaryBtnClick(true);
													}
												}}
												variant='contained'
												sx={{ textTransform: "none" }}>
												{userData?.temporarilySuspend ? "Temporary Suspended" : "Temporary Suspend"}
											</Button>
											<Button
												onClick={() => {
													ReportActionApiCall({
														userId: userData?.systemUserId ? userData?.systemUserId : params?.id,

														permanentSuspend: true,
													});
												}}
												disabled={userData?.permanentSuspend || userData?.temporarilySuspend}
												color='error'
												variant='contained'
												sx={{ textTransform: "none" }}>
												{userData?.permanentSuspend ? "Permenant Suspended" : "Permenant Suspend"}
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
								<Card sx={{ bgcolor: "background.paper", padding: "10px" }}>
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
												<Grid item xs={12}>
													<div
														style={{
															// width: "100%",
															// background: "white",
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
																className={classes.dataGridFooter}
															/>
														</div>
													</div>
												</Grid>
											</Grid>
										</TabPanel>
									</SwipeableViews>
								</Card>
							) : (
								<div className='d-flex justify-content-center' style={{ margin: "25%" }}>
									<CircularProgress />
								</div>
							)}
						</Grid>
					</Grid>
				) : (
					<div className='d-flex justify-content-center' style={{ margin: "25%" }}>
						<CircularProgress />
					</div>
				)}
			</Container>
		</div>
	);
}

export default ViewReportedUser;
