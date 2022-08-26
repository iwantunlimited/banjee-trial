import { Refresh } from "@mui/icons-material";
import { Card, Typography, IconButton, Tooltip, Box } from "@mui/material";
import React from "react";

function ChipComp() {
	return (
		<Card
			sx={{
				p: 2,
				mb: 2,
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flexDirection: { xs: "column", sm: "row" },
			}}>
			<Box sx={{ mb: { xs: 2, sm: 0 } }}>
				<Typography
					sx={{
						color: "#6b778c",
						fontSize: "20px",
						fontWeight: "500",
						textAlign: "left",
					}}>
					Create Neighbourhood
				</Typography>
			</Box>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Box sx={{ ml: 1 }}>
					<Tooltip title='Refresh'>
						<IconButton
							// onClick={() => navigate("reported-feeds")}
							style={{
								borderRadius: "50px",
								background: "#1976D2",
								padding: window.innerWidth < 501 ? "5px" : "10px",
								color: "white",
							}}>
							<Refresh />
						</IconButton>
					</Tooltip>
				</Box>
			</Box>
		</Card>
	);
}

export default ChipComp;
