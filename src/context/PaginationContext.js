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
	eventPagination: {},
	setEventPagination: () => {},
	notificationPagination: {},
	setNotificationPagination: () => {},
	groupPagination: {},
	setGroupPagination: () => {},
	nhDetailPagination: {},
	setNhDetailPagination: () => {},
	feedFilter: {},
	setFeedFilter: () => {},
	userFeedFilter: {},
	setUserFeedFilter: () => {},
	reportedUserPagination: {},
	setReportedUserPagination: () => {},
});

function ContextHandler({ children }) {
	const [pagination, setPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [feedPagination, setFeedPagination] = React.useState({
		page: 0,
		pageSize: 12,
	});
	const [feedFilterData, setFeedFilterData] = React.useState({
		page: 0,
		pageSize: 10,
		startDate: null,
		endDate: null,
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
		page: 0,
		pageSize: 10,
	});
	const [eventPagination, setEventPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});
	const [notificationPagination, setNotificationPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [groupPagination, setGroupPagination] = React.useState({
		page: undefined,
		pageSize: undefined,
	});
	const [nhDetailPagination, setNhDetailPagination] = React.useState({
		page: 0,
		pageSize: 12,
	});
	const [userFeed, setUserFeed] = React.useState({
		page: 0,
		pageSize: 12,
	});
	const [reportedUser, setReportedUser] = React.useState({
		page: 0,
		pageSize: 12,
		activeUserPage: 0,
		activeUserpageSize: 10,
	});

	function handlePagination(data) {
		setPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}
	function handleFeedPagination(data) {
		setFeedPagination(() => ({
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}

	function handleFeedFilter(data) {
		setFeedFilterData({
			page: data?.page === 0 ? 0 : data?.page ? data?.page : feedFilterData?.page,
			pageSize: data?.pageSize ? data?.pageSize : feedFilterData?.pageSize,
			startDate:
				data?.startDate === null ? null : data?.startDate ? data?.startDate : feedFilterData?.startDate,
			endDate: data?.endDate === null ? null : data?.endDate ? data?.endDate : feedFilterData?.endDate,
		});
	}
	function handleNeighbourhoodPagination(data) {
		setNeighbourPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	}
	function handleNeighbourhoodDetailPagination(data) {
		setNhDetailPagination((prev) => ({
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

	function handleEventPagination(data) {
		setEventPagination(() => ({
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
	function handleUserFeedFilter(data) {
		setUserFeed((prev) => ({
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
				feedFilter: feedFilterData,
				setFeedFilter: handleFeedFilter,
				neighbourhoodPagination: neighbourPagination,
				setNeighbourhoodPagination: handleNeighbourhoodPagination,
				nhDetailPagination: nhDetailPagination,
				setNhDetailPagination: handleNeighbourhoodDetailPagination,
				blogPagination: blogPagination,
				setBlogPagination: handleBlogPagination,
				alertPagination: alertPagination,
				setAlertPagination: handleAlertPagination,
				eventPagination: eventPagination,
				setEventPagination: handleEventPagination,
				notificationPagination: notificationPagination,
				setNotificationPagination: handleNotificationPagination,
				groupPagination: groupPagination,
				setGroupPagination: handleGroupPagination,
				userFeedFilter: userFeed,
				setUserFeedFilter: handleUserFeedFilter,
				reportedUserPagination: reportedUser,
				setReportedUserPagination: (data) =>
					setReportedUser({
						page: data?.page,
						pageSize: data?.pageSize,
						activeUserPage: data?.activeUserPage,
						activeUserpageSize: data?.activeUserpageSize,
					}),
			}}>
			{children}
		</PaginationContext.Provider>
	);
}

export { ContextHandler, PaginationContext };
