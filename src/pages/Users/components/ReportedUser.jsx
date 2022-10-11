import React from "react";
import { makeStyles } from "@mui/styles";
import { Container, Card, Button, Avatar, IconButton, CircularProgress } from "@mui/material";
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

	const [reportList, setReportList] = React.useState([]);

	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
		totalElement: 0,
	});

	const { page, pageSize } = pagination;

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
				<Avatar src={params.row.toUser.avtarUrl} alt={params.row.toUser.name} />
			),
		},
		{
			id: "2",
			field: "name",
			headerClassName: "app-header",
			headerName: "User Name",
			flex: 0.5,
		},
		{
			id: "3",
			field: "email",
			headerClassName: "app-header",
			headerName: "Email",
			flex: 0.7,
		},
		{
			id: "4",
			field: "mobile",
			headerClassName: "app-header",
			headerName: "Mobile",
			flex: 0.4,
		},
		{
			id: "5",
			field: "reports",
			headerClassName: "app-header",
			headerName: "Reported By",
			flex: 0.5,
			align: "center",
		},
		{
			id: "6",
			field: "view",
			headerClassName: "app-header",
			headerName: "View",
			align: "center",
			flex: 0.3,
			renderCell: (params) => (
				<strong>
					<IconButton
						onClick={() => {
							navigate("/user/reportedUserView/" + params.row.toUserId);
						}}>
						<VisibilityIcon />
					</IconButton>
				</strong>
			),
		},
	];

	const listApiCall = React.useCallback((page, pageSize) => {
		ReportedUserList({ page: page, pageSize: pageSize })
			.then((response) => {
				const resp = response.content.map((ele) => {
					return {
						...ele,
						...ele.toUser,
						reports: ele.reports ? (ele.reports.length > 0 ? ele.reports.length : 0) : null,
					};
				});
				setReportList(() => resp);
				setPagination(() => ({
					page: response.pageable.pageNumber,
					pageSize: response.pageable.pageSize,
					totalElement: response.totalElements,
				}));
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	React.useEffect(() => {
		listApiCall(page, pageSize);
	}, [listApiCall, page, pageSize]);

	if (reportList && rows.length > 0) {
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
							Reported Users ({pagination?.totalElement})
						</div>
						<hr />
						<div style={{ width: "100%" }}>
							<div className={classes.DataGridBackground}>
								<DataGrid
									autoHeight
									page={pagination.page}
									pageSize={pagination.pageSize}
									onPageSizeChange={(event) => {
										setPagination((prev) => ({
											...prev,
											pageSize: event,
										}));
										listApiCall(pagination.page, event);
									}}
									rowCount={pagination.totalElement}
									rows={rows}
									columns={columns}
									paginationMode='server'
									// autoPageSize
									pagination
									onPageChange={(event) => {
										listApiCall(event, pagination.pageSize);
									}}
									rowsPerPageOptions={[5, 10, 20]}
									className={classes.dataGridFooter}
								/>
							</div>
						</div>
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
