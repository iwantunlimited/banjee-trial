import { Container, Box, Grid, Tabs, Tab, Card } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import ChipComp from "./Components/CardChipComp";
import "./neighbourhood.css";
import NeighbourList from "./Components/NeighbourList";
import { ApprovalList } from "./Components/ApprovalList";
import {
	filterMembers,
	filterNeighbourhood,
	pendingApproval,
	requestCommunityFilter,
} from "./services/apiServices";

import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router";
import { PaginationContext } from "../../context/PaginationContext";
import GeneralPendingMemberRequests from "./Components/NHPrivacy/GeneralPendingMemberReq";
import AdminPendingRequests from "./Components/NHPrivacy/AdminPendingRequests";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function Neighbourhood() {
	const theme = useTheme();
	const {
		neighbourhoodPagination,
		setNeighbourhoodPagination,
		nHPrivacyPagination: {
			generalMemberRequestPageSize,
			generalMemberRequestPage,
			generalAdminReqPage,
			generalAdminReqPageSize,
		},
	} = React.useContext(PaginationContext);

	const location = useLocation();
	const [value, setValue] = React.useState(location?.state?.pending ? 1 : 0);
	const [listData, setListData] = React.useState("");
	const [totalElement, setTotalElement] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		page: neighbourhoodPagination?.page ? neighbourhoodPagination?.page : 0,
		pageSize: neighbourhoodPagination?.pageSize ? neighbourhoodPagination?.pageSize : 10,
	});
	const [pendingListData, setPendingListData] = React.useState("");
	const [generalPendingReq, setGeneralPendingReq] = React.useState({
		data: [],
		totalElements: 0,
	});
	const [adminPendingData, setAdminPendingData] = React.useState({
		data: [],
		totalMembers: 0,
	});

	const [totalPendingElement, setTotalPendingElement] = React.useState(0);
	const [pendingPagination, setPendingPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handlePagination = (item) => {
		setPagination((prev) => ({
			...prev,
			page: item?.page,
			pageSize: item?.pageSize,
		}));
	};
	const handlePendingPagination = (item) => {
		setPendingPagination((prev) => ({
			...prev,
			page: item?.page,
			pageSize: item?.pageSize,
		}));
	};

	const listApiCall = React.useCallback(
		(data) => {
			const payload =
				data?.keyword !== ""
					? {
							page: pagination?.page,
							pageSize: pagination?.pageSize,
							online: true,
							keywords: data?.keyword,
					  }
					: { page: pagination?.page, pageSize: pagination?.pageSize, online: true };
			filterNeighbourhood(payload)
				.then((res) => {
					const resp = res.content.map((ele) => {
						return {
							routingId: ele.id,
							...ele,
							// ...ele?.name,
							// ...ele?.createdOn,
						};
					});
					setListData(resp);
					// setState((prev) => ({
					// 	...prev,0
					// 	page: res?.pageable?.pageNumber,
					// 	pageSize: res?.pageable?.pageSize,
					// }));
					setTotalElement(res?.totalElements);
				})
				.catch((err) => console.error(err));
		},
		[pagination]
	);

	const pendingListApiCall = React.useCallback(() => {
		pendingApproval({
			page: pendingPagination?.page,
			pageSize: pendingPagination?.pageSize,
			onList: true,
			// processed: false,
			// approved: false,
		})
			.then((res) => {
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						...ele,
						...ele?.payload,
						// ...ele?.name,
						// ...ele?.createdOn,
					};
				});
				setPendingListData(resp);
				setTotalPendingElement(res?.totalElements);
			})
			.catch((err) => console.error(err));
	}, [pendingPagination]);

	const generalPendingListApiCall = React.useCallback(() => {
		requestCommunityFilter({
			approved: false,
			processed: true,
			page: generalMemberRequestPage,
			pageSize: generalMemberRequestPageSize,
			userType: -1,
			type: "SOCIAL_CLOUD",
		})
			.then((res) => {
				console.log("general memebr resssss", res);
				setGeneralPendingReq({
					data: res?.content,
					totalElements: res?.totalElements,
				});
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, [generalMemberRequestPage, generalMemberRequestPageSize]);

	const AdminRequestApiCall = React.useCallback(() => {
		filterMembers({
			// cloudId: params?.id,
			verificationReq: "true",
			verificationRejection: "false",
			reUpload: "false",
			verified: "false",
			role: "MEMBER",
			page: generalAdminReqPage,
			pageSize: generalAdminReqPageSize,
			cloudType: "SOCIAL_CLOUD",
		})
			.then((res) => {
				// console.log("admin resssss", res);
				setAdminPendingData({
					data: res?.content,
					totalMembers: res?.totalElements,
				});
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, [generalAdminReqPage, generalAdminReqPageSize]);

	React.useEffect(() => {
		listApiCall();
		generalPendingListApiCall();
	}, [listApiCall, generalPendingListApiCall]);

	React.useEffect(() => {
		pendingListApiCall();
	}, [pendingListApiCall]);

	return (
		<Container maxWidth='xl' style={{ padding: "0px", margin: "auto" }}>
			<Helmet>
				<title>Neighbourhood | Banjee Admin</title>
			</Helmet>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<ChipComp listApiCall={listApiCall} pendingListApiCall={pendingListApiCall} />
				</Grid>
				<Grid item xs={12}>
					<Card sx={{ padding: { xs: "10px", lg: "20px" } }}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<Tabs
								indicatorColor='primary'
								textColor='primary'
								value={value}
								onChange={handleChange}
								aria-label='basic tabs example'>
								<Tab
									sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
									label={`Neighbourhood (${totalElement})`}
									{...a11yProps(0)}
								/>
								<Tab
									sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
									label={`Pending List (${totalPendingElement})`}
									{...a11yProps(1)}
								/>
								<Tab
									sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
									label={`Pending Member Requests (${generalPendingReq?.totalElements})`}
									{...a11yProps(2)}
								/>
								<Tab
									sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
									label={`Pending Admin Requests (${adminPendingData?.totalMembers})`}
									{...a11yProps(3)}
								/>
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							<Box sx={{ paddingY: "15px" }}>
								<NeighbourList
									listData={listData}
									listApiCall={listApiCall}
									totalElement={totalElement}
									pagination={pagination}
									handlePagination={handlePagination}
									handleTabChange={handleChange}
								/>
							</Box>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Box sx={{ paddingY: "15px" }}>
								<ApprovalList
									data={pendingListData}
									pendingListApiCall={pendingListApiCall}
									totalElement={totalPendingElement}
									pagination={pendingPagination}
									handlePagination={handlePendingPagination}
									handleTabChange={handleChange}
								/>
							</Box>
						</TabPanel>
						<TabPanel value={value} index={2}>
							<Box sx={{ paddingY: "15px" }}>
								<GeneralPendingMemberRequests
									pendingData={generalPendingReq}
									refreshApi={generalPendingListApiCall}
									handleTabChange={handleChange}
								/>
							</Box>
						</TabPanel>
						<TabPanel value={value} index={3}>
							<Box sx={{ paddingY: "15px" }}>
								<AdminPendingRequests
									pendingData={adminPendingData}
									AdminRequestApiCall={AdminRequestApiCall}
									RefreshMemberApiCall={listApiCall}
								/>
							</Box>
						</TabPanel>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Neighbourhood;
