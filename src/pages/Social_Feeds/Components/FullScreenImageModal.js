import * as React from "react";
import { Modal, Typography, Box, Button, IconButton } from "@mui/material";
import { PlayCircle, PauseCircle, Fullscreen } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	boxShadow: 24,
};

export default function FullScreenImageModal(props) {
	const {
		state: { imageModal, src, type },
		handleClose,
	} = props;

	const [videoState, setVideoState] = React.useState(true);

	function playPause() {
		if (document.getElementById("video").paused) document.getElementById("video").play();
		else document.getElementById("video").pause();
	}

	// React.useEffect(() => {
	// 	if (document.getElementById("video").paused)
	// 		document.getElementById("video").play();
	// 	else document.getElementById("video").pause();
	// }, []);

	return (
		<Modal
			open={imageModal}
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box sx={style}>
				<Box
					sx={{
						position: "relative",
						"&:hover": {
							"& > .btnFullScreen": {
								display: "block",
								position: "absolute",
								left: "75%",
								top: "10%",
								transform: "translate(-50%, -50%)",
							},
						},
						"& > .btnFullScreen": {
							display: "none",
						},
					}}>
					<img
						alt=''
						src={src && src}
						style={{
							height: "100%",
							width: "100%",
							objectFit: "contain",
						}}
					/>
					<IconButton className='btnFullScreen' onClick={handleClose}>
						<Fullscreen style={{ color: "#FFF", fontSize: "30px" }} />
					</IconButton>
				</Box>
			</Box>
		</Modal>
	);
}
