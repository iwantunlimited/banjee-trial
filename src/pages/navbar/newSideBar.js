import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import {
	Dashboard,
	PeopleAlt,
	// ViewHeadline,
	Category as CategoryIcon,
	ConnectWithoutContact,
	Groups,
	Report,
	ExpandLess,
	ExpandMore,
} from "@mui/icons-material";
import routing from "./navRouting";
import { useLocation, useNavigate } from "react-router";

function SidebarList({ handleId, handleClick }) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const path1 = pathname?.split("/")?.[1];

	const path2 = pathname?.split("/")?.[2];
	const path3 = pathname?.split("/")?.[3];

	console.log("path----3", path3);
	const [open, setOpen] = React.useState(false);
	const [id, setId] = React.useState("");
	return (
		<List
			sx={{
				width: "100%",
				bgcolor: "background.paper",
				paddingTop: "0px !important",
			}}
			component='nav'
			aria-labelledby='nested-list-subheader'>
			{routing?.map((item, index) => {
				if (item?.children?.length > 0) {
					return (
						<>
							<ListItemButton
								key={index}
								onClick={() => {
									handleId(item?.id);
									navigate(item?.path);
									setOpen(!open);
									setId(item.id);
								}}
								sx={{
									color: `/${path1}` === item.path ? "white" : "white",
									// padding: "5px 10px",
									background: `/${path1}` === item.path ? "rgb(42,149,15)" : "#1976D2",
									borderRadius: "10px",
									margin: "2.5px",
									":hover": {
										background: `/${path1}` === item.path ? "rgb(42,149,15)" : "#1976D2",
										opacity: "0.8",
									},
								}}>
								<ListItemIcon
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										color: `/${path1}` === item.path ? "white" : "white",
										"& > svg": {
											fontSize: { xl: "1.8rem", lg: "1.5rem" },
										},
									}}>
									{item?.icon}
								</ListItemIcon>
								<ListItemText
									sx={{
										"& > span": {
											fontSize: {
												sm: "12px",
												md: "15px",
												lg: "15px",
												xl: "18px",
											},
										},
									}}>
									{item?.name}
								</ListItemText>
								{open && item?.id === id ? <ExpandLess /> : <ExpandMore />}
							</ListItemButton>
							<Collapse in={open && item?.id === id}>
								<List sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
									{item?.children?.map((text, index) => {
										return (
											<ListItemButton
												onClick={() => {
													navigate(text?.path);
													handleClick();
												}}
												sx={{
													color: `/${path2}` === text.path ? "white" : "white",
													// padding: "5px 10px",
													background: pathname === text.path ? "rgb(42,149,15)" : "#1976D2",
													borderRadius: "10px",
													margin: "5px",
													ml: 8,
													":hover": {
														background: pathname === text.path ? "rgb(42,149,15)" : "#1976D2",
														opacity: "0.8",
													},
												}}>
												<ListItemIcon
													sx={{
														display: "flex",
														justifyContent: "center",
														alignItems: "center",
														color: `/${path1}` === item.path ? "white" : "white",
														"& > svg": {
															fontSize: { xl: "1.8rem", lg: "1.5rem" },
														},
													}}>
													{text?.icon}
												</ListItemIcon>
												<ListItemText
													sx={{
														"& > span": {
															fontSize: {
																sm: "12px",
																md: "15px",
																lg: "15px",
																xl: "18px",
															},
														},
													}}>
													{text?.name}
												</ListItemText>
											</ListItemButton>
										);
									})}
								</List>
							</Collapse>
						</>
					);
				} else {
					return (
						<ListItemButton
							key={index}
							onClick={() => {
								handleId(item?.id);
								navigate(item?.path);
								setOpen(false);
								handleClick();
							}}
							sx={{
								color: `/${path1}` === item.path ? "white" : "white",
								// padding: "5px 10px",
								background: `/${path1}` === item.path ? "rgb(42,149,15)" : "#1976D2",
								borderRadius: "10px",
								margin: "5px",
								":hover": {
									background: `/${path1}` === item.path ? "rgb(42,149,15)" : "#1976D2",
									opacity: "0.8",
								},
							}}>
							<ListItemIcon
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									color: `/${path1}` === item.path ? "white" : "white",
									"& > svg": {
										fontSize: { xl: "1.8rem", lg: "1.5rem" },
									},
								}}>
								{item?.icon}
							</ListItemIcon>
							<ListItemText
								sx={{
									"& > span": {
										fontSize: { sm: "12px", md: "15px", lg: "15px", xl: "18px" },
									},
								}}>
								{item?.name}
							</ListItemText>
						</ListItemButton>
					);
				}
			})}
		</List>
	);
}

export default SidebarList;
