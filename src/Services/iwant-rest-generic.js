import axios from "axios";
import {urls} from "../Environment/ApiUrl";
import Setting from "../Environment/Setting";

let setting = new Setting();

let http = (method) => {
	switch (method) {
		case "GET":
			return axios.get;
		case "DELETE":
			return axios.delete;
		default:
			return null;
	}
};

let httpRest = (url, actionCode, payload, method, noToken) => {
	let promise = new Promise((resolve, reject) => {
		let tid = Date.now() + 30000;
		let sid = setting.setSecurity(
			urls.headers["itpl-client-id"],
			Date.now() + 30000
		);

		// let queryString = `?tid=${tid}&sid=${sid}&actionCode=${actionCode}`;

		let queryString = `?tid=${tid}&sid=${sid}${
			actionCode === "" || actionCode === null
				? ""
				: "&actionCode=" + actionCode
		}`;
		url = url + queryString;
		http(method)(url, {
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
				console.error(
					`Failed => HTTP/${method}, ${actionCode}: url :${url}, error: ${err}`
				);
				reject(err);
			});
	});
	return promise;
};

let executeGet = (url, actionCode, payload, method, noToken) => {
	let promise = new Promise((resolve, reject) => {
		httpRest(url, actionCode, payload, method, noToken)
			.then((response) => {
				let {statusCode, data, message} = response.data;
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

export default httpRest;
export {executeGet};
