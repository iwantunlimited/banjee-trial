import { Add, Delete, Refresh } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	Stack,
	Switch,
	Tooltip,
	Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { Visibility } from "@mui/icons-material";
import "../../../Explore/Components/component.css";
import { DataGrid } from "@mui/x-data-grid";
import {
	activeToggleHandler,
	deleteNotificationById,
	listNotificationConfig,
} from "../../ApiServices/apiServices";
import { MainContext } from "../../../../context/Context";
import ModalComp from "../../../../CustomComponents/ModalComp";
import moment from "moment";
import { PaginationContext } from "../../../../context/PaginationContext";

function Automation() {
	const navigate = useNavigate();
	const context = useContext(MainContext);
	const { notificationPagination, setNotificationPagination } = React.useContext(PaginationContext);
	const { setModalOpen, setModalData } = context;
	const [data, setData] = React.useState("");

	const [modal, setModal] = React.useState({
		open: false,
		id: "",
	});

	// pagination state
	const [pagination, setPagination] = React.useState({
		page: notificationPagination?.page ? notificationPagination?.page : 0,
		pageSize: notificationPagination?.pageSize ? notificationPagination?.pageSize : 10,
	});
	const [totalEle, setTotalEle] = React.useState();

	let rows = data ? data : [];

	const handleModal = (data) => {
		setModal((prev) => ({
			...prev,
			open: data,
		}));
	};

	const ActiveAPiCall = React.useCallback((data) => {
		activeToggleHandler(data)
			.then((res) => {
				const to = res?.pause ? "inactive" : "active";
				const from = res?.pause ? "active" : "inactive";
				// console.log("====================================");
				// console.log(res);
				// console.log("====================================");
				AutomationListApiCall();
				setModalOpen(true);
				setModalData(`${"status changed from " + from + " to " + to}`, "success");
			})
			.catch((err) => {
				setModalOpen(true);
				setModalData("something went wrong !", "error");
				console.error(err);
			});
	}, []);

	let columns = [
		{
			id: "1",
			field: "title",
			headerClassName: "app-header",
			headerName: "Title",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
		},
		{
			id: "2",
			field: "description",
			headerClassName: "app-header",
			headerName: "Description",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "3",
			field: "clickAction",
			headerClassName: "app-header",
			headerName: "Click Action",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.4,
		},
		{
			id: "4",
			field: "durationType",
			headerClassName: "app-header",
			headerName: "Duration Type",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
		},
		{
			id: "5",
			field: "inactivityType",
			headerClassName: "app-header",
			headerName: "Filter Activity",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.4,
		},
		{
			id: "8",
			field: "pause",
			headerClassName: "app-header",
			headerName: "Active",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.2,
			renderCell: (params) => {
				if (params?.row?.durationType === "QUICK_SEND") {
					return <span></span>;
				} else {
					return (
						<Switch
							checked={params?.row?.pause === false}
							onChange={(event) => {
								ActiveAPiCall({
									id: params?.row?.id,
									pause: !event.target?.checked,
								});
							}}
						/>
					);
				}
			},
		},
		// {
		// 	id: "3",
		// 	field: "createdBy",
		// 	headerClassName: "app-header",
		// 	// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
		// 	headerName: "Created By",
		// 	// align: "center",
		// 	flex: 0.3,
		// 	renderCell: (params) => {
		// 		if (params?.row && params?.row?.mfirstName) {
		// 			const name =
		// 				params?.row?.mfirstName
		// 			return name;
		// 		} else {
		// 			return null;
		// 		}
		// 	},
		// },
		{
			id: "4",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.3,
			// type: "date",
			// formate: "DD-MM-YYYY",
			// valueGetter: ({ value }) => value && new Date(value),
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("LLL");
					return date;
				} else {
					return "-";
				}
			},
		},
		{
			id: "5",
			field: "id",
			headerClassName: "app-header-rejected",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Actions",
			// align: 'center',
			flex: 0.3,
			renderCell: (params) => {
				return (
					<Stack direction={"row"} spacing={1}>
						<IconButton
							onClick={() => {
								setModal({
									open: true,
									id: params?.row?.id,
								});
							}}>
							<Delete />
						</IconButton>
						<IconButton
							onClick={() => {
								setNotificationPagination({
									page: pagination?.page,
									pageSize: pagination?.pageSize,
								});
								navigate("/notification/automation/" + params?.row?.id);
							}}>
							<Visibility />
						</IconButton>
					</Stack>
				);
			},
		},
	];

	const AutomationListApiCall = React.useCallback(() => {
		listNotificationConfig({
			page: pagination?.page,
			pageSize: pagination?.pageSize,
		})
			.then((res) => {
				setData(res?.content);
				setTotalEle(res.totalElements);
			})
			.catch((err) => console.error(err));
	}, [pagination]);

	const DeleteNotificationApiCall = React.useCallback((nId) => {
		deleteNotificationById(nId)
			.then((Res) => {
				setModalOpen(true);
				setModalData("Notification Deleted Successfully", "success");
				AutomationListApiCall();
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		AutomationListApiCall();
	}, [AutomationListApiCall]);

	if (data) {
		return (
			<Container style={{ padding: "0px", margin: "auto" }} maxWidth='xl'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
							<Box>
								<Typography
									sx={{
										fontWeight: 500,
										color: context?.themeData ? "default" : "#6b778c",
										fontSize: "22px",
									}}>
									Automated Notifications ({totalEle ? totalEle : 0})
								</Typography>
							</Box>
							<Box>
								<Tooltip
									title='Create Notification Config'
									arrow
									sx={{ bacground: "white", color: "black" }}>
									<IconButton onClick={() => navigate("/notification/automation/create")}>
										<Add color='primary' />
									</IconButton>
								</Tooltip>
								<Tooltip title='Refresh Notification' arrow sx={{ bacground: "white", color: "black" }}>
									<IconButton
										onClick={() => {
											setNotificationPagination({ page: undefined, pageSize: undefined });
											setPagination({ page: 0, pageSize: 10 });
										}}>
										<Refresh color='primary' />
									</IconButton>
								</Tooltip>
							</Box>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px" }}>
							{data?.length > 0 ? (
								<div>
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
													setPagination({
														page: pagination?.page,
														pageSize: event,
													});
												}}
												rowCount={totalEle}
												rows={rows}
												columns={columns}
												paginationMode='server'
												// autoPageSize
												pagination
												onPageChange={(event) => {
													setPagination({
														page: event,
														pageSize: pagination?.pageSize,
													});
												}}
												rowsPerPageOptions={[5, 10, 20]}
												className='dataGridFooter'
												disableSelectionOnClick
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
										marginTop: "10px",
									}}>
									<p>No data available</p>
								</div>
							)}
						</Card>
					</Grid>
				</Grid>
				<ModalComp handleModal={handleModal} data={modal}>
					<Box
						sx={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}>
						<Typography
							sx={{
								fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
								fontWeight: 400,
							}}>
							Are you sure to delete notification?
						</Typography>
						<Box sx={{ marginTop: "20px" }}>
							<Button
								onClick={() => {
									handleModal(false);
								}}>
								cancel
							</Button>
							<Button
								sx={{ marginLeft: "10px" }}
								onClick={() => {
									DeleteNotificationApiCall(modal?.id);
									handleModal(false);
								}}>
								confirm
							</Button>
						</Box>
					</Box>
				</ModalComp>
			</Container>
		);
	} else {
		return (
			<Box
				sx={{
					width: "100%",
					height: "50vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress color='primary' />
			</Box>
		);
	}
}

export default Automation;
