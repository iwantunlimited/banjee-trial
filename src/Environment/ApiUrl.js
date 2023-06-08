import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from "@mui/x-data-grid";
import { services } from "./Environment.dev";

let token = "Basic aXRwbDppd2FudHVubGltaXRlZA==";

export const urls = {
	headers: {
		"Content-Type": "application/json",
		Authorization: localStorage.getItem("token")
			? "Bearer " + localStorage.getItem("token")
			: token,
		"itpl-app-name": "Merchant-Registration-App",
		"itpl-app-version": "1.0-101",
		"itpl-app-type": "web",
		"itpl-client-id": "SS7052021-001",
		"itpl-app-os": "web",
	},

	LOGIN: services.AUTH,

	DASHBOARD: {
		DASHBOARD_DATA: services.BIG_DATA + "api/dashboard/execute",
		WIDGET_GROUP: services.BIG_DATA + "api/widget-group/execute/",
		REPORTS: {
			FILTER: services.BIG_DATA + "api/analytics/filter",
			EXECUTE: services.BIG_DATA + "api/analytics/execute",
		},
	},

	ASSETS_SERVICES: {
		FILTER_CATEGORY: services.ASSETS_SERVICES + "category/filter",
		CREATE_CATEGORY: services.ASSETS_SERVICES + "category",
		CREATE_SUB_CATEGORY: services.ASSETS_SERVICES + "sub-category",
		DELETE_CATEGORY: services.ASSETS_SERVICES + "category/delete/",
		DELETE_SUB_CATEGORY: services.ASSETS_SERVICES + "sub-category/delete/",
	},
	SOCIAL_CONNECTION: {
		FILTER: services.SOCIAL_CONNECTIONS + "social-connection/group/filter",
		FIND_BY_ID: services.SOCIAL_CONNECTIONS + "social-connection/group/findById/",
		FIND_REPORTED_CUSTOMER_BY_ID: services.SOCIAL_CONNECTIONS + "secured/report/findById/",
		FILTER_REPORTED_CUSTOMER: services.SOCIAL_CONNECTIONS + "secured/report/filter",
	},
	NOTIFICATIONS: {
		ACTIVE_STATUS: services.NOTIFICATIONS + "notif/config/status",
		ACTIVE_USERS: services.NOTIFICATIONS + "user/active",
		LIVE_USER: services.NOTIFICATIONS + "online-tracker/filter",
		NOTIFICATION_CONFIG: services?.NOTIFICATIONS + "notif/config/",
		AUTO_NOTIFICATION: services?.NOTIFICATIONS + "notif/",
		MESSAGE_BROKER: services?.MESSAGE_BROKER + "message/delivery/filter",
	},
	SOCIAL_FEEDS: {
		CREATE_FEED: services.SOCIAL_FEEDS + "/feeds",
		FILTER: services.SOCIAL_FEEDS + "api/feeds/admin/filter",
		GET_FEED_DETAILS: services.SOCIAL_FEEDS + "feeds/findById/",
		GET_COMMENTS: services.SOCIAL_FEEDS + "comments/byFeed/",
		DELETE_COMMENTS: services.SOCIAL_FEEDS + "comments/delete/",
		GET_REACTIONS: services.SOCIAL_FEEDS + "reaction/",
		DELETEFEED: services.SOCIAL_FEEDS + "api/feeds/admin/remove",
		REPORTED_FEED_DETAIL: services.SOCIAL_FEEDS + "api/feeds/admin/reports/",
	},

	GEO_CLOUD: {
		CREATE_NEIGHBOURHOOD: services.GEO_CLOUD + "social-cloud",
		REMOVE_USER_FROM_NEIGHBOURHOOD: services.GEO_CLOUD + "social-cloud/quit",
		// FILTER_NEIGHBOURHOOD: services.GEO_CLOUD + "social-cloud/filter",
		FILTER_NEIGHBOURHOOD: services.GEO_CLOUD + "api/admin-filter",
		Assign_Admin_To_Cloud: services.GEO_CLOUD + "api/assignAdmin",
		Assign_Member_To_Cloud: services.GEO_CLOUD + "api/assignMember",
		PENDING_APPROVAL: services.GEO_CLOUD + "social-cloud/pending-approvals",
		APPROVE_NEIGHBOURHOOD: services.GEO_CLOUD + "social-cloud/approve",
		REJECT_NEIGHBOURHOOD: services.GEO_CLOUD + "social-cloud/reject",
		DELETE_NEIGHBOURHOOD: services.GEO_CLOUD + "social-cloud/delete/",
		FIND_NEIGHBOURHOOD: services.GEO_CLOUD + "social-cloud/findById/",
		FIND_NEIGHBOURHOOD_BY_USER_ID: services.GEO_CLOUD + "social-cloud/byUserId/",
		FILTER_MEMBERS: services.GEO_CLOUD + "social-cloud/members/filter",
		FIND_MEMBERS_BY_CLOUDID: services.GEO_CLOUD + "social-cloud/members/byCloudId/",
		GEO_ALERT: services.GEO_CLOUD + "api/geo-alert/",
		FILTER_REPORTED_ALERT: services.GEO_CLOUD + "api/geo-alert/report/filter",
		COMMUNITY: services.GEO_CLOUD + "community",
		COMMUNITY_BY_USER_ID: services.GEO_CLOUD + "community/byUserId",
	},

	LOCAL_DISCOVERY: {
		FILTER_BUSINESS: services.LOCAL_DISCOVERY + "business/filter",
		APPROVE_BUSINESS: services.LOCAL_DISCOVERY + "business/approve",
		CREATE_BUSINESS: services.LOCAL_DISCOVERY + "business/",
		FIND_BUSINESS_BYID: services.LOCAL_DISCOVERY + "business/findById/",
		FIND_BUSINESS_BY_USER_ID: services.LOCAL_DISCOVERY + "business/byUserId/",
		GET_ALL_BLOGS: services.LOCAL_DISCOVERY + "blogs/filter/",
		FIND_BLOGS_BYID: services.LOCAL_DISCOVERY + "blogs/",
		FIND_BLOGS_BY_USER_ID: services.LOCAL_DISCOVERY + "blogs/byUserId",
		CREATE_BLOG: services.LOCAL_DISCOVERY + "blogs",
		CREATE_COMMENTS: services.LOCAL_DISCOVERY_V2 + "blog/comments",
		GET_COMMENTS: services.LOCAL_DISCOVERY_V2 + "blog/comments/byPost/",
		DELETE_COMMENTS: services.LOCAL_DISCOVERY_V2 + "blog/comments/delete/",
		CREATE_REACTIONS: services.LOCAL_DISCOVERY_V2 + "user-reactions",
	},

	CDN: {
		FIND_FOLDER: services.CDN_SERVICE + "resources/find",
		FOLDER_CREATE: services.CDN_SERVICE + "resources/directory",
		UPLOAD_IMAGE: services.CDN_SERVICE + "resources/bulk",
		FOLDER_DELETE: services.CDN_SERVICE + "resources/",
		ANALYSTICS: services.CDN_SERVICE + "resources/analytics/",
		DELETE: services.CDN_SERVICE + "resources/",
	},

	CATEGORY: {
		ADD: services.PRODUCT + "category",
		FILTERLIST: services.PRODUCT + "category/filter",
		FIND_BY_ID: services.PRODUCT + "category/findById/",
		FIND_BLOCK: services.PRODUCT + "category/block/",
		FIND_ACTIVATE: services.PRODUCT + "category/activate/",
		FIND_DELETE: services.PRODUCT + "category/delete/",
	},

	THEME: {
		ADD: services.MERCHANT + "theme",
		FILTERLIST: services.MERCHANT + "theme/filter",
		FIND_BY_ID: services.MERCHANT + "theme/findById/",
		FIND_DELETE: services.MERCHANT + "theme/delete/",
	},

	USERPROFILE: {
		USER_CSV_DATA: services?.USER_PROFILE + "remote/user/csvdownload",
		USER_MEMBERSHIP: services?.USER_PROFILE_MEMBERSHIP + "/user-membership",
		CUSTOMER_LIST: services.USER_PROFILE + "profile/filter",
		CUSTOMER_FIND_BY_ID: services.USER_PROFILE + "admin/findById/",
		FIND_USER_BY_SYSTEMUSER_ID: services?.USER_PROFILE + "profile/findBySystemUserId/",
		FIND_USER_BY_USER_ID: services?.USER_PROFILE + "profile/findById/",
		FIND_USER_CONNECTION_BY_ID: services.USER_PROFILE + "admin/userConnection/",
		FIND_USER_BLOCK_LIST: services.USER_PROFILE + "admin/userBlockList/",
		DASHBOARD_LIST_CUSTOMER: services.USER_PROFILE + "admin/registry/report",
		FIND_BY_ID: services.USER_PROFILE + "profile/findById/",
		FILTER: services.USER_PROFILE + "profile/filter",
		UPDATE: services.USER_PROFILE + "profile",
	},

	COUNTRY: {
		ADD: services.LOCATION + "system/country",
		UPDATE: services.LOCATION + "system/country",
		DELETE: services.LOCATION + "system/country/delete/", // pass id when calling this api
		FIND_BLOCK: services.LOCATION + "system/country/block/",
		FIND_ACTIVATE: services.LOCATION + "system/country/activate/",
		FILTER: services.LOCATION + "system/country/findAll",
		FIND_BY_ID: services.LOCATION + "system/country/findById/", // pass id when calling this api
	},

	STATE: {
		ADD: services.LOCATION + "system/states",
		UPDATE: services.LOCATION + "system/states",
		DELETE: services.LOCATION + "system/states/delete/", // pass id when calling this api
		FILTER: services.LOCATION + "system/states/filter",
		FIND_BLOCK: services.LOCATION + "system/states/block/",
		FIND_ACTIVATE: services.LOCATION + "system/states/activate/",
		FIND_BY_ID: services.LOCATION + "system/states/findById/", // pass id when calling this api
	},

	CITY: {
		ADD: services.LOCATION + "system/city",
		UPDATE: services.LOCATION + "system/city",
		DELETE: services.LOCATION + "system/city/delete/", // pass id when calling this api
		FILTER: services.LOCATION + "system/city/filter",
		FIND_BLOCK: services.LOCATION + "system/city/block/",
		FIND_ACTIVATE: services.LOCATION + "system/city/activate/",
		FIND_BY_ID: services.LOCATION + "system/city/findById/", // pass id when calling this api
	},

	TEMPLATE: {
		ADD: services.SNS_SERVICE + "sns/templates",
		UPDATE: services.SNS_SERVICE + "sns/templates",
		DELETE: services.SNS_SERVICE + "sns/templates",
		FILTER: services.SNS_SERVICE + "sns/templates",
		FIND_BY_ID: services.SNS_SERVICE + "sns/templates",
	},

	LOCALE: services.TEMPLOCATION + "commons/locale",
	TIMEZONE: services.TEMPLOCATION + "commons/timezone",

	COUNTRY_LIST: services.LIST_OF_TOWN + "system/country/findAll/",
	STATE_LIST: services.LIST_OF_TOWN + "system/states/filter",
	CITY_LIST: services.LOCATION + "system/city/filter",
	DISTIC_LIST: services.LIST_OF_TOWN + "system/states/bycountry/",
	TAX: services.PRODUCT + "tax/filter",
	USER_HISTORY: services.PRODUCT + "user-interactions/filter",
};
