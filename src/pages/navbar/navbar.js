import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import { Drawer, Hidden, Toolbar, List, Typography, IconButton, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../assets/LogoWhite.svg";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import routing from "./navRouting";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTheme } from "@mui/material/styles";
import SidebarList from "./newSideBar";
import SnackbarContext from "../../CustomComponents/SnackbarContext";
import { MainContext } from "../../context/Context";
import { DarkMode, Light, LightMode } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";

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

function Navbar(props) {
	let navigate = useNavigate();
	const theme = useTheme();
	const { setModalOpen, setModalData, setThemeData, themeData } = React.useContext(MainContext);

	const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)");

	const [id, setId] = React.useState("");

	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	function handleIdFun(event) {
		setId(event);
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
					<SidebarList handleId={handleIdFun} handleClick={handleDrawerToggle} />
					{/* <Sidebar handleId={handleIdFun} handleClick={handleDrawerToggle} /> */}
				</List>
			</Box>
		</Drawer>
	);

	const mobile = (
		<Drawer
			//   container={container}
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
					<SidebarList handleId={handleIdFun} handleClick={handleDrawerToggle} />
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
												console.log("themeData", themeData);
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
											}}>
											<Link to='/login'>
												<LogoutIcon style={{ color: theme.palette.primary.contrastText }} />
											</Link>
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
					<Outlet />
				</Box>
			</Box>
			<SnackbarContext />
		</div>
	);
}

export default Navbar;
