import { paginationClasses } from "@mui/material";
import React from "react";

const PaginationContext = React.createContext({
	userPagination: {},
	setUserPagination: () => {},
	feedPagination: {},
	setFeedPagination: () => {},
	neighbourhoodPagination: {},
	setNeighbourhoodPagination: () => {},
	blogPagination: {},
	setBlogPagination: () => {},
	alertPagination: {},
	setAlertPagination: () => {},
	notificationPagination: {},
	setNotificationPagination: () => {},
	groupPagination: {},
	setGroupPagination: () => {},
});

function ContextHandler({ children }) {
	const [pagination, setPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [feedPagination, setFeedPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [neighbourPagination, setNeighbourPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [blogPagination, setBlogPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [alertPagination, setAlertPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [notificationPagination, setNotificationPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [groupPagination, setGroupPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});

	function handlePagination(data) {
		setPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}
	function handleFeedPagination(data) {
		setFeedPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}
	function handleNeighbourhoodPagination(data) {
		setNeighbourPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}
	function handleBlogPagination(data) {
		setBlogPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}
	function handleAlertPagination(data) {
		setAlertPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}
	function handleNotificationPagination(data) {
		setNotificationPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}
	function handleGroupPagination(data) {
		setGroupPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}

	return (
		<PaginationContext.Provider
			value={{
				userPagination: pagination,
				setUserPagination: handlePagination,
				feedPagination: feedPagination,
				setFeedPagination: handleFeedPagination,
				neighbourhoodPagination: neighbourPagination,
				setNeighbourhoodPagination: handleNeighbourhoodPagination,
				blogPagination: blogPagination,
				setBlogPagination: handleBlogPagination,
				alertPagination: alertPagination,
				setAlertPagination: handleAlertPagination,
				notificationPagination: notificationPagination,
				setNotificationPagination: handleNotificationPagination,
				groupPagination: groupPagination,
				setGroupPagination: handleGroupPagination,
			}}>
			{children}
		</PaginationContext.Provider>
	);
}

export { ContextHandler, PaginationContext };
