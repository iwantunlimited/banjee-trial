import React from "react";
import { Modal, Typography, Box, Button, TextField } from "@mui/material";
import { deleteCollabFeed, deleteSocialFeed } from "../services/ApiServices";
import { MainContext } from "../../../context/Context";
import { Navigate, useLocation, useNavigate } from "react-router";

function DeleteFeedModal({
	open,
	dFeedData,
	openModalfun,
	FeedDataFun,
	socialFilterApi,
	mainModal,
}) {
	const { setModalData, setModalOpen } = React.useContext(MainContext);
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const path1 = pathname?.split("/")?.[1];

	const deleteFeedApiCall = React.useCallback((data) => {
		deleteSocialFeed({
			feedId: data.feedId,
			remark: data.remark,
		})
			.then((res) => {
				setModalOpen(true);
				setModalData("Feed Deleted", "success");
				// setOpenSnackBar(true);
				if (pathname === "/social-feeds/reported-feeds/" + data.feedId) {
					navigate("/social-feeds/reported-feeds");
				}
				socialFilterApi(0, 10);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	const deleteCollabFeedApi = React.useCallback((data) => {
		deleteCollabFeed({
			feedId: data.feedId,
			collaborateId: data?.collaborateId,
			remark: data.remark,
		})
			.then((res) => {
				setModalOpen(true);
				setModalData("Feed Deleted", "success");
				// setOpenSnackBar(true);
				if (pathname === "/social-feeds/reported-feeds/" + data.feedId) {
					navigate("/social-feeds/reported-feeds");
				}
				socialFilterApi(0, 10);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		<Modal
			className='delete-modal'
			sx={{
				"& > div": {
					backgroundColor: "rgb(35 35 35 / 8%)",
				},
			}}
			open={open}
			onClose={() => openModalfun(false)}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					// width: 400,
					minWidth: "320px",
					background: "white !important",
					// boxShadow: 24,
					borderRadius: "10px",
					padding: "40px",
				}}
				className='delete1-modal'>
				<form
					onSubmit={() => {
						if (dFeedData?.collaborateId) {
							deleteCollabFeedApi(dFeedData);
						} else {
							deleteFeedApiCall(dFeedData);
						}
						openModalfun(false);
						mainModal();
					}}>
					<Typography
						id='modal-modal-title'
						sx={{ fontSize: { xs: "14px", sm: "16px", lg: "18px", xl: "20px" }, fontWeight: 400 }}>
						Are you sure to delete this feed ?
					</Typography>
					<Box sx={{ my: 2 }}>
						<Typography style={{ fontSize: window.innerWidth < 500 ? "12px" : "14px" }}>
							Give Remark to feed
						</Typography>
						<TextField
							fullWidth
							label='remark'
							name='remark'
							value={dFeedData.remark}
							onChange={(event) => {
								FeedDataFun((prev) => {
									return {
										...prev,
										remark: event.target.value,
									};
								});
							}}
							required
							variant='outlined'
						/>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<Button variant='outlined' onClick={() => openModalfun(false)}>
							Cancel
						</Button>
						<Button
							variant='contained'
							type='submit'
							// onClick={() => {
							// 	deleteFeedApiCall();
							// 	filterSocialFeedsApiCall();
							// 	setOpenDModal(false);
							// }}
						>
							Submit
						</Button>
					</Box>
				</form>
			</Box>
		</Modal>
	);
}

export default DeleteFeedModal;
