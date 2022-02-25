import {urls} from "../../../Environment/ApiUrl";
import {executeGet} from "../../../Services/iwant-rest-generic";
import {executePost} from "../../../Services/iwant-rest-http-post";

export const filterRooms = (requestLoad) => {
	let url = urls.SOCIAL_CONNECTION.FILTER;
	let actionCode = "ACTION_GROUP-FILTER_CONNECTION";
	let payload = requestLoad;
	let method = "POST";
	return executePost(url, actionCode, payload, method);
};

export const findRoomsById = (requestLoad) => {
	let url = urls.SOCIAL_CONNECTION.FIND_BY_ID + requestLoad;
	let actionCode = "";
	let payload = {};
	let method = "GET";
	return executeGet(url, actionCode, payload, method);
};
