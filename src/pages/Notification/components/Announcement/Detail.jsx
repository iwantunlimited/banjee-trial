import { ArrowBack } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Divider,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { findByIdBlog } from "../../ApiServices/apiServices";

function AnnouncementDetail() {
	const params = useParams();
	const navigate = useNavigate();

	const [data, setData] = React.useState("");

	const DetailApiCall = React.useCallback(() => {
		findByIdBlog(params?.id)
			.then((res) => {
				setData(res);
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		DetailApiCall();
	}, [DetailApiCall]);

	if (data) {
		return (
			<Box>
				<Grid item container spacing={2}>
					<Grid item xs={12}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBack color='primary' />
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "10px" }}>
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<Typography sx={{ fontSize: "22px", fontWeight: 600, color: "gray" }}>
									Template Information
								</Typography>
								<Button onClick={() => navigate("/notification/template/update/" + params?.id)}>
									update
								</Button>
							</Box>
							<Box sx={{ marginY: "5px" }}>
								<Divider />
							</Box>
							<Box>
								<Typography sx={{ fontSize: "22px", fontWeight: 600 }}>{data?.title}</Typography>

								{data?.shortDescription && (
									<Typography>
										<span>
											<b>Short Description: </b>
										</span>
										{data?.shortDescription}
									</Typography>
								)}
								{data?.description && (
									<Typography>
										<span>
											<b>Description: </b>
										</span>
										<div dangerouslySetInnerHTML={{ __html: data?.description }} />
									</Typography>
								)}
							</Box>
						</Card>
					</Grid>
				</Grid>
			</Box>
		);
	} else {
		return (
			<Box
				sx={{
					width: "100%",
					height: "80vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default AnnouncementDetail;
