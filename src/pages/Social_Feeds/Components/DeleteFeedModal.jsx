import React from "react";
import { Modal, Typography, Box, Button, TextField } from "@mui/material";
import { deleteSocialFeed } from "../services/ApiServices";

function DeleteFeedModal({
	open,
	dFeedData,
	openModalfun,
	FeedDataFun,
	socialFilterApi,
	mainModal,
}) {
	const deleteFeedApiCall = React.useCallback(() => {
		deleteSocialFeed({
			feedId: dFeedData.feedId,
			remark: dFeedData.remark,
		})
			.then((res) => {
				// setOpenSnackBar(true);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [dFeedData.remark, dFeedData.feedId]);
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
					padding: "40px",
				}}
				className='delete1-modal'>
				<form
					onSubmit={() => {
						deleteFeedApiCall();
						socialFilterApi();
						openModalfun(false);
						mainModal();
					}}>
					<Typography
						id='modal-modal-title'
						style={{
							fontSize: window.innerWidth < 500 ? "14px" : "24px",
						}}>
						<b>Are you sure to delete this feed ?</b>
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
