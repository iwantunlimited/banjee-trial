import React from "react";
import { CircularProgress, Box, IconButton, Typography, Grid, Card, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { ChatBubbleOutline, FavoriteBorder, RemoveRedEye, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router";
import {
	filterNeighbourhood,
	findCommunityByUserId,
	findNeighbourhoodByUserId,
} from "../../Neighbourhoods/services/apiServices";
import { findBlogByUserId } from "../../Explore/services/ApiServices";

function BlogList(props) {
	const navigate = useNavigate();
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 5,
	});

	const [totalEle, setTotalEle] = React.useState(0);

	const [state, setState] = React.useState("");

	//find neighbourhood by user id

	const findBlogApiCall = React.useCallback(() => {
		findBlogByUserId({
			userId: props?.data,
			page: pagination?.page,
			pageSize: pagination?.pageSize,
		})
			.then((res) => {
				setState(res?.content);
				// setPagination({
				// 	page: res?.pageable?.pageNumber,
				// 	pageSize: res?.pageable?.pageSize,
				// });
				setTotalEle(res?.totalElements);
			})
			.catch((err) => console.error(err));
	}, [pagination]);

	let rows = state ? state : [];

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
			field: "totalMembers",
			headerClassName: "app-header",
			headerName: "Total Members",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			flex: 0.5,
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
					return 0;
				}
			},
		},
		{
			id: "8",
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
								navigate("/groups/" + params.row.id);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	React.useEffect(() => {
		findBlogApiCall();
	}, [findBlogApiCall]);

	if (state) {
		return (
			<Box>
				<Grid container spacing={1}>
					{state?.length > 0 ? (
						state?.map((item, index) => {
							return (
								<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
									<Card sx={{ borderRadius: "20px", cursor: "pointer" }}>
										<Box sx={{ position: "relative" }}>
											{/* <Box
												onClick={() => navigate("/explore/blogs/detail/" + item?.blogId)}
												style={{
													display: "flex",
													alignItems: "center",
													paddingLeft: "10px",
												}}>
												<Avatar
													alt={item?.muserName}
													src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${item?.mavtarUrl}`}
													style={{
														height: "40px",
														width: "40px",
														objectFit: "contain",
														borderRadius: "50%",
													}}
												/>
												<Typography
													style={{
														padding: "10px 10px",
														display: "flex",
														flexDirection: "column",
													}}>
													{item?.userObject?.firstName && item?.userObject?.lastName ? (
														<Typography
															// noWrap={true}
															sx={{
																display: "-webkit-box",
																overflow: "hidden",
																WebkitBoxOrient: "vertical",
																WebkitLineClamp: 1,
															}}>
															{item?.userObject?.firstName + " " + item?.userObject?.lastName}
														</Typography>
													) : (
														<Typography>{`${
															item?.muserName || item?.muserName || "userName"
														}`}</Typography>
													)}
												</Typography>
											</Box> */}
											<Box
												onClick={() => navigate("/explore/blogs/detail/" + item?.id)}
												sx={{
													width: "100%",
													maxHeight: "150px",
													height: "150px",
													aspectRatio: "auto",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
												}}>
												<img
													style={{ height: "100%", width: "100%", aspectRatio: "auto" }}
													src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${item?.bannerImageUrl}.png`}
													alt='blog-img'
												/>
											</Box>
											<Box
												onClick={() => navigate("/explore/blogs/detail/" + item?.id)}
												style={{
													marginTop: "10px",
													padding: "0 5px",
													display: "flex",
													flexDirection: "column",
												}}
												// onClick={() => setModal({ open: true, data: ele })}
											>
												<span style={{ fontSize: "12px", textAlign: "right" }}>
													{moment(item?.createdOn).format("lll")}
												</span>
												{item?.title ? (
													<Typography noWrap={true}>
														{item?.title || <p style={{ height: "16px" }}> </p>}
													</Typography>
												) : (
													<Box style={{ height: "24px" }}></Box>
												)}
												<Box sx={{ display: "flex", paddingTop: "20px", paddingBottom: "10px" }}>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
														}}>
														<RemoveRedEye />
														<span style={{ marginLeft: "5px" }}>{item?.totalViews || 0}</span>
													</Box>
													<Box
														style={{
															display: "flex",
															alignItems: "center",
															marginLeft: "10px",
														}}>
														<FavoriteBorder />
														<span style={{ marginLeft: "5px" }}>
															{item?.totalReactions || item?.reactions?.length || 0}
														</span>
													</Box>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															marginLeft: "10px",
														}}>
														<ChatBubbleOutline />
														<span style={{ marginLeft: "5px" }}>{item?.totalComments || 0}</span>
													</Box>
												</Box>
											</Box>
										</Box>
									</Card>
								</Grid>
							);
						})
					) : (
						<Grid item xs={12}>
							<Box sx={{ display: "flex", justifyContent: "center" }}>
								<Typography>No data found.</Typography>
							</Box>
						</Grid>
					)}
				</Grid>
			</Box>
		);
	} else {
		return (
			<Box
				sx={{
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default BlogList;
