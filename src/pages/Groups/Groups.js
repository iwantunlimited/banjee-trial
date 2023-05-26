import { Delete, Refresh, Visibility } from "@mui/icons-material";
import {
	Container,
	Grid,
	IconButton,
	Card,
	CircularProgress,
	Box,
	Tooltip,
	Typography,
	Stack,
	Button,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { Helmet } from "react-helmet";
import { communityList, deleteCommunity } from "./services/apiServices";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router";
import { MainContext } from "../../context/Context";
import { PaginationContext } from "../../context/PaginationContext";
import ModalComp from "../../CustomComponents/ModalComp";

function GroupsComp(props) {
	const navigate = useNavigate();
	const { themeData, setModalData, setModalOpen } = React.useContext(MainContext);
	const { groupPagination, setGroupPagination } = React.useContext(PaginationContext);
	const [listData, setListData] = React.useState("");
	const [totalElement, setTotalElement] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		page: groupPagination?.page ? groupPagination?.page : 0,
		pageSize: groupPagination?.pageSize ? groupPagination?.pageSize : 10,
	});
	const [modal, setModal] = React.useState({
		open: false,
		id: "",
	});

	const handleModalClose = () => {
		setModal({
			open: false,
			id: "",
		});
	};

	const handlePagination = (data) => {
		setPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	};

	const CommunityListApiCall = React.useCallback(() => {
		communityList({ page: pagination?.page, pageSize: pagination?.pageSize })
			.then((res) => {
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						...ele,
						// ...ele?.name,
						// ...ele?.createdOn,
					};
				});
				setListData(resp);
				setTotalElement(res?.totalElements);
			})
			.catch((err) => console.error(err));
	}, [pagination]);

	const DeleteCommunityApiCall = React.useCallback((payload) => {
		deleteCommunity(payload)
			.then((res) => {
				setModalOpen(true);
				setModalData("Community Deleted", "success");
				CommunityListApiCall();
				setModal((prev) => ({
					...prev,
					open: false,
					id: "",
				}));
			})
			.catch((err) => {
				console.error(err);
				setModalOpen(true);
				setModalData({
					message: "Something went wrong, try again later !",
					severity: "error",
				});
			});
	}, []);

	React.useEffect(() => {
		CommunityListApiCall();
	}, [CommunityListApiCall]);

	let rows = listData ? listData : [];

	let columns = [
		{
			id: "1",
			field: "name",
			headerClassName: "app-header",
			headerName: "Community Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
		},
		{
			id: "2",
			field: "categoryName",
			headerClassName: "app-header",
			headerName: "Category",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.3,
		},
		{
			id: "3",
			field: "cloudType",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Type",
			// align: "center",
			flex: 0.3,
		},
		{
			id: "4",
			field: "totalMembers",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Members",
			// align: "center",
			flex: 0.3,
			// type: "number",
		},
		{
			id: "5",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.4,
			// type: "date",
			// valueGetter: ({ value }) => value && new Date(value),
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("DD/MM/YYYY");
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
			headerName: "Action",
			// align: 'center',
			flex: 0.3,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								// setGroupPagination({ page: pagination?.page, pageSize: pagination?.pageSize });
								// navigate("/groups/" + params.row.routingId);
								// DeleteCommunityApiCall(params.row.routingId);
								setModal({
									open: true,
									id: params.row.routingId,
								});
							}}>
							<Delete />
						</IconButton>
						<IconButton
							onClick={() => {
								setGroupPagination({ page: pagination?.page, pageSize: pagination?.pageSize });
								navigate("/groups/" + params.row.routingId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	return (
		<Container maxWidth='xl'>
			<Helmet>
				<title>Groups | Banjee Admin</title>
			</Helmet>
			<Grid item container xs={12}>
				<Grid item xs={12}>
					<Card sx={{ padding: "20px" }}>
						{listData ? (
							<div>
								<Box
									sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
									<div
										style={{
											color: themeData ? "default" : "#6b778c",
											fontSize: "22px",
											fontWeight: "500",
										}}>
										Groups ({totalElement})
									</div>
									<Tooltip title='Refresh Groups' arrow sx={{ bacground: "white", color: "black" }}>
										<IconButton
											onClick={() => {
												setGroupPagination({ page: undefined, pageSize: undefined });
												setPagination({ page: 0, pageSize: 10 });
											}}>
											<Refresh color='primary' />
										</IconButton>
									</Tooltip>
								</Box>
								<hr />
								<Box
									className='root'
									sx={{
										width: "100%",
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
											handlePagination({
												page: pagination?.page,
												pageSize: event,
											});
										}}
										rowCount={totalElement}
										rows={rows}
										columns={columns}
										paginationMode='server'
										// autoPageSize
										pagination
										onPageChange={(event) => {
											handlePagination({
												page: event,
												pageSize: pagination?.pageSize,
											});
										}}
										rowsPerPageOptions={[5, 10, 20]}
										className='dataGridFooter'
									/>
								</Box>
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
			<ModalComp data={modal} handleModal={handleModalClose}>
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
								setModal({
									open: false,
									id: "",
								});
							}}>
							Cancel
						</Button>
						<Button
							variant='contained'
							onClick={() => {
								DeleteCommunityApiCall(modal?.id);
							}}>
							Confirm
						</Button>
					</Stack>
				</Box>
			</ModalComp>
		</Container>
	);
}

export default GroupsComp;
