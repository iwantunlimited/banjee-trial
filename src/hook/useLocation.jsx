import { useIsFocusVisible } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";

const localLat = localStorage.getItem("lat");
const localLng = localStorage.getItem("lng");
function useLocation(props) {
	const [location, setLocation] = React.useState({
		lat: 0,
		lng: 0,
		address: "",
	});

	const AddressApi = React.useCallback(() => {
		axios
			.get(
				`https://maps.googleapis.com/maps/api/geocode/json?latlng=${localLat},${localLng}&key=AIzaSyCrhHuTkSLIcd5UhwimmpF50CrP9itelXk`
			)
			.then((res) => {
				// console.log("res", res);
				setLocation((prev) => ({
					...prev,
					address: res?.data?.results?.[0]?.formatted_address,
				}));
			})
			.catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		setLocation((prev) => ({
			...prev,
			lat: localLat,
			lng: localLng,
		}));
		AddressApi();
	}, [localLng && localLat, AddressApi]);
	return {
		location,
	};
}

export default useLocation;
