import "./App.css";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./Theme/theme";
import "./App.css";

function App() {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
