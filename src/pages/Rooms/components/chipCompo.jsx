import React from "react";
import { Refresh } from "@mui/icons-material";
import { Card, IconButton, TextField } from "@mui/material";
import "../../Users/users.css";
import { useTheme } from "@mui/material/styles";

function ChipCompo({ refreshApi, handleSearch, words }) {
	const theme = useTheme();

	return (
		<Card className='main-card space-css'>
			<div style={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={() => refreshApi(0, 10, "")}
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
					name='words'
					value={words}
					onChange={(e) => handleSearch(e)}
					className='search-field'
				/>
			</div>
			{/* <div>
                <Tooltip title="Reported Users">
                <IconButton  onClick={() => navigate('/user/reporteduser')}
                        style={{borderRadius: '50px',background: '#1976D2',padding:  window.innerWidth < 501 ? '5px' : '10px',color:'white'}}
                    >
                    <Report />
                </IconButton>
                </Tooltip>
            </div> */}
		</Card>
	);
}

export default ChipCompo;
