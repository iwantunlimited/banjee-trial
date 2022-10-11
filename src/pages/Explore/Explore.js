import { Container, Box, Grid, Tabs, Tab, Card } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import { BusinessApprovalList } from "./Components/Business/ApprovalList";
import BusinessList from "./Components/Business/BusinessList";
import ChipComp from "./Components/CardChipComp";
import ExploreBlogs from "./Components/Blogs/Blogs";
import { filterBusiness } from "./services/ApiServices";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
	const [value, setValue] = React.useState(0);

	const [listData, setListData] = React.useState("");
	const [state, setState] = React.useState({
		totalElement: 0,
		pagination: {
			page: 0,
			pageSize: 10,
		},
	});

	const handlePagination = (data) => {
		setState((prev) => ({
			...prev,
			pagination: data,
		}));
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
		listApiCAll(0, 10);
	};

	const listApiCAll = React.useCallback((page, pageSize) => {
		filterBusiness({ page: page, pageSize: pageSize, approved: true })
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
				setState((prev) => ({
					...prev,
					totalElement: res.totalElements,
					pagination: {
						page: res?.pageable?.pageNumber,
						pageSize: res?.pageable?.pageSize,
					},
				}));
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		listApiCAll(0, 10);
	}, [listApiCAll]);

	return (
		<Container maxWidth='xl' style={{ padding: "0px", margin: "auto" }}>
			<Helmet>
				<title>Explore | Banjee Admin</title>
			</Helmet>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<ChipComp listApiCall={listApiCAll} />
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
								<Tab label='Business' {...a11yProps(0)} />
								<Tab label='Pending Request' {...a11yProps(1)} />
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							<BusinessList
								handlePagination={handlePagination}
								data={listData}
								paginationState={state}
								listApiCall={listApiCAll}
							/>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<BusinessApprovalList handleTabChange={handleChange} listApiCall={listApiCAll} />
						</TabPanel>
					</Card>
				</Grid>
				<Grid item xs={8}></Grid>
			</Grid>
		</Container>
	);
}

export default Explore;
