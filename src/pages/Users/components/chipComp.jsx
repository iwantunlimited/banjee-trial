import React from "react";
import { Refresh, Report, Search } from "@mui/icons-material";
import { Card, IconButton, Stack, TextField, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../users.css";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import moment from "moment";

function ChipComp({ refreshApi, keyword, handleKey, handleDate }) {
	const navigate = useNavigate();
	const theme = useTheme();

	const [sDate, setSDate] = React.useState([null, null]);

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
				<form
					onSubmit={(event) => {
						event.preventDefault();
						handleDate(sDate);
					}}>
					<Stack direction={"row"} spacing={3}>
						<LocalizationProvider
							dateAdapter={AdapterDateFns}
							localeText={{ start: "from-date", end: "to-date" }}>
							<DateRangePicker
								inputFormat='dd/MM/yyyy'
								value={sDate}
								onChange={(newValue) => {
									setSDate(newValue);
								}}
								renderInput={(startProps, endProps) => (
									<React.Fragment>
										<TextField required {...startProps} />
										<Box sx={{ mx: 2 }}> to </Box>
										<TextField required {...endProps} />
									</React.Fragment>
								)}
							/>
						</LocalizationProvider>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<IconButton
								type='submit'
								color='primary'
								style={{
									borderRadius: "50px !important",
									background: theme.palette.primary.main,
									padding: window.innerWidth < 501 ? "5px" : "10px",
									color: theme.palette.primary.contrastText,
								}}>
								<Search fontSize='small' />
							</IconButton>
						</Box>
						{/* <Tooltip title='Reported Users'>
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
					</Tooltip> */}
					</Stack>
				</form>
			</div>
		</Card>
	);
}

export default ChipComp;
