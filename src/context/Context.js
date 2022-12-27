import React from "react";

const MainContext = React.createContext({
	modalData: {},
	setModalData: () => {},
	modalOpen: false,
	setModalOpen: () => {},
	notificationPopup: false,
	setNotificationPopup: () => {},
	themeData: false,
	setThemeData: () => {},
	locationData: {},
	setLocationData: () => {},
});

function ContextProvider({ children }) {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [notificationPopup, setNotificationPopup] = React.useState({
		open: false,
		message: "",
	});

	const [themeData, setThemeData] = React.useState(false);
	const [location, setLocation] = React.useState({
		lat: 0,
		lng: 0,
		address: "",
		updated: false,
	});

	const [modalData, setModalData] = React.useState({
		message: "",
		severity: "",
	});

	const handleLocation = (data) => {
		setLocation((prev) => ({
			...prev,
			lat: data?.lat,
			lng: data?.lng,
			address: data?.address,
			updated: data?.updated ? data?.updated : false,
		}));
	};

	const handleThemeData = (msg) => {
		setThemeData(msg);
	};

	const handleData = (message, severity) => {
		setModalData({
			message: message,
			severity: severity,
		});
	};

	const handleNotification = (data) => {
		setNotificationPopup((prev) => ({
			...prev,
			open: data?.open,
			message: data?.message,
		}));
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
				themeData: themeData,
				setThemeData: handleThemeData,
				locationData: location,
				setLocationData: handleLocation,
			}}>
			{children}
		</MainContext.Provider>
	);
}

export { ContextProvider, MainContext };
