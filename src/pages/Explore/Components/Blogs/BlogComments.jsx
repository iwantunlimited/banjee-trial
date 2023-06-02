import {
	Box,
	Button,
	TextField,
	Typography,
	Grid,
	Divider,
	useTheme,
	IconButton,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import { createComments, deleteBlogComments, getComments } from "../../services/ApiServices";
import ModalComp from "../../../../CustomComponents/ModalComp";
import { Delete } from "@mui/icons-material";
import { MainContext } from "../../../../context/Context";

function BlogComments({ blogData, postType }) {
	const params = useParams();
	const theme = useTheme();
	const { setModalOpen, setModalData } = React.useContext(MainContext);
	const [comment, setComment] = React.useState({
		postId: params?.id,
		text: "",
	});

	const [modal, setModal] = React.useState({
		open: false,
		commentId: "",
	});

	const [commentData, setCommentData] = React.useState([]);

	const handleModal = () => {
		setModal((prev) => ({
			open: false,
			commentId: "",
		}));
	};

	const GetCommentsApiCall = React.useCallback(() => {
		if (params?.id) {
			getComments(params?.id)
				.then((res) => {
					if (res?.data !== null) {
						setCommentData(res);
					}
				})
				.catch((err) => console.error(err));
		}
	}, [params]);

	const CreateCommentApi = React.useCallback((data) => {
		createComments(data)
			.then((res) => {
				setComment((prev) => ({
					...prev,
					text: "",
				}));
				GetCommentsApiCall();
			})
			.catch((err) => console.error(err));
	}, []);

	const deleteCommentApiCall = React.useCallback((payload) => {
		deleteBlogComments(payload)
			.then((res) => {
				handleModal();
				setModalOpen(true);
				setModalData("Comment Deleted", "success");
			})
			.catch((err) => {
				console.error(err);
				setModalOpen(true);
				setModalData("Something went wrong", "error");
			});
	}, []);

	React.useEffect(() => {
		GetCommentsApiCall();
	}, [GetCommentsApiCall]);

	return (
		<Grid item container xs={12} spacing={2}>
			<Grid item xs={12}>
				<Box
					sx={{
						width: "100%",
						height: commentData?.length < 2 ? "100px" : "300px",
						maxHeight: commentData?.length > 20 ? "500px" : "300px",
						overflowY: commentData?.length > 5 ? "scroll" : "hidden",
						overflowX: "auto",
					}}>
					{commentData?.length > 0 ? (
						commentData?.map((item, index) => {
							const commentId = item?.id;
							return (
								<Box
									sx={{
										marginY: "5px",
										display: "flex",
										justifyContent:
											// blogData?.authorId === item?.author?.id ? "flex-end" : "flex-start",
											item?.author?.username === "root" ? "flex-end" : "flex-start",
									}}>
									<Box
										key={index}
										sx={{
											maxWidth: "90%",
											// background: "#e8ebed",
											background: theme?.palette?.grey?.A700,
											borderRadius: "10px",
											padding: "5px",
											paddingX: "10px",
											textAlign: item?.author?.username === "root" ? "right" : "left",
											// textAlign: blogData?.authorId === item?.author?.id ? "right" : "left",
										}}>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}>
											<Typography sx={{ fontSize: "10px" }}>
												{item?.author?.firstName && item?.author?.lastName
													? item?.author?.firstName + " " + item?.author?.lastName
													: item?.author?.username}
											</Typography>
											{postType === "ALERT" && (
												<IconButton
													sx={{ padding: "2.5px", marginLeft: "5px" }}
													onClick={() => {
														setModal((prev) => ({
															...prev,
															open: true,
															commentId: commentId,
														}));
													}}>
													<Delete sx={{ fontSize: "12px" }} />
												</IconButton>
											)}
										</Box>
										<Typography
											sx={{
												fontSize: "14px",
												// marginRight: blogData?.authorId === item?.user?.id ? "5px" : "0px",
												// marginLeft: blogData?.authorId === item?.user?.id ? "0px" : "5px",
											}}>
											{item?.text}
										</Typography>
									</Box>
									<ModalComp data={modal} handleModal={handleModal}>
										<form
											onSubmit={(event) => {
												event?.preventDefault();
												deleteCommentApiCall(modal?.commentId);
											}}>
											<Typography
												id='modal-modal-title'
												sx={{
													fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
													fontWeight: 400,
												}}>
												Are you sure to delete this Comment ?
											</Typography>
											<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
												<Button variant='outlined' onClick={() => handleModal()}>
													Cancel
												</Button>
												<Button
													variant='contained'
													type='submit'
													sx={{ marginLeft: { xs: "10px", sm: "20px" } }}
													// onClick={() => {
													// 	deleteFeedApiCall();
													// 	filterSocialFeedsApiCall();
													// }}
												>
													Submit
												</Button>
											</Box>
										</form>
									</ModalComp>
								</Box>
							);
						})
					) : (
						<Box>
							<Typography>No Comments !</Typography>
						</Box>
					)}
				</Box>
			</Grid>
			{/* <Grid item xs={12}>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						CreateCommentApi({
							...comment,
							postType: postType,
						});
					}}>
					<Box
						sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
						<Box
							sx={{
								display: "flex",
								// alignItems: "space",
								justifyContent: "left",
								width: "100%",
							}}>
							<TextField
								fullWidth
								required
								name='text'
								size='small'
								value={comment.text}
								label='Enter Comment'
								onChange={(event) => {
									setComment((prev) => ({ ...prev, text: event.target.value }));
								}}
							/>
							<Button
								variant='contained'
								type='submit'
								sx={{ textTransform: "none", fontSize: "12px", marginLeft: 1 }}>
								Comment
							</Button>
						</Box>
					</Box>
				</form>
			</Grid> */}
		</Grid>
	);
}

export default BlogComments;
