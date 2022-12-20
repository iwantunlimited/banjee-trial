import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { ThemeProvider } from "@mui/material/styles";
import { theme, darkTheme } from "./Theme/theme";
import "./App.css";
import { ContextProvider, MainContext } from "./context/Context";
import SnackbarContext from "./CustomComponents/SnackbarContext";
import NotificationPopup from "./CustomComponents/NotificationPopup";
import useMediaQuery from "@mui/material/useMediaQuery";

function App() {
	const { themeData, setThemeData } = React.useContext(MainContext);
	const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)");
	// console.log("====================================");
	// console.log("themeData", isDarkModeEnabled);
	// console.log("====================================");

	return (
		<ThemeProvider theme={isDarkModeEnabled ? darkTheme : themeData ? darkTheme : theme}>
			<BrowserRouter>
				<Routes />
				<SnackbarContext />
				<NotificationPopup />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
