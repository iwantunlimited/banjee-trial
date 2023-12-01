import React from "react";
import { Grid, Typography, Box, CircularProgress, TablePagination } from "@mui/material";

import { useNavigate } from "react-router-dom";
import "../../Social_Feeds/SocialFeed.css";

import FeedCard from "../../Social_Feeds/Components/FeedCard";
import DeleteFeedModal from "../../Social_Feeds/Components/DeleteFeedModal";
import { PaginationContext } from "../../../context/PaginationContext";
import { filterSocialFeeds } from "../../Social_Feeds/services/ApiServices";

export default function GroupFeed({ groupId, groupName }) {
	const navigate = useNavigate();
	const { feedPagination, setFeedPagination } = React.useContext(PaginationContext);
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
		pageSize: feedPagination?.pageSize ? feedPagination?.pageSize : 12,
	});
	const [totalEle, setTotalEle] = React.useState();

	const filterSocialFeedsApiCall = React.useCallback(
		() => {
			// setData();
			filterSocialFeeds({
				keywords: null,
				pageId: groupId ? groupId : "",
				pageName: groupName ? groupName : "",
				page: pagination?.page,
				pageSize: pagination?.pageSize,
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
			</Box>
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
