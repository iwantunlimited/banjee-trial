import * as React from "react";
import {
	Modal,
	Typography,
	Box,
	Button,
	IconButton,
	makeStyles,
	Grid,
	useTheme,
} from "@mui/material";
import moment from "moment";
import { getSocialFeedsComments } from "../services/ApiServices";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "400px",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: "24px",
	padding: "40px",
};

export default function CommentsModal(props) {
	const {
		state: { open, data },
		handleClose,
	} = props;

	const theme = useTheme();
	const [result, setResult] = React.useState([]);

	React.useEffect(() => {
		getSocialFeedsComments(data?.id)
			.then((res) => {
				setResult(res);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box sx={style}>
				<Box
					style={{
						display: "flex",
						alignItems: "center",
						paddingLeft: "10px",
					}}>
					<img
						src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${data?.author?.avtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						style={{
							height: "40px",
							width: "40px",
							objectFit: "contain",
							borderRadius: "50%",
						}}
					/>
					<Typography
						style={{
							padding: "10px 15px",
							display: "flex",
							flexDirection: "column",
						}}>
						<span>{`${data?.author?.username || data?.author?.userName || "userName"}`}</span>
						<span style={{ fontSize: "12px" }}>{moment(data?.createdOn).format("lll")}</span>
					</Typography>
				</Box>
				<Typography variant='h6' style={{ marginTop: "10px" }}>
					Comments
				</Typography>
				<Box style={{ marginTop: "10px" }}>
					<Grid container spacing={1}>
						{result &&
							result?.length > 0 &&
							result?.map((ele, index) => (
								<React.Fragment key={index}>
									<Grid item xs={4}>
										<span>{ele?.createdByUser?.username}</span>
									</Grid>
									<Grid item xs={6}>
										<span>{ele?.text}</span>
									</Grid>
								</React.Fragment>
							))}
					</Grid>
				</Box>
			</Box>
		</Modal>
	);
}
