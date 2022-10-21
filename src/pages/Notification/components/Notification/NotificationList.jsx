import { Add, Delete } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	Tooltip,
	Typography,
} from "@mui/material";
import moment from "moment";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { Visibility } from "@mui/icons-material";
import "../../../Explore/Components/component.css";
import { DataGrid } from "@mui/x-data-grid";
import { deleteAlert, listNotification } from "../../ApiServices/apiServices";
import SnackBarComp from "../../../../CustomComponents/SnackBarComp";
import { MainContext } from "../../../../context/Context";
import ModalComp from "../../../../CustomComponents/ModalComp";

function NotificationList() {
	const navigate = useNavigate();
	const context = useContext(MainContext);
	const { setModalOpen, setModalData, setNotificationPopup } = context;
	const [data, setData] = React.useState("");

	const [modal, setModal] = React.useState({
		open: false,
		id: "",
	});

	// pagination state
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 12,
	});
	const [totalEle, setTotalEle] = React.useState();

	let rows = data ? data : [];

	const handleModal = (data) => {
		setModal((prev) => ({
			...prev,
			open: data,
		}));
	};

	let columns = [
		{
			id: "1",
			field: "eventName",
			headerClassName: "app-header",
			headerName: "Title",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.4,
		},
		{
			id: "2",
			field: "cloudName",
			headerClassName: "app-header",
			headerName: "Neighbourhood",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "3",
			field: "templateName",
			headerClassName: "app-header",
			headerName: "Template",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
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
		// 				params?.row?.mfirstName &&
		// 				params?.row?.mfirstName + " " + params?.row?.mlastName &&
		// 				params?.row?.mfirstName;
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
			field: "notificationId",
			headerClassName: "app-header-rejected",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Delete",
			// align: 'center',
			flex: 0.2,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								setModal({
									open: true,
									id: params?.row?.notificationId,
								});
							}}>
							<Delete />
						</IconButton>
					</strong>
				);
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
								navigate("/notification/" + params?.row?.notificationId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	const NotificationListApiCall = React.useCallback((page, pageSize) => {
		listNotification({ page: page, pageSize: pageSize, eventCode: "ADMIN_NOTIFICATION" })
			.then((res) => {
				const resp = res?.content?.map((item, index) => ({
					...item,
					notificationId: item.id,
					templateName: item?.metaInfo?.templateName,
					muserName: item?.userObject?.username,
					mfirstName: item?.userObject?.firstName,
					mlastName: item?.userObject?.lastName,
				}));

				setData(resp);
				setTotalEle(res.totalElements);
				setPagination({
					page: res?.pageable?.pageNumber,
					pageSize: res?.pageable?.pageSize,
				});
			})
			.catch((err) => console.error(err));
	}, []);

	const DeleteAlertApiCall = React.useCallback((data) => {
		deleteAlert(data)
			.then((res) => {
				setModalOpen(true);
				setModalData("Notification Deleted successfully", "success");
				NotificationListApiCall(0, 10);
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		NotificationListApiCall(0, 10);
	}, [NotificationListApiCall]);

	if (data) {
		return (
			<Container style={{ padding: "0px", margin: "auto" }} maxWidth='xl'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
							<Box>
								<Typography sx={{ fontWeight: 600, color: "gray", fontSize: "25px" }}>
									Notifications({totalEle})
								</Typography>
							</Box>
							<Tooltip
								title='Create Notification'
								arrow
								sx={{ bacground: "white", color: "black" }}>
								<IconButton onClick={() => navigate("/notification/create-notification")}>
									<Add color='primary' />
								</IconButton>
							</Tooltip>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px" }}>
							{data ? (
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
												page={pagination?.pagination?.page}
												pageSize={pagination?.pagination?.pageSize}
												onPageSizeChange={(event) => {
													setPagination({
														page: pagination?.pagination?.page,
														pageSize: event,
													});
													NotificationListApiCall(pagination?.pagination?.page, event);
												}}
												rowCount={pagination?.totalElement}
												rows={rows}
												columns={columns}
												paginationMode='server'
												// autoPageSize
												pagination
												onPageChange={(event) => {
													setPagination({
														page: event,
														pageSize: pagination?.pagination?.page,
													});
													NotificationListApiCall(event, pagination?.pagination?.pageSize);
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
										height: "50vh",
									}}>
									<CircularProgress />
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
						<Typography sx={{ fontSize: "20px" }}>
							<b>Are you sure to delete notification?</b>
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
									DeleteAlertApiCall(modal?.id);
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

export default NotificationList;
