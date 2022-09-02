import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

function DeleteBlogModal({ data, openModalfun, deleteApi, blogListApi }) {
	return (
		<Modal
			className='delete-modal'
			sx={{
				"& > div": {
					backgroundColor: "rgb(35 35 35 / 8%)",
				},
			}}
			open={data?.open}
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
					minWidth: 320,
					background: "white !important",
					boxShadow: 24,
					p: 4,
				}}
				className='delete1-modal'>
				<Typography
					id='modal-modal-title'
					style={{
						fontSize: window.innerWidth < 500 ? "14px" : "24px",
					}}>
					<b>Are you sure to delete this feed ?</b>
				</Typography>

				<Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
					<Button variant='outlined' onClick={() => openModalfun(false)}>
						Cancel
					</Button>
					<Button
						variant='contained'
						type='submit'
						onClick={() => {
							deleteApi(data?.data);
							openModalfun(false);
							blogListApi();
						}}
						// onClick={() => {
						// 	deleteFeedApiCall();
						// 	filterSocialFeedsApiCall();
						// 	setOpenDModal(false);
						// }}
					>
						Submit
					</Button>
				</Box>
			</Box>
		</Modal>
	);
}

export default DeleteBlogModal;
