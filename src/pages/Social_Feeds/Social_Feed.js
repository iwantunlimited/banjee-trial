import React, { useRef } from "react";
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
import { Search, Delete, Report, Add, Refresh } from "@mui/icons-material";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { filterSocialFeeds } from "./services/ApiServices";

import FullScreenImageModal from "./Components/FullScreenImageModal";
import { useNavigate } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";

import DeleteFeedModal from "./Components/DeleteFeedModal";
import { useTheme } from "@mui/material/styles";
import { MainContext } from "../../context/Context";
import { PaginationContext } from "../../context/PaginationContext";
import FeedCard from "./Components/FeedCard";
import { Helmet } from "react-helmet";

export default function SocialFeed(props) {
	const navigate = useNavigate();
	const theme = useTheme();
	const { feedFilter, setFeedFilter } = React.useContext(PaginationContext);
	const { themeData } = React.useContext(MainContext);
	const [data, setData] = React.useState([]);
	//delete menu ------
	const [openDModal, setOpenDModal] = React.useState(false);
	const [dFeedData, setDFeedData] = React.useState({
		feedId: "",
		remark: "",
	});

	// pagination state
	const [pagination, setPagination] = React.useState({
		page: feedFilter?.page ? feedFilter?.page : 0,
		pageSize: feedFilter?.pageSize ? feedFilter?.pageSize : 10,
	});
	const [totalEle, setTotalEle] = React.useState();

	const [startDate, setStartDate] = React.useState(
		feedFilter?.startDate ? feedFilter?.startDate : null
	);
	const [endDate, setEndDate] = React.useState(feedFilter?.endDate ? feedFilter?.endDate : null);
	const [openStartDate, setOpenStartDate] = React.useState(false);
	const [openEndDate, setOpenEndDate] = React.useState(false);

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
				finishDate: feedFilter?.endDate
					? moment(feedFilter?.endDate).set({ hour: 23, minute: 59, second: 58 }).format()
					: null,
				inactive: null,
				keywords: null,
				page: feedFilter?.page,
				pageSize: feedFilter?.pageSize,
				sortBy: null,
				startDate: feedFilter?.startDate
					? moment(feedFilter?.startDate).set({ hour: 0, minute: 0, second: 0 }).format()
					: null,
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
		[feedFilter]
	);

	function handleDeleteModal(data) {
		setDFeedData({ feedId: data?.feedId });
		setOpenDModal(data?.open);
	}

	// console.log("====================================");
	// console.log("feed filter", feedFilter);
	// console.log("====================================");

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
			<>
				<Helmet>
					<title>Feeds | Banjee Admin</title>
				</Helmet>
				<Container maxWidth={"xl"} sx={{ padding: "0px", margin: "auto" }}>
					<Card
						sx={{
							padding: { xs: 1, md: 2 },
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
										open={openStartDate}
										onOpen={() => {
											setOpenStartDate((prev) => !prev);
											setOpenEndDate(false);
										}}
										onClose={() => {
											setOpenStartDate((prev) => !prev);
											// setOpenEndDate((prev) => !prev);
										}}
										closeOnSelect
										onChange={(newValue) => {
											setStartDate(newValue);
										}}
										renderInput={(params) => (
											<TextField
												// onClick={() => {
												// 	setOpenEndDate(false);
												// 	setOpenStartDate(true);
												// }}
												size='small'
												helperText={params?.InputProps?.placeholder}
												{...params}
											/>
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
										open={openEndDate}
										onOpen={() => {
											setOpenStartDate(false);
											setOpenEndDate((prev) => !prev);
										}}
										onClose={() => {
											// setOpenEndDate((prev) => !prev);
											setOpenEndDate((prev) => !prev);
										}}
										closeOnSelect
										onChange={(newValue) => {
											// const nowDate = moment(newValue).format("l") === moment().format("l");
											// console.log("now date", nowDate);
											// console.log("now date ---", moment().format());
											setEndDate(newValue);
										}}
										renderInput={(params) => (
											<TextField
												// onClick={() => {
												// 	setOpenEndDate(true);
												// 	setOpenStartDate(false);
												// }}
												size='small'
												{...params}
											/>
										)}
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
											setFeedFilter({
												page: 0,
												pageSize: 10,
												startDate: startDate,
												endDate: endDate,
											});
											setPagination((prev) => ({
												...prev,
												page: 0,
												pageSize: 12,
											}));
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
											setFeedFilter({
												page: 0,
												pageSize: 10,
												startDate: null,
												endDate: null,
											});
											setStartDate(null);
											setEndDate(null);
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
							<Box sx={{ marginLeft: "10px" }}>
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
							</Box>
						</Box>
					</Card>
					{data?.content?.length > 0 ? (
						<Grid item container spacing={2}>
							{data?.content?.map((ele, index) => {
								return (
									<React.Fragment>
										<Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
											<FeedCard
												groupFeed={false}
												index={index}
												ele={ele}
												reported={false}
												data={{
													author: ele?.author,
													mainMedia:
														ele?.collaboration && ele?.collaborateFeeds?.length > 0
															? [
																	...ele?.mediaContent,
																	...ele?.collaborateFeeds?.map((item) => ({
																		...item,
																		...item?.mediaContent,
																	})),
															  ]
															: ele?.mediaContent,
													pageName: ele?.pageName,
													text: ele?.text,
												}}
												handleDeleteModal={handleDeleteModal}
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
										page={feedFilter?.page}
										rowsPerPage={feedFilter.pageSize}
										rowsPerPageOptions={[10, 15, 20]}
										onPageChange={(event, data) => {
											setPagination((prev) => ({
												...prev,
												page: data,
											}));
											setFeedFilter({
												page: data,
											});
										}}
										onRowsPerPageChange={(event) => {
											setPagination((prev) => ({
												...prev,
												pageSize: event.target.value,
											}));
											setFeedFilter({
												pageSize: event.target.value,
											});
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

					{/* <Typography variant="h3">Social Feeds</Typography> */}
				</Container>
			</>
		);
	} else {
		return (
			<Container>
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
			</Container>
		);
	}
}
