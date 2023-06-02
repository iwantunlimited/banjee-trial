import { urls } from "../../../Environment/ApiUrl";
import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

export const findCountry = (requestLoad) => {
	let url = urls.COUNTRY_LIST;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const filterBusiness = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.FILTER_BUSINESS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const createBusiness = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_BUSINESS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const deleteBusiness = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_BUSINESS + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

export const updateBusiness = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_BUSINESS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "PUT";
	return executePost(url, actionCode, payload, method);
};

export const approveRequest = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.APPROVE_BUSINESS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const findByIdBusiness = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.FIND_BUSINESS_BYID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const findBusinessByUserId = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.FIND_BUSINESS_BY_USER_ID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const blogsList = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.GET_ALL_BLOGS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const findByIdBlog = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.FIND_BLOGS_BYID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

export const deleteBlog = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.FIND_BLOGS_BYID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

export const createBlog = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_BLOG;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const findBlogByUserId = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.FIND_BLOGS_BY_USER_ID;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const updateBlog = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_BLOG;
	let actionCode = "";
	let payload = requestLoad;
	let method = "PUT";
	return executePost(url, actionCode, payload, method);
};

export const createReactions = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_REACTIONS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const createComments = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_COMMENTS;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const getComments = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.GET_COMMENTS + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
export const deleteBlogComments = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.DELETE_COMMENTS + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

export const getReactions = (requestLoad) => {
	let url = urls.LOCAL_DISCOVERY.CREATE_REACTIONS + `/${requestLoad}`;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
