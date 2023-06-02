import { Visibility } from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React from "react";
import { approveRequest, pendingApproval, rejectRequest } from "../services/apiServices";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useLocation, useNavigate } from "react-router";
import ModalComp from "../../../CustomComponents/ModalComp";
import { MainContext } from "../../../context/Context";

export function ApprovalList({
	handleTabChange,
	pendingListApiCall,
	data,
	pagination,
	handlePagination,
	totalElement,
}) {
	const navigate = useNavigate();

	const { setModalData, setModalOpen } = React.useContext(MainContext);
	const [review, setReview] = React.useState("");

	const [modal, setModal] = React.useState({
		open: false,
		data: "",
		event: "",
	});

	const handleModal = (data) => {
		setModal((prev) => ({
			...prev,
			open: data,
		}));
	};

	let rows = data ? data : [];

	let columns = [
		{
			id: "1",
			field: "objectName",
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
			flex: 0.15,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								navigate("/neighbourhood/" + params.row.objectId, {
									state: { inApprove: true },
								});
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
			flex: 0.4,
			renderCell: (params) => {
				return (
					<strong>
						<Stack direction='row' spacing={2}>
							<Chip
								label='Approve'
								style={{ background: "green", color: "white" }}
								onClick={(event) => {
									// navigate("/rooms/view/" + params.row.routingId);

									ApproveApiCAll(params?.row?.routingId);
									handleTabChange(event, 0);
									// pendingAPiCAll(0, 10);
								}}
							/>
							<Chip
								label='Reject'
								style={{ background: "red", color: "white" }}
								onClick={(event) => {
									// navigate("/rooms/view/" + params.row.routingId);
									setModal({
										open: true,
										data: params?.row?.routingId,
										event: event,
									});
								}}
							/>
						</Stack>
					</strong>
				);
			},
		},
	];

	const ApproveApiCAll = React.useCallback((data) => {
		approveRequest({ id: data })
			.then((res) => {
				setModalOpen(true);
				setModalData("Neighbourhood approved", "success");
				handleTabChange(modal?.event, 1);
				pendingListApiCall();
			})
			.catch((err) => console.error(err));
	}, []);

	const RejectApiCAll = React.useCallback((data) => {
		rejectRequest({ id: data, reviewComment: review })
			.then((res) => {
				handleModal(false);
				setModalOpen(true);
				setModalData("Neighbourhood Rejected", "success");
				handleTabChange(modal?.event, 1);
				pendingListApiCall();
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<Box>
			{data ? (
				<div>
					{/* <div style={{ color: "#6b778c", fontSize: "22px", fontWeight: "500" }}>
						Pending Neighrbourhood ({totalElement})
					</div>
					<hr /> */}
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
								page={pagination?.page}
								pageSize={pagination?.pageSize}
								onPageSizeChange={(event) => {
									handlePagination({ page: pagination?.page, pageSize: event });
								}}
								rowCount={totalElement}
								rows={rows}
								columns={columns}
								paginationMode='server'
								// autoPageSize
								pagination
								onPageChange={(event) => {
									handlePagination({ page: event, pageSize: pagination?.pageSize });
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
			<ModalComp handleModal={handleModal} data={modal}>
				<Typography
					sx={{
						fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
						fontWeight: 400,
					}}>
					Are You Sure To Reject The Neighbourhood ?
				</Typography>
				<Box sx={{ marginY: "10px" }}>
					<TextField
						fullWidth
						label='Review'
						name='review'
						value={review}
						onChange={(event) => setReview(event?.target?.value)}
					/>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
					<Button variant='outlined' onClick={() => handleModal(false)}>
						cancel
					</Button>
					<Button
						sx={{ marginLeft: "20px" }}
						variant='contained'
						onClick={() => {
							RejectApiCAll(modal?.data);
						}}>
						confirm
					</Button>
				</Box>
			</ModalComp>
		</Box>
	);
}
