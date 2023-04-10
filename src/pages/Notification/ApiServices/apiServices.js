import { urls } from "../../../Environment/ApiUrl";
import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export const createAlert = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const deleteAlert = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};
export const AlertById = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + "my-alerts/" + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const findByIdBlog = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.FIND_BLOGS_BYID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export let listNotification = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + "/filter";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export let createNotificationConfig = (requestLoad) => {
	let url = urls.NOTIFICATIONS?.NOTIFICATION_CONFIG;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export let updateNotificationConfig = (requestLoad) => {
	let url = urls.NOTIFICATIONS?.NOTIFICATION_CONFIG;
	let actionCode = "";
	let payload = requestLoad;
	let method = "PUT";
	return executePost(url, actionCode, payload, method);
};

export let listNotificationConfig = (requestLoad) => {
	let url = urls.NOTIFICATIONS?.NOTIFICATION_CONFIG + "filter";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const findNotificationById = (requestLoad) => {
	let url = urls.NOTIFICATIONS?.NOTIFICATION_CONFIG + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
export const deleteNotificationById = (requestLoad) => {
	let url = urls.NOTIFICATIONS?.NOTIFICATION_CONFIG + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};
