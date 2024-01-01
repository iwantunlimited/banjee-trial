import { urls } from "../../../Environment/ApiUrl";
import { executePost } from "../../../Services/iwant-rest-http-post";
import { executeGet } from "../../../Services/iwant-rest-generic";

// ---------------------------------------- CREATED SERVICE FOR EACH CUSTOMER URL -----------------------------------//

// ----------------------------------------- CUSTOMER LIST SERVICE ---------------------------------------------------
let listCustomer = (requestLoad) => {
	let url = urls.USERPROFILE.CUSTOMER_LIST;
	let actionCode = "ACTION_FILTER_PROFILE";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
// ----------------------------------------- CUSTOMER LIST SERVICE ---------------------------------------------------
let getUserCsvData = (requestLoad) => {
	let url = urls.USERPROFILE.USER_CSV_DATA;
	let actionCode = "";
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
	let url = urls.USERPROFILE.CUSTOMER_FIND_BY_ID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
// -----------------------------------------  FIND USER BY SYSTEM USER ID SERVICE ------------------------------------------------//
let findUserBySystemUserId = (requestLoad) => {
	let url = urls.USERPROFILE.FIND_USER_BY_SYSTEMUSER_ID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
// -----------------------------------------  FIND USER BY SYSTEM USER ID SERVICE ------------------------------------------------//
let findUserByUserId = (requestLoad) => {
	let url = urls.USERPROFILE.FIND_USER_BY_USER_ID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

// ----------------------------------------- CUSTOMER CONNECTIONS ------------------------------------------------//
let findCustomerConnection = (requestLoad) => {
	let url = urls.USERPROFILE.FIND_USER_CONNECTION_BY_ID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

// ----------------------------------------- BLOCKED CUSTOMER ------------------------------------------------//
let findBlockedCustomers = (requestLoad) => {
	let url = urls.USERPROFILE.FIND_USER_BLOCK_LIST + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

// ----------------------------------------- REPORTED CUSTOMER VIEW ------------------------------------------------//
let findReportedCustomer = (requestLoad) => {
	let url = urls.SOCIAL_CONNECTION.FIND_REPORTED_CUSTOMER_BY_ID + requestLoad;
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
	let url = urls.USERPROFILE.REPORTED_USERS;
	// let actionCode = "ACTION_FILTER_REPORT";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
//----------------------------------------- REPORT ACTION ----------------------------------------//
let ReportedUserAction = (requestLoad) => {
	let url = urls.USERPROFILE.REPORT_ACTION;
	// let actionCode = "ACTION_FILTER_REPORT";
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

// --------------------------------------- CATEGORY Api ----------------------------------------------//

let CategoryList = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.FILTER_CATEGORY;
	let actionCode = "ACTION_FILTER_CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ Create Category ------------------------------------------------//

let CreateCategory = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.CREATE_CATEGORY;
	let actionCode = "ACTION_CREATE_CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ Create  Sub-Category ------------------------------------------------//

let CreateSubCategory = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.CREATE_SUB_CATEGORY;
	let actionCode = "ACTION_CREATE_SUB-CATEGORY";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

//------------------------------------------ Delete Category ------------------------------------------------//

let deleteCategory = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.DELETE_CATEGORY + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

//------------------------------------------ Delete Sub-Category ------------------------------------------------//

let deleteSubCategory = (requestLoad) => {
	let url = urls.ASSETS_SERVICES.DELETE_SUB_CATEGORY + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "DELETE";
	return executeGet(url, actionCode, payload, method);
};

//------------------------------------------ Dashboard list customer api ------------------------------------------------//

let DashboardlistCustomer = (requestLoad) => {
	let url = urls.USERPROFILE.DASHBOARD_LIST_CUSTOMER;
	let actionCode = "ACTION_LIST_USER";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
//------------------------------------------ Dashboard list customer api ------------------------------------------------//

let UserFeeds = (requestLoad) => {
	let url = urls.SOCIAL_FEEDS.FEEDS_BY_USER_ID;
	let actionCode = "";
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
	findUserBySystemUserId,
	findUserByUserId,
	getUserCsvData,
	UserFeeds,
	ReportedUserAction,
};
