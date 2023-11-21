import { Avatar, Box, Card, IconButton, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "styled-components";
import { MainContext } from "../../../context/Context";
import moment from "moment";
import { Delete } from "@mui/icons-material";

export default function ThoughtCard({ ele, setOpen, setDeleteThoughtId }) {
	const theme = useTheme();
	const { themeData } = React.useContext(MainContext);
	console.log("====================================");
	console.log(ele);
	console.log("====================================");
	return (
		<>
			<Card
				sx={{
					// paddingX: "14px",
					// paddingBottom: "7px",
					width: "100%",
					// height: "100%",
					// minHeight: "250px",
					boxShadow:
						"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset",
					borderRadius: "8px",
					background: themeData === false ? "#FFF" : "default",
					cursor: "pointer",
					"&:hover": {
						background: themeData === false ? theme?.palette.grey.A700 : "#323232",
					},
				}}
			>
				<Box
					sx={{
						paddingX: "14px",
						width: "100%",
					}}
				>
					<Box
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Box
							style={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Avatar
								alt={ele?.user?.firstName}
								src={`https://gateway.banjee.org//services/media-service/iwantcdn/resources/${ele?.user?.avtarImageUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
								style={{
									height: "40px",
									width: "40px",
									objectFit: "contain",
									borderRadius: "50%",
								}}
							/>
							<Typography
								style={{
									padding: "10px 10px",
									display: "flex",
									flexDirection: "column",
								}}
							>
								{ele?.user?.firstName ? (
									<span
										style={{
											display: "-webkit-box",
											overflow: "hidden",
											WebkitBoxOrient: "vertical",
											WebkitLineClamp: 1,
										}}
									>{`${ele?.user?.firstName}`}</span>
								) : (
									<span
										style={{
											display: "-webkit-box",
											overflow: "hidden",
											WebkitBoxOrient: "vertical",
											WebkitLineClamp: 1,
										}}
									>
										{ele?.user?.username ? ele?.user?.username : "username"}
									</span>
								)}
								{ele?.scheduled === true ? (
									<span style={{ fontSize: "12px" }}>
										{/* scheduled */}
										{"Scheduled at " + moment(ele?.dateTime).format("dddd")}
									</span>
								) : (
									<span style={{ fontSize: "12px" }}>
										{moment(ele?.createdOn).format("lll")}
									</span>
								)}
							</Typography>
						</Box>
						<IconButton
							onClick={() => {
								setOpen(true);
								setDeleteThoughtId(ele?.id);
							}}
							style={{ width: "40px", height: "40px" }}
						>
							<Delete />
						</IconButton>
					</Box>
					<Box sx={{ marginY: "10px" }}>{ele?.text}</Box>
				</Box>
			</Card>
		</>
	);
}
