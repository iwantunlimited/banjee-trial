import { ArrowBack, Visibility } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	Divider,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { findNotificationById, sentNotificationList } from "../../ApiServices/apiServices";

function ViewAutoNotification() {
	const params = useParams();
	const navigate = useNavigate();

	const [data, setData] = React.useState("");
	const [sentNotificationData, setSentNotificationData] = React.useState("");
	const [pagination, setPagination] = React.useState("");
	const [totalNotifyUsers, setTotalNotifyUsers] = React.useState("");

	const [responseNull, setResponseNull] = React.useState(false);

	const DetailApiCall = React.useCallback(() => {
		findNotificationById(params?.id)
			.then((res) => {
				if (res === null) {
					setResponseNull(true);
				}
				setData(res);

				sentNotificationApiCall(res?.id);
			})
			.catch((err) => console.error(err));
	}, []);

	let rows = sentNotificationData ? sentNotificationData : [];

	let columns = [
		{
			id: "1",
			field: "durationType",
			headerClassName: "app-header",
			headerName: "Duration Type",
			flex: 0.4,
			// align: "center",
		},
		{
			id: "2",
			field: "inactivityType",
			headerClassName: "app-header",
			headerName: "Inactivity Type",
			flex: 0.4,
		},
		{
			id: "3",
			field: "clickAction",
			headerClassName: "app-header",
			headerName: "Click Action",
			// align: "center",
			flex: 0.4,
		},
		{
			id: "4",
			field: "userCount",
			headerClassName: "app-header",
			headerName: "User Count",
			// align: "center",
			flex: 0.25,
		},
		{
			id: "5",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				if (params.row && params.row?.createdOn) {
					const date = moment(params.row?.createdOn).format("lll");
					return date;
				} else {
					return "-";
				}
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
								// setModal({ open: true, data: params?.row, modalId: 2 });
								navigate("/notification/automation/notifyUsers", {
									state: {
										id: params?.row?.id,
									},
								});
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	const sentNotificationApiCall = React.useCallback((payload) => {
		sentNotificationList({ id: payload })
			.then((res) => {
				const resp = res?.map((item) => {
					return {
						...item,
						clickAction: item?.configObject?.clickAction,
						durationType: item?.configObject?.durationType,
						inactivityType: item?.configObject?.inactivityType,
						configCreatedOn: item?.configObject?.createdOn,
					};
				});
				setSentNotificationData(resp);
				setTotalNotifyUsers(res?.length);
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		DetailApiCall();
	}, [DetailApiCall]);

	if (data) {
		return (
			<Container maxWidth='lg'>
				<Grid item container spacing={2}>
					<Grid item xs={12}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBack color='primary' />
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px" }}>
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<Typography sx={{ fontSize: "22px", fontWeight: 600, color: "gray" }}>
									Auto Notification Information
								</Typography>
								<Button onClick={() => navigate("/notification/automation/update/" + data?.id)}>
									update
								</Button>
							</Box>
							<Box sx={{ marginY: "5px" }}>
								<Divider />
							</Box>
							<Box>
								<Typography sx={{ fontSize: "22px", fontWeight: 600 }}>{data?.title}</Typography>
								{data?.description && (
									<Typography>
										<span>
											<b>Description: </b>
										</span>
										{data?.description}
									</Typography>
								)}
								{data?.clickAction && (
									<Typography>
										<span>
											<b>Click Action: </b>
										</span>
										{data?.clickAction}
									</Typography>
								)}
								{data?.inactivityType && (
									<Typography>
										<span>
											<b>Inactivity Type: </b>
										</span>
										{data?.inactivityType}
									</Typography>
								)}
								{data?.durationType && (
									<Typography>
										<span>
											<b>Duration Type: </b>
										</span>
										{data?.durationType}
									</Typography>
								)}
							</Box>
							<Card sx={{ margin: 1, padding: 1 }}>
								<Typography sx={{ color: "#6b778c", fontSize: "22px", fontWeight: "500" }}>
									Notification List
								</Typography>
								<Divider sx={{ marginY: 1 }} />
								<div style={{ width: "100%" }}>
									<Box
										className='root'
										sx={
											{
												// "& .app-header-live": {
												// 	bgcolor: "#76e060",
												// },
											}
										}>
										<DataGrid
											autoHeight
											// getRowClassName={(params) => `app-header-${params.row.status}`}
											page={pagination?.page}
											pageSize={pagination?.pageSize}
											onPageSizeChange={(event) => {
												setPagination((prev) => ({
													...prev,
													page: pagination?.page,
													pageSize: event,
												}));
											}}
											rowCount={totalNotifyUsers}
											rows={rows}
											columns={columns}
											paginationMode='server'
											// autoPageSize
											pagination
											onPageChange={(event) => {
												setPagination((prev) => ({
													...prev,
													page: event,
													pageSize: pagination?.pageSize,
												}));
											}}
											rowsPerPageOptions={[5, 10, 20]}
											className='dataGridFooter'
										/>
									</Box>
								</div>
							</Card>
						</Card>
					</Grid>
				</Grid>
			</Container>
		);
	} else {
		return (
			<Box
				sx={{
					width: "100%",
					height: "80vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				{responseNull ? <Typography>No Data Available !</Typography> : <CircularProgress />}
			</Box>
		);
	}
}

export default ViewAutoNotification;
