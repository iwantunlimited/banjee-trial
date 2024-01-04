import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";

import { useTheme } from "@mui/material/styles";
import {
	// ViewHeadline,
	ExpandLess,
	ExpandMore,
} from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router";
import NavRouting from "./navRouting";

function SidebarList({ handleId, handleClick }) {
	const navigate = useNavigate();
	const params = useParams();
	const theme = useTheme();
	const userType = localStorage?.getItem("userType");

	const { pathname } = useLocation();
	const path0 = pathname?.split("/")?.[0];
	const path1 = pathname?.split("/")?.[1];

	const path2 = pathname?.split("/")?.[2];
	const routing = NavRouting();

	// console.log("path----3", "/" + path0 + " " + path1, path2);
	// console.log("path----corect", path1, path1 === "social-feeds");
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
			{userType &&
				routing?.map((item, index) => {
					const routingPath = item?.path.split("/")?.[1];

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
										color:
											`/${path1}` === routingPath ? theme.palette.common.white : theme.palette.common.white,
										// padding: "5px 10px",
										background:
											path1 === routingPath ? theme.palette.secondary.main : theme.palette.primary.main,
										borderRadius: "10px",
										marginTop: "2.5px",
										marginX: "5px",
										":hover": {
											background:
												path1 === routingPath ? theme.palette.secondary.main : theme.palette.primary.main,
											opacity: "0.8",
										},
									}}>
									<ListItemIcon
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											color:
												path1 === routingPath
													? theme.palette.primary.contrastText
													: theme.palette.primary.contrastText,
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
									<List className='urvik' sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
										{item?.children?.map((text, index) => {
											const childPath1 = text?.path.split("/")?.[1];
											const childPath2 = text?.path.split("/")?.[2];

											const childPathUrlForDetail = text?.path + "/detail/" + params?.id;
											const childPathUrlForView = text?.path + "/" + params?.id;
											const childPathUrlForUpdate = text?.path + "/detail/update/" + params?.id;

											return (
												<ListItemButton
													key={index}
													onClick={() => {
														navigate(text?.path);
														handleClick();
													}}
													sx={{
														// color:
														// 	`/${path2}` === text.path
														// 		? theme.palette.primary.contrastText
														// 		: theme.palette.primary.contrastText,
														color:
															(path1 === routingPath && path2 === childPath2) ||
															pathname === childPathUrlForDetail ||
															pathname === childPathUrlForUpdate ||
															pathname === childPathUrlForView
																? theme.palette.primary.contrastText
																: theme.palette.primary.contrastText,
														// padding: "5px 10px",
														background:
															(path1 === routingPath && path2 === childPath2) ||
															pathname === childPathUrlForDetail ||
															pathname === childPathUrlForUpdate ||
															pathname === childPathUrlForView
																? theme.palette.secondary.main
																: theme.palette.primary.main,
														borderRadius: "10px",
														marginY: "5px",
														marginX: "5px",
														ml: 3,
														":hover": {
															background:
																(path1 === routingPath && path2 === childPath2) ||
																pathname === childPathUrlForDetail ||
																pathname === childPathUrlForUpdate ||
																pathname === childPathUrlForView
																	? theme.palette.secondary.main
																	: theme.palette.primary.main,
															opacity: "0.8",
														},
													}}>
													<ListItemIcon
														sx={{
															display: "flex",
															justifyContent: "center",
															alignItems: "center",
															color:
																(path1 === routingPath && path2 === childPath2) ||
																pathname === childPathUrlForDetail ||
																pathname === childPathUrlForUpdate ||
																pathname === childPathUrlForView
																	? theme.palette.primary.contrastText
																	: theme.palette.primary.contrastText,
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
									color:
										path1 === routingPath
											? theme.palette.primary.contrastText
											: theme.palette.primary.contrastText,
									// padding: "5px 10px",
									// background:
									// 	path1 === routingPath
									// 		? theme.palette.secondary.main
									// 		: theme.palette.primary.main,

									background:
										userType === "mechant"
											? path1 === routingPath ||
											  (index === 0 && pathname === `${"/social-feeds/" + params?.id}`)
												? theme.palette.secondary.main
												: theme.palette.primary.main
											: path1 === routingPath
											? theme.palette.secondary.main
											: theme.palette.primary.main,
									borderRadius: "10px",
									margin: "5px",
									":hover": {
										// background:
										// 	path1 === routingPath
										// 		? theme.palette.secondary.main
										// 		: theme.palette.primary.main,
										background:
											path1 === routingPath ? theme.palette.secondary.main : theme.palette.primary.main,
										opacity: "0.8",
									},
								}}>
								<ListItemIcon
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										color:
											path1 === routingPath
												? theme.palette.primary.contrastText
												: theme.palette.primary.contrastText,
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
