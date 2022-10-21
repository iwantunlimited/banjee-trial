import { Visibility } from "@mui/icons-material";
import { CircularProgress, IconButton, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router";

function AlertListTable({ data, handlePagination, pagination, listApiCall }) {
	const navigate = useNavigate();

	let rows = data ? data : [];

	let columns = [
		{
			id: "1",
			field: "cloudName",
			headerClassName: "app-header",
			headerName: "Cloud Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
		},
		{
			id: "2",
			field: "eventName",
			headerClassName: "app-header",
			headerName: "Event Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
		},
		{
			id: "3",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.2,
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
			field: "description",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Description",
			// align: "center",
			flex: 0.5,
		},

		{
			id: "8",
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
								navigate("/banjee-alert/" + params.row.id);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	return (
		<Box>
			{data ? (
				<div style={{ width: "100%" }}>
					<Box className='root'>
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
								listApiCall(pagination?.pagination?.page, event);
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
								listApiCall(event, pagination?.pagination?.pageSize);
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

export default AlertListTable;
