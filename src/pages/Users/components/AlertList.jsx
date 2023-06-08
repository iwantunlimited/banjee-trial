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
import { findAlertByUserId } from "../../BanjeeAlert/api-services/apiServices";

function AlertList(props) {
	const navigate = useNavigate();
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 5,
	});

	const [totalEle, setTotalEle] = React.useState(0);

	const [state, setState] = React.useState("");

	//find neighbourhood by user id

	const findAlertApiCall = React.useCallback(() => {
		findAlertByUserId({
			userId: props?.data,
			page: 0,
			pageSize: 10,
		})
			.then((res) => {
				// console.log("====================================");
				// console.log("alert response", res);
				// console.log("====================================");
				setState(res?.content);
				// setPagination({
				// 	page: res?.pageable?.pageNumber,
				// 	pageSize: res?.pageable?.pageSize,
				// });
				setTotalEle(res?.totalElements);
			})
			.catch((err) => console.error(err));
	}, [props?.data, pagination]);

	let rows = state ? state : [];

	let columns = [
		{
			id: "1",
			field: "eventName",
			headerClassName: "app-header",
			headerName: "Event Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "2",
			field: "description",
			headerClassName: "app-header",
			headerName: "Description",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "3",
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
			id: "4",
			field: "mFirstName",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Created By",
			// align: "center",
			flex: 0.3,
			renderCell: (params) => {
				const fullname =
					params?.row?.createdByUser?.firstName + " " + params?.row?.createdByUser?.lastName;
				return fullname;
			},
		},
		{
			id: "5",
			field: "id",
			headerClassName: "app-header-rejected",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "View",
			// align: 'center',
			flex: 0.2,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								navigate("/banjee-alert/" + params.row.id, { state: { reported: false } });
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	React.useEffect(() => {
		findAlertApiCall();
	}, [findAlertApiCall]);

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
										// findCommunityApiCall(pagination?.page, event);
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
										// findCommunityApiCall(event, pagination?.pageSize);
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

export default AlertList;
