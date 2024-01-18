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

function SidebarList({ handleId, handleClick, mainId }) {
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
	const [childId, setChildId] = React.useState("");

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

					const compareRoute =
						item?.path?.length > 1
							? pathname?.slice(1, pathname?.length).startsWith(routingPath)
							: item?.path === pathname;

					if (item?.children?.length > 0) {
						return (
							<>
								<ListItemButton
									key={index}
									onClick={() => {
										setChildId(item?.children?.[0].id);
										navigate(item?.path);
										setOpen(open ? true : !open);
										handleId(item?.id);
									}}
									sx={{
										color: compareRoute ? theme.palette.common.white : theme.palette.common.white,
										// padding: "5px 10px",
										background: compareRoute ? "#121212" : theme.palette.primary.main,
										borderRadius: "10px",
										marginTop: "2.5px",
										marginX: "5px",
										":hover": {
											background: compareRoute ? theme.palette.secondary.main : theme.palette.primary.main,
											opacity: "0.8",
										},
									}}>
									<ListItemIcon
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
											color: compareRoute
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
									{open && item?.id === mainId ? <ExpandLess /> : <ExpandMore />}
								</ListItemButton>
								<Collapse in={open && item?.id === mainId}>
									<List className='urvik' sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
										{item?.children?.map((text, index) => {
											const childPath1 = text?.path.split("/")?.[1];
											const comparechildPath =
												pathname?.slice(1, pathname?.length).startsWith(childPath1) && text.id === childId;

											return (
												<ListItemButton
													key={index}
													onClick={() => {
														navigate(text?.path);
														handleClick();
														setChildId(text?.id);
													}}
													sx={{
														// color:
														// 	`/${path2}` === text.path
														// 		? theme.palette.primary.contrastText
														// 		: theme.palette.primary.contrastText,
														color: comparechildPath
															? theme.palette.primary.contrastText
															: theme.palette.primary.contrastText,
														// padding: "5px 10px",
														background: comparechildPath
															? theme.palette.secondary.main
															: theme.palette.primary.main,
														borderRadius: "10px",
														marginY: "5px",
														marginX: "5px",
														ml: 3,
														":hover": {
															background: comparechildPath
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
															color: comparechildPath
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
									color: compareRoute
										? theme.palette.primary.contrastText
										: theme.palette.primary.contrastText,
									// padding: "5px 10px",
									// background:
									// 	path1 === routingPath
									// 		? theme.palette.secondary.main
									// 		: theme.palette.primary.main,

									background: compareRoute ? theme.palette.secondary.main : theme.palette.primary.main,
									borderRadius: "10px",
									margin: "5px",
									":hover": {
										// background:
										// 	path1 === routingPath
										// 		? theme.palette.secondary.main
										// 		: theme.palette.primary.main,
										background: compareRoute ? theme.palette.secondary.main : theme.palette.primary.main,
										opacity: "0.8",
									},
								}}>
								<ListItemIcon
									sx={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										color: compareRoute
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
