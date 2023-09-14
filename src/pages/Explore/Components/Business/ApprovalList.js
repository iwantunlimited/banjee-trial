import { Visibility } from "@mui/icons-material";
import { Box, Chip, CircularProgress, IconButton } from "@mui/material";
import React, { useContext } from "react";
import { approveRequest, filterBusiness } from "../../services/ApiServices";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useNavigate } from "react-router";
import { MainContext } from "../../../../context/Context";

export function BusinessApprovalList({
	handleTabChange,
	pendingListApiCall,
	paginationState,
	handlePagination,
	data,
	totalElement,
}) {
	const navigate = useNavigate();

	const context = useContext(MainContext);
	const { setModalOpen, setModalData } = context;

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
				return params?.row?.mfirstName;
			},
		},
		{
			id: "4",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.3,
			// type: "date",
			// valueGetter: ({ value }) => value && new Date(value),
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("DD/MM/YYYY");
					return date;
				} else {
					return "-";
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
								navigate("/explore/detail/" + params.row.routingId, { state: { inApprove: true } });
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
							}}
						/>
					</strong>
				);
			},
		},
	];

	const ApproveApiCAll = React.useCallback((data) => {
		approveRequest({ id: data, approved: true })
			.then((res) => {
				setModalOpen(true);
				setModalData("Business Approved", "success");
				handleTabChange(0, 1);
				pendingListApiCall();
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<Box>
			{data ? (
				<div>
					{/* <div style={{ color: "#6b778c", fontSize: "22px", fontWeight: "500" }}>
						In Approval ({totalElement})
					</div>
					<hr /> */}
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
							disableSelectionOnClick
							getRowClassName={(params) => `app-header-${params.row.status}`}
							page={paginationState?.page}
							pageSize={paginationState?.pageSize}
							onPageSizeChange={(event) => {
								handlePagination({ page: paginationState?.page, pageSize: event });
							}}
							rowCount={totalElement}
							rows={rows}
							columns={columns}
							paginationMode='server'
							// autoPageSize
							pagination
							onPageChange={(event) => {
								handlePagination({ page: event, pageSize: paginationState?.pageSize });
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
		</Box>
	);
}
