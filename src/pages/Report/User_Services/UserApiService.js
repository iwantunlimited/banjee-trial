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
let listUserMembership = (requestLoad) => {
	let url = urls.USERPROFILE.USER_MEMBERSHIP;
	let actionCode = "";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};
// ----------------------------------------- CUSTOMER LIST SERVICE ---------------------------------------------------
let listActiveUsers = (requestLoad) => {
	let url = urls.NOTIFICATIONS.LIVE_USER;
	let actionCode = "";
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

export { listCustomer, listUserMembership, getUserCsvData, listActiveUsers };
