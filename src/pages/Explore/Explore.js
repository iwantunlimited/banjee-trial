import { Container, Box, Grid, Tabs, Tab, Card } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { BusinessApprovalList } from "./Components/Business/ApprovalList";
import BusinessList from "./Components/Business/BusinessList";
import ChipComp from "./Components/CardChipComp";
import { filterBusiness } from "./services/ApiServices";
import { useLocation } from "react-router";

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

function Explore() {
	const location = useLocation();
	console.log("====================================");
	console.log("location", location);
	console.log("====================================");
	const [value, setValue] = React.useState(location?.state?.approved === false ? 1 : 0);

	const [listData, setListData] = React.useState("");
	const [pendingListData, setPendingListData] = React.useState("");
	const [state, setState] = React.useState({
		page: 0,
		pageSize: 10,
	});
	const [pendingListPagination, setPendingListPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	const [totalElement, setTotalElement] = React.useState(0);
	const [totalPendingElement, setTotalPendingElement] = React.useState(0);

	const handlePagination = (data) => {
		setState((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	};
	const handlePendingListPagination = (data) => {
		setPendingListPagination((prev) => ({
			...prev,
			page: data?.page,
			pageSize: data?.pageSize,
		}));
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const listApiCAll = React.useCallback(() => {
		filterBusiness({ page: state?.page, pageSize: state?.pageSize, approved: true })
			.then((res) => {
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						userFName: ele?.userObject?.firstName
							? ele?.userObject?.firstName + " " + ele?.userObject?.lastName
							: "-",
						...ele,
						// ...ele?.userObject,
						// ...ele?.name,
						// ...ele?.createdOn,
					};
				});
				setListData(resp);
				setTotalElement(res.totalElements);
			})
			.catch((err) => console.error(err));
	}, [state]);

	const pendingListApiCall = React.useCallback(() => {
		filterBusiness({
			page: pendingListPagination?.page,
			pageSize: pendingListPagination?.pageSize,
			approved: false,
		})
			.then((res) => {
				const resp = res.content.map((ele) => {
					return {
						routingId: ele.id,
						...ele,
						mfirstName: ele?.userObject?.firstName,
						mlastName: ele?.userObject?.lastName,
						// ...ele?.name,
						// ...ele?.createdOn,
					};
				});
				setTotalPendingElement(res?.totalElements);
				setPendingListData(resp);
			})
			.catch((err) => console.error(err));
	}, [pendingListPagination]);

	React.useEffect(() => {
		listApiCAll();
	}, [listApiCAll]);

	React.useEffect(() => {
		pendingListApiCall();
	}, [pendingListApiCall]);

	return (
		<Container maxWidth='xl' style={{ padding: "0px", margin: "auto" }}>
			<Helmet>
				<title>Explore | Banjee Admin</title>
			</Helmet>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<ChipComp listApiCall={listApiCAll} pendingListApiCall={pendingListApiCall} />
				</Grid>
				<Grid item xs={12}>
					<Card sx={{ padding: "20px" }}>
						<Box sx={{ borderBottom: "10px", borderColor: "divider" }}>
							<Tabs
								indicatorColor='primary'
								textColor='primary'
								value={value}
								onChange={handleChange}
								aria-label='basic tabs example'>
								<Tab
									sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
									label={`Business (${totalElement})`}
									{...a11yProps(0)}
								/>
								<Tab
									sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
									label={`Pending Request (${totalPendingElement})`}
									{...a11yProps(1)}
								/>
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							<Box sx={{ paddingY: "15px" }}>
								<BusinessList
									totalElement={totalElement}
									handlePagination={handlePagination}
									data={listData}
									paginationState={state}
									listApiCall={listApiCAll}
								/>
							</Box>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Box sx={{ paddingY: "15px" }}>
								<BusinessApprovalList
									data={pendingListData}
									totalElement={totalPendingElement}
									paginationState={pendingListPagination}
									handlePagination={handlePendingListPagination}
									handleTabChange={handleChange}
									pendingListApiCall={pendingListApiCall}
								/>
							</Box>
						</TabPanel>
					</Card>
				</Grid>
				<Grid item xs={8}></Grid>
			</Grid>
		</Container>
	);
}

export default Explore;
