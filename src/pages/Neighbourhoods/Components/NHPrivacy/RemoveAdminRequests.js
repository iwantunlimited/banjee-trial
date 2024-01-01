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
	approveRemoveAdminReq,
	approveRequestCommunity,
	rejectRemoveAdminReq,
	rejectRequestCommunity,
} from "../../services/apiServices";
import { PaginationContext } from "../../../../context/PaginationContext";
import { MainContext } from "../../../../context/Context";

function RemoveAdminRequests({ pendingData, refreshApi, RefreshMemberApiCall }) {
	const {
		setNHPrivacyPagination,
		nHPrivacyPagination: { nhPendingReqPage, nhPendingReqPageSize },
	} = useContext(PaginationContext);
	let rows = pendingData?.data ? pendingData?.data : [];
	const { setModalOpen, setModalData } = React.useContext(MainContext);

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
						src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${params?.row?.admin?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						alt={params?.row?.admin?.firstName}
					/>
				);
			},
		},
		{
			id: "2",
			field: "muserName",
			headerClassName: "app-header",
			headerName: "Full Name",
			flex: 0.25,
			renderCell: (params) => {
				if (params?.row?.admin?.firstName) {
					return params?.row?.admin?.firstName;
				} else {
					return "-";
				}
			},
		},
		{
			id: "3",
			field: "cloudId",
			headerClassName: "app-header",
			headerName: "Cloud Name",
			// align: "center",
			flex: 0.3,
			renderCell: (params) => {
				return params?.row?.cloudName;
			},
		},
		{
			id: "4",
			field: "requestedCount",
			headerClassName: "app-header",
			headerName: "Requested Count",
			align: "center",
			flex: 0.15,
			renderCell: (params) => {
				return params?.row?.removeRequestBy?.length;
			},
		},
		{
			id: "5",
			field: "reasons",
			headerClassName: "app-header",
			headerName: "Reasons",
			// align: "center",
			flex: 0.35,
			height: "auto",
			// width: 150,
			editable: true,
			renderCell: (params) => {
				return (
					<strong>
						<Stack direction={"column"} rowGap={1}>
							{params?.row?.reasons?.map((item, index) => (
								<Chip label={item} key={index} />
							))}
						</Stack>
					</strong>
				);
			},
		},
		// {
		// 	id: "6",
		// 	field: "requestBy",
		// 	headerClassName: "app-header",

		// 	headerName: "Request By",
		// 	// align: "center",
		// 	flex: 0.4,
		// 	renderCell: (params) => {
		// 		return params?.row?.users?.map((item) => `${item?.firstName}\n`);

		// 		// if (params?.row?.users?.length > 0) {
		// 		// 	return (
		// 		// 		<Box sx={{ flexDirection: "column", height: "100%" }}>
		// 		// 			{params?.row?.users?.map((item) => (
		// 		// 				<Typography>{item?.firstName}</Typography>
		// 		// 			))}
		// 		// 		</Box>
		// 		// 	);
		// 		// } else {
		// 		// 	return "-";
		// 		// }
		// 	},
		// },
		{
			id: "7",
			field: "id",
			headerClassName: "app-header",
			headerName: "Status",
			align: "center",
			flex: 0.3,
			renderCell: (params) => {
				// console.log("====================================");
				// console.log("8888", params);
				// console.log("====================================");
				return (
					<strong>
						<Stack direction='row' spacing={2}>
							<Chip
								label='Reject'
								style={{ background: "red", color: "white" }}
								onClick={(event) => {
									// navigate("/rooms/view/" + params.row.routingId);
									RejectApiCall(params?.row?.cloudId, params?.row?.id);
								}}
							/>
							<Chip
								label='Approve'
								style={{ background: "green", color: "white" }}
								onClick={(event) => {
									AcceptApiCall(params?.row?.cloudId, params?.row?.id);
									// navigate("/rooms/view/" + params.row.routingId);
									// ApproveApiCAll(params?.row?.routingId);
									// pendingAPiCAll(0, 10);
								}}
							/>
						</Stack>
					</strong>
				);
			},
		},
	];

	const AcceptApiCall = React.useCallback((cloudId, requestId) => {
		approveRemoveAdminReq(requestId)
			.then((res) => {
				// console.log("====================================");
				// console.log("community approve res", res);
				// console.log("====================================");
				setModalOpen(true);
				setModalData("Request Accepted");
				RefreshMemberApiCall();
				if (nhPendingReqPage === 0) {
					refreshApi();
				} else {
					setNHPrivacyPagination({
						from: "removeAdminRequest",
						page: 0,
						pageSize: 10,
					});
				}
			})
			.catch((err) => console.error("erro", err));
	}, []);

	const RejectApiCall = React.useCallback((cloudId, requestId) => {
		rejectRemoveAdminReq(requestId)
			.then((res) => {
				// console.log("====================================");
				// console.log("community reject res", res);
				// console.log("====================================");

				setModalOpen(true);
				setModalData("Request Rejected");
				if (nhPendingReqPage === 0) {
					refreshApi();
				} else {
					setNHPrivacyPagination({
						from: "removeAdminRequest",
						page: 0,
						pageSize: 10,
					});
				}
			})
			.catch((err) => console.error("erro", err));
	}, []);

	React.useEffect(() => {
		refreshApi();
	}, [refreshApi]);

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
								// maxHeight: "100%",
							}}>
							<DataGrid
								autoHeight
								getRowClassName={(params) => `app-header-${params?.row?.status}`}
								page={nhPendingReqPage}
								pageSize={nhPendingReqPageSize}
								onPageSizeChange={(event) => {
									setNHPrivacyPagination({
										from: "pendingRequest",
										page: nhPendingReqPage,
										pageSize: event,
									});
								}}
								rowCount={pendingData?.totalMembers}
								rows={rows}
								columns={columns}
								paginationMode='server'
								getRowHeight={(params) => {
									console.log("params", params?.model);
									if (params?.model?.removeRequestBy?.length < 2) {
										return 53;
									} else if (params?.model?.removeRequestBy?.length === 2) {
										return 100;
									} else if (params?.model?.removeRequestBy?.length === 3) {
										return 150;
									} else if (params?.model?.removeRequestBy?.length === 4) {
										return 200;
									} else {
										return 250;
									}
								}}
								pagination
								onPageChange={(event) => {
									setNHPrivacyPagination({
										from: "pendingRequest",
										page: event,
										pageSize: nhPendingReqPageSize,
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

export default RemoveAdminRequests;
