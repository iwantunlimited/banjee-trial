import {
	Alert,
	Box,
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	Snackbar,
} from "@mui/material";
import React from "react";
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

function UserComp() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const context = React.useContext(MainContext);
	const decodeToken = jwt_decode(token);
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

	const [customerFilter, setCustomerFilter] = React.useState({
		page: 0,
		pageSize: 10,
		domain: decodeToken.domain,
	});

	const [keyword, setKeyword] = React.useState("");
	function handleKeyword(event) {
		setKeyword(event.target.value);
	}

	function handleDate(data) {
		const payload = {
			fromdate: moment(data[0]).format(),
			toDate: moment(data[1]).format(),
		};
		UserApiCall(payload);
	}

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
			headerName: "First Name",
			flex: 0.4,
		},
		{
			field: "lastName",
			headerClassName: "app-header",
			headerName: "Last Name",
			flex: 0.4,
		},
		{
			field: "mobile",
			headerClassName: "app-header",
			headerName: "Contact Number",
			flex: 0.5,
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
			flex: 0.5,
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
							<ChipComp refreshApi={UserApiCall} keyword={keyword} handleKey={handleKeyword} />
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
								refreshApi={UserApiCall}
								keyword={keyword}
								handleKey={handleKeyword}
								handleDate={handleDate}
							/>
						</Grid>
						<Grid item xs={12}>
							<Card className='main-card space-css'>
								<div style={{ width: "100%" }}>
									<div
										style={{
											color: context?.themeData ? "default" : "#6b778c",
											fontSize: "20px",
											fontWeight: "500",
										}}>
										Users ({userData?.totalElement})
									</div>
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
												<IconButton
													size='small'
													aria-label='close'
													color='inherit'
													onClick={sanckbarClose}>
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
