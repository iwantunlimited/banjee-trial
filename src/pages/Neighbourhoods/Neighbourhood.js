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
	const [value, setValue] = React.useState(0);
	const theme = useTheme();

	const [listData, setListData] = React.useState("");
	const [pendingListData, setPendingListData] = React.useState([]);
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

	const listApiCAll = React.useCallback(
		(data) => {
			const payload =
				data?.keyword !== ""
					? { page: state?.page, pageSize: state?.pageSize, online: true, keywords: data?.keyword }
					: { page: state?.page, pageSize: state?.pageSize, online: true };
			filterNeighbourhood(payload)
				.then((res) => {
					console.log("--------", res);
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
				.catch((err) => console.log(err));
		},
		[state]
	);

	const pendingAPiCAll = React.useCallback(() => {
		pendingApproval({
			page: pendingListPagination?.page,
			pageSize: pendingListPagination?.pageSize,
			processed: false,
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
				setTotalPendingElement(res?.totalElements);
				setPendingListData(resp);
			})
			.catch((err) => console.error(err));
	}, [pendingListPagination?.page, pendingListPagination?.pageSize]);

	React.useEffect(() => {
		listApiCAll();
		pendingAPiCAll();
	}, [listApiCAll, pendingAPiCAll, state, pendingListPagination]);

	return (
		<Container maxWidth='xl' style={{ padding: "0px", margin: "auto" }}>
			<Helmet>
				<title>Neighbourhood | Banjee Admin</title>
			</Helmet>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<ChipComp listApiCAll={listApiCAll} />
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
									listApiCAll={listApiCAll}
									data={listData}
									totalElement={totalElement}
									pagination={state}
									handlePagination={handlePagination}
								/>
							</Box>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Box sx={{ paddingY: "15px" }}>
								<ApprovalList
									listApiCAll={listApiCAll}
									pendingListApiCall={pendingAPiCAll}
									data={pendingListData}
									totalElement={totalPendingElement}
									pagination={pendingListPagination}
									handlePagination={handlePendingListPagination}
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
