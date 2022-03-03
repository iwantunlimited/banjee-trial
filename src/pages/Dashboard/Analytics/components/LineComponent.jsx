import React from "react";
import {
	Grid,
	Box,
	Card,
	CardContent,
	IconButton,
	Typography,
	Tooltip,
	ButtonGroup,
	CircularProgress,
} from "@mui/material";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TableChartIcon from "@mui/icons-material/TableChart";
import Trial from './Trial'
import DataGridCustom from "./dataGrid";
import '../Analytics.css'

export default function LineComponent(props) {

    const { data,chart, showData,myDate, title} = props

    const { series } = data

    console.log(chart);

    // const [state,setState] = React.useState({
    //     series: series,
    //     option: option
    // })

	const [filter, setFilter] = React.useState({
		line: true,
		stats: false,
	});

	return (
        <Card
            className="lineComp-Card"
        >
            <CardContent style={{padding:'0px'}}>
                <Grid container>
                    <Grid item xs={8} lg={9} xl={10}>
                        <Typography
                            style={{fontSize: window.innerWidth < 500 ? '20px' : '20px',fontWeight:400, color:'grey'}}
                            className="customLabelData"
                            // color="textSecondary"
                        >
                            {title}
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
                                        setFilter((prev) => ({ ...prev, stats: !prev.stats,line: !prev.line }));
                                    }}
                                >
                                    <TableChartIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Bar">
                                <IconButton
                                    disabled={series && series.length === 0}
                                    sx={{
                                        color: filter.line ? "primary.main" : "text.secondary",
                                    }}
                                    onClick={() => {
                                        setFilter((prev) => ({
                                            ...prev,
                                            stats: !prev.stats,
                                            line: !prev.line,
                                        }));
                                        // handleGraphChange("bar");
                                    }}
                                >
                                    <EqualizerIcon fontSize="small" />
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
                                            chart={chart}
                                            dataType={myDate}
                                        />
                                    ) : (
                                        <DataGridCustom
                                            data={chart}
                                        />
                                    )}
                                </React.Fragment>
                            ) : (
                                <Typography
                                    style={{fontSize: window.innerWidth < 500 ? '18px' : window.innerWidth < 1442 ? "20px" : '25px',fontWeight: 500,color:'grey' }}
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
        </Card>
	);
}
