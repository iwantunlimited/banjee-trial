import { Visibility } from "@mui/icons-material";
import { Box, Chip, CircularProgress, IconButton } from "@mui/material";
import React from "react";
import { approveRequest, filterBusiness } from "../../services/ApiServices";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useNavigate } from "react-router";
import SnackBarComp from "../../../../CustomComponents/SnackBarComp";

export function BusinessApprovalList({ handleTabChange, listApiCall }) {
	const navigate = useNavigate();
	const [data, setData] = React.useState();

	const [state, setState] = React.useState({
		totalElement: 0,
		pagination: {
			page: 0,
			pageSize: 10,
		},
	});

	const [snackbar, setSnackbar] = React.useState({
		open: false,
		message: "",
		duration: 3000,
		severity: "",
	});

	const handleSnackbar = (data) => {
		setSnackbar((prev) => ({
			...prev,
			open: data,
		}));
	};

	let rows = data ? data : [];

	let columns = [
		{
			id: "1",
			field: "name",
			headerClassName: "app-header",
			headerName: "Business Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.4,
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
			field: "username",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Created By",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				const firstName = params?.row?.mfirstName;
				const lastName = params?.row?.mlastName;
				const name = firstName + " " + lastName;
				return name;
			},
		},
		{
			id: "4",
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
			field: "routingId",
			headerClassName: "app-header-rejected",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "View",
			align: "center",
			flex: 0.2,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								navigate("/explore/detail/" + params.row.routingId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
		{
			id: "6",
			field: "id",
			headerClassName: "app-header",
			headerName: "Status",
			align: "center",
			flex: 0.3,
			renderCell: (params) => {
				return (
					<strong>
						<Chip
							label='Approve'
							style={{ background: "green", color: "white" }}
							onClick={(event) => {
								// navigate("/rooms/view/" + params.row.routingId);
								ApproveApiCAll(params?.row?.routingId);
								pendingAPiCAll(0, 10);
								handleTabChange(event, 0);
								// listApiCall(0, 10);
							}}
						/>
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
			.catch((err) => console.error(err));
	}, []);

	const ApproveApiCAll = React.useCallback((data) => {
		approveRequest({ id: data, approved: true })
			.then((res) => {
				setSnackbar({
					open: true,
					duration: 3000,
					severity: "success",
					message: "Business Approved",
				});
			})
			.catch((err) => console.error(err));
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
								disableSelectionOnClick
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
					<SnackBarComp handleSnackbar={handleSnackbar} data={snackbar} />
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
