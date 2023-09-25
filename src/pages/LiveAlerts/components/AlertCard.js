import { Box, Paper, Typography, Grid, Button, Avatar } from "@mui/material";
import React from "react";
import moment from "moment";

export default function AlertCard({ alert, handleData }) {
	console.log(alert);
	return (
		<Paper
			onClick={() => handleData(alert)}
			sx={{
				height: "250px",
				padding: "10px",
				width: "250px",
				ml: "60px",
				cursor: "pointer",
			}}
		>
			<Box>
				<Typography
					variant="h6"
					sx={{ textAlign: "center", mb: 2 }}
				>
					{alert?.eventName}
				</Typography>

				<Grid container>
					<Grid
						item
						sm={3}
						xs={3}
					>
						<Avatar
							src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${alert?.createdBy}`}
							alt={alert?.eventName}
							variant="circular"
							sx={{ height: "40px", width: "40px" }}
						/>
					</Grid>
					<Grid
						item
						sx={{ display: "flex", alignItems: "center" }}
						xs={8}
						sm={8}
					>
						<Typography sx={{ fontSize: "22px" }}>
							{alert?.createdByUser?.firstName}
						</Typography>
					</Grid>
					<Grid
						item
						xs={12}
						style={{
							display: "-webkit-box",
							webkitLineClamp: "3",
							webkitBoxOrient: "vertical",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						<span style={{ fontWeight: "bold" }}>Description: </span>
						{alert?.description}
					</Grid>
					<Grid
						item
						xs={12}
						style={{
							display: "-webkit-box",
							webkitLineClamp: "3",
							webkitBoxOrient: "vertical",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						<span style={{ fontWeight: "bold" }}>Created On: </span>
						{moment(alert?.createdOn).format("LLL")}
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
}
