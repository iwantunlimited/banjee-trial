import React from "react";
import { Refresh, Report } from "@mui/icons-material";
import { Card, IconButton, TextField, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../users.css";

function ChipComp({ refreshApi, keyword, handleKey }) {
	const navigate = useNavigate();

	return (
		<Card className='main-card space-css'>
			<div style={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={() => refreshApi()}
					style={{
						borderRadius: "50px",
						marginRight: window.innerWidth < 501 ? "10px" : "30px",
						background: "#1976D2",
						padding: window.innerWidth < 501 ? "5px" : "10px",
						color: "white",
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
							background: "#1976D2",
							padding: window.innerWidth < 501 ? "5px" : "10px",
							color: "white",
						}}>
						<Report />
					</IconButton>
				</Tooltip>
			</div>
		</Card>
	);
}

export default ChipComp;
