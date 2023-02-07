import { Add, Delete } from "@mui/icons-material";
import {
	Box,
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	Button,
	Tooltip,
	Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { Visibility } from "@mui/icons-material";
import { blogsList, deleteBlog } from "../../../Explore/services/ApiServices";
import "../../../Explore/Components/component.css";
import { DataGrid } from "@mui/x-data-grid";
import { MainContext } from "../../../../context/Context";
import ModalComp from "../../../../CustomComponents/ModalComp";
import moment from "moment";

function Announcement() {
	const navigate = useNavigate();
	const context = useContext(MainContext);
	const { setModalOpen, setModalData, themeData } = context;

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

	const handleModal = (data) => {
		setModal((prev) => ({
			...prev,
			open: data,
		}));
	};

	let rows = data ? data : [];

	let columns = [
		{
			id: "1",
			field: "title",
			headerClassName: "app-header",
			headerName: "Title",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.4,
		},
		{
			id: "2",
			field: "shortDescription",
			headerClassName: "app-header",
			headerName: "Short Description",
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
			flex: 0.2,
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
			id: "5",
			field: "templateId",
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
								setModal({ open: true, id: params?.row?.templateId });
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
								navigate("/notification/template/" + params?.row?.templateId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	const BlogsListApiCall = React.useCallback((page, pageSize) => {
		blogsList({ page: page, pageSize: pageSize, blogType: "ANNOUNCEMENT" })
			.then((res) => {
				const resp = res?.content?.map((item, index) => ({
					...item,
					templateId: item.id,
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

	const DeleteBlogApiCall = (customData) => {
		deleteBlog(customData)
			.then((res) => {
				setModalOpen(true);
				setModalData("Announcement Deleted Successfully", "success");
				BlogsListApiCall();
			})
			.catch((err) => console.error(err));
	};

	React.useEffect(() => {
		BlogsListApiCall(0, 10);
	}, [BlogsListApiCall]);

	if (data) {
		return (
			<Container style={{ padding: "0px", margin: "auto" }} maxWidth='xl'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
							<Box>
								<Typography
									sx={{
										fontWeight: 500,
										color: themeData ? "default" : "#6b778c",
										fontSize: "22px",
									}}>
									Template({totalEle})
								</Typography>
							</Box>
							<Tooltip title='Create Template' arrow sx={{ bacground: "white", color: "black" }}>
								<IconButton onClick={() => navigate("/notification/template/create-template")}>
									<Add color='primary' />
								</IconButton>
							</Tooltip>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px" }}>
							{data?.length > 0 ? (
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
													BlogsListApiCall(pagination?.pagination?.page, event);
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
													BlogsListApiCall(event, pagination?.pagination?.pageSize);
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
										marginTop: "10px",
									}}>
									<p>No data available</p>
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
							<b>Are you sure to delete template ?</b>
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
									DeleteBlogApiCall(modal?.id);
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

export default Announcement;
