import { ArrowBack } from "@mui/icons-material";
import { Box, Card, Container, Grid, IconButton, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { findByIdBlog } from "../services/ApiServices";

function BlogDetail() {
	const params = useParams();
	const navigate = useNavigate();

	const [data, setData] = React.useState("");

	const ApiCall = React.useCallback(() => {
		findByIdBlog(params?.id)
			.then((res) => {
				setData(res);
				console.log("====================================");
				console.log("find by id blog response", res);
				console.log("====================================");
			})
			.catch((err) => console.log(err));
	}, []);

	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	React.useEffect(() => {
		ApiCall();
	}, [ApiCall]);

	return (
		<Container style={{ margin: "auto" }} maxWidth='md'>
			<IconButton onClick={() => navigate(-1)}>
				<ArrowBack style={{ color: "#1976d2" }} />
			</IconButton>
			<Card sx={{ borderRadius: "0px", boxShadow: "none", py: 2, px: 4 }}>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<Typography sx={{ textAlign: "center", fontSize: "24px", fontWeight: 600 }}>
							{data?.title}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box
							sx={{ position: "relative", width: "100%", minHeight: "200px", maxHeight: "100%" }}>
							<img
								style={{ height: "100%", width: "100%", objectFit: "contain" }}
								src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${data?.bannerImageUrl}.png`}
								alt='image'
							/>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ position: "relative" }}>
							<Typography sx={{ textAlign: "center", fontSize: "22px", fontWeight: 400 }}>
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
