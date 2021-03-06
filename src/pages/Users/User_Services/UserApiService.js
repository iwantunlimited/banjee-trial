import { urls } from "../../../Environment/ApiUrl";
import { executePost } from "../../../Services/iwant-rest-http-post";
import { executeGet } from "../../../Services/iwant-rest-generic";

// ---------------------------------------- CREATED SERVICE FOR EACH CUSTOMER URL -----------------------------------//

// ----------------------------------------- CUSTOMER LIST SERVICE ---------------------------------------------------
let listCustomer = (requestLoad) => {
	let url = "https://gateway.banjee.org/services/userprofile-service/api/admin/registry/filter";
	let actionCode = "ACTION_FILTER_REGISTRY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ AVATAR FIND URL-----------------------------------------//

let findAvatar = (requestLoad) => {
	let url = "https://gateway.banjee.org//services/media-service/iwantcdn/resources/" + requestLoad;
	let actionCode = "ACTION_DOWNLOAD_RESOURCE";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

// ----------------------------------------- CUSTOMER FIND SERVICE ------------------------------------------------//
let findCustomer = (requestLoad) => {
	let url =
		"https://gateway.banjee.org/services/userprofile-service/api/admin/findById/" + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

// ----------------------------------------- CUSTOMER CONNECTIONS ------------------------------------------------//
let findCustomerConnection = (requestLoad) => {
	let url =
		"https://gateway.banjee.org/services/userprofile-service/api/admin/userConnection/" +
		requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

// ----------------------------------------- BLOCKED CUSTOMER ------------------------------------------------//
let findBlockedCustomers = (requestLoad) => {
	let url =
		"https://gateway.banjee.org/services/userprofile-service/api/admin/userBlockList/" +
		requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

// ----------------------------------------- REPORTED CUSTOMER VIEW ------------------------------------------------//
let findReportedCustomer = (requestLoad) => {
	let url =
		"http://gateway.banjee.org/services/social-connections//api/secured/report/findById/" +
		requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

//----------------------------------------- CUSTOMER HISTORY SERVICE ----------------------------------------//
let showCustomerHistory = (requestLoad) => {
	let url = urls.USER_HISTORY;
	let actionCode = "ACTION_FILTER_INTERACTION";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//----------------------------------------- PENDDING CONNECTIONS LIST ----------------------------------------//
let penddingConnectionsList = (requestLoad) => {
	let url = "https://gateway.banjee.org/services/userprofile-service/api/registry/filter";
	let actionCode = "ACTION_FILTER_REGISTRY";
	let payload = {
		systemUserIds: requestLoad,
		// systemUserIds: [
		// 	"61640b19234805598a095c72",
		// 	"611fbbcd1aa42c3951257cd6",
		// 	"6135a1011aa42c3951260a6c",
		// ],
	};
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//----------------------------------------- REPORTED USERS ----------------------------------------//
let ReportedUserList = (requestLoad) => {
	let url = "http://gateway.banjee.org/services/social-connections/api/secured/report/filter";
	let actionCode = "ACTION_FILTER_REPORT";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

// --------------------------------------- CATEGORY Api ----------------------------------------------//

let CategoryList = (requestLoad) => {
	let url = "https://gateway.banjee.org/services/assets-service/api/category/filter";
	let actionCode = "ACTION_FILTER_CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ Create Category ------------------------------------------------//

let CreateCategory = (requestLoad) => {
	let url = "https://gateway.banjee.org/services/assets-service/api/category";
	let actionCode = "ACTION_CREATE_CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ Create  Sub-Category ------------------------------------------------//

let CreateSubCategory = (requestLoad) => {
	let url = "https://gateway.banjee.org/services/assets-service/api/sub-category";
	let actionCode = "ACTION_CREATE_SUB-CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ Delete Category ------------------------------------------------//

let deleteCategory = (requestLoad) => {
	let url = "https://gateway.banjee.org/services/assets-service/api/category/delete/" + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

//------------------------------------------ Delete Sub-Category ------------------------------------------------//

let deleteSubCategory = (requestLoad) => {
	let url =
		"https://gateway.banjee.org/services/assets-service/api/sub-category/delete/" + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

//------------------------------------------ Dashboard list customer api ------------------------------------------------//

let DashboardlistCustomer = (requestLoad) => {
	let url = "https://gateway.banjee.org/services/userprofile-service/api/admin/registry/report";
	let actionCode = "ACTION_LIST_USER";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export {
	listCustomer,
	findCustomer,
	findAvatar,
	findCustomerConnection,
	findBlockedCustomers,
	showCustomerHistory,
	ReportedUserList,
	findReportedCustomer,
	penddingConnectionsList,
	CategoryList,
	CreateCategory,
	CreateSubCategory,
	deleteCategory,
	deleteSubCategory,
	DashboardlistCustomer,
};
