import { urls } from "../../../Environment/ApiUrl";
import { executeGet } from "../../../Services/iwant-rest-generic";
import { executePost } from "../../../Services/iwant-rest-http-post";

let findAdmin = (requestLoad) => {
	let url = urls.USERPROFILE.FIND_BY_ID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};

let updateAccount = (requestLoad) => {
	let url = urls.USERPROFILE.UPDATE;
	let actionCode = "ACTION_UPDATE_PROFILE";
	let payload = requestLoad;
	let method = "PUT";
	return executePost(url, actionCode, payload, method);
};

export { findAdmin, updateAccount };
