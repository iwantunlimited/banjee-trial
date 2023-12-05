import {
	Alert,
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	Snackbar,
} from "@mui/material";
import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import { listActiveUsers, listUserMembership } from "./User_Services/UserApiService";
import jwt_decode from "jwt-decode";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MainContext } from "../../context/Context";
import { Download } from "@mui/icons-material";
import { PaginationContext } from "../../context/PaginationContext";
import ChipComponents from "./components/ChipComponents";

function ActiverUsers() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const context = React.useContext(MainContext);
	const { setReportedUserPagination, reportedUserPagination } = React.useContext(PaginationContext);
	const decodeToken = jwt_decode(token);
	const date = new Date();
	const [userData, setUserData] = React.useState({
		data: [],
		customerRows: [],
		snackbar: {
			message: "",
			open: false,
			severity: "info",
		},
		totalElement: 0,
	});

	const [userRow, setUserRow] = React.useState();

	const [customerFilter, setCustomerFilter] = React.useState({
		page: reportedUserPagination?.activeUserPage ? reportedUserPagination?.activeUserPage : 0,
		pageSize: reportedUserPagination?.activeUserpageSize
			? reportedUserPagination?.activeUserpageSize
			: 10,
		// domain: decodeToken.domain,
		fromDate: moment().set({ hour: 0, minute: 0, second: 0 }).format(),
		toDate: moment().set({ hour: 23, minute: 59, second: 59 }).format(),
	});

	const [keyword, setKeyword] = React.useState("");
	function handleKeyword(event) {
		setKeyword(event.target.value);
	}

	function handleRefresh() {
		setCustomerFilter((prev) => ({
			...prev,
			page: 0,
			pageSize: 10,
		}));
		setReportedUserPagination({
			...reportedUserPagination,
			activeUserPage: 0,
			activeUserpageSize: 10,
		});
	}

	function handleDate(data) {
		setCustomerFilter((prev) => ({
			...prev,
			// fromDate: data?.startDate,
			page: 0,
			pageSize: 10,
			fromDate: moment(data?.startDate).set({ hour: 0, minute: 0, second: 0 }).format(),
			// toDate: data?.startDate,
			toDate: moment(data?.startDate).set({ hour: 23, minute: 59, second: 59 }).format(),
		}));
		setReportedUserPagination({
			...reportedUserPagination,
			activeUserPage: 0,
			activeUserpageSize: 10,
		});
	}

	function sanckbarClose() {
		setUserData((prev) => ({
			...prev,
			snackbar: { ...prev.snackbar, open: !prev.snackbar.open },
		}));
	}

	const customerCols = [
		{
			id: 1,
			field: "firstName",
			headerClassName: "app-header",
			headerName: "Name",
			flex: 0.4,
		},
		{
			id: 3,
			field: "mobile",
			headerClassName: "app-header",
			headerName: "Contact Number",
			flex: 0.4,
		},
		{
			id: 4,
			field: "email",
			headerClassName: "app-header",
			headerName: "Email",
			flex: 0.5,
		},
		{
			id: 5,
			field: "timeSpent",
			headerClassName: "app-header",
			headerName: "Time Spent",
			flex: 0.5,
			renderCell: (params) => {
				// console.log("====================================");
				// console.log("params row hour", params?.row?.timeSpent);
				// console.log("====================================");
				const hour = params?.row?.timeSpent?.hour;
				const minutes = params?.row?.timeSpent?.minutes;
				const seconds = params?.row?.timeSpent?.seconds;
				const time = `${hour + " hour, " + minutes + " minutes, " + seconds + " seconds"}`;
				// return time;
				if (params?.row && params?.row?.timeSpent) {
					return time;
				} else {
					return "-";
				}
			},
		},
		{
			field: "View",
			headerClassName: "app-header",
			headerName: "View",
			flex: 0.2,
			renderCell: (params) => {
				// console.log("====================================");
				// console.log("params", params?.row);
				// console.log("====================================");
				return (
					<strong>
						<IconButton
							onClick={() => {
								// navigate(`/user/${params?.row?.userObject?.id}`);
								navigate("/user/" + params?.row?.userId);
								// this.props.history.push(
								// 	this.props.location.pathname +
								// 		"/view/" +
								// 		params.row.userObject.id
								// );
							}}>
							<VisibilityIcon />
						</IconButton>
					</strong>
				);
			},
		},
	];
	const rows = userRow ? userRow : [];

	const ActiveUserApiCall = React.useCallback(
		(newData) => {
			// console.log("====================================");
			// console.log(newData);
			// console.log("====================================");
			const payload =
				newData !== undefined
					? {
							page: newData?.page,
							pageSize: newData?.pageSize,
							fromDate: customerFilter?.fromDate,
							toDate: customerFilter?.toDate,
					  }
					: {
							page: customerFilter?.page,
							pageSize: customerFilter?.pageSize,
							fromDate: customerFilter?.fromDate,
							toDate: customerFilter?.toDate,
					  };
			listActiveUsers(payload)
				.then((res) => {
					console.log("listActive user", res);
					const rowData = res?.content?.map((item) => {
						return {
							...item,
							firstName: item?.userObject?.firstName,
							lastName: item?.userObject?.lastName,
							email: item?.userObject?.email,
							mobile: item?.userObject?.mobile,
							createdOn: item?.userObject?.createdOn,
							userId: item?.userId,
							timeSpent: item?.onlineActivity?.totalDuration,
							view: "view",
						};
					});
					setUserRow(rowData);
					setUserData((prev) => ({
						...prev,
						data: res,
						totalElement: res.totalElements,
						customerRows: rowData,
					}));
					setCustomerFilter((prev) => ({
						...prev,
						page: res?.pageable?.pageNumber,
						pageSize: res?.pageable?.pageSize,
					}));
				})
				.catch((err) => {
					console.warn(err);
				});
		},
		[customerFilter?.page, customerFilter?.pageSize, customerFilter?.fromDate, customerFilter?.toDate]
	);

	// console.log("====================================");
	// console.log("active users", userRow);
	// console.log("====================================");

	const UserCsvDataApi = React.useCallback((data) => {
		fetch("https://gateway.banjee.org/services/userprofile-service/api/remote/user/csvdownload", {
			method: "post",
			body: JSON.stringify({
				payload:
					data?.fromDate && data?.toDate
						? { userType: 0, fromDate: data?.fromDate, toDate: data?.toDate }
						: { userType: 0 },
			}),
			headers: {
				"Content-Type": "application/json;",
				authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJsYXN0TmFtZSI6IiIsImRvbWFpblNzaWQiOiIyMDg5OTEiLCJnZW5kZXIiOm51bGwsInVzZXJfbmFtZSI6IjYxMTExZTQyYmNjNjhiMmExZmEzNDMyYyIsImluY29nbml0byI6ZmFsc2UsIm1jYyI6bnVsbCwidHlwZSI6IlNZU19BRE1JTiIsImxvY2FsZSI6ImVuLVVTIiwiY2xpZW50X2lkIjoiaXRwbCIsImV4dGVybmFsUmVmZXJlbmNlSWQiOm51bGwsInNjb3BlIjpbIlJlYWQiLCJXcml0ZSJdLCJhdnRhckltYWdlVXJsIjoiNjNhMDFlYTVkZGVmYjM3ZjY5MjFiMmU4IiwiaWQiOiI2MTExMWU0MmJjYzY4YjJhMWZhMzQzMmMiLCJleHAiOjE2NzkyODc3MDAsImp0aSI6ImEyOTFjMGE2LWQ2YzMtNDUzNy05ZDg5LTg3MTMzZGFjNGVlMiIsImVtYWlsIjoicm9vdEBpdHBsLmlvIiwiR3JhbnRlZC1BdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9TWVNURU1fQURNSU4ifV0sInRpbWVab25lSWQiOiJBc2lhL0pha2FydGEiLCJtb2JpbGUiOiIxMjM0NTY3ODkwIiwiZXh0ZXJuYWxTeXN0ZW1Db2RlIjpudWxsLCJ1c2VyTmFtZSI6InJvb3QiLCJiaXJ0aERhdGUiOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1lTVEVNX0FETUlOIl0sImZpcnN0TmFtZSI6IkJhbmplZSIsImV4dGVybmFsVXNlcklkIjpudWxsLCJkb21haW4iOiIyMDg5OTEiLCJyZWFsbSI6ImJhbmplZSIsInVzZXJUeXBlIjotMSwidXNlcm5hbWUiOiJyb290In0.ABSYC8llKHnoskHltFynTlaKUwMhea-bnbnQDJ61lHf2NJljQpMlpmzQ0pt12FePbyPbS1KwKUwms8NDmMCByeKAQwbUbZU6u9EqTQIh8Ig4b8aGNavsMfjXuG2qbcFYFS3H-OLR5kCFAd0UxU8IZtcyZGK7C4oFWpCM2C-FMYR0zImqn2CaZV3RgKPzUpbSkTb0zCG14NAQ0tcQ_7bosorzjtppDhKYltRc2rg6uK-N-BHQytoiCY85Vxute9P8dGIt5zQfyEKdSzoLXjur91MmlIufPtbqSRF4KzgA4HF1z2TTU22qhF65qVoo8yDygsONEuqS8xq_GDYOUA`,
			},
		})
			.then((response) => response.blob())
			.then((blob) => {
				// Create blob link to download
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", `userData.xls`);

				// Append to html link element page
				document.body.appendChild(link);

				// Start download
				link.click();

				// Clean up and remove the link
				link.parentNode.removeChild(link);
			});
	}, []);

	React.useEffect(() => {
		ActiveUserApiCall();
	}, [ActiveUserApiCall]);

	if (userRow?.length === 0) {
		return (
			<>
				<Helmet>
					<title>Users | Banjee Admin</title>
				</Helmet>
				<Container
					maxWidth='xl'
					sx={{ padding: "0px", margin: "auto" }}
					// style={{ paddingTop: window.innerWidth < 501 ? "0px" : "20px" }}
				>
					<Grid item container xs={12} spacing={window.innerWidth < 601 ? 2 : 4}>
						<Grid item xs={12}>
							<ChipComponents
								refreshApi={handleRefresh}
								searchByDate={true}
								keyword={keyword}
								handleKey={handleKeyword}
								handleDate={handleDate}
							/>
						</Grid>
						<Grid item xs={12}>
							<Box sx={{ display: "flex", justifyContent: "center" }}>
								<p>No data Available !</p>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</>
		);
	} else if (userRow?.length > 0) {
		return (
			<>
				<Helmet>
					<title>Users | Banjee Admin</title>
				</Helmet>
				<Container
					maxWidth='xl'
					sx={{ padding: "0px", margin: "auto" }}
					// style={{ paddingTop: window.innerWidth < 501 ? "0px" : "20px" }}
				>
					<Grid item container xs={12} spacing={window.innerWidth < 601 ? 2 : 4}>
						<Grid item xs={12}>
							<ChipComponents
								refreshApi={handleRefresh}
								searchByDate={true}
								keyword={keyword}
								handleKey={handleKeyword}
								handleDate={handleDate}
							/>
						</Grid>
						<Grid item xs={12}>
							<Card className='main-card space-css'>
								<div style={{ width: "100%" }}>
									<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
										<div
											style={{
												color: context?.themeData ? "default" : "#6b778c",
												fontSize: "20px",
												fontWeight: "500",
											}}>
											Daily Active Users ({userData?.totalElement})
										</div>
										{/* <Button
											onClick={() => {
												UserCsvDataApi({
													fromDate: customerFilter?.fromDate
														? moment(customerFilter?.fromDate).format()
														: undefined,
													toDate: customerFilter?.toDate
														? moment(customerFilter?.toDate).format()
														: undefined,
												});
											}}
											startIcon={<Download />}>
											csv
										</Button> */}
									</Box>
									<hr />
									<div className='root' style={{ width: "100%" }}>
										<DataGrid
											pagination
											page={customerFilter?.page}
											pageSize={customerFilter?.pageSize}
											rowsPerPageOptions={[5, 10, 20, 30]}
											onPageSizeChange={(event) => {
												setCustomerFilter((prev) => ({
													...prev,
													pageSize: event,
												}));
												setReportedUserPagination({
													...reportedUserPagination,
													activeUserpageSize: event,
												});
											}}
											rowCount={userData?.totalElement}
											paginationMode='server'
											autoHeight
											onPageChange={(event) => {
												setCustomerFilter((prev) => ({
													...prev,
													page: event,
												}));
												setReportedUserPagination({
													...reportedUserPagination,
													activeUserPage: event,
												});
											}}
											className='dataGridFooter'
											// onCellClick = {(data) =>
											//   this.CalltoUpdate(data)
											// }
											columns={customerCols}
											rows={rows}
											// {...state.CustomerData}
										/>
									</div>
									<Snackbar
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "center",
										}}
										open={userData?.snackbar.open}
										style={{ width: "100%" }}
										autoHideDuration={6000}
										onClose={sanckbarClose}
										action={
											<React.Fragment>
												<IconButton size='small' aria-label='close' color='inherit' onClick={sanckbarClose}>
													close
													{/* <CloseIcon fontSize='small' /> */}
												</IconButton>
											</React.Fragment>
										}>
										<Alert onClose={sanckbarClose} severity={userData?.snackbar?.severity}>
											{userData?.snackbar?.message}
										</Alert>
									</Snackbar>
								</div>
							</Card>
						</Grid>
					</Grid>
				</Container>
			</>
		);
	} else {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "80vh",
					width: "100%",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default ActiverUsers;
