import { urls } from "../../../Environment/ApiUrl";

import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export let listEvent = (requestLoad) => {
	let url = urls.GEO_CLOUD.GEO_ALERT + "filter";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const createEvent = (requestLoad) => {
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
