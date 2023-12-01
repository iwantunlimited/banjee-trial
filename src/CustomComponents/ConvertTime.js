export const convertTime = (timer, short) => {
	var today = Date.now();
	var postedDate = Date.parse(timer);
	var diffMs = today - postedDate; // milliseconds between now & postedDate
	var diffDays = Math.floor(diffMs / 86400000); // days
	var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
	var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

	if (diffDays <= 0) {
		if (diffHrs <= 0) {
			if (diffMins <= 0) {
				return "Just now";
			} else {
				return `${diffMins}${short ? "m" : " min ago"}`;
			}
		} else {
			return `${diffHrs}${short ? "h" : " hr ago"}`;
		}
	} else {
		if (diffDays >= 30) {
			return `${1}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 31 && diffDays <= 60) {
			return `${2}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 61 && diffDays <= 90) {
			return `${3}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 91 && diffDays <= 120) {
			return `${4}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 121 && diffDays <= 150) {
			return `${5}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 151 && diffDays <= 180) {
			return `${6}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 181 && diffDays <= 210) {
			return `${7}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 211 && diffDays <= 240) {
			return `${8}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 241 && diffDays <= 270) {
			return `${9}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 271 && diffDays <= 300) {
			return `${10}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 301 && diffDays <= 330) {
			return `${11}${short ? "m" : " month ago"}`;
		} else if (diffDays >= 331 && diffDays <= 360) {
			return `${12}${short ? "m" : " month ago"}`;
		}
		return `${diffDays}${short ? "d" : diffDays === 1 ? " day ago" : " days ago"}`;
	}
};

export const getFormatedDate = (value) => {
	const currentDate = new Date();
	const limitYear = currentDate.getFullYear();
	const limitMonth = currentDate.getMonth();
	const limitDate = currentDate.getDate();
	const limit = new Date(parseInt(limitYear) - 13, limitMonth, limitDate);

	let accDate = new Date(value);
	const year = accDate.getFullYear();
	const month = accDate.getMonth();
	const date = accDate.getDate();
	return {
		fDate: `${year}-${month + 1}-${date}`,
		limit,
	};
};
