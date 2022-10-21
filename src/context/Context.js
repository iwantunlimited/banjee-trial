import React from "react";

const MainContext = React.createContext({
	modalData: {},
	setModalData: () => {},
	modalOpen: false,
	setModalOpen: () => {},
	notificationPopup: false,
	setNotificationPopup: () => {},
});

function ContextProvider({ children }) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [notificationPopup, setNotificationPopup] = React.useState(false);

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

	const handleNotification = (data) => {
		setNotificationPopup(data);
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
				notificationPopup: notificationPopup,
				setNotificationPopup: handleNotification,
			}}>
			{children}
		</MainContext.Provider>
	);
}

export { ContextProvider, MainContext };
