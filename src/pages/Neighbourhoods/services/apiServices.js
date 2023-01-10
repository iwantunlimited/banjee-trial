import { urls } from "../../../Environment/ApiUrl";
import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export const imageUpload = (requestLoad) => {
	let url = urls.CDN.UPLOAD_IMAGE;
	let actionCode = "ACTION_UPLOAD_RESOURCE";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const createNeighbourhood = (requestLoad) => {
	let url = urls.GEO_CLOUD.CREATE_NEIGHBOURHOOD;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const filterNeighbourhood = (requestLoad) => {
	let url = urls.GEO_CLOUD.FILTER_NEIGHBOURHOOD;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const updateNeighbourhood = (requestLoad) => {
	let url = urls.GEO_CLOUD.CREATE_NEIGHBOURHOOD;
	let actionCode = "";
	let payload = requestLoad;
	let method = "PUT";
	return executePost(url, actionCode, payload, method);
};

export const filterMembers = (requestLoad) => {
	let url = urls.GEO_CLOUD.FILTER_MEMBERS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const assignAdminToCloud = (requestLoad) => {
	let url = urls.GEO_CLOUD.Assign_Admin_To_Cloud;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const assignMemberToCloud = (requestLoad) => {
	let url = urls.GEO_CLOUD.Assign_Member_To_Cloud;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const pendingApproval = (requestLoad) => {
	let url = urls.GEO_CLOUD.PENDING_APPROVAL;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const approveRequest = (requestLoad) => {
	let url = urls.GEO_CLOUD.APPROVE_NEIGHBOURHOOD;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const rejectRequest = (requestLoad) => {
	let url = urls.GEO_CLOUD.REJECT_NEIGHBOURHOOD;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const deleteNeighbourhood = (requestLoad) => {
	let url = urls.GEO_CLOUD.DELETE_NEIGHBOURHOOD + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

export const findNeighbourhood = (requestLoad) => {
	let url = urls.GEO_CLOUD.FIND_NEIGHBOURHOOD + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
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
