import {
	Box,
	CircularProgress,
	Divider,
	Grid,
	IconButton,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import React from "react";
import { createReactions, getReactions } from "../../services/ApiServices";

import AngryEmoji from "../../../../assets/emojis/Angry.svg";
import LaughEmoji from "../../../../assets/emojis/Laugh.svg";
import LikeEmoji from "../../../../assets/emojis/Like.svg";
import LoveEmoji from "../../../../assets/emojis/Love.svg";
import SadEmoji from "../../../../assets/emojis/Sad.svg";
import WowEmoji from "../../../../assets/emojis/Wow.svg";
import { useParams } from "react-router";

function BlogReaction({ blogData }) {
	const params = useParams();
	const theme = useTheme();

	const [reaction, setReaction] = React.useState([]);

	const [payloadData, setPayloadData] = React.useState({
		postId: params?.id,
		postType: "BLOG",
		reactionType: "",
	});

	const emojiData = [
		{
			name: "LIKE",
			emoji: LikeEmoji,
		},
		{
			name: "SAD",
			emoji: SadEmoji,
		},
		{
			name: "CELEBRATING",
			emoji: LaughEmoji,
		},
		{
			name: "LOVING",
			emoji: LoveEmoji,
		},
		{
			name: "NICE",
			emoji: WowEmoji,
		},
		{
			name: "ANGRY",
			emoji: AngryEmoji,
		},
	];

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

	const GetReactionsApi = React.useCallback(() => {
		getReactions(params?.id)
			.then((res) => {
				setReaction(res);
			})
			.catch((err) => console.error(err));
	}, []);

	const CreateReactionApiCall = React.useCallback((data) => {
		createReactions(data)
			.then((res) => {
				GetReactionsApi();
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		GetReactionsApi();
	}, [GetReactionsApi]);

	if (blogData) {
		return (
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<Box
						sx={{
							height: reaction?.length === 0 ? "100px" : reaction?.length < 20 ? "300px" : "500px",
							overflowY: reaction?.length > 5 ? "scroll" : "hidden",
						}}>
						<Grid item container xs={12} spacing={1}>
							{reaction?.length > 0 ? (
								reaction?.map((ele, index) => {
									const userLength = ele?.user?.username.length;
									return (
										<React.Fragment key={index}>
											<Grid item xs={12}>
												<Box
													sx={{
														display: "flex",
														justifyContent:
															ele?.user?.username === "root" ? "flex-end" : "flex-start",
														// blogData?.authorId === ele?.user?.id ? "flex-end" : "flex-start",
													}}>
													<Box
														key={index}
														sx={{
															maxWidth: "90%",
															// background: "#e8ebed",
															background: theme?.palette?.grey?.A700,
															borderRadius: "10px",
															padding: "5px",
															paddingX: "10px",
															textAlign: ele?.user?.username === "root" ? "right" : "left",
															// textAlign: blogData?.authorId === ele?.user?.id ? "right" : "left",
														}}>
														{ele?.user?.firstName && ele?.user?.lastName ? (
															<Typography sx={{ fontSize: "12px" }} noWrap>
																{ele?.user?.firstName + " " + ele?.user?.lastName}
															</Typography>
														) : (
															<Typography sx={{ fontSize: "12px" }} noWrap>
																{ele?.user?.username}
															</Typography>
														)}
														<Box
															sx={
																{
																	// marginRight: blogData?.authorId === ele?.user?.id ? "5px" : "0px",
																	// marginLeft: blogData?.authorId === ele?.user?.id ? "0px" : "5px",
																}
															}>
															<img
																src={getEmoji(ele?.reactionType)}
																alt=''
																style={{
																	height: "25px",
																	width: "25px",
																	objectFit: "contain",
																}}
															/>
														</Box>
													</Box>
												</Box>
											</Grid>
										</React.Fragment>
									);
								})
							) : (
								<Grid item xs={12}>
									<Typography>No Reactions !</Typography>
								</Grid>
							)}
						</Grid>
					</Box>
					{/* <Box>
						{emojiData?.map((item, index) => {
							return (
								<Tooltip title={item?.name}>
									<IconButton
										onClick={() => {
											setPayloadData((prev) => ({
												...prev,
												reactionType: item?.name,
											}));
											CreateReactionApiCall({
												postId: params?.id,
												postType: "BLOG",
												reactionType: item.name,
											});
										}}>
										<img
											src={item.emoji}
											alt={item?.name}
											style={{
												height: "25px",
												width: "25px",
												objectFit: "contain",
											}}
										/>
									</IconButton>
								</Tooltip>
							);
						})}
					</Box> */}
				</Grid>
			</Grid>
		);
	} else {
		return (
			<Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<CircularProgress />
			</Box>
		);
	}
}

export default BlogReaction;
