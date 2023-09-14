import React from "react";
import { makeStyles } from "@mui/styles";
import { Container, Card, IconButton, CircularProgress, Box, Grid } from "@mui/material";
// import { ReportedUserList } from "../../../Users/User_Services/UserApiService";
import { DataGrid } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { filterSocialFeeds } from "../../services/ApiServices";
import { ArrowBack } from "@mui/icons-material";

const useStyles = makeStyles({
	root: {
		width: "100%",
		marginTop: "30px",
	},
	container: {
		maxHeight: "440px",
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

	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	const [totalEle, setTotalEle] = React.useState();

	const rows = reportedFeed ? reportedFeed : [];

	const columns = [
		{
			id: "1",
			field: "username",
			headerClassName: "app-header",
			headerName: "Name",
			flex: 0.3,
			renderCell: (params) => {
				return params?.row?.author?.firstName;
			},
			// align: "center",
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
			renderCell: (params) => {
				return params?.row?.text;
			},
		},
		{
			id: "4",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			type: "date",
			valueGetter: ({ value }) => value && new Date(value),
			flex: 0.3,
		},
		{
			id: "5",
			field: "view",
			headerClassName: "app-header",
			headerName: "View",
			align: "center",
			flex: 0.2,
			renderCell: (params) => (
				<strong>
					<IconButton
						onClick={() => {
							navigate("/social-feeds/reported-feeds/" + params.row.mainId);
						}}>
						<VisibilityIcon />
					</IconButton>
				</strong>
			),
		},
	];

	const feedListApiCall = React.useCallback((page, pageSize) => {
		setReportedFeed();
		filterSocialFeeds({ reported: true, page: page, pageSize: pageSize })
			.then((res) => {
				const resp = res.content.map((ele) => {
					return {
						...ele,
						mainId: ele.id,
						description: ele?.text,
						...ele.author,
						reports: ele?.reportedCount ? ele?.reportedCount : null,
					};
				});
				setReportedFeed(resp);
				setTotalEle(res.totalElements);
				// setPagination(() => ({
				// 	page: res.pageable.pageNumber,
				// 	pageSize: res.pageable.pageSize,
				// 	totalElement: res.totalElements,
				// }));
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	React.useEffect(() => {
		feedListApiCall(0, 10);
	}, [feedListApiCall]);

	if (reportedFeed && rows.length > 0) {
		return (
			<div style={{ marginBottom: "20px" }}>
				<Container maxWidth='xl'>
					<Grid item container spacing={2}>
						<Grid item xs={12}>
							<Box>
								<IconButton onClick={() => navigate(-1)}>
									<ArrowBack color='primary' />
								</IconButton>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Card
								style={{
									// background: "white",
									padding: "25px",
									border: "1px solid lightgrey",
									marginTop: "30px",
									borderRadius: "10px",
								}}>
								<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
									Reported Feeds ({totalEle})
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
											rowCount={totalEle}
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
						</Grid>
					</Grid>
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
