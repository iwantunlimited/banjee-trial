import { Container, Box, Grid, Tabs, Tab, Card } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import ChipComp from "./Components/CardChipComp";
import "./neighbourhood.css";
import NeighbourList from "./Components/NeighbourList";
import { ApprovalList } from "./Components/ApprovalList";
import { filterNeighbourhood } from "./services/apiServices";

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

function Neighbourhood() {
	const [value, setValue] = React.useState(0);
	const theme = useTheme();

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
	};

	const listApiCAll = React.useCallback((page, pageSize) => {
		filterNeighbourhood({ page: page, pageSize: pageSize, online: true })
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
				setState((prev) => ({
					...prev,
					totalElement: res.totalElements,
					pagination: {
						page: res?.pageable?.pageNumber,
						pageSize: res?.pageable?.pageSize,
					},
				}));
			})
			.catch((err) => console.log(err));
	}, []);

	React.useEffect(() => {
		listApiCAll(0, 10);
	}, [listApiCAll]);

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
					<Card sx={{ padding: { xs: "10px", sm: "20px" } }}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<Tabs
								indicatorColor='primary'
								textColor='primary'
								value={value}
								onChange={handleChange}
								aria-label='basic tabs example'>
								<Tab label='Neighbourhood List' {...a11yProps(0)} />
								<Tab label='Pending List' {...a11yProps(1)} />
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							<Box sx={{ padding: { xs: "10px", sm: "10px" } }}>
								<NeighbourList
									listApiCAll={listApiCAll}
									data={listData}
									pagination={state}
									handlePagination={handlePagination}
								/>
							</Box>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Box sx={{ padding: "10px" }}>
								<ApprovalList listApiCAll={listApiCAll} handleTabChange={handleChange} />
							</Box>
						</TabPanel>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Neighbourhood;
