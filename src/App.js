import "./App.css";
import React, { useEffect } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import Routes from "./Routes";
import { ThemeProvider } from "@mui/material/styles";
import { theme, darkTheme } from "./Theme/theme";
import "./App.css";
import { ContextProvider, MainContext } from "./context/Context";
import SnackbarContext from "./CustomComponents/SnackbarContext";
import NotificationPopup from "./CustomComponents/NotificationPopup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SocketConfiguration, initWebSocket } from "./WebSocketConfig";
import {WebSocketProvider} from "./context/WebSocketContext";

function App() {
	const { themeData, setThemeData, setLocationData } = React.useContext(MainContext);
	const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)");
	// console.log("====================================");
	// console.log("themeData", isDarkModeEnabled, "----", themeData);
	// console.log("====================================");

	// if (isDarkModeEnabled) {
	// 	console.log("====================================");
	// 	console.log("dark");
	// 	console.log("====================================");
	// 	setThemeData(true);
	// }

	//navigator for getting current lat lon
	navigator.geolocation.getCurrentPosition(function (position) {
		// console.log("Latitude is :", position.coords.latitude);
		// console.log("Longitude is :", position.coords.longitude);
		localStorage?.setItem("lat", position.coords.latitude);
		localStorage?.setItem("lng", position.coords.longitude);
		setLocationData({ lat: position.coords.latitude, lng: position.coords.longitude, address: "" });
		return position;
	});



	return (
		<WebSocketProvider>
			<SocketConfiguration />
		<ThemeProvider theme={themeData ? darkTheme : theme}>
			<BrowserRouter>
				<Routes />
				<SnackbarContext />
				<NotificationPopup />
			</BrowserRouter>
		</ThemeProvider>
		</WebSocketProvider>
	);
}

export default App;
