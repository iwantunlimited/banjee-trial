import axios from "axios";
import { urls } from "../Environment/ApiUrl";
import Setting from "../Environment/Setting";

let setting = new Setting();

let body = {
	tid: "",
	sid: "",
	payload: {},
};

let http = (method) => {
	switch (method) {
		case "PUT":
			return axios.put;
		case "POST":
			return axios.post;
		default:
			return null;
	}
};

let postApiCall = (url, actionCode, payload, method, noToken) => {
	let promise = new Promise((resolve, reject) => {
		body.tid = Date.now() + 30000;
		body.sid = setting.setSecurity(urls.headers["itpl-client-id"], Date.now() + 30000);
		// body.actionCode = actionCode;
		body.payload = payload;
		// if(actionCode !== ''){
		body = { ...body, actionCode: actionCode };
		// }

		http(method)(url, body, {
			headers: {
				...urls.headers,
				Authorization: !noToken
					? "Bearer " + localStorage.getItem("token")
					: "Basic aXRwbDppd2FudHVubGltaXRlZA==",
			},
		})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				if (err?.response?.status === 401) {
					localStorage?.removeItem("token");
					window.location.reload();
				}
				console.error(`[${actionCode}]Api Call Failed : ${err}`);
				reject(err);
			});
	});
	return promise;
};

let executePost = (url, actionCode, payload, method, noToken) => {
	let promise = new Promise((resolve, reject) => {
		postApiCall(url, actionCode, payload, method, noToken)
			.then((response) => {
				let { statusCode, data, message } = response.data;
				//console.log(`${actionCode} : Status Code : ${statusCode}`);
				if (statusCode === 0) {
					resolve(data);
				} else {
					reject(statusCode + ":" + message);
				}
			})
			.catch((err) => {
				console.log("ERROR", err);
				reject(err);
			});
	});

	return promise;
};

export default postApiCall;
export { executePost };
