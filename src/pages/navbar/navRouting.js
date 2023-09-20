import React from "react";
import {
	Dashboard,
	PeopleAlt,
	// ViewHeadline,
	Category as CategoryIcon,
	ConnectWithoutContact,
	Groups,
	Report,
	TravelExplore,
	NotificationImportant,
	Summarize,
	VerifiedUser,
	EditNotifications,
} from "@mui/icons-material";
import CampaignIcon from '@mui/icons-material/Campaign';
import SocialFeed from "../Social_Feeds/Social_Feed";
import UsersReport from "../Report/UsersReport";
import Neighbourhood from "../Neighbourhoods/Neighbourhood";
import { MainCategoryComp } from "../Category/MainCategoryPage";
import Explore from "../Explore/Explore";
import ExploreBlogs from "../Explore/Components/Blogs/Blogs";
import BanjeeAlert from "../BanjeeAlert/BanjeeAlert";
import Notification from "../Notification/Notification";
import Announcement from "../Notification/components/Announcement/Announcement";
import { Notifications } from "@mui/icons-material";
import GroupComp from "../Groups/Groups";
import UserComp from "../Users/users";
import DashboardTrial from "../Dashboard/DashboardChart";
import Room from "../Rooms/Rooms";
import Reports from "../Report/Report";
import ActiveUsers from "../Report/ActiveUsers";
import Automation from "../Notification/components/Automation/Automation";
import { MainContext } from "../../context/Context";
import BanjeeEvent from "../BanjeeEvent/BanjeeEvent";
import LiveAlerts from "../LiveAlerts/LiveAlerts";

function NavRouting(props) {
	const userType = localStorage.getItem("userType");

	const adminRouting = [
		{
			id: 1,
			path: "/",
			name: "Dashboard",
			icon: <Dashboard fontSize='medium' />,
			component: <DashboardTrial />,
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
			component: <UserComp />,
		},
		// {
		// 	id: 4,
		// 	path: "/rooms",
		// 	name: "Rooms",
		// 	icon: <Groups fontSize='medium' />,
		// 	component: <Room />,
		// },
		{
			id: 5,
			path: "/social-feeds",
			name: "Social Feeds",
			icon: <ConnectWithoutContact fontSize='medium' />,
			component: <SocialFeed />,
		},
		// {
		// 	id: 6,
		// 	path: "/report",
		// 	name: "Report",
		// 	icon: <Report fontSize='medium' />,
		// 	component: <UsersReport />,
		// 	children: [
		// 		{
		// 			id: 7,
		// 			path: "/report",
		// 			name: "Users",
		// 			icon: <PeopleAlt fontSize='medium' />,
		// 			component: <UsersReport />,
		// 		},
		// 		// {
		// 		// 	id: 8,
		// 		// 	path: "/report/rooms",
		// 		// 	name: "Rooms",
		// 		// 	icon: <Groups fontSize='medium' />,
		// 		// 	component: <RoomsReport />,
		// 		// },
		// 	],
		// },
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

		{
			id: 13,
			path: "/banjee-alert",
			name: "Banjee Alert",
			icon: <NotificationImportant fontSize='medium' />,
			component: <BanjeeAlert />,
		},
		{
			id: 22,
			path: "/banjee-event",
			name: "Banjee Event",
			icon: <NotificationImportant fontSize='medium' />,
			component: <BanjeeEvent />,
		},

		{
			id: 14,
			path: "/notification",
			name: "Notification",
			icon: <Notifications fontSize='medium' />,
			component: <Notification />,
			children: [
				{
					id: 15,
					path: "/notification/template",
					name: "Template",
					icon: <Notifications fontSize='medium' />,
					component: <Announcement />,
				},
				{
					id: 16,
					path: "/notification",
					name: "Notification",
					icon: <Notifications fontSize='medium' />,
					component: <Notification />,
				},
				{
					id: 21,
					path: "/notification/automation",
					name: "Automation",
					icon: <EditNotifications fontSize='medium' />,
					component: <Automation />,
				},
			],
		},
		{
			id: 17,
			path: "/groups",
			name: "Groups",
			icon: <PeopleAlt fontSize='medium' />,
			component: <GroupComp />,
		},
		{
			id: 18,
			path: "/report",
			name: "Report",
			icon: <Summarize fontSize='medium' />,
			component: <Reports />,
			children: [
				{
					id: 19,
					path: "/report",
					name: "Users",
					icon: <PeopleAlt fontSize='medium' />,
					component: <Reports />,
				},
				{
					id: 20,
					path: "/report/activeUsers",
					name: "Active Users",
					icon: <VerifiedUser fontSize='medium' />,
					component: <ActiveUsers />,
				},
			],
		},
		{
			id: 18,
			path: "/livealerts",
			name: "Live Alerts",
			icon: <CampaignIcon fontSize='medium' />,
			component: <LiveAlerts />,
		},
		// {
		//     id:3,
		//     path: '/account',
		//     name: 'Account',
		//     icon: <AccountBox fontSize={ window.innerWidth > 500 ? "large" : 'medium' } />,
		//     component: <Account />
		// }
	];

	const specificRouting = [
		{
			id: 5,
			path: "/",
			name: "Social Feeds",
			icon: <ConnectWithoutContact fontSize='medium' />,
			component: <SocialFeed />,
		},
		{
			id: 13,
			path: "/banjee-alert",
			name: "Banjee Alert",
			icon: <NotificationImportant fontSize='medium' />,
			component: <BanjeeAlert />,
		},

		// {
		//     id:3,
		//     path: '/account',
		//     name: 'Account',
		//     icon: <AccountBox fontSize={ window.innerWidth > 500 ? "large" : 'medium' } />,
		//     component: <Account />
		// }
	];
	if (userType) {
		if (userType === "merchant") {
			return specificRouting;
		} else {
			return adminRouting;
		}
	} else {
		return [];
	}
}

export default NavRouting;
