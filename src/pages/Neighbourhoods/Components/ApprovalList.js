import { Visibility } from "@mui/icons-material";
import { Box, Button, Chip, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { approveRequest, pendingApproval, rejectRequest } from "../services/apiServices";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useNavigate } from "react-router";
import ModalComp from "../../../CustomComponents/ModalComp";
import { MainContext } from "../../../context/Context";

export function ApprovalList({ handleTabChange, listApiCAll }) {
	const navigate = useNavigate();

	const { setModalData, setModalOpen } = React.useContext(MainContext);

	const [data, setData] = React.useState();

	const [modal, setModal] = React.useState({
		open: false,
		data: "",
		event: "",
	});

	const [state, setState] = React.useState({
		totalElement: 0,
		pagination: {
			page: 0,
			pageSize: 10,
		},
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
								navigate("/neighbourhood/detail/" + params.row.objectId);
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
									pendingAPiCAll(0, 10);
									listApiCAll(0, 10);
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

	const pendingAPiCAll = React.useCallback((page, pageSize) => {
		pendingApproval({ page: page, pageSize: pageSize, processed: false })
			.then((res) => {
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						...ele,
						...ele?.payload,
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
		approveRequest({ id: data })
			.then((res) => {
				setModalOpen(true);
				setModalData("Neighbourhood approved", "success");
			})
			.catch((err) => console.error(err));
	}, []);

	const RejectApiCAll = React.useCallback((data) => {
		rejectRequest({ id: data })
			.then((res) => {
				setModalOpen(true);
				setModalData("Neighbourhood Rejected", "success");
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
					<div style={{ color: "#6b778c", fontSize: "22px", fontWeight: "500" }}>
						Pending Neighrbourhood ({state?.totalElement})
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
			<ModalComp handleModal={handleModal} data={modal} width={500}>
				<Typography sx={{ fontSize: { xs: "16px", sm: "20px", fontWeight: 500 } }}>
					Are You Sure To Delete The Neighbourhood ?
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
					<Button variant='outlined' onClick={() => handleModal(false)}>
						cancel
					</Button>
					<Button
						sx={{ marginLeft: "20px" }}
						variant='contained'
						onClick={() => {
							RejectApiCAll(modal?.data);
							pendingAPiCAll(0, 10);
							handleTabChange(modal?.event, 0);
							listApiCAll(0, 10);
						}}>
						confirm
					</Button>
				</Box>
			</ModalComp>
		</Box>
	);
}
