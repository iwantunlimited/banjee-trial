import { Visibility } from "@mui/icons-material";
import { Container, Grid, IconButton, Card, CircularProgress, Box } from "@mui/material";
import moment from "moment";
import React from "react";
import { Helmet } from "react-helmet";
import { communityList } from "./services/apiServices";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import { MainContext } from "../../context/Context";

function GroupsComp(props) {
	const navigate = useNavigate();
	const { themeData } = React.useContext(MainContext);
	const [listData, setListData] = React.useState("");
	const [totalElement, setTotalElement] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	const handlePagination = (data) => {
		setPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	};

	const CommunityListApiCall = React.useCallback(() => {
		communityList({ page: pagination?.page, pageSize: pagination?.pageSize })
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
				setTotalElement(res?.totalElements);
			})
			.catch((err) => console.log(err));
	}, [pagination]);

	React.useEffect(() => {
		CommunityListApiCall();
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
			field: "totalMembers",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Members",
			// align: "center",
			flex: 0.3,
		},
		{
			id: "5",
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
			id: "6",
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
								<div
									style={{
										color: themeData ? "default" : "#6b778c",
										fontSize: "22px",
										fontWeight: "500",
									}}>
									Groups ({totalElement})
								</div>
								<hr />
								<Box
									className='root'
									sx={{
										width: "100%",
										"& .app-header-live": {
											bgcolor: "#76e060",
										},
									}}>
									<DataGrid
										autoHeight
										getRowClassName={(params) => `app-header-${params.row.status}`}
										page={pagination?.page}
										pageSize={pagination?.pageSize}
										onPageSizeChange={(event) => {
											handlePagination({
												page: pagination?.page,
												pageSize: event,
											});
										}}
										rowCount={totalElement}
										rows={rows}
										columns={columns}
										paginationMode='server'
										// autoPageSize
										pagination
										onPageChange={(event) => {
											handlePagination({
												page: event,
												pageSize: pagination?.page,
											});
										}}
										rowsPerPageOptions={[5, 10, 20]}
										className='dataGridFooter'
									/>
								</Box>
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
