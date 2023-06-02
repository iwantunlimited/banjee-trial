import React from "react";
import {
	CircularProgress,
	Box,
	IconButton,
	Chip,
	Typography,
	Button,
	TextField,
	Stack,
	Tooltip,
} from "@mui/material";
import { deleteNeighbourhood } from "../services/apiServices";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Refresh, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router";
import ModalComp from "../../../CustomComponents/ModalComp";
import { MainContext } from "../../../context/Context";
import moment from "moment";
import { PaginationContext } from "../../../context/PaginationContext";

function NeighbourList(props) {
	const { listData, totalElement, listApiCall, handlePagination, pagination } = props;
	const { setNeighbourhoodPagination } = React.useContext(PaginationContext);
	const navigate = useNavigate();
	const { setModalOpen, setModalData } = React.useContext(MainContext);

	const [modal, setModal] = React.useState({
		open: false,
		id: "",
	});

	const [keywords, setKeywords] = React.useState(null);

	function handleModal(data) {
		setModal((prev) => ({
			...prev,
			open: data,
		}));
	}

	const deleteAlertApiCall = (id) => {
		deleteNeighbourhood(id)
			.then((res) => {
				setModal((prev) => ({
					...prev,
					open: false,
					id: "",
				}));
				setModalOpen(true);
				setModalData("neighbourhood deleted", "success");
				listApiCall();
			})
			.catch((err) => console.warn(err));
	};

	let rows = listData ? listData : [];

	let columns = [
		{
			id: "1",
			field: "name",
			headerClassName: "app-header",
			headerName: "Neighbourhood Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		// {
		// 	id: "2",
		// 	field: "countryName",
		// 	headerClassName: "app-header",
		// 	headerName: "Country",
		// 	// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
		// 	flex: 0.3,
		// },
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
			id: "8",
			field: "routingId",
			headerClassName: "app-header-rejected",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Action",
			// align: 'center',
			flex: 0.3,
			renderCell: (params) => {
				return (
					<strong>
						<Stack direction={"row"} spacing={1}>
							<IconButton
								onClick={() => {
									setNeighbourhoodPagination({
										page: pagination?.page,
										pageSize: pagination?.pageSize,
									});
									navigate("/neighbourhood/" + params.row.routingId, {
										state: { inApprove: false },
									});
								}}>
								<Visibility />
							</IconButton>
							<IconButton
								onClick={() => {
									navigate("/neighbourhood/update/" + params.row.routingId, {
										state: { inApprove: false },
									});
								}}>
								<Edit />
							</IconButton>
							<IconButton
								onClick={(event) => {
									setModal((prev) => ({
										...prev,
										open: true,
										id: params?.row?.routingId,
									}));
								}}>
								<Delete />
							</IconButton>
						</Stack>
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
			{listData ? (
				<div>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						{/* <div style={{ color: "#6b778c", fontSize: "22px", fontWeight: "500" }}>
							Neighrbourhood ({totalElement})
						</div> */}
						<Box
							sx={{
								marginBottom: "15px",
								width: "100%",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							{/* <Stack> */}
							<Box>
								<TextField
									fullWidth
									size='small'
									variant='outlined'
									label='Search'
									name='keywords'
									value={keywords}
									onChange={(e) => {
										listApiCall({ keyword: e.target.value });
										setKeywords(e.target.value);
									}}
									className='search-field'
								/>
							</Box>

							<Tooltip title='Refresh Neighbourhood'>
								<IconButton
									onClick={() => {
										handlePagination({ page: 0, pageSize: 10 });
										setNeighbourhoodPagination({ page: undefined, pageSize: undefined });
									}}>
									<Refresh color='primary' />
								</IconButton>
							</Tooltip>
							{/* </Stack> */}
						</Box>
					</Box>
					{/* <hr /> */}
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
								page={pagination?.page}
								pageSize={pagination?.pageSize}
								onPageSizeChange={(event) => {
									handlePagination({
										page: pagination?.page,
										pageSize: event,
									});
								}}
								rowCount={totalElement}
								rows={rows}
								columns={columns}
								paginationMode='server'
								// autoPageSize
								pagination
								onPageChange={(event) => {
									handlePagination({
										page: event,
										pageSize: pagination?.pageSize,
									});
								}}
								rowsPerPageOptions={[5, 10, 20]}
								className='dataGridFooter'
							/>
						</Box>
					</div>
					<ModalComp data={modal} handleModal={handleModal}>
						<Box>
							<Typography
								sx={{
									fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
									fontWeight: 400,
								}}>
								Are you sure to delete the neighbourhood ?
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
