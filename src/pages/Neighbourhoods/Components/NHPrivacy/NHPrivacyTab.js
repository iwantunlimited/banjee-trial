import { Tabs, Tab, Typography, Box, Avatar, Button, IconButton, Hidden } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
	assignAdminToCloud,
	assignMemberToCloud,
	filterMembers,
	leaveAdminRoleToCloud,
	removeAdminRequests,
	removeUserFromNeighbourhood,
	requestCommunityFilter,
} from "../../services/apiServices";
import { useParams } from "react-router";
import ModalComp from "../../../../CustomComponents/ModalComp";
import TotalMembers from "./TotalMembers";
import { Cancel } from "@mui/icons-material";
import { MainContext } from "../../../../context/Context";
import MemberPendingRequests from "./MemberPendingRequests";
import AdminPendingRequests from "./AdminPendingRequests";
import { PaginationContext } from "../../../../context/PaginationContext";
import SuggestedAdmin from "./SuggestedAdmin";
import RemoveAdminRequests from "./RemoveAdminRequests";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function NHPrivacyTab(props) {
	const params = useParams();
	const [value, setValue] = React.useState(0);

	const { setModalOpen, setModalData } = React.useContext(MainContext);
	const {
		setNHPrivacyPagination,
		nHPrivacyPagination: {
			nhMemberpage,
			nhMemberpageSize,
			nhPendingAdminPage,
			nhPendingAdminPageSize,
			nhPendingReqPage,
			nhPendingReqPageSize,
			suggestedAdminPage,
			suggestedAdminPageSize,
			removeAdminpage,
			removeAdminPageSize,
		},
	} = useContext(PaginationContext);
	const [adminPendingPagination, setAdminPendingPagination] = React.useState({
		page: 0,
		pageSize: 10,
	});

	const [members, setMembers] = React.useState({
		data: [],
		totalMembers: 0,
	});
	const [pendingMemberData, setPendingMemberData] = React.useState({
		data: [],
		totalMembers: 0,
	});
	const [adminPendingData, setAdminPendingData] = React.useState({
		data: [],
		totalMembers: 0,
	});
	const [removeAdminPendingData, setRemoveAdminPendingData] = React.useState({
		data: [],
		totalMembers: 0,
	});

	const [suggestedAdmin, setSuggestedAdmin] = useState({
		data: [],
		totalElements: 0,
	});

	const [modal, setModal] = React.useState({
		modalId: 1,
		open: false,
		data: "",
	});

	function handleModal(d) {
		setModal((prev) => ({
			...prev,
			open: d?.open,
			data: d?.data,
			modalId: d?.modalId,
		}));
	}

	const handleChange = (event, newValue) => {
		setValue(newValue);
		// if(newValue === 0){
		//      filterMemberApiCall()
		// }else if
	};
	// /for filtering members by cloud id
	const filterMemberApiCall = React.useCallback(
		(data) => {
			filterMembers({
				cloudId: params?.id,
				page: nhMemberpage,
				pageSize: nhMemberpageSize,
				...(data ? { keywords: data } : {}),
			})
				.then((res) => {
					const resp = res?.content?.map((item, index) => ({
						...item,
						assignId: item?.profile?.id,
						muserName: item?.profile?.username,
						mavtarUrl: item?.profile?.avtarUrl,
						memail: item?.profile?.email,
						mmcc: item?.profile?.mcc,
						mmobile: item?.profile?.mobile,
						mfirstName: item?.profile?.firstName,
						mlastName: item?.profile?.lastName,
					}));
					setMembers((prev) => ({
						...prev,
						data: resp,
						totalMembers: res?.totalElements,
					}));
				})
				.catch((err) => console.error(err));
		},
		[nhMemberpage, nhMemberpageSize, params?.id]
	);

	const AdminRequestApiCall = React.useCallback(() => {
		filterMembers({
			cloudId: params?.id,
			verificationReq: "true",
			verificationRejection: "false",
			reUpload: "false",
			verified: "false",
			role: "MEMBER",
			page: nhPendingAdminPage,
			pageSize: nhPendingAdminPageSize,
		})
			.then((res) => {
				setAdminPendingData({
					data: res?.content,
					totalMembers: res?.totalElements,
				});
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, [nhPendingAdminPage, nhPendingAdminPageSize]);

	const RemoveAdminRequestApiCall = React.useCallback(() => {
		removeAdminRequests({
			cloudId: params?.id,
			page: removeAdminpage,
			pageSize: removeAdminPageSize,
			approved: "false",
			processed: "true",
		})
			.then((res) => {
				setRemoveAdminPendingData({
					data: res?.content,
					totalMembers: res?.totalElements,
				});
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, [removeAdminpage, removeAdminPageSize]);

	const memberRequestApiCall = React.useCallback(() => {
		requestCommunityFilter({
			cloudId: params?.id,
			approved: false,
			processed: true,
			page: nhPendingReqPage,
			pageSize: nhPendingReqPageSize,
			userType: -1,
		})
			.then((res) => {
				setPendingMemberData({
					data: res?.content,
					totalMembers: res?.totalElements,
				});
			})
			.catch((err) => {
				console.error("error", err);
			});
	}, [nhPendingReqPage, nhPendingReqPageSize]);

	const removeUserFromNeighbourhoodApiCall = React.useCallback((data) => {
		removeUserFromNeighbourhood({
			cloudId: params?.id,
			userId: data?.profile?.id,
		})
			.then((res) => {
				setModal((prev) => ({
					...prev,
					open: false,
					modalId: 1,
					data: "",
				}));
				setModalOpen(true);
				setModalData("user removed from neighbourhood", "success");
				filterMemberApiCall();
			})
			.catch((err) => {
				console.error(err);
				setModalOpen(true);
				setModalData("something went wrong , try again !", "error");
			});
	}, []);

	//api for assigning admin to the cloud
	const AssignAdminApiCall = (payload) => {
		assignAdminToCloud(payload)
			.then((res) => {
				setModal((prev) => ({
					...prev,
					open: false,
					modalId: 1,
					data: "",
				}));
				setModalOpen(true);
				setModalData("New Admin Assigned", "success");
				filterMemberApiCall();
			})
			.catch((err) => console.error(err));
	};

	//api for assigning member to the cloud
	const AssignMemberApiCall = (payload) => {
		leaveAdminRoleToCloud(payload)
			.then((res) => {
				setModal((prev) => ({
					...prev,
					open: false,
					modalId: 1,
					data: "",
				}));
				setModalOpen(true);
				setModalData("Member Assigned", "success");
				filterMemberApiCall();
			})
			.catch((err) => console.error(err));
	};

	// /suggested admin for nh admin
	const SuggestedAdminApiCall = React.useCallback(() => {
		filterMembers({
			cloudId: params?.id,
			page: suggestedAdminPage,
			pageSize: suggestedAdminPageSize,
			suggestion: "true",
		})
			.then((res) => {
				setSuggestedAdmin({
					data: res?.content,
					totalElements: res?.totalElements,
				});
			})
			.catch((err) => console.error(err));
	}, [params?.id, suggestedAdminPage, suggestedAdminPageSize]);

	function modalFunction(modalId) {
		switch (modalId) {
			case 2:
				// for user details
				return (
					<ModalComp handleModal={handleModal} data={modal}>
						<IconButton
							onClick={() => handleModal(false)}
							style={{ position: "absolute", top: "0px", right: "0px" }}>
							<Cancel sx={{ color: "brown" }} />
						</IconButton>
						<Box
							elevation={1}
							style={{
								boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
								padding: "40px 10px 40px 10px",
								background: "white ",
								minHeight: "420px",
							}}>
							<Box
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "column",
									padding: "0 10px 0 10px",
								}}>
								<Avatar
									alt={modal?.data?.mfirstName?.length > 0 ? modal?.data?.mfirstName?.slice(0, 1) : "A"}
									// src={
									// 	"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
									// 	modal?.data?.mavatarUrl
									// }
									src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${modal?.data?.mavtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
									sx={{ width: "150px", height: "150px" }}
								/>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										marginTop: "10px",
										fontSize: "10px",
										fontWeight: "400",
									}}>
									{modal?.data?.firstName && (
										<Typography variant='h6' style={{ marginRight: "5px" }}>
											{modal?.data?.mfirstName}
										</Typography>
									)}
								</div>
								<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
									{window.innerWidth > 1282
										? modal?.data?.memail
										: modal?.data?.memail && modal?.data?.memail.slice(0, 20)}
								</Typography>
								{window.innerWidth < 1282 && modal && modal?.data?.memail?.length > 10 && (
									<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
										{modal?.data?.memail?.slice(20, modal?.data?.memail?.length + 1)}
									</Typography>
								)}
								<Typography style={{ marginTop: "5px", color: "grey" }} variant='h6'>
									{modal?.data?.mmcc
										? +modal?.data?.mmcc + " " + modal?.data?.mmobile
										: modal?.data?.mmobile}
								</Typography>
							</Box>
						</Box>
					</ModalComp>
				);
			case 3:
				// for assign admin role
				return (
					<ModalComp handleModal={handleModal} data={modal}>
						<Box>
							<Typography
								sx={{
									fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
									fontWeight: 400,
								}}>
								Are you sure to assign admin role ?
							</Typography>
							<Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
								<Button variant='outlined' onClick={() => handleModal(false)}>
									Cancel
								</Button>
								<Button
									variant='contained'
									sx={{ marginLeft: "20px" }}
									onClick={() => {
										AssignAdminApiCall({
											cloudId: params?.id,
											userId: modal?.data,
										});
									}}>
									Confirm
								</Button>
							</Box>
						</Box>
					</ModalComp>
				);
			case 4:
				// for assign member role
				return (
					<ModalComp handleModal={handleModal} data={modal}>
						<Box>
							<Typography
								sx={{
									fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
									fontWeight: 400,
								}}>
								Are you sure to assign member role ?
							</Typography>
							<Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
								<Button variant='outlined' onClick={() => handleModal(false)}>
									Cancel
								</Button>
								<Button
									variant='contained'
									sx={{ marginLeft: "20px" }}
									onClick={() => {
										AssignMemberApiCall({
											cloudId: params?.id,
											userId: modal?.data,
											reasons: "From Banjee Admin",
										});
									}}>
									Confirm
								</Button>
							</Box>
						</Box>
					</ModalComp>
				);
			case 5:
				// for delete neighbourhood
				return (
					<ModalComp handleModal={handleModal} data={modal}>
						<Box>
							<Typography
								sx={{
									fontSize: { xs: "14px", sm: "16px", md: "16px", lg: "18px", xl: "20px" },
									fontWeight: 400,
								}}>
								Are you sure to remove user from neighbourhood ?
							</Typography>
							<Box sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
								<Button variant='outlined' onClick={() => handleModal(false)}>
									Cancel
								</Button>
								<Button
									variant='contained'
									sx={{ marginLeft: "20px" }}
									onClick={() => {
										removeUserFromNeighbourhoodApiCall(modal?.data);
									}}>
									Confirm
								</Button>
							</Box>
						</Box>
					</ModalComp>
				);
			default:
				break;
		}
	}

	useEffect(() => {
		filterMemberApiCall();
		memberRequestApiCall();
		AdminRequestApiCall();
		SuggestedAdminApiCall();
		RemoveAdminRequestApiCall();
	}, [
		AdminRequestApiCall,
		memberRequestApiCall,
		filterMemberApiCall,
		SuggestedAdminApiCall,
		RemoveAdminRequestApiCall,
	]);

	return (
		<Box>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				{props?.cloudType === "PRIVATE" ? (
					<Tabs
						indicatorColor='primary'
						textColor='primary'
						value={value}
						onChange={handleChange}
						aria-label='basic tabs example'>
						<Tab
							sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
							label={`TotalMembers (${members?.totalMembers})`}
							{...a11yProps(0)}
						/>
						<Tab
							sx={{
								textTransform: "none",
								fontSize: { lg: "18px" },
							}}
							label={`Pending Member Request (${pendingMemberData?.totalMembers})`}
							{...a11yProps(1)}
						/>
						<Tab
							sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
							label={`Pending Admin Request (${adminPendingData?.totalMembers})`}
							{...a11yProps(2)}
						/>
						<Tab
							sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
							label={`Remove Admin Request (${removeAdminPendingData?.totalMembers})`}
							{...a11yProps(3)}
						/>
						<Tab
							sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
							label={`Suggested Admin (${suggestedAdmin?.totalElements})`}
							{...a11yProps(4)}
						/>
					</Tabs>
				) : (
					<Tabs
						indicatorColor='primary'
						textColor='primary'
						value={value}
						onChange={handleChange}
						aria-label='basic tabs example'>
						<Tab
							sx={{ textTransform: "none", fontSize: { lg: "18px" } }}
							label={`TotalMembers (${members?.totalMembers})`}
							{...a11yProps(0)}
						/>
					</Tabs>
				)}
			</Box>
			<TabPanel value={value} index={0}>
				<Box sx={{ paddingY: "15px" }}>
					<TotalMembers
						members={members}
						handleTabChange={handleChange}
						handleModal={handleModal}
						refreshApi={filterMemberApiCall}
					/>
				</Box>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<Box sx={{ paddingY: "15px" }}>
					<MemberPendingRequests
						pendingData={pendingMemberData}
						refreshApi={memberRequestApiCall}
						RefreshMemberApiCall={filterMemberApiCall}
					/>
				</Box>
			</TabPanel>
			<TabPanel value={value} index={2}>
				<Box sx={{ paddingY: "15px" }}>
					<AdminPendingRequests
						pendingData={adminPendingData}
						AdminRequestApiCall={AdminRequestApiCall}
						RefreshMemberApiCall={filterMemberApiCall}
					/>
				</Box>
			</TabPanel>
			<TabPanel value={value} index={3}>
				<Box sx={{ paddingY: "15px" }}>
					<RemoveAdminRequests
						pendingData={removeAdminPendingData}
						refreshApi={RemoveAdminRequestApiCall}
						RefreshMemberApiCall={filterMemberApiCall}
					/>
				</Box>
			</TabPanel>
			<TabPanel value={value} index={4}>
				<Box sx={{ paddingY: "15px" }}>
					<SuggestedAdmin
						pendingData={suggestedAdmin}
						handleTabChange={handleChange}
						handleModal={handleModal}
						SuggestedAdminApiCall={SuggestedAdminApiCall}
					/>
				</Box>
			</TabPanel>

			{modalFunction(modal?.modalId)}
		</Box>
	);
}

export default NHPrivacyTab;
