import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BlogReaction from "./BlogReaction";
import BlogComments from "./BlogComments";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function ReactionCommentTab({ blogData, postType }) {
	console.log("====================================");
	console.log("blogData reaction", blogData);
	console.log("====================================");
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
					<Tab label='Reactions' {...a11yProps(0)} />
					<Tab label='Comments' {...a11yProps(1)} />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<BlogReaction blogData={blogData} postType={postType} />
			</TabPanel>
			<TabPanel value={value} index={1}>
				<BlogComments blogData={blogData} postType={postType} />
			</TabPanel>
		</Box>
	);
}
