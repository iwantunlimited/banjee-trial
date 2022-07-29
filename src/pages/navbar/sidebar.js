import React from "react";
import routing from "./navRouting";
import {List} from "@mui/material";
import {useLocation} from "react-router-dom";
import {Link} from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

function Sidebar(props) {
	const {pathname} = useLocation();
	const path1 = pathname?.split("/")?.[1];

	// console.log("path1-------", `/${path1}`);

	const {handleId} = props;

	return (
		<List sx={{paddingTop: "4px"}}>
			{routing.map((text, index) => {
				return (
					<Link
						to={text.path}
						style={{display: "flex", textDecoration: "none", color: "grey"}}
						onClick={() => {
							handleId(text.id);
						}}
					>
						<ListItem
							button
							key={index}
							onClick={props.handleClick}
							sx={{
								color: `/${path1}` === text.path ? "white" : "white",
								// padding: "5px 10px",
								background:
									`/${path1}` === text.path ? "rgb(42,149,15)" : "#1976D2",
								borderRadius: "10px",
								margin: "5px",
								":hover": {
									background:
										`/${path1}` === text.path ? "rgb(42,149,15)" : "#1976D2",
									opacity: "0.8",
								},
							}}
						>
							<ListItemIcon
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									color: `/${path1}` === text.path ? "white" : "white",
									"& > svg": {
										fontSize: {xl: "1.8rem", lg: "1.5rem"},
									},
								}}
							>
								{text.icon}
							</ListItemIcon>
							<ListItemText
								sx={{
									"& > span": {
										fontSize: {sm: "12px", md: "15px", lg: "15px", xl: "18px"},
									},
								}}
							>
								{text.name}
							</ListItemText>
							{/* <Typography variant='h5' style={{marginLeft: window.innerWidth < 500 ? '-20px' : '0px',fontWeight:'500'}}>{text.name}</Typography> */}
						</ListItem>
					</Link>
				);
			})}
		</List>
	);
}

export default Sidebar;
