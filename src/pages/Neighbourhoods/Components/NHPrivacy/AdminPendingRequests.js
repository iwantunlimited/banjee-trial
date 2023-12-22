import React, { useState } from "react";
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
import AdminVerificationModal from "../../../../CustomComponents/AdminVerificationModal";
import { adminVerificationApi } from "../../services/apiServices";
import { MainContext } from "../../../../context/Context";

function AdminPendingRequests({
	pendingData,
	adminPendingPagination,
	handlePagination,
	handleModal,
	handleTabChange,
	AdminRequestApiCall,
	RefreshMemberApiCall,
}) {
	const { setModalData, setModalOpen } = React.useContext(MainContext);
	const [AdminVerificationModalOpen, setAdminVerificationModalOpen] = useState({
		open: false,
		data: "",
	});
	let rows = pendingData?.data ? pendingData?.data : [];

	// console.log("====================================");
	// console.log("rows", rows);
	// console.log("====================================");

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
			flex: 0.3,
			renderCell: (params) => {
				return params?.row?.profile?.email;
			},
		},
		{
			id: "5",
			field: "neighbourhoodname",
			headerClassName: "app-header",
			headerName: "Neighbourhood Name",
			// align: "center",
			flex: 0.5,
			renderCell: (params) => {
				return params?.row?.payload?.name;
			},
		},
		{
			id: "6",
			field: "id",
			headerClassName: "app-header",
			headerName: "View",
			align: "center",
			flex: 0.2,
			renderCell: (params) => {
				return (
					<React.Fragment>
						{/* <strong>
							<Stack direction='row' spacing={2}>
								<Chip
									label='Reject'
									style={{ background: "red", color: "white" }}
									onClick={(event) => {
										// navigate("/rooms/view/" + params.row.routingId);
										handleModal({
											open: true,
											data: params?.row?.userId,
											event: event,
										});
									}}
								/>
								<Chip
									label='Approve'
									style={{ background: "green", color: "white" }}
									onClick={(event) => {
										// navigate("/rooms/view/" + params.row.routingId);
										// ApproveApiCAll(params?.row?.routingId);
										// pendingAPiCAll(0, 10);
									}}
								/>
							</Stack>
						</strong> */}
						<IconButton
							onClick={() =>
								setAdminVerificationModalOpen((prev) => ({
									...prev,
									open: true,
									data: params?.row,
								}))
							}>
							<Visibility />
						</IconButton>
					</React.Fragment>
				);
			},
		},
	];

	const AdminAcceptApiCall = React.useCallback((accept, cloudId, userId) => {
		adminVerificationApi({
			verified: accept,
			cloudId: cloudId,
			userId: userId,
			...(accept ? {} : { reUpload: true }),
		})
			.then((res) => {
				// console.log("====================================");
				// console.log("admin verification accept", res);
				// console.log("====================================");
				setModalOpen(true);
				setModalData(
					accept ? "Admin Verified" : "Request send successfully for re-verification ",
					"success"
				);
				setAdminVerificationModalOpen({
					open: false,
					data: "",
				});
				AdminRequestApiCall();
				RefreshMemberApiCall();
			})
			.catch((error) => {
				console.error("error", error);
				setModalOpen(true);
				setModalData("Something went wrong", "error");
			});
	}, []);

	const PermenentRejectAdminApi = React.useCallback((cloudId, userId) => {
		adminVerificationApi({
			cloudId: cloudId,
			userId: userId,
			verificationRejection: true,
		})
			.then((res) => {
				// console.log("====================================");
				// console.log("PermenentRejectAdminApi", res);
				// console.log("====================================");
				setModalData("Request Rejected Successfully", "success");
				setAdminVerificationModalOpen({
					open: false,
					data: "",
				});
				AdminRequestApiCall();
			})
			.catch((error) => console.error("error", error));
	}, []);

	React.useEffect(() => {
		AdminRequestApiCall();
	}, [AdminRequestApiCall]);

	return (
		<Box>
			{AdminVerificationModalOpen && (
				<AdminVerificationModal
					open={AdminVerificationModalOpen?.open}
					handleModal={(data) =>
						setAdminVerificationModalOpen((prev) => ({
							...prev,
							open: data,
						}))
					}
					data={AdminVerificationModalOpen?.data}
					AdminAcceptApiCall={AdminAcceptApiCall}
					PermenentRejectAdminApi={PermenentRejectAdminApi}
				/>
			)}
			<Box>
				{/* {pendingData?.totalMembers === 0 ? (
					<Typography style={{ textAlign: "center" }}>No Pending Request !</Typography>
				) : ( */}
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
							page={adminPendingPagination?.page}
							pageSize={adminPendingPagination?.pageSize}
							onPageSizeChange={(event) => {
								handlePagination({
									page: adminPendingPagination?.page,
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
								handlePagination({
									page: event,
									pageSize: adminPendingPagination?.pageSize,
								});
							}}
							rowsPerPageOptions={[5, 10, 20]}
							className='dataGridFooter'
						/>
					</Box>
				</div>
				{/* )} */}
			</Box>
		</Box>
	);
}

export default AdminPendingRequests;
