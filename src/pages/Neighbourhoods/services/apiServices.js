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

export const sendLinkToUser = (requestLoad) => {
	let url = urls.GEO_CLOUD.SEND_LINK;
	// let url = "http://192.168.1.6:50001/social-cloud/members/filter";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const filterMembers = (requestLoad) => {
	let url = urls.GEO_CLOUD.FILTER_MEMBERS;
	// let url = "http://192.168.1.6:50001/social-cloud/members/filter";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const requestCommunityFilter = (requestLoad) => {
	let url = urls.GEO_CLOUD.REQUEST_COMMUNITY_FILTER;
	// let url = "http://192.168.1.6:50001/request-community/filter";
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
export const leaveAdminRoleToCloud = (requestLoad) => {
	let url = urls.GEO_CLOUD.LEAVE_ADMIN_ROLE;
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
export const adminVerificationApi = (requestLoad) => {
	let url = urls.GEO_CLOUD.ADMIN_VERIFICATION;
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
export const approveRequestCommunity = (requestLoad) => {
	let url = urls.GEO_CLOUD.REQUEST_COMMUNITY_APPROVE;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const removeAdminRequests = (requestLoad) => {
	let url = urls.GEO_CLOUD.REMOVE_ADMIN_REQUEST;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
export const rejectRequestCommunity = (requestLoad) => {
	let url = urls.GEO_CLOUD.REQUEST_COMMUNITY_REJECT;
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
export const removeUserFromNeighbourhood = (requestLoad) => {
	let url = urls.GEO_CLOUD.REMOVE_USER_FROM_NEIGHBOURHOOD;
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

export const approveRemoveAdminReq = (requestLoad) => {
	let url = urls.GEO_CLOUD.APPROVE_REMOVE_ADMIN_REQUEST + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
export const rejectRemoveAdminReq = (requestLoad) => {
	let url = urls.GEO_CLOUD.REJECT_REMOVE_ADMIN_REQUEST + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
export const findNeighbourhood = (requestLoad) => {
	let url = urls.GEO_CLOUD.FIND_NEIGHBOURHOOD + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
export const findNeighbourhoodByUserId = (requestLoad) => {
	let url = urls.GEO_CLOUD.FIND_NEIGHBOURHOOD_BY_USER_ID + requestLoad;
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

export const findPlaceByPlaceId = (requestLoad) => {
	let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${requestLoad}&key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk&v=3`;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const findNearByNH = (requestLoad) => {
	let url = urls.GEO_CLOUD.CREATE_NEIGHBOURHOOD + "/filter";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
