import React from "react";
import {
	Card,
	Container,
	Typography,
	Box,
	Grid,
	Divider,
	TextField,
	Select,
	Avatar,
	IconButton,
	Button,
	Modal,
	MenuItem,
	InputLabel,
	FormControl,
	CircularProgress,
	Stack,
} from "@mui/material";
import {
	deleteNeighbourhood,
	filterMembers,
	filterNeighbourhood,
	findNeighbourhood,
	updateNeighbourhood,
} from "../../services/apiServices";
import { useNavigate, useParams } from "react-router";
import MyGoogleMap from "../../Map/GoogleMap";
import UserLocation from "../../../Users/components/UserLocation";
import moment from "moment";
import { ArrowBack, Cancel, Visibility } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import ModalComp from "../../../../CustomComponents/ModalComp";
import { useTheme } from "@mui/material/styles";
import { MainContext } from "../../../../context/Context";

function DetailPage() {
	const params = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const { setModalOpen, setModalData } = React.useContext(MainContext);
	const [state, setState] = React.useState();

	const [modal, setModal] = React.useState({
		modalId: 1,
		open: false,
		data: "",
	});
	const [members, setMembers] = React.useState({
		data: [],
		pagination: {
			page: 0,
			pageSize: 10,
		},
		totalMembers: 0,
	});

	function handleModal(data) {
		setModal((prev) => ({
			...prev,
			open: data,
			modalId: 1,
			data: "",
		}));
	}

	const deleteAlertApiCall = React.useCallback((id) => {
		deleteNeighbourhood(id)
			.then((res) => {
				navigate(-1);
				setModal((prev) => ({
					...prev,
					open: false,
					modalId: 1,
					data: "",
				}));
				console.log(res);
				setModalOpen(true);
				setModalData("neighbourhood deleted", "success");
			})
			.catch((err) => console.warn(err));
	}, []);

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
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("L");
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
			flex: 0.3,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								setModal({ open: true, data: params?.row, modalId: 2 });
								// navigate("/neighbourhood/detail/" + params?.row?.routingId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	const ApiCall = React.useCallback(() => {
		findNeighbourhood(params?.id)
			.then((res) => {
				setState(res);
			})
			.catch((err) => console.error(err));
	}, []);

	const filterMemberApiCall = React.useCallback((page, pageSize) => {
		filterMembers({ cloudId: params?.id, page: page, pageSize: pageSize })
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
					pagination: {
						page: res?.pageable?.pageNumber,
						pageSize: res?.pageable?.pageSize,
					},
				}));
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		ApiCall();
		filterMemberApiCall(0, 10);
	}, [ApiCall, filterMemberApiCall]);

	if (state) {
		return (
			<Container maxWidth='lg' style={{ padding: "0px", margin: "auto" }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBack style={{ color: theme.palette.primary.main }} />
					</IconButton>
					<Stack spacing={1} direction='row'>
						<Button
							variant='contained'
							onClick={() => {
								setModal(() => ({
									open: true,
									modalId: 1,
									data: params?.id,
								}));
							}}>
							Delete
						</Button>
						<Button
							variant='contained'
							onClick={() => {
								navigate("/neighbourhood/update/" + params.id);
							}}>
							Edit
						</Button>
					</Stack>
				</Box>
				<Card sx={{ padding: "20px" }}>
					<Grid item container xs={12}>
						<Grid item xs={12} sm={12}>
							<Box sx={{ display: "flex", alignItems: "center", paddingY: "20px" }}>
								<Box>
									<Avatar
										// src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${state?.imageUrl}.png`}
										src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${state?.imageUrl}.png`}
										// src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${state?.imageUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
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
									{state?.countryName && <Typography>{state?.countryName}</Typography>}
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
												page={members?.pagination?.page}
												pageSize={members?.pagination?.pageSize}
												onPageSizeChange={(event) => {
													setMembers((prev) => ({
														...prev,
														pagination: {
															page: members?.pagination?.page,
															pageSize: event,
														},
													}));
													filterMemberApiCall(members?.pagination?.page, event);
												}}
												rowCount={members?.pagination?.totalMembers}
												rows={rows}
												columns={columns}
												paginationMode='server'
												// autoPageSize
												pagination
												onPageChange={(event) => {
													setMembers((prev) => ({
														...prev,
														pagination: {
															page: event,
															pageSize: members?.pagination?.page,
														},
													}));
													filterMemberApiCall(event, members?.pagination?.page);
												}}
												rowsPerPageOptions={[5, 10, 20]}
												className='dataGridFooter'
											/>
										</Box>
									</div>
								</Box>
							</Card>
						</Grid>
						<Grid item xs={12}>
							<Card
								sx={{
									padding: "10px",
									borderRadius: "0px",
								}}>
								<Box sx={{ p: 1 }}>
									<Typography sx={{ fontSize: "20px", fontWeight: 500, color: "gray" }}>
										Neighbourhood Location
									</Typography>
									<Divider />
								</Box>
								{state && (
									<Box>
										<UserLocation
											data={{
												name: state?.name,
												currentLocation: {
													lat: state?.geoLocation?.coordinates[1],
													lon: state?.geoLocation?.coordinates[0],
												},
												zoom: 15,
											}}
										/>
									</Box>
								)}
							</Card>
						</Grid>
					</Grid>
				</Card>
				{modal?.modalId === 2 ? (
					<ModalComp handleModal={handleModal} data={modal}>
						<IconButton
							onClick={() => handleModal(false)}
							style={{ position: "absolute", top: "0px", right: "0px" }}>
							<Cancel sx={{ color: "brown" }} />
						</IconButton>
						<Box
							elevation={1}
							style={{
								boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
								padding: "40px 10px 40px 10px",
								background: "white ",
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
									src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${modal?.data?.mavtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
									alt={modal?.data?.muserName}
									sx={{ width: "150px", height: "150px" }}
								/>
								{/* <Avatar
								alt={
									modal?.data?.mfirstName?.length > 0
										? modal?.data?.mfirstName?.slice(0, 1)
										: "A"
								}
								// src={
								// 	"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
								// 	modal?.data?.mavatarUrl
								// }
								src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${modal?.data?.mavatarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
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
									{modal?.data?.firstName && (
										<Typography variant='h6' style={{ marginRight: "5px" }}>
											{modal?.data?.mfirstName + " " + modal?.data?.mlastName}
										</Typography>
									)}
								</div>
								<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
									{window.innerWidth > 1282
										? modal?.data?.memail
										: modal?.data?.memail && modal?.data?.memail.slice(0, 20)}
								</Typography>
								{window.innerWidth < 1282 && modal && modal?.data?.memail?.length > 10 && (
									<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
										{modal?.data?.memail?.slice(20, modal?.data?.memail?.length + 1)}
									</Typography>
								)}
								<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
									{modal?.data?.mmcc
										? +modal?.data?.mmcc + " " + modal?.data?.mmobile
										: modal?.data?.mmobile}
								</Typography>
							</Box>
						</Box>
					</ModalComp>
				) : (
					<ModalComp handleModal={handleModal} data={modal}>
						<Box>
							<Typography>
								<b>Are you sure to delete the neighbourhood ?</b>
							</Typography>
							<Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
								<Button variant='outlined' onClick={() => handleModal(false)}>
									Cancel
								</Button>
								<Button
									variant='contained'
									sx={{ marginLeft: "20px" }}
									onClick={() => {
										deleteAlertApiCall(modal?.data);
									}}>
									Confirm
								</Button>
							</Box>
						</Box>
					</ModalComp>
				)}
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
export default DetailPage;
