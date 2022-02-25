import {services} from "./Environment.dev";

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

	CDN: {
		FIND_FOLDER: services.CDN_SERVICE + "resources/find",
		FOLDER_CREATE: services.CDN_SERVICE + "resources/directory",
		UPLOAD_IMAGE: services.CDN_SERVICE + "resources/bulk",
		FOLDER_DELETE: services.CDN_SERVICE + "resources/",
		ANALYSTICS: services.CDN_SERVICE + "resources/analytics/",
		DELETE: services.CDN_SERVICE + "resources/",
	},

	DEPARTMENT: {
		ADD: services.PRODUCT + "department",
		UPDATE: services.PRODUCT + "department",
		FILTERLIST: services.PRODUCT + "department/filter",
		FIND_BY_ID: services.PRODUCT + "department/findById/",
		FIND_BLOCK: services.PRODUCT + "department/block/",
		FIND_ACTIVATE: services.PRODUCT + "department/activate/",
		FIND_DELETE: services.PRODUCT + "department/delete/",
	},

	LOCATIONMAN: {
		ADD: services.PRODUCT + "location",
		UPDATE: services.PRODUCT + "location",
		FILTERLIST: services.PRODUCT + "location/filter",
		FIND_BY_ID: services.PRODUCT + "location/findById/",
		FIND_BLOCK: services.PRODUCT + "location/view/",
		FIND_DELETE: services.PRODUCT + "location/delete/",
	},

	BRANDS: {
		ADD: services.PRODUCT + "brand",
		UPDATE: services.PRODUCT + "brand",
		FILTERLIST: services.PRODUCT + "brand/filter",
		FIND_BY_ID: services.PRODUCT + "brand/findById/",
		FIND_BLOCK: services.PRODUCT + "brand/block/",
		FIND_ACTIVATE: services.PRODUCT + "brand/activate/",
		FIND_DELETE: services.PRODUCT + "brand/delete/",
	},
	DASHBORD: {
		ADD: services.WIDGET_GROUP + "dashboard",
		UPDATE: services.WIDGET_GROUP + "dashboard",
		FILTERLIST: services.WIDGET_GROUP + "dashboard/filter",
		FIND_BY_ID: services.WIDGET_GROUP + "dashboard/findById/",
		FIND_DELETE: services.WIDGET_GROUP + "dashboard/delete/",
	},
	WIDGETGROUP: {
		ADD: services.WIDGET_GROUP + "widget-group",
		FILTERLIST: services.WIDGET_GROUP + "widget-group/filter",
		FIND_BY_ID: services.WIDGET_GROUP + "widget-group/findById/",
		FIND_BLOCK: services.WIDGET_GROUP + "widget-group/block/",
		FIND_ACTIVATE: services.WIDGET_GROUP + "widget-group/activate/",
		FIND_DELETE: services.WIDGET_GROUP + "widget-group/delete/",
	},
	WIDGET: {
		ADD: services.WIDGET_GROUP + "analytics",
		FILTERLIST: services.WIDGET_GROUP + "analytics/filter",
		FIND_BY_ID: services.WIDGET_GROUP + "analytics/findByElement",
		FIND_BLOCK: services.WIDGET_GROUP + "analytics/block/",
		FIND_ACTIVATE: services.WIDGET_GROUP + "analytics/activate/",
		FIND_DELETE: services.WIDGET_GROUP + "analytics/delete/",
		SERVICE_LIST: services.WIDGET_GROUP + "meta-data/services",
		OUTPUT_FORMATS: services.WIDGET_GROUP + "meta-data/output-formats",
	},

	VARIENT: {
		ADD: services.PRODUCT + "variant",
		FILTERLIST: services.PRODUCT + "variant/filter",
		FIND_BY_ID: services.PRODUCT + "variant/findById/",
		FIND_BLOCK: services.PRODUCT + "variant/block/",
		FIND_ACTIVATE: services.PRODUCT + "variant/activate/",
		FIND_DELETE: services.PRODUCT + "variant/delete/",
	},

	CAMPAIGN: {
		ADD: services.PRODUCT + "campaign",
		FILTERLIST: services.PRODUCT + "campaign/filter",
		FIND_BY_ID: services.PRODUCT + "campaign/findById/",
		FIND_DELETE: services.PRODUCT + "vacampaignriant/delete/",
	},

	PROMOTIONSOFERS: {
		ADD: services.PRODUCT + "promotion",
		FILTERLIST: services.PRODUCT + "promotion/filter",
		FIND_BY_ID: services.PRODUCT + "promotion/findById/",
		FIND_DELETE: services.PRODUCT + "promotion/delete/",
	},

	LIVE_STORE: {
		ADD: services.PRODUCT + "store",
		FILTERLIST: services.PRODUCT + "store/filter",
		FIND_BY_ID: services.PRODUCT + "store/findById/",
		FIND_BLOCK: services.PRODUCT + "store/block/",
		FIND_ACTIVATE: services.PRODUCT + "store/activate/",
	},

	CATEGORY: {
		ADD: services.PRODUCT + "category",
		FILTERLIST: services.PRODUCT + "category/filter",
		FIND_BY_ID: services.PRODUCT + "category/findById/",
		FIND_BLOCK: services.PRODUCT + "category/block/",
		FIND_ACTIVATE: services.PRODUCT + "category/activate/",
		FIND_DELETE: services.PRODUCT + "category/delete/",
	},

	SELLEROUTLET: {
		ADD: services.MERCHANT + "seller",
		FILTERLIST: services.MERCHANT + "seller/filter",
		FIND_BY_ID: services.MERCHANT + "seller/findById/",
		FIND_BLOCK: services.MERCHANT + "seller/block/",
		FIND_ACTIVATE: services.MERCHANT + "seller/activate/",
		FIND_DELETE: services.MERCHANT + "seller/delete/",
	},

	PRODUCTCATALOGUE: {
		ADD: services.PRODUCT + "catalogue",
		FILTERLIST: services.PRODUCT + "catalogue/filter",
		FIND_BY_ID: services.PRODUCT + "catalogue/findById/",
		FIND_BLOCK: services.PRODUCT + "catalogue/block/",
		FIND_ACTIVATE: services.PRODUCT + "catalogue/activate/",
		FIND_DELETE: services.PRODUCT + "catalogue/delete/",
	},

	PRODUCTLISTING: {
		ADD: services.PRODUCT + "listing",
		FILTERLIST: services.PRODUCT + "listing/filter",
		FIND_BY_ID: services.PRODUCT + "listingreq/findById/",
		FIND_BLOCK: services.PRODUCT + "listing/block/",
		FIND_ACTIVATE: services.PRODUCT + "listing/activate/",
		FIND_DELETE: services.PRODUCT + "listingreq/delete/",
	},

	PRODUCTTYPE: {
		ADD: services.PRODUCT + "type",
		FILTERLIST: services.PRODUCT + "type/filter",
		FIND_BY_ID: services.PRODUCT + "type/findById/",
		FIND_BLOCK: services.PRODUCT + "type/block/",
		FIND_ACTIVATE: services.PRODUCT + "type/activate/",
		FIND_DELETE: services.PRODUCT + "type/delete/",
	},

	THEME: {
		ADD: services.MERCHANT + "theme",
		FILTERLIST: services.MERCHANT + "theme/filter",
		FIND_BY_ID: services.MERCHANT + "theme/findById/",
		FIND_DELETE: services.MERCHANT + "theme/delete/",
	},

	DELIVERY: {
		ADD: services.ORDER + "deliveryMode",
		FILTERLIST: services.ORDER + "deliveryMode/filter",
		FIND_BY_ID: services.ORDER + "deliveryMode/findById/",
		FIND_BLOCK: services.ORDER + "deliveryMode/block/",
		FIND_ACTIVATE: services.ORDER + "deliveryMode/activate/",
		FIND_DELETE: services.ORDER + "deliveryMode/delete/",
	},

	MERCHANT: {
		ADD: services.MERCHANT + "merchant",
		FILTERLIST: services.MERCHANT + "merchant/filter",
		FIND_BY_ID: services.MERCHANT + "merchant/findById/",
		FIND_BLOCK: services.MERCHANT + "merchant/block/",
		FIND_ACTIVATE: services.MERCHANT + "merchant/activate/",
		FIND_DELETE: services.MERCHANT + "merchant/delete/",
		FIND_VALIDATE: services.MERCHANT + "merchant/validate/",
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

	LIVEPRODUCTS: {
		UPDATE: services.PRODUCT + "storefront/update",
		FILTERLIST: services.PRODUCT + "storefront/filter",
		// FIND_BY_ID: services.LIVEPRODUCT + "store-front/findById",
		FIND_BLOCK: services.PRODUCT + "storefront/offline",
		FIND_ACTIVATE: services.PRODUCT + "storefront/offline",
	},

	PAYMENT_MODE: {
		ADD: services.PAYMENT + "paymentMode/v2",
		FIND_ALL: services.PAYMENT + "paymentMode/v2/findAll",
		FIND_BY_ID: services.PAYMENT + "paymentMode/v2/findById/",
		FIND_BY_ACCOUNT: services.PAYMENT + "paymentMode/v2/findByAccount",
		FIND_DELETE: services.PAYMENT + "paymentMode/v2/delete/",
	},

	PAYMENT_GATEWAY: {
		ADD: services.PAYMENT + "payment-gateway",
		FIND_ALL: services.PAYMENT + "payment-gateway/findAll",
		FIND_BY_ID: services.PAYMENT + "payment-gateway/findById/",
		FIND_BY_ACCOUNT: services.PAYMENT + "payment-gateway/findByAccount",
		FIND_DELETE: services.PAYMENT + "payment-gateway/delete/",
	},

	PAYMENT_ACCOUNT: {
		ADD: services.PAYMENT + "payment-gateway/account",
		FIND_ALL: services.PAYMENT + "payment-gateway/account/findAllByDomain",
		FIND_BY_ID: services.PAYMENT + "payment-gateway/account/findById/",
		FIND_BLOCK: services.PAYMENT + "payment-gateway/account/block/",
		FIND_ACTIVATE: services.PAYMENT + "payment-gateway/account/activate/",
		FIND_DELETE: services.PAYMENT + "payment-gateway/account/delete/",
	},

	SALEORDERS: {
		ADD: services.ORDER + "salesorder",
		FILTERLIST: services.ORDER + "salesorder/filter",
		FIND_BY_ID: services.ORDER + "salesorder/findById/",
		FIND_VALIDATE: services.ORDER + "salesorder/validate/",
		SALEORDERSTATUS: services.ORDER + "salesorder/status",
		SHIPPLINGPACKAGE: services.ORDER + "shippingpackage",
	},

	CART: {
		ADD: services.PRODUCT + "shoppingCart",
		FIND_ALL: services.PRODUCT + "shoppingCart/filter",
		FIND_BY_ID: services.PRODUCT + "shoppingCart/findById/",
		FIND_BLOCK: services.PRODUCT + "shoppingCart/block/",
		FIND_ACTIVATE: services.PRODUCT + "shoppingCart/activate/",
		FIND_DELETE: services.PRODUCT + "shoppingCart/delete/",
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

	USERID_MAPPING: {
		ADD: services.USER_SERVICE + "system/useridmapping",
		UPDATE: services.USER_SERVICE + "system/useridmapping",
		DELETE: services.USER_SERVICE + "system/useridmapping",
		FILTER: services.USER_SERVICE + "system/useridmapping",
		FIND_BY_ID: services.USER_SERVICE + "system/useridmapping",
	},

	EMAIL: {
		ADD: services.SNS_SERVICE + "sns/emailaccount",
		UPDATE: services.SNS_SERVICE + "sns/emailaccount",
		DELETE: services.SNS_SERVICE + "sns/emailaccount",
		FILTER: services.SNS_SERVICE + "sns/emailaccount",
		FIND_BY_ID: services.SNS_SERVICE + "sns/emailaccount",
	},

	TEMPLATE: {
		ADD: services.SNS_SERVICE + "sns/templates",
		UPDATE: services.SNS_SERVICE + "sns/templates",
		DELETE: services.SNS_SERVICE + "sns/templates",
		FILTER: services.SNS_SERVICE + "sns/templates",
		FIND_BY_ID: services.SNS_SERVICE + "sns/templates",
	},

	CHANNEL: {
		ADD: services.SNS_SERVICE + "sns/channel",
		UPDATE: services.SNS_SERVICE + "sns/channel",
		DELETE: services.SNS_SERVICE + "sns/channel",
		FILTER: services.SNS_SERVICE + "sns/channel",
		FIND_BY_ID: services.SNS_SERVICE + "sns/channel",
	},

	TOPIC: {
		ADD: services.SNS_SERVICE + "sns/topic",
		UPDATE: services.SNS_SERVICE + "sns/topic",
		DELETE: services.SNS_SERVICE + "sns/topic",
		FILTER: services.SNS_SERVICE + "sns/topic",
		FIND_BY_ID: services.SNS_SERVICE + "sns/topic",
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

	COUNTRY_LIST: services.LIST_OF_TOWN + "system/country/findAll",
	DISTIC_LIST: services.LIST_OF_TOWN + "system/states/bycountry/",
	TAX: services.PRODUCT + "tax/filter",
	USER_HISTORY: services.PRODUCT + "user-interactions/filter",
};
