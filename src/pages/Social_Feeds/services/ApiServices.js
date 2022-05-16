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
