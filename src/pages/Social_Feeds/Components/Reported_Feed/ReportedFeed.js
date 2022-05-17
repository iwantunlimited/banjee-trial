import React from "react";
import { makeStyles } from "@mui/styles";
import { Container, Card, Button, Avatar, IconButton, CircularProgress } from "@mui/material";
import { ReportedUserList } from "../../../Users/User_Services/UserApiService";
import { DataGrid } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { filterSocialFeeds } from "../../services/ApiServices";

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

function ReportedFeed(props) {
	const navigate = useNavigate();

	const classes = useStyles();

	const [reportedFeed, setReportedFeed] = React.useState([]);

	console.log("reportedFeed-------------", reportedFeed);

	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
		totalElement: 0,
	});

	const { page, pageSize } = pagination;

	const rows = reportedFeed ? reportedFeed : [];

	const columns = [
		{
			id: "1",
			field: "username",
			headerClassName: "app-header",
			headerName: "UserName",
			flex: 0.2,
			align: "center",
			// renderCell: (params) => (
			// 	<Avatar src={params.row.toUser.avtarUrl} alt={params.row.toUser.name} />
			// ),
		},
		{
			id: "2",
			field: "email",
			headerClassName: "app-header",
			headerName: "Email",
			flex: 0.5,
		},
		{
			id: "3",
			field: "text",
			headerClassName: "app-header",
			headerName: "Text",
			flex: 0.5,
		},
		{
			id: "4",
			field: "remark",
			headerClassName: "app-header",
			headerName: "Remark",
			flex: 0.5,
			// align: "center",
		},
		{
			id: "5",
			field: "view",
			headerClassName: "app-header",
			headerName: "View",
			align: "center",
			flex: 0.3,
			renderCell: (params) => (
				<strong>
					<IconButton
						onClick={() => {
							console.log("params datagrid", params);
							navigate("/social-feeds/reported-feeds/" + params.id);
						}}>
						<VisibilityIcon />
					</IconButton>
				</strong>
			),
		},
	];

	const feedListApiCall = React.useCallback((page, pageSize) => {
		filterSocialFeeds({ reported: true, page: page, pageSize: pageSize })
			.then((res) => {
				console.log("res", res);
				const resp = res.content.map((ele) => {
					return {
						...ele,
						...ele.author,
						reports: ele?.reportedCount ? ele?.reportedCount : null,
					};
				});
				setReportedFeed(resp);
				setPagination(() => ({
					page: res.pageable.pageNumber,
					pageSize: res.pageable.pageSize,
					totalElement: res.totalElements,
				}));
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	React.useEffect(() => {
		feedListApiCall(page, pageSize);
	}, [feedListApiCall, page, pageSize]);

	if (reportedFeed && rows.length > 0) {
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
				<Container maxWidth='lg'>
					<Card
						style={{
							background: "white",
							padding: "25px",
							border: "1px solid lightgrey",
							marginTop: "30px",
							borderRadius: "10px",
						}}>
						<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
							Reported Social Feeds
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
										feedListApiCall(pagination.page, event);
									}}
									rowCount={pagination.totalElement}
									rows={rows}
									columns={columns}
									paginationMode='server'
									// autoPageSize
									pagination
									onPageChange={(event) => {
										feedListApiCall(event, pagination.pageSize);
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
export default ReportedFeed;
