import { ArrowBack, Visibility } from "@mui/icons-material";
import {
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	Box,
	Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import { MainContext } from "../../../../context/Context";
import { urls } from "../../../../Environment/ApiUrl";
import Setting from "../../../../Environment/Setting";
import { notifiedUsersList } from "../../ApiServices/apiServices";

function NotifyUsers(props) {
	const navigate = useNavigate();
	const location = useLocation();
	const { themeData } = React.useContext(MainContext);

	const [listData, setListData] = React.useState("");
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});
	const [totalElements, setTotalElements] = React.useState("");

	const [showData, setShowData] = React.useState(false);

	let rows = listData ? listData : [];

	let columns = [
		{
			id: "1",
			field: "rName",
			headerClassName: "app-header",
			headerName: "Name",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.35,
		},
		{
			id: "3",
			field: "rEmail",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Email",
			// align: "center",
			flex: 0.3,
		},
		{
			id: "4",
			field: "rMobile",
			headerClassName: "app-header",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Mobile",
			// align: "center",
			flex: 0.25,
		},
		{
			id: "5",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.3,
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("lll");
					return date;
				} else {
					return "-";
				}
			},
		},
		{
			id: "8",
			field: "ricipentId",
			headerClassName: "app-header-rejected",
			headerName: "View",
			flex: 0.2,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								navigate("/user/" + params.row.recipientId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	const ListApiCall = React.useCallback(() => {
		const url =
			"https://gateway.banjee.org/services/message-broker/api/message/delivery/filter/messageId";
		let body = {
			tid: "",
			sid: "",
			payload: {},
		};

		let setting = new Setting();

		body.tid = Date.now() + 30000;
		body.sid = setting.setSecurity(urls.headers["itpl-client-id"], Date.now() + 30000);
		// body.actionCode = actionCode;
		body.payload = {
			messageId: location?.state?.id,
			page: pagination?.page,
			pageSize: pagination?.pageSize,
		};

		axios
			.post(
				url,
				{ ...body },
				{
					headers: {
						Authorization: localStorage.getItem("token")
							? "Bearer " + localStorage.getItem("token")
							: "Basic aXRwbDppd2FudHVubGltaXRlZA==",
					},
				}
			)
			.then((res) => {
				const resp = res?.data?.content?.map((item) => {
					return {
						...item,
						rName: item?.recipient?.firstName,
						rMobile: item?.recipient?.mcc + " " + item?.recipient?.mobile,
						rEmail: item?.recipient?.email,
						rAvatarUrl: item?.recipient?.avtarImageUrl,
					};
				});
				setShowData(true);
				setListData(resp);
				setTotalElements(res?.data?.totalElements);
			})
			.catch((err) => console.error(err));
	}, [pagination]);

	React.useEffect(() => {
		ListApiCall();
	}, [ListApiCall]);

	if (listData) {
		return (
			<Container maxWidth='xl'>
				<Grid item container spacing={2}>
					<Grid item xs={12}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBack />
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: { xs: "10px", sm: "20px" } }}>
							<Typography
								sx={{
									color: themeData ? "default" : "#6b778c",
									fontSize: "22px",
									fontWeight: "500",
									textAlign: "left",
								}}>
								Notified Users
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card>
							<div style={{ width: "100%" }}>
								<Box
									className='root'
									// sx={{
									// 	"& .app-header-live": {
									// 		bgcolor: "#76e060",
									// 	},
									// }}
								>
									<DataGrid
										autoHeight
										page={pagination?.page}
										pageSize={pagination?.pageSize}
										onPageSizeChange={(event) => {
											setPagination((prev) => ({ ...prev, pageSize: event }));
										}}
										rowCount={totalElements}
										rows={rows}
										columns={columns}
										paginationMode='server'
										// autoPageSize
										pagination
										onPageChange={(event) => {
											setPagination((prev) => ({ ...prev, page: event }));
										}}
										rowsPerPageOptions={[5, 10, 20]}
										className='dataGridFooter'
									/>
								</Box>
							</div>
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
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default NotifyUsers;
