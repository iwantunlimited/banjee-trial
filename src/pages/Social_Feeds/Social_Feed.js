import React from "react";
import {
	Container,
	Grid,
	Typography,
	Box,
	CircularProgress,
	IconButton,
	Card,
	TextField,
	Tooltip,
	TablePagination,
	Avatar,
} from "@mui/material";
import {
	FavoriteBorder,
	ChatBubbleOutline,
	Fullscreen,
	Search,
	Delete,
	Report,
	Add,
	Refresh,
} from "@mui/icons-material";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { filterSocialFeeds } from "./services/ApiServices";

import FullScreenImageModal from "./Components/FullScreenImageModal";
import DetailsModal from "./Components/DetailsModal";
import { useNavigate } from "react-router-dom";
import "./SocialFeed.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";

import DeleteFeedModal from "./Components/DeleteFeedModal";
import { useTheme } from "@mui/material/styles";
import { MainContext } from "../../context/Context";
import { PaginationContext } from "../../context/PaginationContext";
import FeedCard from "./Components/FeedCard";

export default function SocialFeed(props) {
	const navigate = useNavigate();
	const theme = useTheme();
	const { feedPagination, setFeedPagination } = React.useContext(PaginationContext);
	const { themeData } = React.useContext(MainContext);
	const [data, setData] = React.useState([]);
	const [modal, setModal] = React.useState({ open: false });
	//delete menu ------
	const [openDModal, setOpenDModal] = React.useState(false);
	const [dFeedData, setDFeedData] = React.useState({
		feedId: "",
		remark: "",
	});

	// pagination state
	const [pagination, setPagination] = React.useState({
		page: feedPagination?.page ? feedPagination?.page : 0,
		pageSize: feedPagination?.pageSize ? feedPagination?.pageSize : 10,
	});
	const [totalEle, setTotalEle] = React.useState();

	const [startDate, setStartDate] = React.useState(null);
	const [endDate, setEndDate] = React.useState(null);
	const [dateFilter, setDateFilter] = React.useState({
		startDate: null,
		endDate: null,
	});

	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});

	const filterSocialFeedsApiCall = React.useCallback(
		() => {
			// setData();
			filterSocialFeeds({
				deleted: null,
				domain: null,
				fields: null,
				finishDate: dateFilter?.endDate,
				inactive: null,
				keywords: null,
				page: pagination?.page,
				pageSize: pagination?.pageSize,
				sortBy: null,
				startDate: dateFilter?.startDate,
			})
				.then((res) => {
					setData(res);
					setTotalEle(res.totalElements);
				})
				.catch((err) => {
					console.error(err);
				});
		},
		// remove dependecies startDate and endDate
		[pagination, dateFilter]
	);

	function handleContextPagination() {
		setFeedPagination({
			page: pagination?.page,
			pageSize: pagination?.pageSize,
		});
	}

	function handleDeleteModal(data) {
		setDFeedData({ feedId: data?.feedId });
		setOpenDModal(data?.open);
	}

	React.useEffect(() => {
		filterSocialFeedsApiCall();
	}, [filterSocialFeedsApiCall]);

	// function playPause(index) {
	// 	if (document.getElementById(`video${index}`).paused)
	// 		document.getElementById(`video${index}`).play();
	// 	else document.getElementById(`video${index}`).pause();
	// }

	if (data?.content) {
		return (
			<Container sx={{ padding: "0px !important", margin: "auto" }} maxWidth='xl'>
				<Card
					sx={{
						padding: "20px",
						marginBottom: "20px",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: { xs: "column", sm: "row" },
					}}>
					<Box sx={{ marginBottom: { xs: "20px", sm: "0px" } }}>
						<Typography
							sx={{
								color: themeData ? "default" : "#6b778c",
								fontSize: "22px",
								fontWeight: "500",
								textAlign: "left",
							}}>
							Feeds({totalEle})
						</Typography>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Box>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									inputFormat='dd/MM/yyyy'
									name='startDate'
									label='Start Date'
									value={startDate}
									onChange={(newValue) => {
										setStartDate(moment(newValue).set({ hour: 0, minute: 0, second: 0 }).format());
									}}
									renderInput={(params) => (
										<TextField size='small' helperText={params?.InputProps?.placeholder} {...params} />
									)}
								/>
							</LocalizationProvider>
						</Box>
						<Box sx={{ paddingX: "20px" }}>
							<LocalizationProvider dateAdapter={AdapterDateFns}>
								<DatePicker
									minDate={startDate !== null && startDate}
									inputFormat='dd/MM/yyyy'
									name='endDate'
									label='End Date'
									value={endDate}
									onChange={(newValue) => {
										// const nowDate = moment(newValue).format("l") === moment().format("l");
										// console.log("now date", nowDate);
										// console.log("now date ---", moment().format());
										setEndDate(moment(newValue).set({ hour: 23, minute: 59, second: 58 }).format());
									}}
									renderInput={(params) => <TextField size='small' {...params} />}
								/>
							</LocalizationProvider>
						</Box>
						<Box>
							<Tooltip title='Search'>
								<IconButton
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}
									onClick={() => {
										setPagination({ page: 0, pageSize: 10 });
										setDateFilter({
											startDate: startDate,
											endDate: endDate,
										});
									}}>
									<Search />
								</IconButton>
							</Tooltip>
						</Box>
						<Box sx={{ marginLeft: "10px" }}>
							<Tooltip title='Create Feed'>
								<IconButton
									onClick={() => navigate("/social-feeds/create")}
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}>
									<Add />
								</IconButton>
							</Tooltip>
						</Box>
						<Box sx={{ marginLeft: "10px" }}>
							<Tooltip title='Refresh Feeds'>
								<IconButton
									onClick={() => {
										setFeedPagination({ page: undefined, pageSize: undefined });
										setPagination({ page: 0, pageSize: 10 });
										setDateFilter({
											startDate: null,
											endDate: null,
										});
									}}
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}>
									<Refresh />
								</IconButton>
							</Tooltip>
						</Box>
						{/* <Box sx={{ marginLeft: "10px" }}>
							<Tooltip title='Reported Feeds'>
								<IconButton
									onClick={() => navigate("reported-feeds")}
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}>
									<Report />
								</IconButton>
							</Tooltip>
						</Box> */}
					</Box>
				</Card>
				{/* <Typography variant="h3">Social Feeds</Typography> */}
				{data?.content?.length > 0 ? (
					<Grid container spacing={2}>
						{data?.content?.map((ele, index) => {
							return (
								<React.Fragment>
									<Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
										<FeedCard
											groupFeed={false}
											index={index}
											ele={ele}
											handleDeleteModal={handleDeleteModal}
											handleContextPagination={handleContextPagination}
										/>
									</Grid>
								</React.Fragment>
							);
						})}
						<DeleteFeedModal
							open={openDModal}
							openModalfun={setOpenDModal}
							dFeedData={dFeedData}
							FeedDataFun={setDFeedData}
							socialFilterApi={filterSocialFeedsApiCall}
						/>
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
							height: "100vh",
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: " center",
						}}>
						<Typography>No Data Found !</Typography>
					</Box>
				)}

				{/* image model for fullscreen show */}
				{fullScreenState.imageModal && (
					<FullScreenImageModal
						state={fullScreenState}
						handleClose={() => setFullScreenState({ imageModal: false })}
					/>
				)}
				{modal.open && (
					<DetailsModal
						state={modal}
						handleClose={() => setModal({ open: false })}
						filterApi={filterSocialFeedsApiCall}
					/>
				)}
			</Container>
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
