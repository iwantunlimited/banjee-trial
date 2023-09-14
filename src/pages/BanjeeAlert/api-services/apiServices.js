import { urls } from "../../../Environment/ApiUrl";

import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export let listAlert = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + "admin/filter";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const createAlert = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const findAlertByUserId = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + "byUserId";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export let nearByAlert = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + "/near-by";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export let listMyAlert = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + "/my-alerts/" + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export let deleteAlert = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

export let filterReportList = (requestLoad) => {
	let url = urls.GEO_CLOUD.FILTER_REPORTED_ALERT;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export let reportedByUserAlertList = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + "/reports/" + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
