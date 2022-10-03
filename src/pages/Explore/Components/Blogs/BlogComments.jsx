import { Box, Button, TextField, Typography, Grid, Divider } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import { createComments, getComments } from "../../services/ApiServices";

function BlogComments({ blogData }) {
	const params = useParams();
	const [comment, setComment] = React.useState({
		postId: params?.id,
		text: "",
	});

	const [commentData, setCommentData] = React.useState([]);

	console.log("commentData", commentData);

	const GetCommentsApiCall = React.useCallback(() => {
		if (params?.id) {
			getComments(params?.id)
				.then((res) => {
					console.log("====================================");
					console.log("all comments", res);
					console.log("====================================");
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
				console.log("====================================");
				console.log("comment created", res);
				console.log("====================================");
				setComment((prev) => ({
					...prev,
					text: "",
				}));
				GetCommentsApiCall();
			})
			.catch((err) => console.error(err));
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
							return (
								<Box
									sx={{
										marginY: "5px",
										display: "flex",
										justifyContent:
											blogData?.authorId === item?.author?.id ? "flex-end" : "flex-start",
									}}>
									<Box
										key={index}
										sx={{
											maxWidth: "90%",
											background: "#e8ebed",
											borderRadius: "10px",
											padding: "5px",
											paddingX: "10px",
											textAlign: blogData?.authorId === item?.author?.id ? "right" : "left",
										}}>
										<Typography sx={{ fontSize: "10px" }}>
											{item?.author?.firstName && item?.author?.lastName
												? item?.author?.firstName + " " + item?.author?.lastName
												: item?.author?.username}
										</Typography>
										<Typography
											sx={{
												fontSize: "14px",
												// marginRight: blogData?.authorId === item?.user?.id ? "5px" : "0px",
												// marginLeft: blogData?.authorId === item?.user?.id ? "0px" : "5px",
											}}>
											{item?.text}
										</Typography>
									</Box>
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
			<Grid item xs={12}>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						console.log("submit done");
						CreateCommentApi(comment);
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
			</Grid>
		</Grid>
	);
}

export default BlogComments;