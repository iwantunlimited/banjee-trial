import React from "react";
import { CircularProgress, Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router";
import {
	filterNeighbourhood,
	findNeighbourhoodByUserId,
} from "../../Neighbourhoods/services/apiServices";
import { listActiveUsers } from "../../Report/User_Services/UserApiService";

function TimeSpentList(props) {
	const navigate = useNavigate();
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 5,
	});

	const [totalEle, setTotalEle] = React.useState(0);

	const [state, setState] = React.useState("");

	//find neighbourhood by user id

	const ActiveUserApiCall = React.useCallback(() => {
		// console.log("====================================");
		// console.log(newData);
		// console.log("====================================");
		const payload = {
			userId: props?.data,
			page: pagination?.page,
			pageSize: pagination?.pageSize,
		};
		listActiveUsers(payload)
			.then((res) => {
				const rowData = res?.content?.[0]?.onlineActivityList?.map((item, index) => {
					console.log("listActive user", item);
					return {
						...item,
						id: index,
						date: item?.date,
						timeSpent: item?.totalDuration,
						view: "view",
					};
				});

				setState(rowData ? rowData : []);
				// setPagination({
				// 	page: res?.pageable?.pageNumber,
				// 	pageSize: res?.pageable?.pageSize,
				// });
				setTotalEle(res?.content?.[0]?.onlineActivityList?.length);
			})
			.catch((err) => {
				console.warn(err);
			});
	}, []);

	console.log("====================================");
	console.log("state", state);
	console.log("====================================");

	let rows = state ? state : [];

	let columns = [
		{
			id: "1",
			field: "date",
			headerClassName: "app-header",
			headerName: "Date",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				if (params.row && params.row.date) {
					const dateFormate = moment(params.row.date).format("LL");
					return dateFormate;
				} else {
					return 0;
				}
			},
		},
		{
			id: "2",
			field: "timeSpent",
			headerClassName: "app-header",
			headerName: "Time Spent",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				const hour = params?.row?.timeSpent?.hour;
				const minutes = params?.row?.timeSpent?.minutes;
				const seconds = params?.row?.timeSpent?.seconds;
				const time = `${hour + " hour, " + minutes + " minutes, " + seconds + " seconds"}`;
				return time;
			},
		},
		// {
		// 	id: "8",
		// 	field: "id",
		// 	headerClassName: "app-header-rejected",
		// 	// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
		// 	headerName: "View",
		// 	// align: 'center',
		// 	flex: 0.3,
		// 	renderCell: (params) => {
		// 		return (
		// 			<strong>
		// 				<IconButton
		// 					onClick={() => {
		// 						navigate("/neighbourhood/" + params.row.id);
		// 					}}>
		// 					<Visibility />
		// 				</IconButton>
		// 			</strong>
		// 		);
		// 	},
		// },
	];

	React.useEffect(() => {
		props?.data && ActiveUserApiCall();
	}, [ActiveUserApiCall]);

	return (
		<Box>
			<Box>
				{state ? (
					<div>
						{/* <div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
							Neighrbourhood
						</div>
						<hr /> */}
						<div style={{ width: "100%", height: "100%" }}>
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
									page={pagination?.page}
									pageSize={pagination?.pageSize}
									onPageSizeChange={(event) => {
										setPagination({
											page: pagination?.page,
											pageSize: event,
										});
										// findNeighbourhoodApiCall(pagination?.page, event);
									}}
									rowCount={totalEle}
									rows={rows}
									columns={columns}
									paginationMode='server'
									// autoPageSize
									pagination
									onPageChange={(event) => {
										setPagination({
											page: event,
											pageSize: pagination?.pageSize,
										});
										// findNeighbourhoodApiCall(event, pagination?.pageSize);
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
			</Box>
		</Box>
	);
}

export default TimeSpentList;
