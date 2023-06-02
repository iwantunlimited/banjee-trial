import { Visibility } from "@mui/icons-material";
import { CircularProgress, IconButton, Box, Button, Chip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router";
import { MainContext } from "../../../context/Context";
import ModalComp from "../../../CustomComponents/ModalComp";
import { deleteAlert, filterReportList } from "../api-services/apiServices";

function ReportedAlertList() {
	const navigate = useNavigate();

	const context = React.useContext(MainContext);

	const [data, setData] = React.useState("");

	const [modalData, setModalData] = React.useState({
		open: false,
		id: "",
	});

	const [pagination, setPagination] = React.useState({
		totalElement: 0,
		pagination: {
			page: 0,
			pageSize: 10,
		},
	});

	const handlePagination = (data) => {
		setPagination((prev) => ({
			...prev,
			pagination: data,
		}));
	};

	function handleModal(data) {
		setModalData((prev) => ({
			...prev,
			open: data,
		}));
	}

	const ReportedAlertListApiCall = React.useCallback((page, pageSize) => {
		filterReportList({ page: page, pageSize: pageSize })
			.then((res) => {
				const resp = res?.content?.map((item) => {
					return {
						routingId: item?.id,
						rFirstName: item?.createdByUser?.firstName,
						rLastName: item?.createdByUser?.lastName,
						cloudName: item?.content?.cloudName,
						eventName: item?.content?.eventName,
						description: item?.content?.description,
						...item,
					};
				});
				setData(resp);
				setPagination((prev) => ({
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

	const deleteAlertApiCall = React.useCallback((id) => {
		deleteAlert(id)
			.then((res) => {
				context?.setModalOpen(true);
				context?.setModalData("Alert Deleted Successfully", "success");
				navigate("/banjee-alert");
				setModalData((prev) => ({
					open: false,
					id: "",
				}));
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		ReportedAlertListApiCall(0, 10);
	}, [ReportedAlertListApiCall]);

	let rows = data ? data : [];

	let columns = [
		// {
		// 	id: "1",
		// 	field: "cloudName",
		// 	headerClassName: "app-header",
		// 	headerName: "Cloud Name",
		// 	// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
		// 	flex: 0.3,
		// },
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
			field: "description",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Description",
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
			type: "date",
			// valueGetter: ({ value }) => value && new Date(value),
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("LLL");
					return date;
				} else {
					return 0;
				}
			},
		},
		{
			id: "5",
			field: "rFirstName",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Created By",
			// align: "center",
			flex: 0.25,
			renderCell: (params) => {
				const fullName = params?.row?.rFirstName + " " + params?.row?.rLastName;
				return fullName;
			},
		},

		{
			id: "6",
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
								navigate("/banjee-alert/" + params.row.id, { state: { reported: true } });
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
		{
			id: "8",
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

	if (data) {
		return (
			<Box>
				{data?.length > 0 ? (
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
									ReportedAlertListApiCall(pagination?.pagination?.page, event);
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
									ReportedAlertListApiCall(event, pagination?.pagination?.pageSize);
								}}
								rowsPerPageOptions={[5, 10, 20]}
								className='dataGridFooter'
							/>
						</Box>
						<ModalComp data={modalData} handleModal={handleModal}>
							<Box>
								<Typography
									sx={{
										fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
										fontWeight: 400,
									}}>
									Are you sure to delete the alert ?
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
						}}>
						<p>No data available!</p>
					</div>
				)}
			</Box>
		);
	} else {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "50vh",
				}}>
				<CircularProgress />
			</div>
		);
	}
}

export default ReportedAlertList;
