import * as React from "react";
import { Modal, Typography, Box, Button, IconButton, makeStyles, Grid } from "@mui/material";
import moment from "moment";

import AngryEmoji from "../../../assets/emojis/Angry.svg";
import LaughEmoji from "../../../assets/emojis/Laugh.svg";
import LikeEmoji from "../../../assets/emojis/Like.svg";
import LoveEmoji from "../../../assets/emojis/Love.svg";
import SadEmoji from "../../../assets/emojis/Sad.svg";
import WowEmoji from "../../../assets/emojis/Wow.svg";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	border: "2px solid #999",
	boxShadow: 24,
	p: 2,
};

export default function ReactionsModal(props) {
	const {
		state: { open, data },
		handleClose,
	} = props;

	const getEmoji = (type) => {
		switch (type) {
			case "LIKE":
				return LikeEmoji;
			case "SAD":
				return SadEmoji;
			case "CELEBRATING":
				return LaughEmoji;
			case "LOVING":
				return LoveEmoji;
			case "NICE":
				return WowEmoji;
			case "ANGRY":
				return AngryEmoji;
			default:
				return LikeEmoji;
		}
	};

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
					Reactions
				</Typography>
				<Box style={{ marginTop: "10px" }}>
					<Grid container spacing={2}>
						{data?.reactions &&
							data?.reactions?.length > 0 &&
							data?.reactions?.map((ele, index) => (
								<React.Fragment key={index}>
									<Grid item xs={6}>
										<span
											style={{
												height: "100%",
												display: "flex",
												alignItems: "center",
											}}>
											{ele?.user?.username}
										</span>
									</Grid>
									<Grid item xs={6}>
										<img
											src={getEmoji(ele?.reactionType)}
											alt=''
											style={{
												height: "35px",
												width: "35px",
												objectFit: "contain",
											}}
										/>
									</Grid>
								</React.Fragment>
							))}
					</Grid>
				</Box>
			</Box>
		</Modal>
	);
}
