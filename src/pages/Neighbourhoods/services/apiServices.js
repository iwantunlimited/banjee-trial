import { urls } from "../../../Environment/ApiUrl";
import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export const createNeighbourhood = (requestLoad) => {
	let url = urls.GEO_CLOUD.CREATE;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const findCountry = (requestLoad) => {
	let url = urls.COUNTRY_LIST;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const findState = (requestLoad) => {
	let url = urls.STATE_LIST;
	let actionCode = "ACTION_FILTER_STATE";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const findCity = (requestLoad) => {
	let url = urls.CITY_LIST;
	let actionCode = "ACTION_FILTER_CITY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
