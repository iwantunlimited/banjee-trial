import React from "react";
import {Grid} from "@mui/material";
import ChipComponent from "./components/chipComponent";
import {listCustomer} from "../../Users/User_Services/UserApiService";
import {filterRooms} from "../../Rooms/Services/ApiServices";
import {ReportedUserList} from "../../Users/User_Services/UserApiService";
import AnalyticsArea from "./AnalyticsArea";
import ChartComp from "./components/chartCompo/chart";
import TrigeredArea from "./TrigeredArea";
import DashboardTrial from "../DashboardChart";

function Analytics(props) {
	const [initialData, setInitialData] = React.useState({
		totalUsers: "",
		reportedUsers: "",
		totalRooms: "",
		totalCall: "",
		userData: [],
	});

	// console.log(initialData.totalRooms);

	const [analyticsData, setAnalyticsData] = React.useState([]);

	const [isLoad, setIsLoad] = React.useState(false);

	const [type, setType] = React.useState("month");

	const handleTypeData = (data) => {
		setType(data);
	};

	const handleIsLoad = () => {
		setIsLoad(true);
	};

	const handleAnalyticsData = React.useCallback((data) => {
		setAnalyticsData(() => data);
	}, []);

	const UserListApiCall = React.useCallback(() => {
		listCustomer({
			page: 0,
			pageSize: 1200,
		})
			.then((res) => {
				setInitialData((prev) => ({
					...prev,
					userData: res,
					totalUsers: res.totalElements,
				}));
			})
			.catch((err) => console.error(err));
	}, []);


	const totalRoomApiCall = React.useCallback(() => {
		filterRooms({
			page: 0,
			pageSize: 100,
		})
			.then((res) => {
				setInitialData((prev) => ({...prev, totalRooms: res.totalElements}));
			})
			.catch((err) => console.error(err));
	}, []);

	const ReportedUsersApiCall = React.useCallback(() => {
		ReportedUserList({
			page: 0,
			pageSize: 100,
		})
			.then((response) => {
				setInitialData((prev) => ({
					...prev,
					reportedUsers: response.totalElements,
				}));
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		UserListApiCall();
		totalRoomApiCall();
		ReportedUsersApiCall();
	}, [UserListApiCall, totalRoomApiCall, ReportedUsersApiCall]);

	return (
		<Grid item container spacing={2}>
			<Grid item xs={12}>
				<ChipComponent totalData={initialData} />
			</Grid>
			<Grid item xs={12}>
				<DashboardTrial />
			</Grid>
			{/* <Grid item xs={12}>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
						<ChartComp data={initialData.userData} />
					</Grid>
					<Grid item xs={12} sm={6} md={6} lg={6} xl={8}>
						<TrigeredArea
							dataType={type}
							handleAnalyticsData={handleAnalyticsData}
							handleIsLoad={handleIsLoad}
							typeData={handleTypeData}
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
			</Grid> */}
		</Grid>
	);
}

export default Analytics;
