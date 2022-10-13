import { Container, Box, Grid, Tabs, Tab, Card } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import Category from "./Category";

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

export function MainCategoryComp() {
	const [value, setValue] = React.useState(0);

	const [state, setState] = React.useState("ROOMS");

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Container maxWidth='xl' style={{ padding: "0px", margin: "auto" }}>
			<Helmet>
				<title>Category | Banjee Admin</title>
			</Helmet>
			<Grid item container xs={12} spacing={2}>
				<Grid item xs={12}>
					<Card sx={{ padding: "20px" }}>
						<Box sx={{ borderBottom: "10px", borderColor: "divider" }}>
							<Tabs
								indicatorColor='primary'
								textColor='primary'
								value={value}
								onChange={handleChange}
								aria-label='basic tabs example'>
								<Tab onClick={() => setState("ROOMS")} label='Rooms' {...a11yProps(0)} />
								<Tab
									onClick={() => setState("LOCALBUSINESS")}
									label='Local Business'
									{...a11yProps(1)}
								/>
								<Tab onClick={() => setState("BUYANDSELL")} label='For sale' {...a11yProps(2)} />
								<Tab onClick={() => setState("BLOG")} label='Blogs' {...a11yProps(3)} />
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							<Category categoryName={state} />
						</TabPanel>
						<TabPanel value={value} index={1}>
							<Category categoryName={state} />
						</TabPanel>
						<TabPanel value={value} index={2}>
							<Category categoryName={state} />
						</TabPanel>
						<TabPanel value={value} index={3}>
							<Category categoryName={state} />
						</TabPanel>
					</Card>
				</Grid>
				<Grid item xs={8}></Grid>
			</Grid>
		</Container>
	);
}
