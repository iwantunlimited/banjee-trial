import {
	Avatar,
	Box,
	Button,
	IconButton,
	Modal,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import "./style.css";
import moment from "moment";
import { Close, Fullscreen } from "@mui/icons-material";
import FullScreenImageModal from "../pages/Social_Feeds/Components/FullScreenImageModal";

function AdminVerificationModal(props) {
	const theme = useTheme();
	const { handleModal, open, data, AdminAcceptApiCall, PermenentRejectAdminApi } = props;
	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});

	const [remark, setRemark] = useState("");
	const [error, setError] = useState(false);

	console.log("====================================");
	console.log("modalFDat", props?.data);
	console.log("====================================");

	return (
		<Modal
			open={open}
			onClose={() => handleModal(false)}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					// width: props?.width ? props?.width : 400,
					bgcolor: theme.palette.background.paper,
					// background: "white",
					// border: "2px solid #000",
					borderRadius: "10px",
					boxShadow: 24,
					p: 4,
					m: 2,
				}}>
				<Box sx={{ position: "relative", minWidth: { xs: "240px", sm: "340px" } }}>
					<IconButton onClick={() => handleModal(false)} sx={{ position: "absolute", top: 0, right: 0 }}>
						<Close />
					</IconButton>
					<Box sx={{ display: "flex", alignItems: "center", paddingY: "20px" }}>
						<Avatar
							src={`https://res.cloudinary.com/banjee/image/upload/ar_1:1,c_pad,f_auto,q_auto:low/v1/${data?.payload?.imageUrl}.png`}
							alt={data?.payload?.name}
							style={{
								width: window.innerWidth < 500 ? "30px" : "70px",
								height: window.innerWidth < 500 ? "30px" : "70px",
							}}
						/>

						<Box sx={{ marginLeft: "40px" }}>
							{data?.payload?.name && (
								<Typography sx={{ fontSize: { xs: "20px", md: "24px" } }}>{data?.payload?.name}</Typography>
							)}
							{/* {data?.payload?.createdOn && (
								<Typography sx={{ fontSize: "12px" }}>
									{moment(data?.payload?.createdOn).format("lll")}
								</Typography>
							)}
							{data?.payload?.countryName && <Typography>{data?.payload?.countryName}</Typography>}
							{data?.payload?.totalMembers && (
								<Typography>{"Total Members: " + data?.payload?.totalMembers}</Typography>
							)}
							<Typography>{data?.payload?.description}</Typography> */}
						</Box>
					</Box>
					<Box>
						<Typography>
							{"Request From: "}
							<b>{data?.profile?.firstName}</b>
						</Typography>
						<Typography>Documents:</Typography>
						<Stack
							columnGap={2}
							flexDirection={"row"}
							sx={{
								display: "flex",
								justifyContent: "center",
								marginTop: 2,
							}}>
							{data?.documents?.map((item, index) => {
								return (
									<Box
										key={index}
										sx={{
											position: "relative",
											height: "200px",
											aspectRatio: "1:1",
											"&:hover": {
												"& > .btnFullScreen": {
													display: "block",
													position: "absolute",
													left: "93%",
													top: "85%",
													transform: "translate(-50%, -50%)",
												},
											},
											"& > .btnFullScreen": {
												display: "none",
											},
										}}>
										<img
											loading='eager'
											alt={item?.title}
											src={item?.src}
											style={{
												height: "100%",
												width: "100%",
												objectFit: "contain",
											}}
										/>
										<IconButton
											className='btnFullScreen'
											onClick={() => {
												setFullScreenState({
													imageModal: true,
													src: item?.src,
												});
											}}>
											<Fullscreen
												style={{
													color: "#000",
													fontSize: "30px",
												}}
											/>
										</IconButton>
									</Box>
								);
							})}
						</Stack>
						<Box sx={{ marginY: { xs: 2, md: 4 } }}>
							<TextField
								error={error}
								helperText={error ? "Give the remark to reject or re-upload" : ""}
								sx={{ paddingX: { xs: 2, md: 4 } }}
								fullWidth
								placeholder='Remark'
								variant='filled'
								name='remark'
								value={remark}
								onChange={(event) => setRemark(event?.target?.value)}
							/>
						</Box>
						<Stack
							columnGap={3}
							flexDirection={"row"}
							sx={{
								display: "flex",
								justifyContent: "center",
								marginTop: 2,
							}}>
							<Button
								onClick={() => {
									if (remark === "") {
										setError(true);
									} else {
										PermenentRejectAdminApi(data?.cloudId, data?.userId);
									}
								}}
								variant='outlined'
								color='warning'>
								Reject
							</Button>
							<Button
								onClick={() => {
									if (remark === "") {
										setError(true);
									} else {
										AdminAcceptApiCall(false, data?.cloudId, data?.userId);
									}
								}}
								variant='outlined'
								color='info'>
								Re - Varification
							</Button>
							<Button
								onClick={() => AdminAcceptApiCall(true, data?.cloudId, data?.userId)}
								variant='contained'
								color='success'>
								Accept
							</Button>
						</Stack>
					</Box>
					{fullScreenState.imageModal && (
						<FullScreenImageModal
							state={fullScreenState}
							handleClose={() => setFullScreenState({ imageModal: false })}
						/>
					)}
				</Box>
			</Box>
		</Modal>
	);
}

export default AdminVerificationModal;
