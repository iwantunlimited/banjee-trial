import React from "react";
import { Refresh, Report, Search } from "@mui/icons-material";
import { Card, IconButton, Stack, TextField, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import moment from "moment";
import { PaginationContext } from "../../../context/PaginationContext";

function ChipComponents({ refreshApi, keyword, handleKey, handleDate, searchByDate }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const [startDate, setStartDate] = React.useState(new Date());
	const [endDate, setEndDate] = React.useState(new Date().setHours(23));

	return (
		<Card className='main-card space-css'>
			<div style={{ display: "flex", alignItems: "center" }}>
				<Tooltip title='Refresh' arrow>
					<IconButton
						onClick={() => {
							refreshApi();
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
				</Tooltip>
				{/* <TextField
					size='small'
					variant='outlined'
					label='Search'
					name='keyword'
					value={keyword}
					onChange={(e) => handleKey(e)}
					className='search-field'
				/> */}
			</div>
			{searchByDate && (
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
									label='Select Date'
									value={startDate}
									onChange={(newValue) => {
										setStartDate(newValue);
									}}
									renderInput={(params) => (
										<TextField size='small' helperText={params?.InputProps?.placeholder} {...params} />
									)}
								/>
							</LocalizationProvider>
							{/* <LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									minDate={startDate !== null && startDate}
									inputFormat='dd/MM/yyyy'
									name='endDate'
									label='End Date'
									value={endDate}
									onChange={(newValue) => {
										const nowDate = moment(newValue).format("l") === moment().format("l");
										// console.log("now date", nowDate);
										setEndDate(moment(newValue).set({ hour: 23, minute: 59, second: 59 }).format());
									}}
									renderInput={(params) => <TextField size='small' {...params} />}
								/>
							</LocalizationProvider> */}
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
						</Stack>
					</form>
				</div>
			)}
		</Card>
	);
}

export default ChipComponents;
