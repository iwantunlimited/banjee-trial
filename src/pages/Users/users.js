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
import ChipComp from "./components/chipComp";
import { listCustomer } from "./User_Services/UserApiService";
import jwt_decode from "jwt-decode";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./users.css";
import { MainContext } from "../../context/Context";
import { Download } from "@mui/icons-material";
import { PaginationContext } from "../../context/PaginationContext";

function UserComp() {
	const navigate = useNavigate();
	const { userPagination, setUserPagination } = useContext(PaginationContext);
	const token = localStorage.getItem("token");
	const context = React.useContext(MainContext);
	const decodeToken = jwt_decode(token);
	const [userData, setUserData] = React.useState({
		data: [],
		customerRows: null,
		snackbar: {
			message: "",
			open: false,
			severity: "info",
		},
		totalElement: 0,
	});

	const [customerFilter, setCustomerFilter] = React.useState({
		page: userPagination?.page ? userPagination?.page : 0,
		pageSize: userPagination?.pageSize ? userPagination?.pageSize : 10,
		domain: decodeToken.domain,
		fromDate: null,
		toDate: null,
	});

	const [keyword, setKeyword] = React.useState("");
	function handleKeyword(event) {
		setKeyword(event.target.value);
		setCustomerFilter((prev) => ({
			...prev,
			page: 0,
			pageSize: 10,
		}));
	}

	function handleCustomFilter(data) {
		setCustomerFilter((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
			fromDate: data?.fromDate,
			toDate: data?.endDate,
		}));
	}

	function handleDate(data) {
		setCustomerFilter((prev) => ({
			...prev,
			fromDate: data?.startDate,
			toDate: data?.endDate,
		}));
	}

	//snackbar close function
	function sanckbarClose() {
		setUserData((prev) => ({
			...prev,
			snackbar: { ...prev.snackbar, open: !prev.snackbar.open },
		}));
	}

	const customerCols = [
		{
			field: "firstName",
			headerClassName: "app-header",
			headerName: "Name",
			flex: 0.3,
		},
		{
			field: "mobile",
			headerClassName: "app-header",
			headerName: "Contact Number",
			flex: 0.3,
		},
		{
			field: "email",
			headerClassName: "app-header",
			headerName: "Email",
			flex: 0.5,
		},
		{
			field: "displayDate",
			headerClassName: "app-header",
			headerName: "Created On",
			flex: 0.3,
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("DD/MM/YYYY");
					return date;
				} else {
					return "-";
				}
			},
		},
		{
			field: "lastOffline",
			headerClassName: "app-header",
			headerName: "last seen",
			flex: 0.5,
			renderCell: (params) => {
				if (params?.row?.lastOffline) {
					// const date = moment(params.row.lastSeen).calendar();
					const date = moment(params?.row?.lastOffline).format("llll");
					return date;
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
			renderCell: (params) => (
				<strong>
					<IconButton
						onClick={() => {
							// navigate(`/user/${params?.row?.userObject?.id}`);
							setUserPagination({ page: customerFilter?.page, pageSize: customerFilter?.pageSize });
							navigate("/user/" + params?.row?.systemUserId);
							// this.props.history.push(
							// 	this.props.location.pathname +
							// 		"/view/" +
							// 		params.row.userObject.id
							// );
						}}>
						<VisibilityIcon />
					</IconButton>
				</strong>
			),
		},
	];

	const rows = userData?.customerRows ? userData?.customerRows : [];

	const UserApiCall = React.useCallback(
		(data) => {
			listCustomer({ ...customerFilter, keywords: keyword, ...data })
				.then((res) => {
					const customerRows = res.content.map((item) => {
						return (data = {
							...item,
							// ...data.userObject,
							userId: item?.id,
							displayDate: item.createdOn ? moment(item.createdOn).format("DD-MM-YYYY") : null,
							View: "View",
						});
					});
					setUserData((prev) => ({
						...prev,
						data: res,
						totalElement: res.totalElements,
						customerRows: customerRows,
					}));
					// setCustomerFilter((prev) => ({
					// 	...prev,
					// 	page: res.pageable.pageNumber,
					// 	pageSize: res.pageable.pageSize,
					// }));
				})
				.catch((err) => {
					console.warn(err);
				});
		},
		[keyword, customerFilter]
	);

	const UserCsvDataApi = React.useCallback((data) => {
		fetch("https://gateway.banjee.org/services/userprofile-service/api/remote/user/csvdownload", {
			method: "post",
			body: JSON.stringify({
				payload:
					data?.fromDate && data?.toDate
						? { userType: 0, fromDate: data?.fromDate, toDate: data?.toDate }
						: { userType: 0 },
				actionCode: "ACTION_DOWNLOAD_CSV",
			}),
			headers: {
				"Content-Type": "application/json;",
				// authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				console.log("====================================");
				console.log("response", response);
				console.log("====================================");
				return response.blob();
			})
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
		UserApiCall();
	}, [UserApiCall]);

	if (userData?.customerRows?.length === 0) {
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
							<ChipComp refreshApi={handleCustomFilter} keyword={keyword} handleKey={handleKeyword} />
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
	} else if (userData?.customerRows?.length > 0) {
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
							<ChipComp
								refreshApi={handleCustomFilter}
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
											Users ({userData?.totalElement})
										</div>
										<Button
											onClick={() => {
												UserCsvDataApi({
													fromDate: customerFilter?.fromDate
														? moment(customerFilter?.fromDate).set({ hour: 0, minute: 0, second: 0 }).format()
														: undefined,
													toDate: customerFilter?.toDate
														? moment(customerFilter?.toDate).set({ hour: 23, minute: 59, second: 58 }).format()
														: undefined,
												});
											}}
											startIcon={<Download />}>
											csv
										</Button>
									</Box>
									<hr />
									<div className='root' style={{ width: "100%" }}>
										<DataGrid
											pagination
											page={customerFilter?.page}
											pageSize={customerFilter?.pageSize}
											rowsPerPageOptions={[5, 10, 20, 30]}
											onPageSizeChange={(event) => {
												// setState((prev) => ({
												// 	...prev,
												// 	paginationState: {
												// 		pageSize: event,
												// 		page: prev.paginationState.page,
												// 	},
												// }));
												setCustomerFilter((prev) => ({
													...prev,
													pageSize: event,
												}));
												UserApiCall({
													page: customerFilter?.page,
													pageSize: event,
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
												UserApiCall({
													page: event,
													pageSize: customerFilter?.pageSize,
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

export default UserComp;
