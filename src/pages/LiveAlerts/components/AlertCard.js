import { Box, Paper, Typography, Grid, Avatar } from "@mui/material";
import React from "react";
import moment from "moment";

export default function AlertCard({ alert, handleData }) {
	console.log(alert);
	if (alert?.eventCode === "NEW_ALERT") {
		return (
			<Paper
				onClick={() => handleData(alert)}
				sx={{
					height: "200px",
					padding: "10px",
					ml: "20px",
					cursor: "pointer",
					transition: "background-color 0.5s ease",
					"&:hover": {
						backgroundColor: "#f0f0f0",
					},
				}}
			>
				<Box>
					<Typography
						variant="h6"
						sx={{ textAlign: "center" }}
					>
						<strong>
							{alert?.eventName.startsWith("Test") ||
							alert?.eventName.startsWith("test")
								? "Other"
								: alert?.eventName}
						</strong>
					</Typography>
					<Grid container>
						<Grid
							item
							sm={3}
							xs={3}
							sx={{ my: 1 }}
						>
							<Avatar
								src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${alert?.createdBy}`}
								alt={alert?.createdByUser?.firstName}
								variant="circular"
								sx={{ height: "50px", width: "50px" }}
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
								WebkitLineClamp: "3",
								WebkitBoxOrient: "vertical",
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
								WebkitLineClamp: "3",
								WebkitBoxOrient: "vertical",
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
	if (alert?.eventCode === "PANIC_EMERGENCY") {
		return (
			<Paper
				onClick={() => handleData(alert)}
				sx={{
					height: "200px",
					padding: "10px",
					ml: "20px",
					cursor: "pointer",
					transition: "background-color 0.5s ease",
					"&:hover": {
						backgroundColor: "#f0f0f0",
					},
				}}
			>
				<Box
					sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
				>
					<Typography variant="h5">
						<strong>{alert?.eventName}</strong>
					</Typography>
				</Box>

				<Grid container>
					<Grid
						item
						md={3}
						sm={3}
						xs={3}
					>
						<Avatar
							src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${alert?.createdBy}`}
							alt={alert?.eventName}
							variant="circular"
							sx={{ height: "70px", width: "70px" }}
						/>
					</Grid>
					<Grid
						item
						md={9}
						ms={9}
						xs={9}
					>
						<Typography sx={{ fontSize: "22px", mt: 2 }}>
							{alert?.createdByUser?.firstName}
						</Typography>
					</Grid>
				</Grid>

				<Grid container>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
					>
						<Typography
							style={{
								display: "-webkit-box",
								WebkitLineClamp: "3",
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							<span style={{ fontWeight: "bold" }}>Description: </span>
							{alert?.description?.length > 0
								? alert?.description
								: "No Discription Added"}
						</Typography>
					</Grid>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
					>
						<Typography component="h6">
							<span style={{ fontWeight: "bold" }}>Created On: </span>
							{moment(alert?.createdOn).format("LLL")}
						</Typography>
					</Grid>
				</Grid>

				<Grid
					container
					sx={{ display: "flex", alignItems: "center" }}
				>
					<Grid
						item
						sx={{ marginLeft: 2 }}
						md={12}
						sm={12}
						xs={12}
					></Grid>
				</Grid>
			</Paper>
		);
	} else {
		return <></>;
	}
}
