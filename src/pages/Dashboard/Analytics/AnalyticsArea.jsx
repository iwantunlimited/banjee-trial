import React from "react";
import {
	Grid,
	Card,
	CircularProgress,
} from "@mui/material";
import MapComponent from "./components/MapComponent";
import LineComponent from "./components/LineComponent";
import { series,options } from "./components/data";
import './Analytics.css'

export default function AnalyticsArea(props) {

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
			<Grid item container spacing={2} id="canvas">
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
						<div style={{fontSize: window.innerWidth < 500 ? '20px' : window.innerWidth < 1442 ? '20px' : '25px',color:'grey',fontWeight:'500'}}>
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
