import React from "react";

function CustomMap() {
	const ref = React.useRef(null);
	const [map, setMap] = React.useState();

	React.useEffect(() => {
		if (ref.current && !map) {
			setMap(new window.google.maps.Map(ref.current, {}));
		}
	}, [ref, map]);

	return (
		<>
			<div ref={ref} />
		</>
	);
}

export default CustomMap;
