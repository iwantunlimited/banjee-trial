import { Container, Grid } from "@mui/material";
import React from "react";
import Helmet from "react-helmet";
import ChipComp from "./components/chipComp";
import UserData from "./components/usersData";
import { IconButton, Snackbar, Alert, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { customerFilter } from "./User_Services/User_Payloads";
import { listCustomer } from "./User_Services/UserApiService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Moment from "moment";
import { urls } from "../../Environment/ApiUrl";
import "./users.css";

function User() {
	const token = localStorage.getItem("token");

	const decodeToken = jwt_decode(token);

	const navigate = useNavigate();

	/////-----------------------------------state - Customer List -----------------------------------------------

	const [state, setState] = React.useState({
		iscontaintload: false,

		componentLoad: "Load",
		CustomerData: {
			rows: [],
			columns: [],
		},
		snackbar: {
			message: "",
			open: false,
			severity: "info",
		},
		dialougeOpen: false,
		deleteCustomerID: "",
		deleteCustomerName: "",
		currentPage: 0,
		totalElement: 0,
		paginationState: { page: 0, pageSize: 10 },
	});

	const [keyword, setKeyword] = React.useState("");
	console.log("keywordds---------", keyword);
	function handleKeyword(event) {
		setKeyword(event.target.value);
	}

	////-------------------------------------- Cusatomer Filter ----------------------------------
	console.log(state);
	const [CustomerFilter, setCustomerFilter] = React.useState({
		...customerFilter,
		inactive: "",
		page: state.paginationState.page,
		pageSize: state.paginationState.pageSize,
		domain: decodeToken.domain,
	});

	//---------------------------------------------Customer: Handling dialogue box------------------------------------------------
	// const handleClickOpen = () => {
	// 	setState((prev)=>({...prev, dialougeOpen: true }));
	// };

	const handleClose = () => {
		setState((prev) => ({ ...prev, dialougeOpen: false }));
	};

	//-------------------------------------Function For Displaying Customer List Page Fields---------------------------------------

	const apiCall = React.useCallback(
		(data) => {
			console.log("user Data", data);
			setState((prev) => ({ ...prev, componentLoad: "Load" }));
			let customerCols = [
				{
					field: "name",
					headerClassName: "app-header",
					headerName: "Username",
					flex: 0.5,
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
					field: "activeConnection",
					headerClassName: "app-header",
					headerName: "Active Connection",
					flex: 0.5,
					align: "center",
				},
				{
					field: "pendingConnection",
					headerClassName: "app-header",
					headerName: "Pending Connection",
					flex: 0.5,
					align: "center",
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
							{/* <Link to={"/user/view/" + params.row.userObject.id} replace={true}> */}
							<IconButton
								onClick={() => {
									console.log(params);
									// this.props.history.push(
									// 	this.props.location.pathname +
									// 		"/view/" +
									// 		params.row.userObject.id
									// );
									navigate("/user/view/" + params.row.userObject.id);
								}}>
								<VisibilityIcon />
							</IconButton>
							{/* </Link> */}
						</strong>
					),
				},
			];
			let customerRows = [];
			console.log(urls.USERPROFILE.FILTER);
			listCustomer({ ...CustomerFilter, keywords: data })
				.then((response) => {
					console.log("Response----->", response);

					if (response === null) {
						//load manage component
						setState((prev) => ({ ...prev, componentLoad: "Manage" }));
					}
					if (response.content.length > 0) {
						//no data
						setState((prev) => ({
							...prev,
							paginationState: {
								page: response.pageable.pageNumber,
								pageSize: response.pageable.pageSize,
							},
							filterData: response,
							totalElement: response.totalElements,
						}));
						customerRows = response.content.map((data) => {
							console.log(data);
							return (data = {
								...data,
								...data.userObject,
								activeConnection: data.connections
									? data.connections.length > 0
										? data.connections.length
										: 0
									: null,
								pendingConnection: data.pendingConnections
									? data.pendingConnections.length > 0
										? data.pendingConnections.length
										: 0
									: null,
								displayDate: data.createdOn ? Moment(data.createdOn).format("DD-MM-YYYY") : null,
								View: "View",
							});
						});
						let CustomerData = { columns: customerCols, rows: customerRows };

						setState((prev) => ({
							...prev,
							CustomerData: CustomerData,
							totalElement: response.totalElements,
							currentPage: response.number,
							componentLoad: "List",
						}));
					}
					console.log(state.totalElement);
					if (response.content.length === 0) {
						setState((prev) => ({
							...prev,
							totalElement: response.totalElements,
							currentPage: response.number,
							componentLoad: "List",
							CustomerData: { columns: customerCols, rows: [] },
						}));
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[CustomerFilter, navigate, state.totalElement]
	);

	function sanckbarClose() {
		setState((prev) => ({
			...prev,
			snackbar: { ...prev.snackbar, open: !prev.snackbar.open },
		}));
	}

	// const FilterapiCall = (event) => {
	// 	console.log(event.target.value);
	// 	CustomerFilter.keywords = event.target.value;
	// 	apiCall();
	// };

	React.useEffect(() => {
		apiCall(keyword);
	}, [apiCall, keyword]);

	//------------------------------rendering component on api --------------------//
	const loadComponent = () => {
		switch (state.componentLoad) {
			case "Load":
				return (
					<div className='d-flex justify-content-center' style={{ margin: "30%" }}>
						<CircularProgress />
					</div>
				);
			case "List":
				console.log("LIST", state);
				return (
					<>
						<div className='root' style={{ width: "100%" }}>
							<DataGrid
								pagination
								page={state.paginationState.page}
								pageSize={state.paginationState.pageSize}
								rowsPerPageOptions={[5, 10, 20, 30]}
								onPageSizeChange={(event) => {
									setState((prev) => ({
										...prev,
										paginationState: {
											pageSize: event,
											page: prev.paginationState.page,
										},
									}));
									setCustomerFilter((prev) => ({
										...prev,
										pageSize: event,
									}));
									apiCall({
										page: state.paginationState.page,
										pageSize: event,
									});
								}}
								rowCount={state.totalElement}
								paginationMode='server'
								autoHeight
								onPageChange={(event) => {
									console.log(event);
									setCustomerFilter((prev) => ({
										...prev,
										page: event,
									}));
									apiCall({
										page: event,
										pageSize: state.paginationState.pageSize,
									});
								}}
								className='dataGridFooter'
								// onCellClick = {(data) =>
								//   this.CalltoUpdate(data)
								// }

								{...state.CustomerData}
							/>
						</div>
						<Snackbar
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "center",
							}}
							open={state.snackbar.open}
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
										<CloseIcon fontSize='small' />
									</IconButton>
								</React.Fragment>
							}>
							<Alert onClose={sanckbarClose} severity={state.snackbar.severity}>
								{state.snackbar.message}
							</Alert>
						</Snackbar>
					</>
				);
			case "Manage":
				return (
					<>
						<CircularProgress />
						{/* <ManageComponents config={this.ListManageConfig} /> */}
					</>
				);
			default:
				break;
		}
	};

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
						<ChipComp refreshApi={apiCall} keyword={keyword} handleKey={handleKeyword} />
					</Grid>
					<Grid item xs={12}>
						<UserData data={state} handleClose={handleClose} loadComponent={loadComponent} />
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
export default User;
