import React, { useState } from "react";
import {
	Grid,
	Typography,
	Box,
	CircularProgress,
	IconButton,
	Card,
	Tooltip,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { MainContext } from "../../context/Context";
import { useTheme } from "styled-components";
import CreateThougthModal from "./Components/CreateThougthModal";
import ThoughtCard from "./Components/ThoughtCard";
import DeleteThoughtModal from "./Components/DeleteThoughtModal";
import { getThoughts } from "./services/ApiServices";
export default function Thoughts() {
	const { themeData } = React.useContext(MainContext);
	const theme = useTheme();
	const [thoughts, setThoughts] = useState();
	const [openCreateModal, setOpenCreateModal] = React.useState(false);
	const [deleteModal, setDeleteModal] = React.useState(false);
	const [deleteThoughtId, setDeleteThoughtId] = React.useState("");
	const [loading, setLoading] = useState(false);
	const getThoughtsApiCall = React.useCallback(() => {
		setLoading(true);
		getThoughts({ cloudId: "62401d53e3a009309544d3e8" })
			.then((res) => {
				setThoughts(res.content);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	React.useEffect(() => {
		getThoughtsApiCall();
	}, [getThoughtsApiCall]);

	if (loading) {
		return (
			<Box
				style={{
					height: "100vh",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: " center",
				}}
			>
				<CircularProgress />
			</Box>
		);
	} else if (thoughts) {
		return (
			<>
				<Card
					sx={{
						padding: "20px",
						marginBottom: "20px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: { xs: "column", sm: "row" },
					}}
				>
					<Box sx={{ marginBottom: { xs: "20px", sm: "0px" } }}>
						<Typography
							sx={{
								color: themeData ? "default" : "#6b778c",
								fontSize: "22px",
								fontWeight: "500",
								textAlign: "left",
							}}
						>
							Thoughts
							{/* ({thoughts?.length}) */}
						</Typography>
					</Box>

					{thoughts?.length === 0 && (
						<Box sx={{ marginLeft: "10px" }}>
							<Tooltip title="Create Thougth">
								<IconButton
									onClick={() => {
										setOpenCreateModal(true);
									}}
									style={{
										borderRadius: "50px",
										background: theme?.palette?.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme?.palette?.primary.contrastText,
									}}
								>
									<Add />
								</IconButton>
							</Tooltip>
						</Box>
					)}

					<CreateThougthModal
						openCreateModal={openCreateModal}
						setOpenCreateModal={setOpenCreateModal}
						getThoughtsApiCall={getThoughtsApiCall}
					/>
					<DeleteThoughtModal
						open={deleteModal}
						deleteThoughtId={deleteThoughtId}
						setOpen={setDeleteModal}
						getThoughtsApiCall={getThoughtsApiCall}
					/>
				</Card>
				{thoughts.length > 0 ? (
					<Grid
						container
						spacing={2}
					>
						{thoughts?.map((ele, index) => {
							return (
								<>
									<Grid
										item
										xs={12}
										sm={12}
										md={12}
										lg={12}
										xl={12}
										key={index}
									>
										<ThoughtCard
											ele={ele}
											setOpen={setDeleteModal}
											setDeleteThoughtId={setDeleteThoughtId}
										/>
									</Grid>
								</>
							);
						})}
					</Grid>
				) : (
					<Box
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: " center",
						}}
					>
						<Typography>No Data Found !</Typography>
					</Box>
				)}
			</>
		);
	} else {
		return (
			<Box
				style={{
					height: "100vh",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: " center",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}
}
