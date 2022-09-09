import React from "react";
import { Refresh, Report } from "@mui/icons-material";
import { Card, IconButton, TextField, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../users.css";
import { useTheme } from "@mui/material/styles";

function ChipComp({ refreshApi, keyword, handleKey }) {
	const navigate = useNavigate();
	const theme = useTheme();
	return (
		<Card className='main-card space-css'>
			<div style={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={() => refreshApi()}
					style={{
						borderRadius: "50px",
						marginRight: window.innerWidth < 501 ? "10px" : "30px",
						background: theme.palette.primary.main,
						padding: window.innerWidth < 501 ? "5px" : "10px",
						color: theme.palette.primary.contrastText,
					}}>
					<Refresh fontSize='small' />
				</IconButton>
				<TextField
					variant='outlined'
					label='Search'
					name='keyword'
					value={keyword}
					onChange={(e) => handleKey(e)}
					className='search-field'
				/>
			</div>
			<div>
				<Tooltip title='Reported Users'>
					<IconButton
						onClick={() => navigate("/user/reporteduser")}
						style={{
							borderRadius: "50px",
							background: theme.palette.primary.main,
							padding: window.innerWidth < 501 ? "5px" : "10px",
							color: theme.palette.primary.contrastText,
						}}>
						<Report />
					</IconButton>
				</Tooltip>
			</div>
		</Card>
	);
}

export default ChipComp;
