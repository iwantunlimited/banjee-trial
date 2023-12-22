const host = "https://gateway.banjee.org";
//const host = "http://136.232.113.214:9180";
//  const host = "http://192.168.1.90:9180";

export const services = {
	HOST: host,
	MESSAGE_BROKER: host + "/services/message-broker/api/",
	SYSTEM_SERVICES: host + "/services/system-service/api/",
	ASSETS_SERVICES: host + "/services/assets-service/api/",
	SOCIAL_CONNECTIONS: host + "/services/social-connections/api/",
	SOCIAL_FEEDS: host + "/services/social-feeds/",
	NOTIFICATIONS: host + "/services/notification-service/api/",
	USER_PROFILE: host + "/services/userprofile-service/api/",
	USER_PROFILE_MEMBERSHIP: host + "/services/userprofile-service/",
	// GEO_CLOUD: host + "/services/geo-cloud/",
	GEO_CLOUD: "http://136.232.113.214:50001/",
	CDN_SERVICE: host + "/services/media-service/api/",
	LIST_OF_TOWN: host + "/services/system-service/api/",
	LOCATION: host + "/services/system-service/api/",
	TEMPLOCATION: host + "/services/system-service/",
	BIG_DATA: host + "/services/big-data/",
	AUTH: host + "/services/system-service/oauth/token",
	USER_SERVICE: host + "/services/user-service/api/",
	LOCAL_DISCOVERY: host + "/services/local-discovery/api/",
	LOCAL_DISCOVERY_V2: host + "/services/local-discovery/",
};
