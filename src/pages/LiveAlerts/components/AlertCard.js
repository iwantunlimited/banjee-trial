import { Box, Paper, Typography, Grid, Avatar, useTheme } from "@mui/material";
import React from "react";
import moment from "moment";
import { MainContext } from "../../../context/Context";

export default function AlertCard({ alert, handleData }) {
	const { themeData } = React.useContext(MainContext);
	const theme = useTheme();
	// console.log(alert);
	if (alert?.eventCode === "NEW_ALERT" || alert?.eventCode === "PANIC_EMERGENCY") {
		return (
			<Paper
				onClick={() => handleData(alert)}
				sx={{
					height: "200px",
					padding: "10px",
					ml: "20px",
					cursor: "pointer",
					transition: "background-color 0.5s ease",
					// "&:hover": {
					// 	backgroundColor: "#f0f0f0",
					// },
					borderRadius: "8px",
					boxShadow: "0 2px 7px 1px rgba(0,0,0,.3)",
					marginBottom: "5px",
					background: themeData === false ? "#FFF" : "default",
					cursor: "pointer",
					"&:hover": {
						background: themeData === false ? theme.palette.grey.A700 : "#323232",
					},
				}}>
				<Box>
					<Typography variant='h6' sx={{ textAlign: "center", marginBottom: { xs: 0.5, md: 1 } }}>
						<strong>
							{alert?.eventName.startsWith("Test") || alert?.eventName.startsWith("test")
								? "Other"
								: alert?.eventName}
						</strong>
					</Typography>
					<Grid
						item
						container
						rowSpacing={1}
						sx={{
							paddingX: { xs: 1, md: 1.5 },
						}}>
						<Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
							<Avatar
								src={`https://gateway.banjee.org/services/media-service/iwantcdn/user/${alert?.createdBy}`}
								alt={alert?.createdByUser?.firstName}
								variant='circular'
								sx={{ height: "40px", width: "40px" }}
							/>
							<Typography
								sx={{ fontSize: { xs: "16px", md: "18px", lg: "18px" }, marginLeft: { xs: 1, md: 2 } }}>
								{alert?.createdByUser?.firstName}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography
								style={{
									display: "-webkit-box",
									WebkitLineClamp: "3",
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}>
								<span style={{ fontWeight: "bold" }}>Description: </span>
								{alert?.description ? alert?.description : "No Description Added"}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography
								style={{
									display: "-webkit-box",
									WebkitLineClamp: "3",
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}>
								<span style={{ fontWeight: "bold" }}>Created On: </span>
								{moment(alert?.createdOn).format("LLL")}
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		);
	}
}
