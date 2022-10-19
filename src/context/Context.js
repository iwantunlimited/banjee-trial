import React from "react";

const MainContext = React.createContext({
	modalData: {},
	setModalData: () => {},
	modalOpen: false,
	setModalOpen: () => {},
});

function ContextProvider({ children }) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [modalData, setModalData] = React.useState({
		message: "",
		severity: "",
	});

	const handleData = (message, severity) => {
		setModalData({
			message: message,
			severity: severity,
		});
	};

	const handleSnackbar = (data) => {
		setModalOpen(data);
	};

	return (
		<MainContext.Provider
			value={{
				modalData: modalData,
				setModalData: handleData,
				modalOpen: modalOpen,
				setModalOpen: handleSnackbar,
			}}>
			{children}
		</MainContext.Provider>
	);
}

export { ContextProvider, MainContext };
