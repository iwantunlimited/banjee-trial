const host = "https://gateway.banjee.org";
//const host = "http://136.232.113.214:9180";
//  const host = "http://192.168.1.90:9180";

export const services = {
	HOST: host,

	ASSETS_SERVICES: host + "/services/assets-service/api/",
	SOCIAL_CONNECTIONS: host + "/services/social-connections/api/",
	SOCIAL_FEEDS: host + "/services/social-feeds/",
	USER_PROFILE: host + "/services/userprofile-service/api/",
	GEO_CLOUD: host + "/services/geo-cloud/",
	CDN_SERVICE: host + "/services/media-service/api/",
	PAYMENTMODE: host + "/services/payment-service/api/paymentMode/v2/",
	MERCHANT: host + "/services/merchant-service/api/",
	LIST_OF_TOWN: host + "/services/system-service/api/",
	LOCATION: host + "/services/system-service/api/",
	TEMPLOCATION: host + "/services/system-service/",
	BIG_DATA: host + "/services/big-data/",
	AUTH: host + "/services/system-service/oauth/token",
	USER_SERVICE: host + "/services/user-service/api/",
	SNS_SERVICE: host + "/services/sns-service/api/",
	WIDGET_GROUP: host + "/services/big-data/api/",
	LOCAL_DISCOVERY: host + "/services/local-discovery/api/",
};
