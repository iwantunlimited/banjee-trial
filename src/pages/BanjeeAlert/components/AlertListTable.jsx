import { Visibility } from "@mui/icons-material";
import { CircularProgress, IconButton, Box, Button, Chip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router";
import { MainContext } from "../../../context/Context";
import ModalComp from "../../../CustomComponents/ModalComp";
import { deleteAlert } from "../api-services/apiServices";

function AlertListTable({
	data,
	handlePagination,
	pagination,
	listApiCall,
	handleAlertListApiCall,
}) {
	const navigate = useNavigate();

	const context = React.useContext(MainContext);

	const [modalData, setModalData] = React.useState({
		open: false,
		id: "",
	});

	function handleModal(data) {
		setModalData((prev) => ({
			...prev,
			open: data,
		}));
	}

	const deleteAlertApiCall = (id) => {
		deleteAlert(id)
			.then((res) => {
				if (res) {
					handleAlertListApiCall();
				}
				navigate("/banjee-alert");
				context?.setModalOpen(true);
				context?.setModalData("Alert Deleted Successfully", "success");
				setModalData((prev) => ({
					open: false,
					id: "",
				}));
			})
			.catch((err) => console.error(err));
	};

	let rows = data ? data : [];

	let columns = [
		{
			id: "1",
			field: "eventName",
			headerClassName: "app-header",
			headerName: "Event Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
		},
		{
			id: "2",
			field: "description",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Description",
			// align: "center",
			flex: 0.4,
		},
		{
			id: "3",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.2,
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
			id: "4",
			field: "mFirstName",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Created By",
			// align: "center",
			flex: 0.3,
			renderCell: (params) => {
				const fullname = params?.row?.cFirstName + " " + params?.row?.cLastName;
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
		{
			id: "6",
			field: "routingId",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Delete",
			// align: "center",
			flex: 0.2,
			renderCell: (params) => {
				return (
					<strong>
						<Chip
							label='Delete'
							style={{ background: "red", color: "white" }}
							onClick={(event) => {
								setModalData((prev) => ({
									...prev,
									open: true,
									id: params?.row?.routingId,
								}));
							}}
						/>
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
					<ModalComp data={modalData} handleModal={handleModal}>
						<Box>
							<Typography>
								<b>Are you sure to delete the alert ?</b>
							</Typography>
							<Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
								<Button variant='outlined' onClick={() => handleModal(false)}>
									Cancel
								</Button>
								<Button
									variant='contained'
									sx={{ marginLeft: "20px" }}
									onClick={() => {
										deleteAlertApiCall(modalData?.id);
									}}>
									Confirm
								</Button>
							</Box>
						</Box>
					</ModalComp>
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
