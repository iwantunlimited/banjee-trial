import React from "react";
// import Account from "./pages/Account/Account";
import Navbar from "./pages/navbar/navbar";
import { useNavigate, useRoutes } from "react-router-dom";
import Login from "./pages/Login/login";
import CustomerView from "./pages/Users/components/userView";
// import Example from "./pages/Users/components/example";
import ReportedUser1 from "./pages/Users/components/ReportedUser";
import ViewReportedUsers from "./pages/Users/components/ViewReportedUsers";
import Room from "./pages/Rooms/Rooms";
import ViewRooms from "./pages/Rooms/ViewRooms";
import SocialFeed from "./pages/Social_Feeds/Social_Feed";
import ReportedFeed from "./pages/Social_Feeds/Components/Reported_Feed/ReportedFeed";
import ViewRFeed from "./pages/Social_Feeds/Components/Reported_Feed/ViewRFeed";
import DashboardTrial from "./pages/Dashboard/DashboardChart";
import RoomsReport from "./pages/Report/RoomsReport";
import UsersReport from "./pages/Report/UsersReport";
import Neighbourhood from "./pages/Neighbourhoods/Neighbourhood";
import DetailPage from "./pages/Neighbourhoods/Components/Detail Page/Details";
import { MainCategoryComp } from "./pages/Category/MainCategoryPage";
import Explore from "./pages/Explore/Explore";
import BusinessDetail from "./pages/Explore/Components/Business/BusinessDetail";
import ExploreBlogs from "./pages/Explore/Components/Blogs/Blogs";
import BlogDetail from "./pages/Explore/Components/Blogs/BlogDetail";
import EditNeighbourhood from "./pages/Neighbourhoods/Components/EditNeighbourhood";
import EditBusiness from "./pages/Explore/Components/Business/EditBusiness";
import CreateBlog from "./pages/Explore/Components/Blogs/CreateBlog";
import CreateFeed from "./pages/Social_Feeds/Components/createFeed";
import BanjeeAlert from "./pages/BanjeeAlert/BanjeeAlert";
import ViewAlert from "./pages/BanjeeAlert/components/ViewAlert";
import CreateAnnouncement from "./pages/Notification/components/Announcement/CreateAnnouncement";
import Announcement from "./pages/Notification/components/Announcement/Announcement";
import CreatePushNotification from "./pages/Notification/components/Notification/CreatePushNotification";
import Notification from "./pages/Notification/Notification";
import NotificationDetail from "./pages/Notification/components/Notification/Detail";
import AnnouncementDetail from "./pages/Notification/components/Announcement/Detail";
import UpdateBlog from "./pages/Explore/Components/Blogs/UpdateBlog";
import UpdateAnnouncement from "./pages/Notification/components/Announcement/UpdateAnnouncement";
import GroupsComp from "./pages/Groups/Groups";
import GroupDetailPage from "./pages/Groups/components/GroupDetailPage";
import UserComp from "./pages/Users/users";
import CreateAlert from "./pages/BanjeeAlert/components/CreateAlert";
import NotFound from "./pages/NotFound/NotFound";
import FeedDetail from "./pages/Social_Feeds/Components/DetailPage/FeedDetail";
import GoogleMapCustom from "./CustomComponents/GoogleMap";
import Reports from "./pages/Report/Report";
import ActiveUsers from "./pages/Report/ActiveUsers";
import Automation from "./pages/Notification/components/Automation/Automation";
import CreateAutoNotification from "./pages/Notification/components/Automation/CreateAutoNotification";
import ViewAutoNotification from "./pages/Notification/components/Automation/ViewAutoNotification";
import UpdateAutoNotification from "./pages/Notification/components/Automation/UpdateAutoNotification";
import NotifyUsers from "./pages/Notification/components/Automation/NotifyUsers";
import { MainContext } from "./context/Context";
import Loader from "./pages/Loader/Loader";

const Routes = () => {
	const navigate = useNavigate();

	const [userType, setUserType] = React.useState(false);

	const merchantRouting = [
		{
			path: "/",
			element: <SocialFeed />,
		},
		{
			path: "social-feeds/:id",
			element: <FeedDetail />,
		},
		{
			path: "social-feeds/create",
			element: <CreateFeed />,
		},
		{
			path: "/social-feeds/reported-feeds",
			element: <ReportedFeed />,
		},
		{
			path: "/social-feeds/reported-feeds/:id",
			element: <ViewRFeed />,
		},
		{
			path: "/banjee-alert",
			element: <BanjeeAlert />,
		},
		{
			path: "/banjee-alert/create",
			element: <CreateAlert />,
		},
		{
			path: "/banjee-alert/:id",
			element: <ViewAlert />,
		},
	];

	const adminRouting = [
		{
			path: "/",
			element: <DashboardTrial />,
		},
		// {
		// 	path: "/map",
		// 	element: <GoogleMapCustom isMarkerShown={true} />,
		// },
		{
			path: "/category",
			element: <MainCategoryComp />,
		},
		{
			path: "/user",
			element: <UserComp />,
		},
		{
			path: "/rooms",
			element: <Room />,
		},
		{
			path: "/user/:id",
			element: <CustomerView />,
		},
		{
			path: "/user/reporteduser",
			element: <ReportedUser1 />,
		},
		{
			path: "/user/reportedUserView/:id",
			element: <ViewReportedUsers />,
		},
		{
			path: "/rooms/view/:id",
			element: <ViewRooms />,
		},
		{
			path: "social-feeds",
			element: <SocialFeed />,
		},
		{
			path: "social-feeds/:id",
			element: <FeedDetail />,
		},
		{
			path: "social-feeds/create",
			element: <CreateFeed />,
		},
		{
			path: "/social-feeds/reported-feeds",
			element: <ReportedFeed />,
		},
		{
			path: "/social-feeds/reported-feeds/:id",
			element: <ViewRFeed />,
		},
		{
			path: "/report",
			element: <Reports />,
		},
		{
			path: "/report/activeUsers",
			element: <ActiveUsers />,
		},
		// {
		// 	path: "/report/users",
		// 	element: <UsersReport />,
		// },
		// {
		// 	path: "/report/rooms",
		// 	element: <RoomsReport />,
		// },
		{
			path: "/neighbourhood",
			element: <Neighbourhood />,
		},
		{
			path: "/neighbourhood/update/:id",
			element: <EditNeighbourhood />,
		},
		{
			path: "/neighbourhood/:id",
			element: <DetailPage />,
		},
		{
			path: "/explore",
			element: <Explore />,
		},
		{
			path: "/explore/blogs",
			element: <ExploreBlogs />,
		},
		{
			path: "/explore/blogs/createblog",
			element: <CreateBlog />,
		},
		{
			path: "/explore/blogs/update/:id",
			element: <UpdateBlog />,
		},
		{
			path: "/explore/blogs/detail/:id",
			element: <BlogDetail />,
		},
		{
			path: "/explore/detail/:id",
			element: <BusinessDetail />,
		},
		{
			path: "/explore/detail/update/:id",
			element: <EditBusiness />,
		},
		{
			path: "/banjee-alert",
			element: <BanjeeAlert />,
		},
		{
			path: "/banjee-alert/create",
			element: <CreateAlert />,
		},
		{
			path: "/banjee-alert/:id",
			element: <ViewAlert />,
		},
		{
			path: "notification",
			element: <Notification />,
		},
		{
			path: "notification/create-notification",
			element: <CreatePushNotification />,
		},
		{
			path: "notification/:id",
			element: <NotificationDetail />,
		},
		{
			path: "notification/template",
			element: <Announcement />,
		},
		{
			path: "notification/template/:id",
			element: <AnnouncementDetail />,
		},
		{
			path: "notification/template/create-template",
			element: <CreateAnnouncement />,
		},
		{
			path: "/notification/template/update/:id",
			element: <UpdateAnnouncement />,
		},
		{
			path: "/notification/automation",
			element: <Automation />,
		},
		{
			path: "/notification/automation/create",
			element: <CreateAutoNotification />,
		},
		{
			path: "/notification/automation/update/:id",
			element: <UpdateAutoNotification />,
		},
		{
			path: "/notification/automation/:id",
			element: <ViewAutoNotification />,
		},
		{
			path: "/notification/automation/notifyUsers",
			element: <NotifyUsers />,
		},
		{
			path: "/groups",
			element: <GroupsComp />,
		},
		{
			path: "/groups/:id",
			element: <GroupDetailPage />,
		},
		// {
		//     path: '/account',
		//     element: <Account />
		// }
	];

	React.useEffect(() => {
		if (localStorage?.getItem("userType") === null) {
			localStorage?.clear();
			navigate("/login");
		}
	}, []);

	React.useEffect(() => {
		setUserType(localStorage?.getItem("userType"));
	}, []);

	return useRoutes([
		{
			path: "/",
			element: <Navbar />,
			children: userType ? userType === "merchant" ? merchantRouting : adminRouting : <Loader />,
		},
		{
			path: "login",
			element: <Login />,
		},
		{
			path: "*",
			element: <NotFound />,
		},
	]);
};

export default Routes;
