import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Card, Container, Grid, IconButton, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { deleteBlog, findByIdBlog } from "../services/ApiServices";
import { useTheme } from "@mui/material/styles";

function BlogDetail() {
	const params = useParams();
	const navigate = useNavigate();
	const theme = useTheme();

	const [data, setData] = React.useState("");

	const DeleteBlogApiCall = React.useCallback((data) => {
		deleteBlog(data)
			.then((res) => {})
			.catch((err) => console.log(err));
	}, []);

	const ApiCall = React.useCallback(() => {
		findByIdBlog(params?.id)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.log(err));
	}, []);

	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	React.useEffect(() => {
		ApiCall();
	}, [ApiCall]);

	return (
		<Container style={{ margin: "auto" }} maxWidth='md'>
			<Box sx={{ marginBottom: 2, display: "flex", justifyContent: "space-between" }}>
				<IconButton onClick={() => navigate(-1)}>
					<ArrowBack color='primary' />
				</IconButton>
				<Button
					onClick={() => {
						DeleteBlogApiCall(params?.id);
						navigate("/blogs");
					}}
					color='primary'
					variant='contained'>
					Delete
				</Button>
			</Box>
			<Card sx={{ borderRadius: "0px", boxShadow: "none", paddingY: "20px", paddingX: "40px" }}>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Typography sx={{ textAlign: "center", fontSize: "24px", fontWeight: 600 }}>
							{data?.title}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ position: "relative", width: "100%", height: "100%" }}>
							<img
								style={{ height: "100%", width: "100%", objectFit: "contain" }}
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
							<Typography sx={{ fontSize: "14px", fontWeight: 500 }}>{data?.authorName}</Typography>
							<Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
								{moment(data?.createdOn).format("lll")}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box>
							<Typography>{descriptionText}</Typography>
						</Box>
					</Grid>
				</Grid>
			</Card>
		</Container>
	);
}

export default BlogDetail;
