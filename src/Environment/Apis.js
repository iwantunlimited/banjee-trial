import { executeGet } from "../Services/iwant-rest-generic";
import { executePost } from "../Services/iwant-rest-http-post";
import { urls } from "./ApiUrl";

//------------------------------------------ Category List ------------------------------------------------//

export let CategoryList = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.FILTER_CATEGORY;
	let actionCode = "ACTION_FILTER_CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
//------------------------------------------ Create Category ------------------------------------------------//

export let CreateCategory = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.CREATE_CATEGORY;
	let actionCode = "ACTION_CREATE_CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ Create  Sub-Category ------------------------------------------------//

export let CreateSubCategory = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.CREATE_SUB_CATEGORY;
	let actionCode = "ACTION_CREATE_SUB-CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ Delete Category ------------------------------------------------//

export let deleteCategory = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.DELETE_CATEGORY + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

//------------------------------------------ Delete Sub-Category ------------------------------------------------//

export let deleteSubCategory = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.DELETE_SUB_CATEGORY + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};
