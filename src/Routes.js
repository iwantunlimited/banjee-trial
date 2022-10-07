import Dashboard from "./pages/Dashboard/dashboard";
import User from "./pages/Users/Users";
// import Account from "./pages/Account/Account";
import Navbar from "./pages/navbar/navbar";
import { useRoutes } from "react-router-dom";
import Login from "./pages/Login/login";
import Category from "./pages/Category/Category";
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
import Chart from "./pages/Dashboard/Chart";
import Reports from "./pages/Report/Report";
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

const Routes = () => {
	return useRoutes([
		{
			path: "",
			element: <Navbar />,
			children: [
				{
					path: "/",
					// element: <Dashboard />,
					element: <DashboardTrial />,
				},
				{
					path: "/category",
					element: <MainCategoryComp />,
				},
				{
					path: "/user",
					element: <User />,
				},
				{
					path: "/rooms",
					element: <Room />,
				},
				{
					path: "/user/view/:id",
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
					element: <UsersReport />,
				},
				{
					path: "/report/users",
					element: <UsersReport />,
				},
				{
					path: "/report/rooms",
					element: <RoomsReport />,
				},
				{
					path: "/neighbourhood",
					element: <Neighbourhood />,
				},
				{
					path: "/neighbourhood/update/:id",
					element: <EditNeighbourhood />,
				},
				{
					path: "/neighbourhood/detail/:id",
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
				// {
				// 	path: "/banjee-alert",
				// 	element: <BanjeeAlert />,
				// },
				// {
				//     path: '/account',
				//     element: <Account />
				// }
			],
		},
		{
			path: "login",
			element: <Login />,
		},
	]);
};

export default Routes;
