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
import { approveRequestCommunity, rejectRequestCommunity } from "../../services/apiServices";
import { PaginationContext } from "../../../../context/PaginationContext";
import { MainContext } from "../../../../context/Context";

function GeneralPendingMemberRequests({ pendingData, handleTabChange, refreshApi }) {
	const {
		setNHPrivacyPagination,
		nHPrivacyPagination: { generalMemberRequestPage, generalMemberRequestPageSize },
	} = useContext(PaginationContext);
	const { setModalOpen, setModalData } = React.useContext(MainContext);
	let rows = pendingData?.data ? pendingData?.data : [];
	const navigate = useNavigate();

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
						src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${params?.row?.userDetails?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						alt={params?.row?.userDetails?.firstName}
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
				if (params?.row?.userDetails?.firstName) {
					return params?.row?.userDetails?.firstName;
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
				if (params?.row?.userDetails?.mcc && params?.row?.userDetails?.mobile) {
					const number =
						params?.row?.userDetails?.mcc &&
						params?.row?.userDetails?.mcc + " " + params?.row?.userDetails?.mobile;

					return number;
				} else if (params?.row?.userDetails?.mobile) {
					const number = params?.row?.userDetails?.mobile;
					return number;
				} else {
					return "-";
				}
			},
		},
		{
			id: "4",
			field: "neighbourhood",
			headerClassName: "app-header",
			headerName: "Neighbourhood Name",
			// align: "center",
			flex: 0.5,
			renderCell: (params) => {
				return params?.row?.cloudName;
			},
		},
		{
			id: "4",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.25,
			renderCell: (params) => {
				if (params?.row && params?.row?.createdOn) {
					const date = moment(params?.row?.createdOn).format("DD/MM/YYYY");
					return date;
				} else {
					return "-";
				}
			},
		},
		{
			id: "6",
			field: "id",
			headerClassName: "app-header",
			headerName: "Status",
			align: "center",
			flex: 0.3,
			renderCell: (params) => {
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
		{
			id: 7,
			field: "View",
			headerClassName: "app-header",
			headerName: "View",
			flex: 0.15,
			renderCell: (params) => (
				<strong>
					<IconButton
						onClick={() => {
							// navigate(`/user/${params?.row?.userObject?.id}`);
							navigate("/user/" + params?.row?.userDetails?.id);
							// this.props.history.push(
							// 	this.props.location.pathname +
							// 		"/view/" +
							// 		params.row.userObject.id
							// );
						}}>
						<Visibility />
					</IconButton>
				</strong>
			),
		},
	];

	const AcceptApiCall = React.useCallback((cloudId, requestId) => {
		approveRequestCommunity({
			cloudId: cloudId,
			requestId: requestId,
		})
			.then((res) => {
				setModalOpen(true);
				setModalData("Request Accepted Successfully", "success");
				if (generalMemberRequestPage === 0) {
					refreshApi();
				} else {
					setNHPrivacyPagination({
						from: "generalMemberRequest",
						page: 0,
						pageSize: 10,
					});
				}
			})
			.catch((err) => console.error("erro", err));
	}, []);

	const RejectApiCall = React.useCallback((cloudId, requestId) => {
		rejectRequestCommunity({
			cloudId: cloudId,
			requestId: requestId,
		})
			.then((res) => {
				setModalOpen(true);
				setModalData("Request Rejected Successfully", "success");
				if (generalMemberRequestPage === 0) {
					refreshApi();
				} else {
					setNHPrivacyPagination({
						from: "generalMemberRequest",
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
							}}>
							<DataGrid
								autoHeight
								getRowClassName={(params) => `app-header-${params.row.status}`}
								page={generalMemberRequestPage}
								pageSize={generalMemberRequestPageSize}
								onPageSizeChange={(event) => {
									setNHPrivacyPagination({
										from: "pendingRequest",
										page: generalMemberRequestPage,
										pageSize: event,
									});
								}}
								rowCount={pendingData?.totalMembers}
								rows={rows}
								columns={columns}
								paginationMode='server'
								// autoPageSize
								pagination
								onPageChange={(event) => {
									setNHPrivacyPagination({
										from: "pendingRequest",
										page: event,
										pageSize: generalMemberRequestPageSize,
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

export default GeneralPendingMemberRequests;
