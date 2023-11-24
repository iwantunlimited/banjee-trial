import React, { useState } from "react";
import {
	Grid,
	Typography,
	Box,
	CircularProgress,
	IconButton,
	Card,
	Tooltip,
	TablePagination,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { MainContext } from "../../context/Context";
import { useTheme } from "styled-components";
import CreateThougthModal from "./Components/CreateThougthModal";
import ThoughtCard from "./Components/ThoughtCard";
import DeleteThoughtModal from "./Components/DeleteThoughtModal";
import { deleteThought, getThoughts } from "./services/ApiServices";
export default function Thoughts() {
	const { themeData, setModalData, setModalOpen } = React.useContext(MainContext);
	const theme = useTheme();
	const [thoughts, setThoughts] = useState();
	const [openCreateModal, setOpenCreateModal] = React.useState(false);
	const [deleteModal, setDeleteModal] = React.useState(false);
	const [deleteThoughtId, setDeleteThoughtId] = React.useState("");
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});
	const [totalEle, setTotalEle] = React.useState();

	const getThoughtsApiCall = React.useCallback(() => {
		setLoading(true);
		getThoughts({
			page: pagination?.page,
			pageSize: pagination?.pageSize,
		})
			.then((res) => {
				setThoughts(res.content);
				setTotalEle(res?.totalElements);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [pagination]);

	const deleteThoughtApiCall = React.useCallback((id) => {
		deleteThought(id)
			.then(() => {
				getThoughtsApiCall();
				setModalOpen(true);
				setModalData("Thought Deleted Successfully", "success");
			})
			.catch((err) => {
				console.log("====================================");
				console.log(err);
				console.log("====================================");
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
				}}>
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
					}}>
					<Box
						sx={{
							marginBottom: { xs: "20px", sm: "0px" },
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<Typography
							sx={{
								color: themeData ? "default" : "#6b778c",
								fontSize: "22px",
								fontWeight: "500",
								textAlign: "left",
							}}>
							Thoughts
							{/* ({thoughts?.length}) */}
						</Typography>
					</Box>

					{thoughts?.length === 0 && (
						<Box sx={{ marginLeft: "10px" }}>
							<Tooltip title='Create Thougth'>
								<IconButton
									onClick={() => {
										setOpenCreateModal(true);
									}}
									style={{
										borderRadius: "50px",
										background: theme?.palette?.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme?.palette?.primary.contrastText,
									}}>
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
						thoughtId={deleteThoughtId}
						deleteThoughtApiCall={deleteThoughtApiCall}
						setOpen={setDeleteModal}
					/>
				</Card>
				{thoughts.length > 0 ? (
					<Grid container spacing={2}>
						{thoughts?.map((ele, index) => {
							return (
								<Grid item xs={12} sm={12} md={12} lg={6} xl={4} key={index}>
									<ThoughtCard ele={ele} setOpen={setDeleteModal} setDeleteThoughtId={setDeleteThoughtId} />
								</Grid>
							);
						})}
						<Grid item xs={12}>
							{/* <Card> */}
							{/* pagination for all feeds */}
							<Box
								className='root'
								sx={{
									"& > div > div": {
										display: "flex",
										alignItems: "baseline !important",
									},
								}}>
								<TablePagination
									component='div'
									count={totalEle}
									page={pagination.page}
									rowsPerPage={pagination.pageSize}
									rowsPerPageOptions={[10, 15, 20]}
									onPageChange={(event, data) => {
										setPagination((prev) => ({
											...prev,
											page: data,
										}));
									}}
									onRowsPerPageChange={(event) => {
										setPagination((prev) => ({
											...prev,
											pageSize: event.target.value,
										}));
									}}
								/>
							</Box>
							{/* </Card> */}
						</Grid>
					</Grid>
				) : (
					<Box
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: " center",
						}}>
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
				}}>
				<CircularProgress />
			</Box>
		);
	}
}
