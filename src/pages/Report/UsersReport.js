import React from "react";
import { Box, Card, Container, IconButton, Typography } from "@mui/material";
import ReportChart from "../Dashboard/ReportChart";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { DateRangePicker, DateRange } from "@mui/x-date-pickers-pro/DateRangePicker";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { Search } from "@mui/icons-material";

function UsersReport() {
	const [dateValue, setDateValue] = React.useState([null, null]);
	const [state, setState] = React.useState(null);
	return (
		<Container maxWidth='xl'>
			<Card
				sx={{
					boxShadow: "0px",
					borderRadius: "0px",
					padding: "20px",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Typography>Filter Data</Typography>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<LocalizationProvider
						dateAdapter={AdapterDateFns}
						localeText={{ start: "Check-in", end: "Check-out" }}>
						<DateRangePicker
							value={dateValue}
							onChange={(newValue) => {
								setDateValue(newValue);
							}}
							renderInput={(startProps, endProps) => (
								<React.Fragment>
									<TextField {...startProps} />
									<Box sx={{ marginX: "20px" }}> to </Box>
									<TextField {...endProps} />
								</React.Fragment>
							)}
						/>
					</LocalizationProvider>
					<IconButton
						sx={{
							marginX: "10px",
							background: "#1976D2",
							padding: "1.5px",
							width: "50px",
							height: "50px",
							// borderRadius: "50%",
							color: "white",
							"&:hover": {
								background: "#1976D2",
							},
						}}
						onClick={() =>
							setState({
								createdOn: {
									$gte: new Date(dateValue[0]),
									$lte: new Date(dateValue[1]),
								},
							})
						}>
						<Search sx={{ padding: "0px", margin: "0px" }} fontSize='medium' />
					</IconButton>
				</Box>
			</Card>
			<Box sx={{ marginY: "20px" }}>
				<ReportChart
					height={"600px"}
					width={"100%"}
					filter={state !== null ? state : null}
					chartId={"62b427e2-852c-47cd-8b42-6e0624ccccda"}
					chartname='userChart'
				/>
			</Box>
		</Container>
	);
}

export default UsersReport;
