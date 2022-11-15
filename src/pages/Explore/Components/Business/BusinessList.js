import React from "react";
import { Card, CircularProgress, Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router";

function BusinessList(props) {
	const { data, handlePagination, listApiCall, paginationState } = props;
	const navigate = useNavigate();

	let rows = data ? data : [];

	let columns = [
		{
			id: "1",
			field: "name",
			headerClassName: "app-header",
			headerName: "Business Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.4,
			renderCell: (params) => {
				return params?.row?.name;
			},
		},
		{
			id: "2",
			field: "categoryName",
			headerClassName: "app-header",
			headerName: "Category Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.4,
		},
		{
			id: "3",
			field: "userFName",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Created By",
			// align: "center",
			flex: 0.4,
			// renderCell: (params) => {
			// 	const firstName = params?.row?.firstName;
			// 	const lastName = params?.row?.lastName;
			// 	const name = firstName + " " + lastName;
			// 	return name;
			// },
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
					return "-";
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
								navigate("/explore/detail/" + params.row.routingId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	return (
		// <Card
		// 	style={{
		// 		display: "flex",
		// 		flexDirection: "column",
		// 		padding: "20px",
		// 		color: "grey",
		// 		justifyContent: "left",
		// 	}}>
		<Box>
			{data ? (
				<div>
					<div style={{ color: "#6b778c", fontSize: "22px", fontWeight: "500" }}>
						Business ({paginationState?.totalElement})
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
								page={paginationState?.pagination?.page}
								pageSize={paginationState?.pagination?.pageSize}
								onPageSizeChange={(event) => {
									handlePagination({
										page: paginationState?.pagination?.page,
										pageSize: event,
									});
									listApiCall(paginationState?.pagination?.page, event);
								}}
								rowCount={paginationState?.totalElement}
								rows={rows}
								columns={columns}
								paginationMode='server'
								// autoPageSize
								pagination
								onPageChange={(event) => {
									handlePagination({
										page: event,
										pageSize: paginationState?.pagination?.page,
									});
									listApiCall(event, paginationState?.pagination?.pageSize);
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
		// </Card>
	);
}
export default BusinessList;
