import React from "react";
import {
	Grid,
	Card,
    Box,
	ButtonGroup,
	CircularProgress,
    Typography,
    Select,
    Menu,
    MenuItem,
    Button,
} from "@mui/material";
import MapComponent from "./components/MapComponent";
import LineComponent from "./components/LineComponent";
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { series,options ,NewUserRegistered} from "./components/data";
import './Analytics.css'
import ChartComp from "./components/chartCompo/chart";
import TrialArea from "./TrigeredArea";

export default function AnalyticsArea(props) {


    const [value, setValue] = React.useState([null, null]);

	const { showData, analyticsValues,dataType,userData} = props;

    const data = showData 

	const analyticsData = analyticsValues;
	console.log(analyticsData);

    const [state,setState] = React.useState({
		series: series,
		option: options
	});

	const { content } = userData;   

	if(analyticsValues && userData){
		return (
			<Grid item container spacing={4} id="canvas">
                {/* <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                    <ChartComp data={userData} />
				</Grid>
                <Grid item xs={12} sm={6} md={6} lg={8} xl={8}>
                    <TrialArea 
                        handleAnalyticsData={(data) => handleAnalyticsData(data)}
						showData={(data) => handleIsLoad(data)}
						dataType={myDate}
                    />
                    <Card className="main-card" style={{display:'flex',justifyContent:'center'}}>
                        <Box>
                            <div>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateRangePicker
                                    startText="Start-Date"
                                    endText="End-Date"
                                    value={value}
                                    onChange={(newValue) => {
                                        setValue(newValue);
                                    }}
                                    renderInput={(startProps, endProps) => (
                                    <React.Fragment>
                                        <TextField {...startProps} />
                                        <Box sx={{ mx: 2 }}> to </Box>
                                        <TextField {...endProps} />
                                    </React.Fragment>
                                    )}
                                />
                                </LocalizationProvider>
                            </div>
                        <div style={{display:'flex',alignItems:'center',marginTop: '20px'}}>
                            <Typography variant="h6">21/02/2022</Typography>
                            <Select style={{marginLeft: '20px'}}>
                                <Menu>
                                    <MenuItem>1</MenuItem>
                                    <MenuItem>2</MenuItem>
                                </Menu>
                            </Select>
                        </div>
                        <div>
                            <Button>
                                Submit
                            </Button>
                        </div>
                        </Box>
                    </Card>
                </Grid>  */}
				<Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
					<LineComponent
						title={"Total Registered User's"}
						showData={data}
						data={state}
						myDate={dataType}
						chart={analyticsData}
					/>
				</Grid>
				<Grid item xs={12} sm={12} md={12} lg={12} xl={12}> 
					<Card 
                        className="lineComp-Card"
					>
						<div style={{fontSize: window.innerWidth < 500 ? '20px' : '25px',color:'grey',fontWeight:'500'}}>
							Total User's Location
						</div>
						<hr className="hr-line" />
						{
							userData && userData.content 
							?
							<MapComponent
								isMarkerShown
								googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3.exp&libraries=geometry,drawing,places"
								loadingElement={<div style={{ height: `100%` }} />}
								containerElement={<div style={{ height: `400px` }} />}
								mapElement={<div style={{ height: `100%` }} />}
								data={content}
							/>
							:
							<div style={{diplay:'flex',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
								<CircularProgress style={{textAlign:'center'}} />
							</div>
						}
					</Card>
				</Grid>
			</Grid>
		);
	}else{
		return(
			<div style={{width:'100vh',height:'100vh'}}>
				<CircularProgress />
			</div>
		)
	}
}
