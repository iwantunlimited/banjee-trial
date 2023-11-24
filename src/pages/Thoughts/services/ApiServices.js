import { urls } from "../../../Environment/ApiUrl";
import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export const createThought = (requestLoad) => {
	let url = urls.GEO_CLOUD.CREATE_THOUGHTS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const getThoughts = (requestLoad) => {
	let url = urls.GEO_CLOUD.FILTER_THOUGHTS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const deleteThought = (requestLoad) => {
	let url = urls.GEO_CLOUD.DELETE_THOUGHTS + requestLoad;
	let actionCode = "";
	let payload = requestLoad;
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};
