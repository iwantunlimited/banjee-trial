import React from "react";
import {
	Container,
	Grid,
	Card,
	Box,
	IconButton,
	Typography,
	Avatar,
	CircularProgress,
	Button,
} from "@mui/material";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { makeStyles } from "@mui/styles";

import { useNavigate, useParams } from "react-router";
import { filterSocialFeeds, getReportedFeedDetail } from "../../services/ApiServices";
import { MainContext } from "../../../../context/Context";

const useStyles = makeStyles({
	root: {
		width: "100%",
		marginTop: "30px",
	},
	container: {
		maxHeight: "440px",
	},
	dataGridFooter: {
		"& > div > .MuiDataGrid-footerContainer > .MuiTablePagination-root > .MuiTablePagination-toolbar":
			{
				alignItems: "baseline !important",
			},
	},
	DataGridBackground: {
		"& .app-header": {
			backgroundColor: "#b9d5ff91",
		},
	},
});

//function for viewing reported feed
function ViewRFeed(props) {
	const navigate = useNavigate();
	const { themeData } = React.useContext(MainContext);
	const classes = useStyles();

	const [reportedData, setReportedData] = React.useState({
		data: [],
		totalElements: 0,
	});

	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	// console.log("====================================");
	// console.log("reportedData", reportedData);
	// console.log("====================================");

	const ReportedFeedApiCall = React.useCallback(() => {
		getReportedFeedDetail({
			feedId: props?.feedId,
			page: pagination?.page,
			pageSize: pagination?.pageSize,
		})
			.then((res) => {
				console.log("====================================");
				console.log("ressss", res);
				console.log("====================================");
				setReportedData({
					data: res?.content,
					totalElements: res?.totalElements,
				});
			})
			.catch((err) => console.error(err));
	}, [pagination]);

	React.useEffect(() => {
		ReportedFeedApiCall();
	}, [ReportedFeedApiCall]);

	const rows = reportedData?.data?.length > 0 ? reportedData?.data : [];

	const columns = [
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
						src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${params?.row?.user?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						alt={params?.row?.user?.avtarUrl}
					/>
				);
			},
		},
		{
			id: "2",
			field: "firstName",
			headerClassName: "app-header",
			headerName: "Name",
			flex: 0.3,
			renderCell: (params) => {
				return params?.row?.user?.firstName;
			},
		},
		// {
		// 	id: "3",
		// 	field: "email",
		// 	headerClassName: "app-header",
		// 	headerName: "Email",
		// 	flex: 0.5,
		// },
		{
			id: "4",
			field: "remark",
			headerClassName: "app-header",
			headerName: "Remark",
			flex: 0.5,
			// align: "center",
		},
		{
			id: "5",
			field: "reportedOn",
			headerClassName: "app-header",
			headerName: "Reported On",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				if (params?.row && params?.row?.reportedOn) {
					const date = moment(params?.row?.reportedOn).format("LL");
					return date;
				} else {
					return "-";
				}
			},
		},
		{
			id: "6",
			field: "view",
			headerClassName: "app-header",
			headerName: "View",
			align: "center",
			flex: 0.2,
			renderCell: (params) => (
				<strong>
					<IconButton
						onClick={() => {
							navigate("/user/" + params?.row?.user?.id);
						}}>
						<VisibilityIcon />
					</IconButton>
				</strong>
			),
		},
	];

	if (reportedData?.data) {
		return (
			<>
				<Container maxWidth='xl'>
					<Card sx={{ p: 2 }}>
						<Grid item container xs={12}>
							<Grid item xs={12}>
								<Typography
									sx={{
										color: "#6b778c",
										fontSize: "20px",
										fontWeight: "500",
									}}>
									Reported By
								</Typography>
								<hr />
							</Grid>
							{reportedData?.data?.length > 0 ? (
								<React.Fragment>
									<Grid item xs={12}>
										<div style={{ width: "100%" }}>
											<div className={classes.DataGridBackground}>
												<DataGrid
													autoHeight
													page={pagination.page}
													pageSize={pagination.pageSize}
													onPageSizeChange={(event) => {
														setPagination((prev) => ({
															...prev,
															pageSize: event,
														}));
													}}
													rowCount={reportedData?.totalElements}
													rows={rows}
													columns={columns}
													paginationMode='server'
													// autoPageSize
													pagination
													onPageChange={(event) => {
														setPagination((prev) => ({
															...prev,
															page: event,
														}));
													}}
													rowsPerPageOptions={[5, 10, 20]}
													className={classes.dataGridFooter}
												/>
											</div>
										</div>
									</Grid>
								</React.Fragment>
							) : (
								<Grid item xs={12}>
									<Typography sx={{ textAlign: "center" }}>No Data Available</Typography>
								</Grid>
							)}
						</Grid>
					</Card>
				</Container>
			</>
		);
	} else {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					height: "100vh",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default ViewRFeed;
