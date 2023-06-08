import { urls } from "../../../Environment/ApiUrl";
import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export const findCommunityById = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY + "/findById/" + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const findCommunityByUserId = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY_BY_USER_ID;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const deleteCommunity = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY + "/delete/" + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

export const communityList = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY + "/community-list";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const filterCommunity = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY + "/filter";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const createCommunity = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const updateCommunity = (requestLoad) => {
	let url = urls.GEO_CLOUD.COMMUNITY;
	let actionCode = "";
	let payload = requestLoad;
	let method = "PUT";
	return executePost(url, actionCode, payload, method);
};
