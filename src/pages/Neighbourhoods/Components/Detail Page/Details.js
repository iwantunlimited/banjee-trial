import React from "react";
import {
	Card,
	Container,
	Typography,
	Box,
	Grid,
	Divider,
	Avatar,
	IconButton,
	Modal,
} from "@mui/material";
import { filterMembers, filterNeighbourhood, findNeighbourhood } from "../../services/apiServices";
import { useNavigate, useParams } from "react-router";
import MyGoogleMap from "../../Map/GoogleMap";
import UserLocation from "../../../Users/components/UserLocation";
import moment from "moment";
import { ArrowBack, Cancel, Visibility } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

function DetailPage() {
	const params = useParams();
	const navigate = useNavigate();
	const [state, setState] = React.useState();
	const [modalData, setModalData] = React.useState({
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

	console.log("====================================");
	console.log("members ------", members);
	console.log("====================================");

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
				return fullName;
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
								setModalData({ open: true, data: params?.row });
								// navigate("/neighbourhood/detail/" + params?.row?.routingId);
								console.log(params);
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
				console.log("====================================");
				console.log("find neighbour api call", res);
				console.log("====================================");
			})
			.catch((err) => console.log(err));
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
				// console.log("====================================");
				// console.log("members response", res);
				// console.log("====================================");
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		ApiCall();
		filterMemberApiCall(0, 10);
	}, [ApiCall, filterMemberApiCall]);

	return (
		<Container maxWidth='lg' style={{ padding: "0px", margin: "auto" }}>
			<IconButton onClick={() => navigate(-1)}>
				<ArrowBack style={{ color: "#1976d2" }} />
			</IconButton>
			<Card sx={{ p: 2 }}>
				<Grid item container xs={12}>
					<Grid item xs={12} sm={12}>
						<Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
							<Box>
								<Avatar
									src={state?.imageUrl}
									alt={state?.name}
									style={{ width: "150px", height: "150px" }}
								/>
							</Box>
							<Box sx={{ ml: 4 }}>
								<Typography sx={{ fontSize: "26px" }}>{state?.name}</Typography>
								<Typography sx={{ fontSize: "12px" }}>
									{moment(state?.createdOn).format("lll")}
								</Typography>
								<Typography>{state?.countryName}</Typography>
								<Typography>{"Total Members: " + state?.totalMembers}</Typography>
								<Typography>{state?.description}</Typography>
							</Box>
						</Box>
					</Grid>
					<Grid item xs={12} sm={12}>
						<Card sx={{ p: 2, borderRadius: "0px" }}>
							<Box sx={{ pb: 1 }}>
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
											page={members?.data?.pagination?.page}
											pageSize={members?.data?.pagination?.pageSize}
											onPageSizeChange={(event) => {
												setMembers((prev) => ({
													...prev,
													pagination: {
														page: members?.data?.pagination?.page,
														pageSize: event,
													},
												}));
												filterMemberApiCall(members?.data?.pagination?.page, event);
											}}
											rowCount={members?.data?.pagination?.totalMembers}
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
														pageSize: members?.data?.pagination?.page,
													},
												}));
												filterMemberApiCall(event, members?.data?.pagination?.page);
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
								p: 1,
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
												lat: state?.geoLocation?.coordinates[0],
												lon: state?.geoLocation?.coordinates[1],
											},
										}}
									/>
								</Box>
							)}
						</Card>
					</Grid>
				</Grid>
			</Card>
			<Modal
				open={modalData?.open}
				onClose={() => setModalData({ open: false, data: "" })}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						// border: "2px solid #000",
						boxShadow: 24,
						p: 4,
					}}>
					<Box sx={{ position: "relative" }}>
						<IconButton
							onClick={() => setModalData({ open: false, data: "" })}
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
									alt={
										modalData?.data?.mfirstName?.length > 0
											? modalData?.data?.mfirstName?.slice(0, 1)
											: "A"
									}
									src={
										"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
										modalData?.data?.mavtarUrl
									}
									sx={{ width: 150, height: 150 }}
								/>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										marginTop: "10px",
										fontSize: "10px",
										fontWeight: "400",
									}}>
									<Typography variant='h6' style={{ marginRight: "5px" }}>
										{modalData?.data?.mfirstName + " " + modalData?.data?.mlastName}
									</Typography>
									{/* {state?.gender && (
									<div>
										{state?.gender.toLowerCase() === "male" ? (
											<Male style={{ color: "blue" }} />
										) : state?.gender.toLowerCase() === "female" ? (
											<Female style={{ color: "#B73BA4" }} />
										) : (
											<Transgender style={{ color: "rgb(246,191,188)" }} />
										)}
									</div>
								)} */}
								</div>
								<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
									{window.innerWidth > 1282
										? modalData?.data?.memail
										: modalData?.data?.memail && modalData?.data?.memail.slice(0, 20)}
								</Typography>
								{window.innerWidth < 1282 && modalData && modalData?.data?.memail.length > 10 && (
									<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
										{modalData?.data?.memail?.slice(20, modalData?.data?.memail.length + 1)}
									</Typography>
								)}
								<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
									{modalData?.data?.mmcc
										? +modalData?.data?.mmcc + " " + modalData?.data?.mmobile
										: modalData?.data?.mmobile}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Box>
			</Modal>
		</Container>
	);
}
export default DetailPage;
