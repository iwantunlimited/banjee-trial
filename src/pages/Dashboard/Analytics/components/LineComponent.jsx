import React from "react";
import {
	Grid,
	Box,
	Card,
	CardContent,
	IconButton,
	Typography,
	Menu,
	MenuItem,
	Tooltip,
	ButtonGroup,
	CircularProgress,
} from "@mui/material";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { DataGrid } from "@mui/x-data-grid";
import Trial from './Trial'
import DataGridCustom from "./dataGrid";
import '../Analytics.css'

export default function LineComponent(props) {

    const { data,chart, showData,calendarData,myDate } = props

    const { series,option } = data

    console.log(chart);

    const [state,setState] = React.useState({
        series: series,
        option: option
    })

    const [anchorEl, setAnchorEl] = React.useState({
		filter: false,
	});

	const [filter, setFilter] = React.useState({
		line: false,
		stats: false,
	});

	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl((prev) => ({
			...prev,
			filter: event.currentTarget,
		}));
	};
	const handleClose = () => {
		setAnchorEl((prev) => ({
			...prev,
			filter: null,
		}));
	};

    console.log(myDate);

    const renderMenu = (
		<Menu
			id="basic-menu"
			anchorEl={anchorEl.filter}
			open={anchorEl.filter}
			onClose={handleClose}
			MenuListProps={{
				"aria-labelledby": "basic-button",
			}}
		>
			<MenuItem
				disabled={series && series.length === 0}
				sx={{
					color: myDate === "" ? "primary.main" : "text.secondary",
					borderColor: myDate === "" ? "primary.main" : "text.secondary",
				}}
				onClick={() => {
					calendarData("");
					handleClose();
				}}
			>
				Date
			</MenuItem>
			<MenuItem
				disabled={series && series.length === 0}
				sx={{
					color: myDate === "month" ? "primary.main" : "text.secondary",
					borderColor: myDate === "month" ? "primary.main" : "text.secondary",
				}}
				onClick={() => {
					calendarData("month");
					handleClose();
				}}
			>
				Month
			</MenuItem>
			<MenuItem
				disabled={series && series.length === 0}
				sx={{
					color: myDate === "year" ? "primary.main" : "text.secondary",
					borderColor: myDate === "year" ? "primary.main" : "text.secondary",
				}}
				onClick={() => {
					calendarData("year");
					handleClose();
				}}
			>
				Year
			</MenuItem>
		</Menu>
	);

	return (
        <Card
            className="lineComp-Card"
        >
            <CardContent style={{padding:'0px'}}>
                <Grid container>
                    <Grid item xs={8} lg={9} xl={10}>
                        <Typography
                            style={{fontSize: window.innerWidth < 500 ? '20px' : '25px',fontWeight:500, color:'grey'}}
                            className="customLabelData"
                            // color="textSecondary"
                        >
                            {props.title}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={4}
                        lg={3}
                        xl={2}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent:'center'
                        }}
                    >
                        <ButtonGroup
                            sx={{
                                ".MuiButtonGroup-grouped": {
                                    borderRight: "none",
                                },
                            }}
                            // size="small"
                            variant="text"
                            aria-label="text button group"
                        >
                            <Tooltip title={"Stats"}>
                                <IconButton
                                    disabled={series && series.length === 0}
                                    sx={{
                                        color: filter.stats ? "primary.main" : "text.secondary",
                                    }}
                                    onClick={() => {
                                        setFilter((prev) => ({ ...prev, stats: !prev.stats }));
                                    }}
                                >
                                    <TableChartIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Bar">
                                <IconButton
                                    disabled={series && series.length === 0}
                                    sx={{
                                        color: !filter.line ? "primary.main" : "text.secondary",
                                    }}
                                    onClick={() => {
                                        setFilter((prev) => ({
                                            ...prev,
                                            line: false,
                                            stats: false,
                                        }));
                                        // handleGraphChange("bar");
                                    }}
                                >
                                    <EqualizerIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Filter">
                                <IconButton
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleClick}
                                >
                                    <FilterAltIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            {/* {dataType === "date" && (
                                <Tooltip title="Filter">
                                    <IconButton
                                        aria-expanded={open ? "true" : undefined}
                                        onClick={handleClick}
                                    >
                                        <FilterAltIcon />
                                    </IconButton>
                                </Tooltip>
                            )} */}
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <hr className="hr-line" />
                <Box
                    sx={{
                        // height: "300px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "transparent",
                    }}
                >
                    {chart ? (
                        <React.Fragment>
                            {chart && showData ? (
                                <React.Fragment>
                                    {!filter.stats ? (
                                        <Trial 
                                            data={props.data}
                                            chart={chart}
                                            myDate={myDate}
                                        />
                                    ) : (
                                        <DataGridCustom
                                            data={chart}
                                        />
                                    )}
                                </React.Fragment>
                            ) : (
                                <Typography
                                    style={{fontSize: window.innerWidth < 500 ? '18px' : '25px',fontWeight: 500,color:'grey' }}
                                >
                                    No data for current selection
                                </Typography>
                            )}
                        </React.Fragment>
                    ) : (
                        <CircularProgress />
                    )}
                </Box>
            </CardContent>
            {renderMenu}
        </Card>
	);
}
