import React from "react";
import {
	Grid,
	Typography,
	Box,
	CircularProgress,
	TablePagination,
	Divider,
	Card,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import "../../Social_Feeds/SocialFeed.css";

import { PaginationContext } from "../../../context/PaginationContext";
import FeedCard from "../../Social_Feeds/Components/FeedCard";
import DeleteFeedModal from "../../Social_Feeds/Components/DeleteFeedModal";
import { UserFeeds } from "../User_Services/UserApiService";

export default function UserFeed({ userId }) {
	const navigate = useNavigate();
	const { userFeedFilter, setUserFeedFilter } = React.useContext(PaginationContext);
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
		page: userFeedFilter?.page ? userFeedFilter?.page : 0,
		pageSize: userFeedFilter?.pageSize ? userFeedFilter?.pageSize : 12,
	});
	const [totalEle, setTotalEle] = React.useState();

	const filterSocialFeedsApiCall = React.useCallback(
		() => {
			// setData();
			UserFeeds({
				// deleted: false,
				page: pagination?.page,
				pageSize: pagination?.pageSize,
				userId: userId,
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
		[pagination]
	);

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
			<Card
				elevation={1}
				sx={{
					boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
					paddingY: { xs: "10px", xl: "20px" },
					paddingX: { xs: "10px", xl: "20px" },
					// background: "white ",
					// minHeight: { lg: "427px" },
					height: { xl: "100%" },
					// width: "100%",
				}}>
				<Box sx={{ paddingBottom: "10px" }}>
					<Typography sx={{ fontSize: "20px", color: "gray", fontWeight: "600" }}>
						User Activity ({totalEle})
					</Typography>
					<Divider />
				</Box>
				<Box>
					{data?.content?.length > 0 ? (
						<Grid container spacing={2}>
							{data?.content?.map((ele, index) => {
								return (
									<React.Fragment>
										<Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={index}>
											<FeedCard
												groupFeed={true}
												index={index}
												ele={ele}
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
										page={pagination.page}
										rowsPerPage={pagination.pageSize}
										rowsPerPageOptions={[10, 15, 20]}
										onPageChange={(event, data) => {
											setUserFeedFilter({
												page: data,
												pageSize: pagination?.pageSize,
											});
											setPagination((prev) => ({
												...prev,
												page: data,
											}));
										}}
										onRowsPerPageChange={(event) => {
											setUserFeedFilter({
												page: pagination?.page,
												pageSize: event?.target?.value,
											});
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
				</Box>
			</Card>
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
