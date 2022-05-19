import React from "react";
import { Grid, Container, Card, IconButton, CircularProgress, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import { Helmet } from "react-helmet";
import ChipCompo from "./components/chipCompo";
import { filterRooms } from "./Services/ApiServices";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

function Room() {
	const navigate = useNavigate();

	const [state, setState] = React.useState();

	console.log("state-------", state);

	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	const [totalEle, setTotalEle] = React.useState();

	const [keywords, setKeywords] = React.useState("");

	function handleSearch(event) {
		setState();
		setKeywords(event.target.value);
		ApiCall(pagination.page, pagination.pageSize, event.target.value);
	}

	const ApiCall = React.useCallback((page, pageSize, keywords) => {
		setState();
		filterRooms({
			inactive: "",
			page: page,
			pageSize: pageSize,
			keywords: keywords,
		})
			.then((res) => {
				console.log(res);
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						...ele,
						...ele.users,
						...ele.creator,
					};
				});
				setState(resp);
				setTotalEle(res.totalElements);
			})
			.catch((errr) => console.log(errr));
	}, []);

	let rows = state ? state : [];

	let columns = [
		{
			id: "1",
			field: "groupName",
			headerClassName: "app-header",
			headerName: "Room Name",
			cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "2",
			field: "userName",
			headerClassName: "app-header",
			headerName: "Created By",
			cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.4,
		},
		{
			id: "3",
			field: "email",
			headerClassName: "app-header",
			headerName: "Email",
			cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "4",
			field: "mobile",
			headerClassName: "app-header",
			cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Mobile Number",
			align: "center",
			flex: 0.4,
		},
		{
			id: "5",
			field: "communityType",
			headerClassName: "app-header",
			cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Type",
			align: "center",
			flex: 0.3,
		},
		{
			id: "6",
			field: "users",
			headerClassName: "app-header",
			cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Members",
			align: "center",
			flex: 0.3,
			renderCell: (params) => {
				if (params.row && params.row.users && params.row.users.length > 0) {
					return params.row.users.length;
				} else {
					return 0;
				}
			},
		},
		{
			id: "7",
			field: "createdOn",
			headerClassName: "app-header",
			cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Created On",
			align: "center",
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
			cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "View",
			// align: 'center',
			flex: 0.3,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								navigate("/rooms/view/" + params.row.routingId);
								console.log(params);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	React.useEffect(() => {
		ApiCall(0, 10, "");
	}, [ApiCall]);

	//    if(state){
	return (
		<>
			<Helmet>
				<title>Rooms | Banjee Admin</title>
			</Helmet>
			<Container maxWidth='lg' style={{ paddingTop: window.innerWidth < 501 ? "0px" : "20px" }}>
				<Grid item container xs={12} spacing={window.innerWidth < 601 ? 2 : 4}>
					<Grid item xs={12}>
						<ChipCompo refreshApi={ApiCall} handleSearch={handleSearch} words={keywords} />
					</Grid>
					<Grid item xs={12}>
						{state ? (
							<Card
								style={{
									display: "flex",
									flexDirection: "column",
									padding: "20px",
									color: "grey",
									justifyContent: "left",
								}}>
								<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
									Rooms ({totalEle})
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
											page={pagination.page}
											pageSize={pagination.pageSize}
											onPageSizeChange={(event) => {
												setPagination((prev) => ({
													...prev,
													pageSize: event,
												}));
												ApiCall(pagination.page, event, keywords);
											}}
											rowCount={totalEle}
											rows={rows}
											columns={columns}
											paginationMode='server'
											// autoPageSize
											pagination
											onPageChange={(event) => {
												console.log("event--------", event);
												setPagination((prev) => ({
													...prev,
													page: event,
												}));
												ApiCall(event, pagination.pageSize, keywords);
											}}
											rowsPerPageOptions={[5, 10, 20]}
											className='dataGridFooter'
										/>
									</Box>
								</div>
							</Card>
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
					</Grid>
				</Grid>
			</Container>
		</>
	);
	//    }else{
	//        return(
	//         <Box style={{width: '100%',height: '50vh'}} className="d-flex justify-content-center align-items-center">
	//             <CircularProgress />
	//         </Box>
	//        )
	//    }
}

export default Room;
