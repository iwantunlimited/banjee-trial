import {
	Add,
	ChatBubbleOutline,
	Delete,
	FavoriteBorder,
	Refresh,
	RemoveRedEye,
} from "@mui/icons-material";
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
import { blogsList, deleteBlog } from "../../services/ApiServices";
import ".././component.css";
import ModalComp from "../../../../CustomComponents/ModalComp";
import { MainContext } from "../../../../context/Context";
import { PaginationContext } from "../../../../context/PaginationContext";

function ExploreBlogs() {
	const { setModalOpen, setModalData } = React.useContext(MainContext);
	const { blogPagination, setBlogPagination } = React.useContext(PaginationContext);
	const navigate = useNavigate();
	const [data, setData] = React.useState("");
	const [modal, setModal] = React.useState({
		open: false,
		data: "",
	});
	// pagination state
	const [pagination, setPagination] = React.useState({
		page: blogPagination?.page ? blogPagination?.page : 0,
		pageSize: blogPagination?.pageSize ? blogPagination?.pageSize : 12,
	});
	const [totalEle, setTotalEle] = React.useState();

	const handleModal = (data) => {
		setModal((prev) => ({
			...prev,
			open: data,
			data: "",
		}));
	};

	const BlogsListApiCall = React.useCallback(() => {
		blogsList({ page: pagination?.page, pageSize: pagination?.pageSize, blogType: "BLOG" })
			.then((res) => {
				const resp = res?.content?.map((item, index) => ({
					...item,
					blogId: item.id,
					mavtarUrl: item?.userObject?.avtarUrl,
					muserName: item?.userObject?.username,
				}));

				setData(resp);
				setTotalEle(res.totalElements);
			})
			.catch((err) => console.error(err));
	}, [pagination]);

	const DeleteBlogApiCall = React.useCallback((data) => {
		deleteBlog(data)
			.then((res) => {
				setModalOpen(true);
				setModalData("Blog Deleted", "warning");
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		BlogsListApiCall();
	}, [BlogsListApiCall]);

	if (data) {
		return (
			<Container style={{ padding: "0px", margin: "auto" }} maxWidth='xl'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
							<Box>
								<Typography sx={{ fontWeight: 500, fontSize: "22px" }}>Blogs({totalEle})</Typography>
							</Box>
							<Box>
								<Tooltip title='Create Blog' arrow sx={{ bacground: "white", color: "black" }}>
									<IconButton onClick={() => navigate("/explore/blogs/createblog")}>
										<Add color='primary' />
									</IconButton>
								</Tooltip>
								<Tooltip title='Refresh Blog' arrow sx={{ bacground: "white", color: "black" }}>
									<IconButton
										onClick={() => {
											setPagination({ page: 0, pageSize: 12 });
											setBlogPagination({ page: undefined, pageSize: undefined });
										}}>
										<Refresh color='primary' />
									</IconButton>
								</Tooltip>
							</Box>
						</Card>
					</Grid>
					{data?.length > 0 ? (
						data?.map((item, index) => {
							return (
								<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
									<Card sx={{ borderRadius: "20px", cursor: "pointer" }}>
										<Box sx={{ position: "relative" }}>
											<Box
												style={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
													// background: "white",
												}}>
												<Box
													onClick={() => {
														setBlogPagination({
															page: pagination?.page,
															pageSize: pagination?.pageSize,
														});
														navigate("/explore/blogs/detail/" + item?.blogId);
													}}
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
														{item?.userObject?.firstName ? (
															<Typography
																// noWrap={true}
																sx={{
																	display: "-webkit-box",
																	overflow: "hidden",
																	WebkitBoxOrient: "vertical",
																	WebkitLineClamp: 1,
																}}>
																{item?.userObject?.firstName}
															</Typography>
														) : (
															<Typography>{`${item?.muserName || item?.muserName || "userName"}`}</Typography>
														)}
														<span style={{ fontSize: "12px" }}>{moment(item?.createdOn).format("lll")}</span>
													</Typography>
												</Box>
												<Box>
													{/* <Tooltip style={{ background: "white" }} title={item?.totalViews}>
														<IconButton>
															<RemoveRedEye />
														</IconButton>
													</Tooltip> */}
													<Tooltip title='delete'>
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
												<ModalComp data={modal} handleModal={handleModal}>
													<Typography
														id='modal-modal-title'
														sx={{
															fontSize: {
																xs: "14px",
																sm: "16px",
																md: "16px",
																lg: "18px",
																xl: "20px",
															},
															fontWeight: 400,
														}}>
														Are you sure to delete this Blog ?
													</Typography>
													<Box
														sx={{
															display: "flex",
															justifyContent: "center",
															marginTop: "20px",
															alignItems: "center",
														}}>
														<Button variant='outlined' onClick={() => handleModal(false)}>
															Cancel
														</Button>
														<Button
															sx={{ marginLeft: "20px" }}
															variant='contained'
															type='submit'
															onClick={() => {
																DeleteBlogApiCall(modal?.data);
																handleModal(false);
																setTimeout(() => {
																	BlogsListApiCall();
																}, [2000]);
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
												onClick={() => {
													setBlogPagination({
														page: pagination?.page,
														pageSize: pagination?.pageSize,
													});

													navigate("/explore/blogs/detail/" + item?.blogId);
												}}
												sx={{
													width: "100%",
													maxHeight: "250px",
													height: "250px",
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
											{/* <Box
												onClick={() => navigate("/explore/blogs/detail/" + item?.blogId)}
												sx={{
													// position: "absolute",
													// bottom: "0px",
													// left: "0px",
													background: "white",
													backfaceVisibility: "hidden",
													paddingX: "12px",
													paddingTop: "0.5px",
													paddingBottom: "5px",
													width: "100%",
													height: "60px",
													maxHeight: "60px",
												}}>
												{item?.title?.length > 50 ? (
													<Typography style={{ fontSize: "18px", fontWeight: 500 }}>
														{item?.title.slice(0, 50)}{" "}
														<a href='' style={{ textDecoration: "none" }}>
															...more
														</a>
													</Typography>
												) : (
													<Typography style={{ fontSize: "18px", fontWeight: 500 }}>
														{item?.title}
													</Typography>
												)}
											</Box> */}
											<Box
												onClick={() => {
													setBlogPagination({
														page: pagination?.page,
														pageSize: pagination?.pageSize,
													});
													navigate("/explore/blogs/detail/" + item?.blogId);
												}}
												style={{
													marginTop: "15px",
													padding: "0 10px",
													display: "flex",
													flexDirection: "column",
												}}
												// onClick={() => setModal({ open: true, data: ele })}
											>
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
													<Box style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
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
									setPagination((prev) => ({
										...prev,
										page: data,
									}));
								}}
								onRowsPerPageChange={(event) => {
									setPagination((prev) => ({
										...prev,
										pageSize: event.target.value,
									}));
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
				<CircularProgress color='primary' />
			</Box>
		);
	}
}

export default ExploreBlogs;
