import { Delete, RemoveRedEye } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	Button,
	Tooltip,
	Typography,
	TablePagination,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router";
import { blogsList, deleteBlog } from "../services/ApiServices";
import "./component.css";
import ModalComp from "../../../CustomComponents/ModalComp";

function ExploreBlogs() {
	const navigate = useNavigate();
	const [data, setData] = React.useState("");
	const [modal, setModal] = React.useState({
		open: false,
		data: "",
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
			data: "",
		}));
	};

	const BlogsListApiCall = React.useCallback((page, pageSize) => {
		blogsList({ page: page, pageSize: pageSize })
			.then((res) => {
				console.log("====================================");
				console.log("blog api response", res);
				console.log("====================================");
				const resp = res?.content?.map((item, index) => ({
					...item,
					blogId: item.id,
					mavtarUrl: item?.userObject?.avtarUrl,
					muserName: item?.userObject?.username,
				}));

				console.log("====================================");
				console.log("new response", resp);
				console.log("====================================");
				setData(resp);
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
				// console.log("====================================");
				// console.log("delete response", res);
				// console.log("====================================");
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
								Blogs({totalEle})
							</Typography>
						</Card>
					</Grid>
					{data?.map((item, index) => {
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
													<span>{`${item?.muserName || item?.muserName || "userName"}`}</span>
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
												<Tooltip style={{ background: "white" }} title='delete'>
													<IconButton
														onClick={() => {
															setModal({
																open: true,
																data: item?.blogId,
															});
														}}>
														<Delete />
													</IconButton>
												</Tooltip>
											</Box>
											<ModalComp data={modal} handleModal={handleModal} width={460}>
												<Typography
													id='modal-modal-title'
													style={{
														fontSize: window.innerWidth < 500 ? "14px" : "24px",
													}}>
													<b>Are you sure to delete this Blog ?</b>
												</Typography>
												<Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
													<Button variant='outlined' onClick={() => handleModal(false)}>
														Cancel
													</Button>
													<Button
														sx={{ marginTop: "20px" }}
														variant='contained'
														type='submit'
														onClick={() => {
															DeleteBlogApiCall(modal?.data);
															BlogsListApiCall(0, 10);
															handleModal(false);
														}}
														// onClick={() => {
														// 	deleteFeedApiCall();
														// 	filterSocialFeedsApiCall();
														// 	setOpenDModal(false);
														// }}
													>
														Submit
													</Button>
												</Box>
											</ModalComp>
										</Box>
										<Box
											onClick={() => navigate("/explore/blogs/detail/" + item?.blogId)}
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
											onClick={() => navigate("/explore/blogs/detail/" + item?.blogId)}
											sx={{
												// position: "absolute",
												// bottom: "0px",
												// left: "0px",
												background: "white",
												backfaceVisibility: "hidden",
												padingX: "20px",
												paddingY: "0.5px",
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
					<Grid item xs={12}>
						<Box
							className='root'
							sx={{
								"& > div > div": {
									display: "flex",
									alignItems: "baseline !important",
								},
							}}>
							<TablePagination
								component='div'
								count={totalEle}
								page={pagination.page}
								rowsPerPage={pagination.pageSize}
								rowsPerPageOptions={[12, 16, 20]}
								onPageChange={(event, data) => {
									// console.log("event--------", event);
									setPagination((prev) => ({
										...prev,
										page: data,
									}));
									BlogsListApiCall(data, pagination.pageSize);
								}}
								onRowsPerPageChange={(event) => {
									// console.log("pagesizedfddv", event, data);
									setPagination((prev) => ({
										...prev,
										pageSize: event.target.value,
									}));
									BlogsListApiCall(pagination.page, event.target.value);
								}}
							/>
						</Box>
					</Grid>
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
				<CircularProgress color="primary" />
			</Box>
		);
	}
}

export default ExploreBlogs;
