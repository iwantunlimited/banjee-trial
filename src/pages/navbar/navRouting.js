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
import CampaignIcon from "@mui/icons-material/Campaign";
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
import Thoughts from "../Thoughts/Thoughts";
import PsychologyIcon from "@mui/icons-material/Psychology";

function NavRouting(props) {
	const userType = localStorage.getItem("userType");

	const adminRouting = [
		{
			path: "/",
			name: "Dashboard",
			icon: <Dashboard fontSize="medium" />,
			component: <DashboardTrial />,
			merchant: false,
		},
		{
			path: "/category",
			name: "Category",
			icon: <CategoryIcon fontSize="medium" />,
			component: <MainCategoryComp />,
			merchant: false,
		},
		{
			path: "/user",
			name: "Users",
			icon: <PeopleAlt fontSize="medium" />,
			component: <UserComp />,
			merchant: false,
		},
		{
			path: "/social-feeds",
			name: "Social Feeds",
			icon: <ConnectWithoutContact fontSize="medium" />,
			component: <SocialFeed />,
			merchant: true,
		},
		{
			path: "/neighbourhood",
			name: "Neighbourhood",
			icon: <ConnectWithoutContact fontSize="medium" />,
			component: <Neighbourhood />,
			merchant: false,
		},
		{
			path: "/explore",
			name: "Explore",
			icon: <TravelExplore fontSize="medium" />,
			component: <Explore />,
			merchant: false,
			children: [
				{
					path: "/explore",
					name: "Business",
					icon: <TravelExplore fontSize="medium" />,
					component: <Explore />,
				},
				{
					path: "/explore/blogs",
					name: "Blogs",
					icon: <TravelExplore fontSize="medium" />,
					component: <ExploreBlogs />,
				},
			],
		},

		{
			path: "/banjee-alert",
			name: "Banjee Alert",
			icon: <NotificationImportant fontSize="medium" />,
			component: <BanjeeAlert />,
			merchant: true,
		},
		{
			path: "/banjee-event",
			name: "Banjee Event",
			icon: <NotificationImportant fontSize="medium" />,
			component: <BanjeeEvent />,
			merchant: false,
		},
		{
			path: "/notification",
			name: "Notification",
			icon: <Notifications fontSize="medium" />,
			component: <Notification />,
			merchant: false,
			children: [
				{
					path: "/notification/template",
					name: "Template",
					icon: <Notifications fontSize="medium" />,
					component: <Announcement />,
				},
				{
					path: "/notification",
					name: "Notification",
					icon: <Notifications fontSize="medium" />,
					component: <Notification />,
				},
				{
					path: "/notification/automation",
					name: "Automation",
					icon: <EditNotifications fontSize="medium" />,
					component: <Automation />,
				},
			],
		},
		{
			path: "/groups",
			name: "Groups",
			merchant: false,
			icon: <PeopleAlt fontSize="medium" />,
			component: <GroupComp />,
		},
		{
			path: "/report",
			name: "Report",
			icon: <Summarize fontSize="medium" />,
			component: <Reports />,
			merchant: false,
			children: [
				{
					path: "/report",
					name: "Users",
					icon: <PeopleAlt fontSize="medium" />,
					component: <Reports />,
				},
				{
					path: "/report/activeUsers",
					name: "Active Users",
					icon: <VerifiedUser fontSize="medium" />,
					component: <ActiveUsers />,
				},
			],
		},
		{
			path: "/livealerts",
			name: "Live Alerts",
			icon: <CampaignIcon fontSize="medium" />,
			component: <LiveAlerts />,
			merchant: false,
		},
		{
			path: "/thoughts",
			name: "Thoughts",
			icon: <PsychologyIcon fontSize="medium" />,
			component: <Thoughts />,
			merchant: false,
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
			icon: <ConnectWithoutContact fontSize="medium" />,
			component: <SocialFeed />,
		},
		{
			id: 13,
			path: "/banjee-alert",
			name: "Banjee Alert",
			icon: <NotificationImportant fontSize="medium" />,
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
