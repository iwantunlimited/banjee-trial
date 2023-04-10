import { ArrowBack } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	Divider,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { findNotificationById } from "../../ApiServices/apiServices";

function ViewAutoNotification() {
	const params = useParams();
	const navigate = useNavigate();

	const [data, setData] = React.useState("");
	const [responseNull, setResponseNull] = React.useState(false);

	const DetailApiCall = React.useCallback(() => {
		findNotificationById(params?.id)
			.then((res) => {
				if (res === null) {
					setResponseNull(true);
				}
				setData(res);
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		DetailApiCall();
	}, [DetailApiCall]);

	if (data) {
		return (
			<Container maxWidth='lg'>
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
									Auto Notification Information
								</Typography>
								<Button onClick={() => navigate("/notification/automation/update/" + data?.id)}>
									update
								</Button>
							</Box>
							<Box sx={{ marginY: "5px" }}>
								<Divider />
							</Box>
							<Box>
								<Typography sx={{ fontSize: "22px", fontWeight: 600 }}>{data?.title}</Typography>
								{data?.description && (
									<Typography>
										<span>
											<b>Description: </b>
										</span>
										{data?.description}
									</Typography>
								)}
								{data?.clickAction && (
									<Typography>
										<span>
											<b>Click Action: </b>
										</span>
										{data?.clickAction}
									</Typography>
								)}
								{data?.inactivityType && (
									<Typography>
										<span>
											<b>Inactivity Type: </b>
										</span>
										{data?.inactivityType}
									</Typography>
								)}
								{data?.durationType && (
									<Typography>
										<span>
											<b>Duration Type: </b>
										</span>
										{data?.durationType}
									</Typography>
								)}
							</Box>
						</Card>
					</Grid>
				</Grid>
			</Container>
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
				{responseNull ? <Typography>No Data Available !</Typography> : <CircularProgress />}
			</Box>
		);
	}
}

export default ViewAutoNotification;
