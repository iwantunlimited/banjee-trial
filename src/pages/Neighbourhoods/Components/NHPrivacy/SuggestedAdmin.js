import React, { useContext } from "react";
import {
	Card,
	Container,
	Typography,
	Box,
	Grid,
	Divider,
	Avatar,
	IconButton,
	Button,
	CircularProgress,
	Stack,
	Paper,
	Tooltip,
	Chip,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";
import moment from "moment";
import { Delete, Done, MoreHoriz, Visibility } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import {
	approveRequestCommunity,
	rejectRequestCommunity,
	sendLinkToUser,
} from "../../services/apiServices";
import { PaginationContext } from "../../../../context/PaginationContext";
import { MainContext } from "../../../../context/Context";

function SuggestedAdmin({ pendingData, handleModal, handleTabChange, SuggestedAdminApiCall }) {
	const {
		setNHPrivacyPagination,
		nHPrivacyPagination: { suggestedAdminPage, suggestedAdminPageSize },
	} = useContext(PaginationContext);
	const { setModalOpen, setModalData } = React.useContext(MainContext);
	let rows = pendingData?.data ? pendingData?.data : [];

	// console.log("====================================");
	// console.log("rows", rows);
	// console.log("====================================");

	const SendLinkApiCall = React.useCallback((userId, cloudId) => {
		sendLinkToUser({
			userId: userId,
			cloudId: cloudId,
		})
			.then((res) => {
				SuggestedAdminApiCall();
				setModalOpen(true);
				setModalData("Link send Successfully", "success");
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, []);

	let columns = [
		{
			id: "1",
			field: "mavatarUrl",
			headerClassName: "app-header",
			headerName: "Avatar",
			flex: 0.15,
			align: "center",
			renderCell: (params) => {
				return (
					<Avatar
						src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${params?.row?.profile?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						alt={params?.row?.profile?.firstName}
					/>
				);
			},
		},
		{
			id: "2",
			field: "muserName",
			headerClassName: "app-header",
			headerName: "Full Name",
			flex: 0.3,
			renderCell: (params) => {
				if (params?.row?.profile?.firstName) {
					return params?.row?.profile?.firstName;
				} else {
					return "-";
				}
			},
		},
		{
			id: "3",
			field: "mmcc",
			headerClassName: "app-header",
			headerName: "Mobile",
			// align: "center",
			flex: 0.3,
			renderCell: (params) => {
				if (params?.row?.profile?.mcc && params?.row?.profile?.mobile) {
					const number =
						params?.row?.profile?.mcc && params?.row?.profile?.mcc + " " + params?.row?.profile?.mobile;

					return number;
				} else if (params?.row?.profile?.mobile) {
					const number = params?.row?.profile?.mobile;
					return number;
				} else {
					return "-";
				}
			},
		},
		{
			id: "4",
			field: "memail",
			headerClassName: "app-header",
			headerName: "Email",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				return params?.row?.profile?.email;
			},
		},
		{
			id: "6",
			field: "id",
			headerClassName: "app-header",
			headerName: "Send Link",
			align: "center",
			flex: 0.4,
			renderCell: (params) => {
				// console.log("====================================");
				// console.log("8888", params);
				// console.log("====================================");
				return (
					<strong>
						<Stack direction='row' spacing={2}>
							{/* <Chip
								label='Reject'
								style={{ background: "red", color: "white" }}
								onClick={(event) => {
									// navigate("/rooms/view/" + params.row.routingId);
									RejectApiCall(params?.row?.cloudId, params?.row?.id);
								}}
							/> */}
							<Chip
								label='Send Link'
								color='success'
								// style={{ background: "green", color: "white" }}
								onClick={() => {
									SendLinkApiCall(params?.row?.userId, params?.row?.cloudId);
								}}
							/>
						</Stack>
					</strong>
				);
			},
		},
	];

	React.useEffect(() => {
		SuggestedAdminApiCall();
	}, [SuggestedAdminApiCall]);

	return (
		<Box>
			<Box>
				{pendingData?.totalMembers === 0 ? (
					<Typography style={{ textAlign: "center" }}>No Pending Request !</Typography>
				) : (
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
								page={suggestedAdminPage}
								pageSize={suggestedAdminPageSize}
								onPageSizeChange={(event) => {
									setNHPrivacyPagination({
										from: "suggestedAdmin",
										page: suggestedAdminPage,
										pageSize: event,
									});
								}}
								rowCount={pendingData?.totalMembers}
								rows={rows}
								columns={columns}
								paginationMode='server'
								// autoPageSize
								isRowSelectable={false}
								pagination
								onPageChange={(event) => {
									setNHPrivacyPagination({
										from: "suggestedAdmin",
										page: event,
										pageSize: suggestedAdminPageSize,
									});
								}}
								rowsPerPageOptions={[5, 10, 20]}
								className='dataGridFooter'
							/>
						</Box>
					</div>
				)}
			</Box>
		</Box>
	);
}

export default SuggestedAdmin;
