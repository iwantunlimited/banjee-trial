import { Visibility } from "@mui/icons-material";
import { Container, Grid, IconButton, Card, CircularProgress, Box } from "@mui/material";
import moment from "moment";
import React from "react";
import { Helmet } from "react-helmet";
import { communityList } from "./services/apiServices";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

function GroupsComp(props) {
	const navigate = useNavigate();
	const [listData, setListData] = React.useState("");
	const [pagination, setPagination] = React.useState({
		totalElement: 0,
		pagination: {
			page: 0,
			pageSize: 10,
		},
	});

	const handlePagination = (data) => {
		setPagination((prev) => ({
			...prev,
			pagination: data,
		}));
	};

	const CommunityListApiCall = React.useCallback((page, pageSize) => {
		communityList({ page: page, pageSize: pageSize })
			.then((res) => {
				console.log(res);
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						...ele,
						// ...ele?.name,
						// ...ele?.createdOn,
					};
				});
				setListData(resp);
				setPagination((prev) => ({
					...prev,
					totalElement: res.totalElements,
					pagination: {
						page: res?.pageable?.pageNumber,
						pageSize: res?.pageable?.pageSize,
					},
				}));
			})
			.catch((err) => console.log(err));
	}, []);

	React.useEffect(() => {
		CommunityListApiCall(0, 10);
	}, [CommunityListApiCall]);

	let rows = listData ? listData : [];

	let columns = [
		{
			id: "1",
			field: "name",
			headerClassName: "app-header",
			headerName: "Community Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "2",
			field: "categoryName",
			headerClassName: "app-header",
			headerName: "Category",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
		},
		{
			id: "3",
			field: "cloudType",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Type",
			// align: "center",
			flex: 0.3,
		},
		{
			id: "4",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("L");
					return date;
				} else {
					return 0;
				}
			},
		},
		{
			id: "8",
			field: "id",
			headerClassName: "app-header-rejected",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "View",
			// align: 'center',
			flex: 0.3,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								navigate("/groups/" + params.row.routingId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	return (
		<Container maxWidth='xl'>
			<Helmet>
				<title>Groups | Banjee Admin</title>
			</Helmet>
			<Grid item container xs={12}>
				<Grid item xs={12}>
					<Card sx={{ padding: "20px" }}>
						{listData ? (
							<div>
								<div style={{ color: "#6b778c", fontSize: "22px", fontWeight: "500" }}>
									Groups ({pagination?.totalElement})
								</div>
								<hr />
								<div style={{ width: "100%" }}>
									<Box
										className='root'
										sx={{
											"& .app-header-live": {
												bgcolor: "#76e060",
											},
										}}>
										<DataGrid
											autoHeight
											getRowClassName={(params) => `app-header-${params.row.status}`}
											page={pagination?.pagination?.page}
											pageSize={pagination?.pagination?.pageSize}
											onPageSizeChange={(event) => {
												handlePagination({
													page: pagination?.pagination?.page,
													pageSize: event,
												});
												CommunityListApiCall(pagination?.pagination?.page, event);
											}}
											rowCount={pagination?.totalElement}
											rows={rows}
											columns={columns}
											paginationMode='server'
											// autoPageSize
											pagination
											onPageChange={(event) => {
												handlePagination({
													page: event,
													pageSize: pagination?.pagination?.page,
												});
												CommunityListApiCall(event, pagination?.pagination?.pageSize);
											}}
											rowsPerPageOptions={[5, 10, 20]}
											className='dataGridFooter'
										/>
									</Box>
								</div>
							</div>
						) : (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "50vh",
								}}>
								<CircularProgress />
							</div>
						)}
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}

export default GroupsComp;
