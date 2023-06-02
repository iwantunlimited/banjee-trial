import { urls } from "../../../Environment/ApiUrl";
import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export const filterSocialFeeds = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.FILTER;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const createSocialFeeds = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.CREATE_FEED;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const getSocialFeedDetails = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.GET_FEED_DETAILS + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const deleteSocialFeed = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.DELETEFEED;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const getSocialFeedsComments = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.GET_COMMENTS + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
export const deleteSocialFeedsComments = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.DELETE_COMMENTS + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};
export const getSocialFeedsReactions = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.GET_REACTIONS + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const getReportedFeedDetail = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.REPORTED_FEED_DETAIL + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
