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
	nHPrivacyPagination: {
		nhMemberpage: 0,
		nhMemberpageSize: 10,
		nhPendingReqPage: 0,
		nhPendingReqPageSize: 10,
		nhPendingAdminPage: 0,
		nhPendingAdminPageSize: 10,
		suggestedAdminPage: 0,
		suggestedAdminPageSize: 10,
		removeAdminpage: 0,
		removeAdminPageSize: 10,
		generalMemberRequestPage: 0,
		generalMemberRequestPageSize: 10,
	},
	setNHPrivacyPagination: () => {},
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

	const [nhPrivacyPagination, setNhPrivacyPagination] = React.useState({
		nhMemberpage: 0,
		nhMemberpageSize: 10,
		nhPendingReqPage: 0,
		nhPendingReqPageSize: 10,
		nhPendingAdminPage: 0,
		nhPendingAdminPageSize: 10,
		suggestedAdminPage: 0,
		suggestedAdminPageSize: 10,
		removeAdminpage: 0,
		removeAdminPageSize: 10,
		generalMemberRequestPage: 0,
		generalMemberRequestPageSize: 10,
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

	function handlePrivacyPagination(data) {
		if (data?.from === "member") {
			setNhPrivacyPagination((prev) => ({
				...prev,
				nhMemberpage: data?.page,
				nhMemberpageSize: data?.pageSize,
			}));
		} else if (data?.from === "pendingRequest") {
			setNhPrivacyPagination((prev) => ({
				...prev,
				nhPendingReqPage: data?.page,
				nhPendingReqPageSize: data?.pageSize,
			}));
		} else if (data?.from === "pendingAdmin") {
			setNhPrivacyPagination((prev) => ({
				...prev,
				nhPendingAdminPage: data?.page,
				nhPendingAdminPageSize: data?.pageSize,
			}));
		} else if (data?.from === "suggestedAdmin") {
			setNhPrivacyPagination((prev) => ({
				...prev,
				suggestedAdminPage: data?.page,
				suggestedAdminPageSize: data?.pageSize,
			}));
		} else if (data?.from === "removeAdminRequest") {
			setNhPrivacyPagination((prev) => ({
				...prev,
				removeAdminpage: data?.page,
				removeAdminPageSize: data?.pageSize,
			}));
		} else if (data?.from === "generalMemberRequest") {
			setNhPrivacyPagination((prev) => ({
				...prev,
				generalMemberRequestPage: data?.page,
				generalMemberRequestPageSize: data?.pageSize,
			}));
		}
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
				nHPrivacyPagination: nhPrivacyPagination,
				setNHPrivacyPagination: handlePrivacyPagination,
			}}>
			{children}
		</PaginationContext.Provider>
	);
}

export { ContextHandler, PaginationContext };
