import { Check, Clear, JoinRight } from "@mui/icons-material";
import { Box, Chip, CircularProgress, IconButton, Stack } from "@mui/material";
import React from "react";
import { approveRequest, filterBusiness } from "../services/ApiServices";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

export function BusinessApprovalList() {
	const [data, setData] = React.useState();

	const [state, setState] = React.useState({
		totalElement: 0,
		pagination: {
			page: 0,
			pageSize: 10,
		},
	});

	let rows = data ? data : [];

	let columns = [
		{
			id: "1",
			field: "name",
			headerClassName: "app-header",
			headerName: "Business Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "2",
			field: "categoryName",
			headerClassName: "app-header",
			headerName: "CAaegory",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
		},
		{
			id: "3",
			field: "username",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Created By",
			// align: "center",
			flex: 0.3,
			renderCell: (params) => {
				const firstName = params?.row?.mfirstName;
				const lastName = params?.row?.mlastName;
				const name = firstName + " " + lastName;
				return name;
			},
		},
		{
			id: "3",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.3,
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
			id: "5",
			field: "id",
			headerClassName: "app-header",
			headerName: "Status",
			align: "center",
			flex: 0.4,
			renderCell: (params) => {
				return (
					<strong>
						{/* <IconButton
							onClick={() => {
								// navigate("/rooms/view/" + params.row.routingId);
								ApproveApiCAll(params?.row?.routingId);
								pendingAPiCAll(0, 10);
								console.log(params);
							}}>
							<Check style={{ color: "green" }} />
						</IconButton> */}
						{/* <Stack direction='row' spacing={2}> */}
						<Chip
							label='Approve'
							style={{ background: "green", color: "white" }}
							onClick={() => {
								// navigate("/rooms/view/" + params.row.routingId);
								ApproveApiCAll(params?.row?.routingId);
								pendingAPiCAll(0, 10);
							}}
						/>
						{/* <Chip
								label='Reject'
								style={{ background: "red", color: "white" }}
								onClick={() => {
									// navigate("/rooms/view/" + params.row.routingId);
									RejectApiCAll(params?.row?.routingId);
									pendingAPiCAll(0, 10);
									console.log(params);
								}}
							/> */}
						{/* </Stack> */}
					</strong>
				);
			},
		},
	];

	const pendingAPiCAll = React.useCallback((page, pageSize) => {
		filterBusiness({ page: page, pageSize: pageSize, approved: false })
			.then((res) => {
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						...ele,
						mfirstName: ele?.userObject?.firstName,
						mlastName: ele?.userObject?.lastName,
						// ...ele?.name,
						// ...ele?.createdOn,
					};
				});
				setData(resp);
				setState((prev) => ({
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

	const ApproveApiCAll = React.useCallback((data) => {
		approveRequest({ id: data, approved: true })
			.then((res) => {
				console.log("====================================");
				console.log("approve response", res);
				console.log("====================================");
			})
			.catch((err) => console.log(err));
	}, []);

	React.useEffect(() => {
		pendingAPiCAll(0, 10);
	}, [pendingAPiCAll]);

	return (
		<Box>
			{data ? (
				<div>
					<div style={{ color: "#6b778c", fontSize: "20px", fontWeight: "500" }}>
						In Approval ({state?.totalElement})
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
								page={state?.pagination?.page}
								pageSize={state?.pagination?.pageSize}
								onPageSizeChange={(event) => {
									setState((prev) => ({
										...prev,
										pagination: {
											pageSize: event,
										},
									}));
									pendingAPiCAll(state?.pagination?.page, event);
								}}
								rowCount={state?.totalElement}
								rows={rows}
								columns={columns}
								paginationMode='server'
								// autoPageSize
								pagination
								onPageChange={(event) => {
									console.log("event--------", event);
									setState((prev) => ({
										...prev,
										pagination: {
											page: event,
										},
									}));
									pendingAPiCAll(event, state?.pagination?.pageSize);
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
	);
}
