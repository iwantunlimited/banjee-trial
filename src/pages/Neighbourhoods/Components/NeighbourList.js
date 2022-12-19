import React from "react";
import { Card, CircularProgress, Box, IconButton, Chip, Typography, Button } from "@mui/material";
import { deleteNeighbourhood, filterNeighbourhood } from "../services/apiServices";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router";
import ModalComp from "../../../CustomComponents/ModalComp";
import { MainContext } from "../../../context/Context";

function NeighbourList(props) {
	const { listApiCAll, data, handlePagination, pagination } = props;
	const navigate = useNavigate();
	const { setModalOpen, setModalData } = React.useContext(MainContext);

	const [modal, setModal] = React.useState({
		open: false,
		id: "",
	});

	function handleModal(data) {
		setModal((prev) => ({
			...prev,
			open: data,
		}));
	}

	const deleteAlertApiCall = React.useCallback((id) => {
		deleteNeighbourhood(id)
			.then((res) => {
				setModal((prev) => ({
					...prev,
					open: false,
					id: "",
				}));
				console.log(res);
				setModalOpen(true);
				setModalData("neighbourhood deleted", "success");
			})
			.catch((err) => console.warn(err));
	}, []);

	let rows = data ? data : [];

	let columns = [
		{
			id: "1",
			field: "name",
			headerClassName: "app-header",
			headerName: "Neighbourhood Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "2",
			field: "countryName",
			headerClassName: "app-header",
			headerName: "Country",
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
			flex: 0.25,
		},
		{
			id: "5",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.25,
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
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "View",
			// align: 'center',
			flex: 0.25,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								navigate("/neighbourhood/detail/" + params.row.routingId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
		{
			id: "9",
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
								setModal((prev) => ({
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
						Neighrbourhood ({pagination?.totalElement})
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
								page={pagination?.pagination?.page}
								pageSize={pagination?.pagination?.pageSize}
								onPageSizeChange={(event) => {
									handlePagination({
										page: pagination?.pagination?.page,
										pageSize: event,
									});
									listApiCAll(pagination?.pagination?.page, event);
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
									listApiCAll(event, pagination?.pagination?.pageSize);
								}}
								rowsPerPageOptions={[5, 10, 20]}
								className='dataGridFooter'
							/>
						</Box>
					</div>
					<ModalComp data={modal} handleModal={handleModal}>
						<Box>
							<Typography>
								<b>Are you sure to delete the neighbourhood ?</b>
							</Typography>
							<Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
								<Button variant='outlined' onClick={() => handleModal(false)}>
									Cancel
								</Button>
								<Button
									variant='contained'
									sx={{ marginLeft: "20px" }}
									onClick={() => {
										deleteAlertApiCall(modal?.id);
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
		// </Card>
	);
}
export default NeighbourList;
