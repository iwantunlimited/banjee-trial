import React from "react";
import { Refresh, Report, Search } from "@mui/icons-material";
import { Card, IconButton, Stack, TextField, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../users.css";
import { useTheme } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import moment from "moment";
import { PaginationContext } from "../../../context/PaginationContext";

function ChipComp({ refreshApi, keyword, handleKey, handleDate }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const { setUserPagination } = React.useContext(PaginationContext);
	const [startDate, setStartDate] = React.useState(null);
	const [endDate, setEndDate] = React.useState(null);

	return (
		<Card className='main-card space-css'>
			<div style={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={() => {
						setUserPagination({ page: undefined, pageSize: undefined });
						refreshApi({ startDate: null, endDate: null, page: 0, pageSize: 10 });
					}}
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
					size='small'
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
						handleDate({
							startDate: startDate,
							endDate: endDate,
						});
					}}>
					<Stack direction={"row"} spacing={3}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								inputFormat='dd/MM/yyyy'
								name='startDate'
								label='Start Date'
								value={startDate}
								onChange={(newValue) => {
									setStartDate(moment(newValue).set({ hour: 0, minute: 0, second: 0 }).format());
								}}
								renderInput={(params) => (
									<TextField size='small' helperText={params?.InputProps?.placeholder} {...params} />
								)}
							/>
						</LocalizationProvider>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DatePicker
								minDate={startDate !== null && startDate}
								inputFormat='dd/MM/yyyy'
								name='endDate'
								label='End Date'
								value={endDate}
								onChange={(newValue) => {
									// const nowDate = moment(newValue).format("l") === moment().format("l");
									// console.log("now date", nowDate);
									// console.log("now date ---", moment().format());
									setEndDate(moment(newValue).set({ hour: 23, minute: 59, second: 58 }).format());
								}}
								renderInput={(params) => <TextField size='small' {...params} />}
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

						{/* for get reported user list */}
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
					</Stack>
				</form>
			</div>
		</Card>
	);
}

export default ChipComp;
