import React from "react";
import { Grid, Typography } from "@mui/material";
import ChipComponent from "./components/chipComponent";
import { listCustomer } from '../../Users/User_Services/UserApiService'
import {filterRooms} from '../../Rooms/Services/ApiServices'
import { ReportedUserList } from '../../Users/User_Services/UserApiService'
import AnalyticsArea from "./AnalyticsArea";
import TrialArea from "./TrigeredArea";
import ChartComp from "./components/chartCompo/chart";
import Trial from "./components/Trial";
import TrigeredArea from "./TrigeredArea";

function Analytics(props){

    const [ initialData, setInitialData ] = React.useState({
		totalUsers: '',
		reportedUsers: '',
		totalRooms: '',
		totalCall:'',
		userData: [],

	})

    console.log(initialData.totalRooms);

	const[analyticsData,setAnalyticsData] = React.useState([]);

	const [isLoad,setIsLoad] = React.useState(false)

	const [type,setType] = React.useState("month");

    const handleTypeData = (data) =>{
        setType(data)
    }

	const handleIsLoad = () =>{
		setIsLoad(true)
	}

	const handleAnalyticsData = React.useCallback( (data) => {
		setAnalyticsData(() => data);
	},[]);

    const UserListApiCall = React.useCallback(() => {
        listCustomer({
            "page": 0,
            "pageSize": 1200
        }).then((res) => {
            console.log(res);
            setInitialData((prev) => ({...prev, userData: res, totalUsers: res.totalElements}))
        }).catch((err) => console.log(err))
    },[])

    console.log(initialData.totalMale);

    const totalRoomApiCall = React.useCallback(() => {
        filterRooms({
            "page": 0,
            "pageSize": 100
        }).then((res) => {
            setInitialData((prev) => ({...prev,totalRooms: res.totalElements}))
        }).catch((err) => console.log(err))
    },[])

	const ReportedUsersApiCall = React.useCallback(() => {
		ReportedUserList({
			page: 0,
			pageSize: 100
		}).then((response) => {
			console.log(response, 'calles');
			setInitialData((prev) => ({...prev,reportedUsers: response.totalElements}))
		}).catch((err) => console.log(err))
	},[])

    React.useEffect(() => {
        UserListApiCall();
        totalRoomApiCall();
        ReportedUsersApiCall();
    },[UserListApiCall,totalRoomApiCall,ReportedUsersApiCall])

    return(
        <Grid item container spacing={4}>
            <Grid item xs={12}>
                <ChipComponent totalData={initialData} />
            </Grid>
            <Grid item xs={12}>
                <Grid item container xs={12} spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                        <ChartComp 
                            data={initialData.userData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={8}>
                        <TrigeredArea 
                            dataType={type}
                            handleAnalyticsData={handleAnalyticsData}
                            handleIsLoad={handleIsLoad}
                            typeData={(data) =>  handleTypeData(data)}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <AnalyticsArea 
                    userData={initialData.userData}
                    analyticsValues={analyticsData}
                    showData={isLoad}
                    dataType={type}
                />
            </Grid>
        </Grid>
    )
}

export default Analytics;