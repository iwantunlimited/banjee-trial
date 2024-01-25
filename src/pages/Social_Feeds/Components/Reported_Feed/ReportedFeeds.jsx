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
import {
	FavoriteBorder,
	ChatBubbleOutline,
	Fullscreen,
	Search,
	Delete,
	Report,
	Add,
	Refresh,
	ArrowBack,
} from "@mui/icons-material";
import moment from "moment";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { filterSocialFeeds, getReportedFeedDetail } from "../../services/ApiServices";

import FullScreenImageModal from "../../Components/FullScreenImageModal";
import { useNavigate } from "react-router-dom";
import "../../SocialFeed.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { Pagination } from "swiper";

import { useTheme } from "@mui/material/styles";
import { MainContext } from "../../../../context/Context";
import { PaginationContext } from "../../../../context/PaginationContext";
import FeedCard from "../FeedCard";
import DeleteFeedModal from "../DeleteFeedModal";

export default function ReportedFeeds(props) {
	const navigate = useNavigate();
	const theme = useTheme();
	const { reportedFeedFilter, setReportedFeedFilter } = React.useContext(PaginationContext);
	const { themeData } = React.useContext(MainContext);
	const [data, setData] = React.useState([]);
	//delete menu ------
	const [openDModal, setOpenDModal] = React.useState(false);
	const [dFeedData, setDFeedData] = React.useState({
		feedId: "",
		collaborateId: "",
		remark: "",
		report: false,
		pageName: "",
		pageId: "",
		authorName: "",
		authorId: null,
	});

	const [totalEle, setTotalEle] = React.useState();

	const [startDate, setStartDate] = React.useState(
		reportedFeedFilter?.startDate ? reportedFeedFilter?.startDate : null
	);
	const [endDate, setEndDate] = React.useState(
		reportedFeedFilter?.endDate ? reportedFeedFilter?.endDate : null
	);
	const [openStartDate, setOpenStartDate] = React.useState(false);
	const [openEndDate, setOpenEndDate] = React.useState(false);

	const [fullScreenState, setFullScreenState] = React.useState({
		imageModal: false,
	});

	const filterReportedFeedsApiCall = React.useCallback(
		() => {
			// setData();
			getReportedFeedDetail({
				page: reportedFeedFilter?.page,
				pageSize: reportedFeedFilter?.pageSize,
				feeds: true,
				// finishDate: reportedFeedFilter?.endDate
				// 	? moment(reportedFeedFilter?.endDate).set({ hour: 23, minute: 59, second: 58 }).format()
				// 	: null,
				// startDate: reportedFeedFilter?.startDate
				// 	? moment(reportedFeedFilter?.startDate).set({ hour: 0, minute: 0, second: 0 }).format()
				// 	: null,
			})
				.then((res) => {
					// const resp = res?.content?.map((item, index) => {
					// 	if (item?.collaborateId) {
					// 		return item?.feed?.collaborateFeeds?.filter((ele) => ele?.id === item?.collaborateId)?.[0];
					// 	} else {
					// 		return { ...item?.user, ...item?.feed };
					// 	}
					// });

					setData(res);
					setTotalEle(res.totalElements);
				})
				.catch((err) => {
					console.error(err);
				});
		},
		// remove dependecies startDate and endDate
		[reportedFeedFilter]
	);

	function handleDeleteModal(data) {
		setDFeedData((prev) => ({
			...prev,
			feedId: data?.feedId,
			collaborateId: data?.collaborateId,
			report: data?.report,
			pageId: data?.pageId,
			pageName: data?.pageName,
			authorName: data?.authorName,
			authorId: data?.authorId,
		}));
		setOpenDModal(data?.open);
	}

	// console.log("====================================");
	// console.log("reportedFeed filter", reportedFeedFilter);
	// console.log("====================================");

	React.useEffect(() => {
		filterReportedFeedsApiCall();
	}, [filterReportedFeedsApiCall]);

	// function playPause(index) {
	// 	if (document.getElementById(`video${index}`).paused)
	// 		document.getElementById(`video${index}`).play();
	// 	else document.getElementById(`video${index}`).pause();
	// }

	if (data?.content) {
		return (
			<Container sx={{ padding: "0px !important", margin: "auto" }} maxWidth='xl'>
				<IconButton onClick={() => navigate(-1)} sx={{ marginBottom: { xs: 1, md: 2 } }}>
					<ArrowBack color='primary' />
				</IconButton>
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
							Reported Feeds({totalEle})
						</Typography>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						{/* <Box>
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
						</Box> */}
						{/* <Box>
							<Tooltip title='Search'>
								<IconButton
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: theme.palette.primary.contrastText,
									}}
									onClick={() => {
										setReportedFeedFilter({
											page: 0,
											pageSize: 10,
											startDate: startDate,
											endDate: endDate,
										});
									}}>
									<Search />
								</IconButton>
							</Tooltip>
						</Box> */}
						<Box sx={{ marginLeft: "10px" }}>
							<Tooltip title='Refresh Feeds'>
								<IconButton
									onClick={() => {
										setReportedFeedFilter({
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
					</Box>
				</Card>
				{/* <Typography variant="h3">Social Feeds</Typography> */}
				{data?.content?.length > 0 ? (
					<Grid container spacing={2}>
						{data?.content?.map((ele, index) => {
							const collab = ele?.collaborateId
								? ele?.feed?.collaborateFeeds?.filter((item, index) => item?.id === ele?.collaborateId)?.[0]
								: null;

							return (
								<React.Fragment>
									<Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
										{ele?.collaborateId ? (
											<FeedCard
												reported={true}
												groupFeed={false}
												index={index}
												ele={ele}
												data={{
													author: collab?.user,
													mainMedia: [collab?.mediaContent],
													pageName: ele?.feed?.pageName,
													text: collab?.text,
												}}
												handleDeleteModal={handleDeleteModal}
											/>
										) : (
											<FeedCard
												reported={true}
												groupFeed={false}
												index={index}
												ele={ele}
												data={{
													author: ele?.feed?.author,
													mainMedia:
														ele?.feed?.collaboration && ele?.feed?.collaborateFeeds?.length > 0
															? [
																	...ele?.feed?.mediaContent,
																	...ele?.feed?.collaborateFeeds?.map((item) => ({
																		...item,
																		...item?.mediaContent,
																	})),
															  ]
															: ele?.feed?.mediaContent,
													pageName: ele?.feed?.pageName,
													text: ele?.feed?.text,
												}}
												handleDeleteModal={handleDeleteModal}
											/>
										)}
									</Grid>
								</React.Fragment>
							);
						})}
						<DeleteFeedModal
							open={openDModal}
							openModalfun={setOpenDModal}
							dFeedData={dFeedData}
							FeedDataFun={setDFeedData}
							socialFilterApi={filterReportedFeedsApiCall}
							removeUser={true}
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
									page={reportedFeedFilter?.page}
									rowsPerPage={reportedFeedFilter.pageSize}
									rowsPerPageOptions={[10, 15, 20]}
									onPageChange={(event, data) => {
										setReportedFeedFilter({
											...reportedFeedFilter,
											page: data,
										});
									}}
									onRowsPerPageChange={(event) => {
										setReportedFeedFilter({
											...reportedFeedFilter,
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
