import { Cancel, Visibility, ArrowBack, Delete } from "@mui/icons-material";
import {
	Avatar,
	Box,
	CircularProgress,
	Container,
	Divider,
	Grid,
	Typography,
	Card,
	Button,
	IconButton,
	Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { MainContext } from "../../../context/Context";
import ModalComp from "../../../CustomComponents/ModalComp";
import { filterMembers } from "../../Neighbourhoods/services/apiServices";
import { deleteCommunity, findCommunityById } from "../services/apiServices";

function GroupDetailPage(props) {
	const params = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const { themeData } = React.useContext(MainContext);

	const [state, setState] = React.useState();

	const [modalId, setModalId] = React.useState("view");

	const [modalData, setModalData] = React.useState({
		open: false,
		data: "",
	});
	const [members, setMembers] = React.useState({
		data: [],
		totalMembers: 0,
	});
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	const handlePagination = (data) => {
		setPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	};

	const handleModal = (data) => {
		setModalData((prev) => ({
			...prev,
			open: data,
		}));
	};

	let rows = members?.data ? members?.data : [];

	let columns = [
		{
			id: "1",
			field: "mavatarUrl",
			headerClassName: "app-header",
			headerName: "Avatar",
			flex: 0.2,
			align: "center",

			renderCell: (params) => {
				return (
					<Avatar
						src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${params.row.mavtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						alt={params.row.muserName}
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
				const fullName = params?.row?.mfirstName + " " + params?.row?.mlastName;
				if (params?.row?.mfirstName && params?.row?.mlastName) {
					return fullName;
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
				if (params?.row?.mmcc) {
					const number = params?.row?.mmcc && params?.row?.mmcc + " " + params?.row?.mmobile;

					return number;
				} else {
					const number = params?.row?.mmobile;
					return number;
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
		},
		{
			id: "5",
			field: "role",
			headerClassName: "app-header",
			headerName: "Role",
			// align: "center",
			flex: 0.3,
		},
		{
			id: "6",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("ll");
					return date;
				} else {
					return "-";
				}
			},
		},
		{
			id: "7",
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
								setModalData({ open: true, data: params?.row });
								// navigate("/neighbourhood/" + params?.row?.routingId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	const ApiCall = React.useCallback(() => {
		findCommunityById(params?.id)
			.then((res) => {
				setState(res);
			})
			.catch((err) => console.error(err));
	}, []);

	const filterMemberApiCall = React.useCallback(() => {
		filterMembers({ cloudId: params?.id, page: pagination?.page, pageSize: pagination?.pageSize })
			.then((res) => {
				const resp = res?.content?.map((item, index) => ({
					...item,
					muserName: item?.profile?.username,
					mavtarUrl: item?.profile?.avtarUrl,
					memail: item?.profile?.email,
					mmcc: item?.profile?.mcc,
					mmobile: item?.profile?.mobile,
					mfirstName: item?.profile?.firstName,
					mlastName: item?.profile?.lastName,
				}));
				setMembers((prev) => ({
					...prev,
					data: resp,
					totalMembers: res?.totalElements,
				}));
			})
			.catch((err) => console.error(err));
	}, [pagination]);

	const DeleteCommunityApiCall = React.useCallback((payload) => {
		deleteCommunity(payload)
			.then((res) => {
				setModalId("view");
				navigate(-1);
				console.log("====================================");
				console.log(res);
				console.log("====================================");
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		ApiCall();
	}, [ApiCall]);

	React.useEffect(() => {
		filterMemberApiCall();
	}, [filterMemberApiCall]);

	// console.log("====================================");
	// console.log(modalData);
	// console.log("====================================");

	if (state) {
		return (
			<Container maxWidth='lg' style={{ padding: "0px", margin: "auto" }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBack style={{ color: theme.palette.primary.main }} />
					</IconButton>
					<IconButton
						onClick={() => {
							setModalId("delete");
							setModalData((prev) => ({
								...prev,
								open: true,
								id: params?.id,
							}));
						}}>
						<Delete />
					</IconButton>
					{/* <Button
						variant='contained'
						onClick={() => {
							navigate("/groups/update/" + params.id);
						}}>
						Edit
					</Button> */}
				</Box>
				<Card sx={{ padding: "20px" }}>
					<Grid item container xs={12}>
						<Grid item xs={12} sm={12}>
							<Box sx={{ display: "flex", alignItems: "center", paddingY: "20px" }}>
								<Box>
									<Avatar
										// src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${state?.imageUrl}.png`}
										src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${state?.imageUrl}.png`}
										alt={state?.name}
										style={{
											width: window.innerWidth < 500 ? "70px" : "150px",
											height: window.innerWidth < 500 ? "70px" : "150px",
										}}
									/>
								</Box>
								<Box sx={{ marginLeft: "40px" }}>
									{state?.name && (
										<Typography sx={{ fontSize: { xs: "22px", md: "26px" } }}>
											{state?.name}
										</Typography>
									)}
									{state?.createdOn && (
										<Typography sx={{ fontSize: "12px" }}>
											{moment(state?.createdOn).format("lll")}
										</Typography>
									)}
									{state?.cloudType && <Typography>{"Cloud Type: " + state?.cloudType}</Typography>}
									{state?.categoryName && (
										<Typography>{"Category Name: " + state?.categoryName}</Typography>
									)}
									{state?.totalMembers && (
										<Typography>{"Total Members: " + state?.totalMembers}</Typography>
									)}
									<Typography>{state?.description}</Typography>
								</Box>
							</Box>
						</Grid>
						<Grid item xs={12} sm={12}>
							<Card sx={{ padding: "20px", borderRadius: "0px" }}>
								<Box sx={{ paddingBottom: "10px" }}>
									<Typography sx={{ fontSize: "20px", color: "gray", fontWeight: "600" }}>
										Total Members({state?.totalMembers})
									</Typography>
									<Divider />
								</Box>
								<Box>
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
													setPagination((prev) => ({
														...prev,
														page: pagination?.page,
														pageSize: event,
													}));
												}}
												rowCount={members?.totalMembers}
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
								</Box>
							</Card>
						</Grid>
					</Grid>
				</Card>
				<ModalComp handleModal={handleModal} data={modalData}>
					{modalId === "view" ? (
						<React.Fragment>
							<IconButton
								onClick={() => handleModal(false)}
								style={{ position: "absolute", top: "0px", right: "0px" }}>
								<Cancel sx={{ color: "brown" }} />
							</IconButton>
							<Card
								elevation={1}
								style={{
									boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
									padding: "40px 10px 40px 10px",
									// background: "white ",
									minHeight: "420px",
								}}>
								<Box
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										flexDirection: "column",
										padding: "0 10px 0 10px",
									}}>
									<Avatar
										src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${modalData?.data?.mavtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
										alt={modalData?.data?.profile?.avtarUrl}
										sx={{ width: "150px", height: "150px" }}
									/>
									{/* <Avatar
								alt={
									modalData?.data?.mfirstName?.length > 0
										? modalData?.data?.mfirstName?.slice(0, 1)
										: "A"
								}
								// src={
								// 	"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
								// 	modalData?.data?.mavatarUrl
								// }
								src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${modalData?.data?.mavatarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
								sx={{ width: "150px", height: "150px" }}
							/> */}
									<div
										style={{
											display: "flex",
											alignItems: "center",
											marginTop: "10px",
											fontSize: "10px",
											fontWeight: "400",
										}}>
										{modalData?.data?.profile?.firstName && (
											<Typography variant='h6' style={{ marginRight: "5px" }}>
												{modalData?.data?.profile?.firstName +
													" " +
													modalData?.data?.profile?.lastName}
											</Typography>
										)}
									</div>
									<Typography
										style={{ marginTop: "5px", color: themeData ? "default" : "grey" }}
										variant='h6'>
										{window.innerWidth > 1282
											? modalData?.data?.profile?.email
											: modalData?.data?.profile?.email &&
											  modalData?.data?.profile?.email.slice(0, 20)}
									</Typography>
									{window.innerWidth < 1282 &&
										modalData &&
										modalData?.data?.profile?.email?.length > 10 && (
											<Typography
												style={{ marginTop: "5px", color: themeData ? "default" : "grey" }}
												variant='h6'>
												{modalData?.data?.profile?.email?.slice(
													20,
													modalData?.data?.profile?.email?.length + 1
												)}
											</Typography>
										)}
									<Typography
										style={{ marginTop: "5px", color: themeData ? "default" : "grey" }}
										variant='h6'>
										{modalData?.data?.profile?.mcc
											? +modalData?.data?.profile?.mcc + " " + modalData?.data?.profile?.mobile
											: modalData?.data?.profile?.mobile}
									</Typography>
								</Box>
							</Card>
						</React.Fragment>
					) : (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								flexDirection: "column",
								alignItems: "center",
							}}>
							<Typography sx={{ fontSize: { xs: "16px", sm: "16px", md: "18px" } }}>
								<b>Are you sure to Delete Community ?</b>
							</Typography>
							<Stack spacing={2} direction={"row"} sx={{ marginTop: { xs: 1, md: 2 } }}>
								<Button
									onClick={() => {
										setModalData((prev) => ({
											...prev,
											open: false,
											id: "",
										}));
									}}>
									Cancel
								</Button>
								<Button
									variant='contained'
									onClick={() => {
										DeleteCommunityApiCall(modalData?.id);
									}}>
									Confirm
								</Button>
							</Stack>
						</Box>
					)}
				</ModalComp>
			</Container>
		);
	} else {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					width: "100%",
				}}>
				<CircularProgress color='primary' />
			</Box>
		);
	}
}

export default GroupDetailPage;
