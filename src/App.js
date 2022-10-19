import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Theme/theme";
import "./App.css";
import { ContextProvider } from "./context/Context";
import SnackbarContext from "./CustomComponents/SnackbarContext";

function App() {
	return (
		<ContextProvider>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<Routes />
					<SnackbarContext />
				</BrowserRouter>
			</ThemeProvider>
		</ContextProvider>
	);
}

export default App;
