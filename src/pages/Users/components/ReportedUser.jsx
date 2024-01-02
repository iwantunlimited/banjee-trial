import React from "react";
import { makeStyles } from "@mui/styles";
import {
	Container,
	Card,
	Button,
	Avatar,
	IconButton,
	CircularProgress,
	darken,
	lighten,
	styled,
	Chip,
	Box,
} from "@mui/material";
import { ReportedUserList } from "../User_Services/UserApiService";
import { DataGrid } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
	root: {
		width: "100%",
		marginTop: "30px",
	},
	container: {
		maxHeight: 440,
	},
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

function ReportedUser1(props) {
	const navigate = useNavigate();

	const classes = useStyles();

	const [reportList, setReportList] = React.useState({
		data: [],
		totalElements: 0,
	});

	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	const rows = reportList?.data ? reportList?.data : [];

	const columns = [
		{
			id: "1",
			field: "avatarurl",
			headerClassName: "app-header",
			headerName: "Avatar",
			flex: 0.15,
			align: "center",
			renderCell: (params) => (
				<Avatar
					src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${params?.row?.reportedUser?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
					alt={params?.row?.reportedUser?.firstName}
				/>
			),
		},
		{
			id: "2",
			field: "name",
			headerClassName: "app-header",
			headerName: "Name",
			flex: 0.2,
			renderCell: (params) => params?.row?.reportedUser?.firstName,
		},
		{
			id: "3",
			field: "email",
			headerClassName: "app-header",
			headerName: "Email",
			flex: 0.3,
			renderCell: (params) => params?.row?.reportedUser?.email,
		},
		{
			id: "4",
			field: "mobile",
			headerClassName: "app-header",
			headerName: "Mobile",
			flex: 0.2,
			renderCell: (params) => params?.row?.reportedUser?.mobile,
		},
		{
			id: "5",
			field: "reports",
			headerClassName: "app-header",
			headerName: "Reported Count",
			flex: 0.15,
			align: "center",
			renderCell: (params) => params?.row?.reportedBy?.length,
		},
		{
			id: "6",
			field: "warning",
			headerClassName: "app-header",
			headerName: "Send Warning",
			align: "center",
			flex: 0.2,
			renderCell: (params) => (
				<strong>
					<Chip
						label='Send Warning'
						style={{ background: "green", color: "white" }}
						onClick={(event) => {
							// AcceptApiCall(params?.row?.cloudId, params?.row?.id);
							// navigate("/rooms/view/" + params.row.routingId);
							// ApproveApiCAll(params?.row?.routingId);
							// pendingAPiCAll(0, 10);
						}}
					/>
				</strong>
			),
		},
		{
			id: "6",
			field: "view",
			headerClassName: "app-header",
			headerName: "View",
			align: "center",
			flex: 0.15,
			renderCell: (params) => (
				<strong>
					<IconButton
						onClick={() => {
							navigate("/user/reportedUserView/" + params?.row?.reportedUserId, {
								state: {
									userObject: {
										...params?.row?.reportedUser,
										reportedCount: params?.row?.reportedBy?.length,
									},
								},
							});
						}}>
						<VisibilityIcon />
					</IconButton>
				</strong>
			),
		},
	];

	const getBackgroundColor = (color, mode) =>
		mode === "dark" ? darken(color, 0.7) : lighten(color, 0.7);

	const getHoverBackgroundColor = (color, mode) =>
		mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);
	const getSelectedBackgroundColor = (color, mode) =>
		mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

	const getSelectedHoverBackgroundColor = (color, mode) =>
		mode === "dark" ? darken(color, 0.4) : lighten(color, 0.4);

	const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
		"& .app-header-true": {
			backgroundColor: getBackgroundColor(theme.palette.error.main, theme.palette.mode),
			"&:hover": {
				backgroundColor: getHoverBackgroundColor(theme.palette.error.main, theme.palette.mode),
			},
			"&.Mui-selected": {
				backgroundColor: getSelectedBackgroundColor(theme.palette.error.main, theme.palette.mode),
				"&:hover": {
					backgroundColor: getSelectedHoverBackgroundColor(theme.palette.error.main, theme.palette.mode),
				},
			},
		},
	}));

	//reported user list api
	const listApiCall = React.useCallback(() => {
		ReportedUserList({ page: pagination?.page, pageSize: pagination?.pageSize })
			.then((response) => {
				setReportList({
					data: response?.content,
					totalElements: response?.totalElements,
				});
			})
			.catch((err) => {
				console.error(err);
			});
	}, [pagination]);

	React.useEffect(() => {
		listApiCall();
	}, [listApiCall]);

	if (reportList?.data) {
		return (
			<div style={{ marginBottom: "20px" }}>
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
					<Card
						style={{
							background: "white",
							padding: "25px",
							border: "1px solid lightgrey",
							marginTop: "30px",
							borderRadius: "10px",
						}}>
						<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
							Reported Users ({reportList?.totalElements})
						</div>
						<hr />
						{reportList?.data?.length > 0 ? (
							<div style={{ width: "100%" }}>
								<div className={classes.DataGridBackground}>
									<StyledDataGrid
										autoHeight
										page={pagination.page}
										pageSize={pagination.pageSize}
										onPageSizeChange={(event) => {
											setPagination((prev) => ({
												...prev,
												pageSize: event,
											}));
										}}
										getRowClassName={(params) => {
											const reported = params?.row?.reportedBy?.length > 3;
											console.log("params", reported);
											return `app-header-${reported}`;
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
						) : (
							<Box
								style={{ width: "100%", height: "100vh" }}
								className='d-flex justify-content-center align-items-center'>
								<p>No data found !</p>
							</Box>
						)}
					</Card>
				</Container>
			</div>
		);
	} else {
		return (
			<box
				style={{ width: "100%", height: "100vh" }}
				className='d-flex justify-content-center align-items-center'>
				<CircularProgress />
			</box>
		);
	}
}
export default ReportedUser1;
