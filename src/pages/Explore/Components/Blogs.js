import { Delete, MoreVert, RemoveRedEye } from "@mui/icons-material";
import {
	Avatar,
	Badge,
	Box,
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router";
import { blogsList, deleteBlog } from "../services/ApiServices";
import DeleteBlogModal from "./DeleteBlogModal";
import "./component.css";

function ExploreBlogs() {
	const navigate = useNavigate();
	const [data, setData] = React.useState("");
	const [modal, setModal] = React.useState({
		open: false,
		data: "",
	});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
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
			data: "",
		}));
	};

	const BlogsListApiCall = React.useCallback((page, pageSize) => {
		blogsList({ page: page, pageSize: pageSize })
			.then((res) => {
				console.log("====================================");
				console.log("blog api response", res);
				console.log("====================================");
				setData(res);
				setTotalEle(res.totalElements);
				setPagination({
					page: res?.pageable?.pageNumber,
					pageSize: res?.pageable?.pageSize,
				});
			})
			.catch((err) => console.log(err));
	}, []);

	const DeleteBlogApiCall = React.useCallback((data) => {
		deleteBlog(data)
			.then((res) => {
				console.log("====================================");
				console.log("delete response", res);
				console.log("====================================");
			})
			.catch((err) => console.log(err));
	}, []);

	React.useEffect(() => {
		BlogsListApiCall(pagination?.page, pagination?.pageSize);
	}, [BlogsListApiCall]);

	if (data) {
		return (
			<Container style={{ padding: "0px", margin: "auto" }} maxWidth='xl'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Card sx={{ p: 2 }}>
							<Typography sx={{ fontWeight: 600, color: "gray", fontSize: "25px" }}>
								Blogs
							</Typography>
						</Card>
					</Grid>
					{data?.content?.map((item, index) => {
						return (
							<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
								<Card sx={{ borderRadius: "20px", cursor: "pointer" }}>
									<Box sx={{ position: "relative" }}>
										<Box
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												background: "white",
											}}>
											<Box
												onClick={() => navigate("/explore/blogs/detail/" + item?.id)}
												style={{
													display: "flex",
													alignItems: "center",
													paddingLeft: "10px",
												}}>
												<Avatar
													alt={item?.userObject?.name}
													src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${item?.userObject?.avtarUrl}`}
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
													<span>{`${
														item?.userObject?.username || item?.userObject?.userName || "userName"
													}`}</span>
													<span style={{ fontSize: "12px" }}>
														{moment(item?.createdOn).format("lll")}
													</span>
												</Typography>
											</Box>
											<Box>
												<Tooltip style={{ background: "white" }} title={item?.totalViews}>
													<IconButton>
														<RemoveRedEye />
													</IconButton>
												</Tooltip>
												<IconButton
													// onClick={() => {
													// 	setDFeedData({ feedId: ele.id });
													// 	setOpenDModal(true);
													// }}
													onClick={(event) => setAnchorEl(event.currentTarget)}
													style={{ width: "40px", height: "40px" }}>
													<MoreVert />
												</IconButton>
											</Box>
											<Menu
												anchorEl={anchorEl}
												id='account-menu'
												open={open}
												onClose={() => setAnchorEl(null)}
												onClick={() => setAnchorEl(null)}
												PaperProps={{
													elevation: 0,
													sx: {
														overflow: "visible",
														filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
														mt: 1.5,
														"& .MuiAvatar-root": {
															width: 32,
															height: 32,
															ml: -0.5,
															mr: 1,
														},
														"&:before": {
															content: '""',
															display: "block",
															position: "absolute",
															top: 0,
															right: 14,
															width: 10,
															height: 10,
															bgcolor: "background.paper",
															transform: "translateY(-50%) rotate(45deg)",
															zIndex: 0,
														},
													},
												}}
												transformOrigin={{ horizontal: "right", vertical: "top" }}
												anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
												{/* <MenuItem>Edit</MenuItem> */}
												<MenuItem
													onClick={() =>
														setModal({
															open: true,
															data: item?.id,
														})
													}>
													Delete
												</MenuItem>
											</Menu>
											<DeleteBlogModal
												data={modal}
												openModalfun={handleModal}
												deleteApi={DeleteBlogApiCall}
												blogListApi={BlogsListApiCall}
											/>
											{/* <DeleteFeedModal
											open={openDModal}
											openModalfun={setOpenDModal}
											dFeedData={dFeedData}
											FeedDataFun={setDFeedData}
											socialFilterApi={filterSocialFeedsApiCall}
										/> */}
										</Box>
										<Box
											onClick={() => navigate("/explore/blogs/detail/" + item?.id)}
											sx={{
												width: "100%",
												maxHeight: "300px",
												height: "300px",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}>
											<img
												style={{ height: "100%", width: "100%" }}
												src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${item?.bannerImageUrl}.png`}
												alt='image'
											/>
										</Box>
										<Box
											onClick={() => navigate("/explore/blogs/detail/" + item?.id)}
											sx={{
												// position: "absolute",
												// bottom: "0px",
												// left: "0px",
												background: "white",
												backfaceVisibility: "hidden",
												px: 2,
												py: 0.5,
												width: "100%",
												height: "60px",
												maxHeight: "60px",
											}}>
											{item?.title?.length > 55 ? (
												<Typography style={{ fontSize: "18px", fontWeight: 500 }}>
													{item?.title.slice(0, 55)}{" "}
													<a href='' style={{ textDecoration: "none" }}>
														...more
													</a>
												</Typography>
											) : (
												<Typography style={{ fontSize: "18px", fontWeight: 500 }}>
													{item?.title}
												</Typography>
											)}
										</Box>
									</Box>
								</Card>
							</Grid>
						);
					})}
				</Grid>
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
				<CircularProgress />
			</Box>
		);
	}
}

export default ExploreBlogs;
