import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import {
	Drawer,
	Hidden,
	Toolbar,
	List,
	Typography,
	IconButton,
	Stack,
	CircularProgress,
	Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../assets/newLogo.png";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTheme } from "@mui/material/styles";
import SidebarList from "./newSideBar";
import SnackbarContext from "../../CustomComponents/SnackbarContext";
import { MainContext } from "../../context/Context";
import { DarkMode, Light, LightMode } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import NavRouting from "./navRouting";
import Loader from "../Loader/Loader";
import { WebSocketContext } from "../../context/WebSocketContext";
import AlertModal from "../LiveAlerts/components/AlertModal";
import AlertSound from "../../assets/alertsound/alert.mp3";

const LightTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: "rgba(0, 0, 0, 0.87)",
		boxShadow: theme.shadows[1],
		fontSize: 17,
	},
}));

function PlayAudio() {
	let audio = new Audio("/alert.mp3");
	audio.play();
}

function Navbar(props) {
	const routing = NavRouting();
	let navigate = useNavigate();
	const theme = useTheme();
	const { socketData: socket } = React.useContext(WebSocketContext);

	const [alertData, setAlertData] = React.useState({
		open: false,
		data: {},
	});
	const handleClose = () => {
		setAlertData({ open: false, data: {} });
	};

	const { setModalOpen, setModalData, setThemeData, themeData } = React.useContext(MainContext);

	const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)");

	const [id, setId] = React.useState("");
	const [userType, setUserType] = React.useState(false);

	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	function handleIdFun(event) {
		setId(event);
	}
	function showNotification(data) {
		var options = {
			body: data?.description,
			icon: "/logo.png",
			dir: "ltr",
			action: data?.action,
			requireInteraction: true,
		};
		var notification = new Notification(data?.title, options);

		notification.addEventListener("click", (event) => {
			event.preventDefault();
			window.open("https://adminv1.banjee.org/banjee-alert/" + data?.alertId, "_blank");
		});

		setTimeout(notification.close.bind(notification), 20000);
	}

	const drawerWidth = window.innerWidth < 700 ? "190px" : "230px";

	const desktop = (
		<Drawer
			variant='permanent'
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
				"& > div": {
					// background: "#1976D2",
					// background: "#2787bd",
					// background: theme.palette.common.white,
				},
			}}>
			<Toolbar />
			<Box sx={{ overflow: "auto" }}>
				<List sx={{ paddingTop: "3px !important" }}>
					{/* <Button
						onClick={() =>
							showNotification({ title: "banjee", description: "Description", action: navigate("/user") })
						}>
						Show notification
					</Button> */}
					<SidebarList mainId={id} handleId={handleIdFun} handleClick={handleDrawerToggle} />
				</List>
			</Box>
		</Drawer>
	);

	const mobile = (
		<Drawer
			anchor='top'
			variant='temporary'
			open={mobileOpen}
			onClose={handleDrawerToggle}
			ModalProps={{
				keepMounted: true, // Better open performance on mobile.
			}}
			sx={{
				// display: { xs: "block", sm: "none" },
				"& .MuiDrawer-paper": {
					boxSizing: "border-box",
					// width: drawerWidth,
					width: "100%",
				},
			}}>
			<Toolbar />
			<Box sx={{ overflow: "auto" }}>
				<List>
					<SidebarList mainId={id} handleId={handleIdFun} handleClick={handleDrawerToggle} />
					{/* <Sidebar handleId={handleIdFun} handleClick={handleDrawerToggle} /> */}
				</List>
			</Box>
		</Drawer>
	);

	React.useEffect(() => {
		if (!localStorage.getItem("token")) {
			navigate("/login", { replace: true });
		}
	}, [navigate]);

	const socketListener = React.useCallback(() => {
		// console.log("I am in nav", socket);
		if (socket) {
			console.log("socket.readyState", socket?.readyState);
			socket?.addEventListener("message", ({ data }) => {
				const { action, data: mData } = JSON.parse(data);

				// console.log("====================================");
				console.log("action", action);
				console.log("mData", mData);
				// console.log("====================================");
				if (mData?.type === "ALERT" || mData?.type === "PANIC" || action === "ALERT_REPORT") {
					PlayAudio();
					if (mData?.type === "ALERT" || mData?.type === "PANIC") {
						setAlertData({ open: true, data: mData });
					} else if (action === "ALERT_REPORT") {
						showNotification(
							mData?.payload?.content?.type === "ALERT"
								? {
										alertId: mData?.payload?.alertId,
										title: mData?.payload?.content?.eventName,
										description: "Alert has been reported. Take actions",
								  }
								: {
										alertId: mData?.payload?.alertId,
										title: "Emergenecy",
										description: "has been reported fake. Take actions immediately",
								  }
						);
					}
				}
				console.log("Socket Data------------->", JSON.parse(data));
			});
		}
	}, [socket]);

	React.useEffect(() => {
		setUserType(localStorage?.getItem("userType"));
		socketListener();
	}, [socketListener]);

	const notificationPermission = React.useCallback(() => {
		if (!("Notification" in window)) {
			console.log("Browser does not support desktop notification");
		} else {
			console.log("Notifications are supported");
			if (Notification.permission === "granted") {
				console.log("permission allowed");
				// console.log("permission", Notification.permission);
			} else {
				Notification.requestPermission()
					.then(function (result) {
						console.log(result);
					})
					.catch((err) => {
						console.error("err", err);
					});
			}
		}
	}, [Notification]);

	useEffect(() => {
		notificationPermission();
	}, [notificationPermission]);

	if (userType) {
		return (
			<div>
				<Helmet>
					<title>Banjee Admin</title>
				</Helmet>
				<Box sx={{ display: "flex" }}>
					<CssBaseline />
					<AppBar
						position='fixed'
						sx={{
							zIndex: (theme) => theme.zIndex.drawer + 1,
							background: theme.palette.primary.main,
							// color: theme.palette.common.white,
						}}>
						<Toolbar>
							<Hidden mdUp>
								<IconButton
									color='inherit'
									aria-label='open drawer'
									edge='start'
									onClick={handleDrawerToggle}
									sx={{ marginRight: "20px", display: { lg: "none" } }}>
									<MenuIcon />
								</IconButton>
							</Hidden>
							<div
								style={{
									display: "flex",
									width: "100%",
									justifyContent: "space-between",
								}}>
								<div
									onClick={() => navigate("/")}
									style={{
										display: "flex",
										alignItems: "center",
										cursor: "pointer",
									}}>
									<img
										src={Logo}
										style={{ width: window.innerWidth < 520 ? "80px" : "110px" }}
										alt='BanjeeLogo'
									/>
									<Hidden mdDown>
										{routing.map((ele) => {
											if (ele.id === id) {
												return (
													<Typography
														sx={{
															fontSize: "25px",
															marginLeft: "4em",
															fontFamily: "inherit",
														}}
														noWrap
														component='div'>
														{ele.name}
													</Typography>
												);
											} else {
												return null;
											}
										})}
									</Hidden>
								</div>
								<div style={{ display: "flex", justifyContent: "flex-end" }}>
									<Stack direction='row' spacing={2} sx={{ display: "flex", alignItems: "center" }}>
										{/* {isDarkModeEnabled === false && ( */}
										<LightTooltip title='theme'>
											<IconButton
												onClick={() => {
													// console.log("themeData", themeData);
													setThemeData(!themeData);
												}}>
												{themeData ? <LightMode /> : <DarkMode />}
											</IconButton>
										</LightTooltip>
										{/* )} */}
										<LightTooltip title='Logout'>
											<IconButton
												onClick={() => {
													setModalOpen(true);
													setModalData("Logout Successfully", "success");
													localStorage.clear();
													navigate("/login");
												}}>
												{/* <Link to='/login'> */}
												<LogoutIcon style={{ color: theme.palette.primary.contrastText }} />
												{/* </Link> */}
											</IconButton>
										</LightTooltip>
									</Stack>
								</div>
							</div>
						</Toolbar>
					</AppBar>
					<Hidden mdDown>{desktop}</Hidden>
					<Hidden mdUp>{mobile}</Hidden>
					<Box
						component='main'
						style={{
							width: "100%",
							height: "100%",
							minHeight: "100vh",
							// background: theme.palette.grey.A700,
							padding: "20px",
						}}>
						<Toolbar />
						<AlertModal open={alertData.open} data={alertData.data} handleClose={handleClose} />
						<Outlet />
					</Box>
				</Box>
				<SnackbarContext />
			</div>
		);
	} else {
		setTimeout(() => {
			if (userType === null) {
				window?.location?.reload();
			}
		}, 10000);
		return <Loader />;
	}
}

export default Navbar;
