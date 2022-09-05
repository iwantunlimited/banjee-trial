import DashboardComp from "../Dashboard/dashboard";
import User from "../Users/Users";
import {
	Dashboard,
	PeopleAlt,
	// ViewHeadline,
	Category as CategoryIcon,
	ConnectWithoutContact,
	Groups,
	Report,
	TravelExplore,
} from "@mui/icons-material";
// import Account from "../Account/Account";
import Room from "../Rooms/Rooms";
import SocialFeed from "../Social_Feeds/Social_Feed";
import UsersReport from "../Report/UsersReport";
import RoomsReport from "../Report/RoomsReport";
import Neighbourhood from "../Neighbourhoods/Neighbourhood";
import { MainCategoryComp } from "../Category/MainCategoryPage";
import Explore from "../Explore/Explore";
import ExploreBlogs from "../Explore/Components/Blogs";

const routing = [
	{
		id: 1,
		path: "/",
		name: "Dashboard",
		icon: <Dashboard fontSize='medium' />,
		component: <DashboardComp />,
	},
	{
		id: 2,
		path: "/category",
		name: "Category",
		icon: <CategoryIcon fontSize='medium' />,
		component: <MainCategoryComp />,
	},
	{
		id: 3,
		path: "/user",
		name: "Users",
		icon: <PeopleAlt fontSize='medium' />,
		component: <User />,
	},
	{
		id: 4,
		path: "/rooms",
		name: "Rooms",
		icon: <Groups fontSize='medium' />,
		component: <Room />,
	},
	{
		id: 5,
		path: "/social-feeds",
		name: "Social Feeds",
		icon: <ConnectWithoutContact fontSize='medium' />,
		component: <SocialFeed />,
	},
	{
		id: 6,
		path: "/report",
		name: "Report",
		icon: <Report fontSize='medium' />,
		component: <UsersReport />,
		children: [
			{
				id: 7,
				path: "/report",
				name: "Users",
				icon: <PeopleAlt fontSize='medium' />,
				component: <UsersReport />,
			},
			{
				id: 8,
				path: "/report/rooms",
				name: "Rooms",
				icon: <Groups fontSize='medium' />,
				component: <RoomsReport />,
			},
		],
	},
	{
		id: 9,
		path: "/neighbourhood",
		name: "Neighbourhood",
		icon: <ConnectWithoutContact fontSize='medium' />,
		component: <Neighbourhood />,
	},
	{
		id: 10,
		path: "/explore",
		name: "Explore",
		icon: <TravelExplore fontSize='medium' />,
		component: <Explore />,
		children: [
			{
				id: 11,
				path: "/explore",
				name: "Business",
				icon: <TravelExplore fontSize='medium' />,
				component: <Explore />,
			},
			{
				id: 12,
				path: "/explore/blogs",
				name: "Blogs",
				icon: <TravelExplore fontSize='medium' />,
				component: <ExploreBlogs />,
			},
		],
	},
	// {
	//     id:3,
	//     path: '/account',
	//     name: 'Account',
	//     icon: <AccountBox fontSize={ window.innerWidth > 500 ? "large" : 'medium' } />,
	//     component: <Account />
	// }
];
export default routing;
