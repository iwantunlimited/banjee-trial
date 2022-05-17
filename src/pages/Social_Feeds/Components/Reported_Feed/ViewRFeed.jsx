import React from "react";
import { useParams } from "react-router";
import { getReportedFeedDetail } from "../../services/ApiServices";

function ViewRFeed() {
	const [data, setData] = React.useState([]);

	const params = useParams();

	console.log("params", params);

	const apiCall = React.useCallback(() => {
		getReportedFeedDetail(params.id)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	React.useEffect(() => {
		apiCall();
	}, [apiCall]);

	return (
		<>
			<h2>R Feeds</h2>
		</>
	);
}

export default ViewRFeed;
