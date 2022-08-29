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

	SVOD_FIND: services.SVOD + "subscriptionpackage/find",

	LOGIN: services.AUTH,

	DASHBOARD: {
		DASHBOARD_DATA: services.BIG_DATA + "api/dashboard/execute",
		WIDGET_GROUP: services.BIG_DATA + "api/widget-group/execute/",
		REPORTS: {
			FILTER: services.BIG_DATA + "api/analytics/filter",
			EXECUTE: services.BIG_DATA + "api/analytics/execute",
		},
	},

	SOCIAL_CONNECTION: {
		FILTER: services.SOCIAL_CONNECTIONS + "social-connection/group/filter",
		FIND_BY_ID: services.SOCIAL_CONNECTIONS + "social-connection/group/findById/",
	},

	SOCIAL_FEEDS: {
		FILTER: services.SOCIAL_FEEDS + "api/feeds/admin/filter",
		GET_FEED_DETAILS: services.SOCIAL_FEEDS + "feeds/findById/",
		GET_COMMENTS: services.SOCIAL_FEEDS + "comments/byFeed/",
		GET_REACTIONS: services.SOCIAL_FEEDS + "reaction/",
		DELETEFEED: services.SOCIAL_FEEDS + "api/feeds/admin/remove",
		REPORTED_FEED_DETAIL: services.SOCIAL_FEEDS + "api/feeds/admin/reports/",
	},

	GEO_CLOUD: {
		CREATE: services.GEO_CLOUD + "social-cloud",
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
		// ADD: services.MERCHANT + "merchant",
		// FILTERLIST: services.MERCHANT + "merchant/filter",
		FIND_BY_ID: services.USER_PROFILE + "profile/findById/",
		// FIND_BLOCK: services.MERCHANT + "merchant/block/",
		// FIND_ACTIVATE: services.MERCHANT + "merchant/activate/",
		// FIND_DELETE: services.MERCHANT + "merchant/delete/",
		FILTER: services.USER_PROFILE + "profile/filter",
		UPDATE: services.USER_PROFILE + "profile",
	},

	FEATURED: {
		ADD: services.PRODUCT + "store-front/collection",
		FILTERLIST: services.PRODUCT + "store-front/collection/filter",
		FIND_BY_ID: services.PRODUCT + "store-front/findById/",
		FIND_BLOCK: services.PRODUCT + "store-front/block/",
		FIND_ACTIVATE: services.PRODUCT + "store-front/activate/",
		FIND_DELETE: services.PRODUCT + "store-front/delete/",
	},

	TAX_CONFIG: {
		ADD: services.PRODUCT + "tax",
		FILTER: services.PRODUCT + "tax/filter",
		FIND_BY_ID: services.PRODUCT + "tax/findById/",
		FIND_DELETE: services.PRODUCT + "tax/delete/",
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

	TRANSACTION_RELAY_CONFIG: {
		ADD: services.USER_SERVICE + "system/relayconfig",
		UPDATE: services.USER_SERVICE + "system/relayconfig",
		DELETE: services.USER_SERVICE + "system/relayconfig",
		FILTER: services.USER_SERVICE + "system/relayconfig",
		FIND_BY_ID: services.USER_SERVICE + "system/relayconfig",
	},

	TEMPLATE: {
		ADD: services.SNS_SERVICE + "sns/templates",
		UPDATE: services.SNS_SERVICE + "sns/templates",
		DELETE: services.SNS_SERVICE + "sns/templates",
		FILTER: services.SNS_SERVICE + "sns/templates",
		FIND_BY_ID: services.SNS_SERVICE + "sns/templates",
	},

	PAGE_CONTENT: {
		PAGE_CONTENT: services.PRODUCT + "store-front/page",
		FIND_BY_ID: services.PRODUCT + "store-front/page/findById/",
		DELETE: services.PRODUCT + "store-front/page/delete/",
	},

	PAYMENTMODE_LIST: services.PAYMENTMODE + "findAll",
	DELIVERYMODE_LIST: services.ORDER + "remote/deliveryMode/findByDomain/",

	LOCALE: services.TEMPLOCATION + "commons/locale",
	TIMEZONE: services.TEMPLOCATION + "commons/timezone",

	COUNTRY_LIST: services.LIST_OF_TOWN + "system/country/findAll/",
	STATE_LIST: services.LIST_OF_TOWN + "system/states/filter",
	CITY_LIST: services.LOCATION + "system/city/filter",
	DISTIC_LIST: services.LIST_OF_TOWN + "system/states/bycountry/",
	TAX: services.PRODUCT + "tax/filter",
	USER_HISTORY: services.PRODUCT + "user-interactions/filter",
};
