import { Container, Box, Grid, Tabs, Tab, Card } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import ChipComp from "./Components/CardChipComp";
import "./neighbourhood.css";
import NeighbourList from "./Components/NeighbourList";
import { ApprovalList } from "./Components/ApprovalList";
import { filterNeighbourhood, pendingApproval } from "./services/apiServices";

import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router";
import { PaginationContext } from "../../context/PaginationContext";

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
	const { neighbourhoodPagination, setNeighbourhoodPagination } =
		React.useContext(PaginationContext);

	const location = useLocation();
	const [value, setValue] = React.useState(location?.state?.pending ? 1 : 0);
	const [listData, setListData] = React.useState("");
	const [totalElement, setTotalElement] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		page: neighbourhoodPagination?.page ? neighbourhoodPagination?.page : 0,
		pageSize: neighbourhoodPagination?.pageSize ? neighbourhoodPagination?.pageSize : 10,
	});
	const [pendingListData, setPendingListData] = React.useState("");
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
					// 	...prev,
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
			// processed: false,
			// approved: false,
			onList: true,
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

	React.useEffect(() => {
		listApiCall();
	}, [listApiCall]);

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
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Neighbourhood;
