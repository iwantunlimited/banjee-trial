import { ArrowBack, ChatBubbleOutline, Delete, FavoriteBorderOutlined } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	Grid,
	IconButton,
	TextField,
	Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { createComments, deleteBlog, findByIdBlog, getComments } from "../../services/ApiServices";
import { useTheme } from "@mui/material/styles";
import BlogReaction from "./BlogReaction";
import BlogComments from "./BlogComments";
import ModalComp from "../../../../CustomComponents/ModalComp";
import ReactionCommentTab from "./ReactionTab";

function BlogDetail() {
	const params = useParams();
	const navigate = useNavigate();
	const theme = useTheme();

	const [modal, setModal] = React.useState({
		open: false,
		type: "reation",
	});

	const handleModal = (data) => {
		setModal(data);
	};

	const [data, setData] = React.useState("");

	const DeleteBlogApiCall = React.useCallback((data) => {
		deleteBlog(data)
			.then((res) => {
				// console.log(res);
			})
			.catch((err) => console.error(err));
	}, []);

	const ApiCall = React.useCallback(() => {
		findByIdBlog(params?.id)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.error(err));
	}, []);

	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	React.useEffect(() => {
		ApiCall();
	}, [ApiCall]);

	if (data) {
		return (
			<Container style={{ margin: "auto" }} maxWidth='lg'>
				<Box sx={{ marginBottom: 2, display: "flex", justifyContent: "space-between" }}>
					<IconButton onClick={() => navigate(-1)}>
						<ArrowBack color='primary' />
					</IconButton>
					<Box>
						{/* <IconButton
						onClick={() =>
							setModal({
								open: true,
								type: "reaction",
							})
						}>
						<FavoriteBorderOutlined />
					</IconButton>
					<IconButton
						onClick={() =>
							setModal({
								open: true,
								type: "comment",
							})
						}>
						<ChatBubbleOutline />
					</IconButton> */}
						<IconButton
							onClick={() => {
								DeleteBlogApiCall(params?.id);
								navigate(-1);
							}}
							// color='primary'
							variant='contained'>
							<Delete />
						</IconButton>
					</Box>
				</Box>
				<Card sx={{ borderRadius: "0px", boxShadow: "none", paddingY: "20px", paddingX: "40px" }}>
					<Grid item container xs={12} spacing={2}>
						<Grid item xs={12}>
							<Typography sx={{ textAlign: "center", fontSize: "24px", fontWeight: 600 }}>
								{data?.title}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Box
								sx={{
									position: "relative",
									width: "100%",
									height: "auto !important",
								}}>
								<img
									style={{ height: "auto !important", width: "100%", objectFit: "contain" }}
									src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${data?.bannerImageUrl}.png`}
									alt='image'
								/>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Box sx={{ position: "relative" }}>
								<Typography sx={{ textAlign: "left", fontSize: "22px", fontWeight: 400 }}>
									{data?.shortDescription}
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								{data?.authorName !== null && (
									<Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
										{data?.authorName ? data?.authorName : ""}
									</Typography>
								)}
								{data?.createdOn && (
									<Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
										{moment(data?.createdOn).format("lll")}
									</Typography>
								)}
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Box>
								<Typography>{descriptionText}</Typography>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<ReactionCommentTab blogData={data} />
						</Grid>
						{/* <ModalComp width={400} handleModal={handleModal} data={modal}>
						{modal?.type === "reaction" ? (
							<React.Fragment>
								<BlogReaction blogData={data} />
							</React.Fragment>
						) : (
							<React.Fragment>
								<BlogComments blogData={data} />
							</React.Fragment>
						)}
					</ModalComp> */}
					</Grid>
				</Card>
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

export default BlogDetail;
