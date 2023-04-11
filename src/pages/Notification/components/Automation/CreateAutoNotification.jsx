import React from "react";
import {
	Card,
	Container,
	Grid,
	Typography,
	Box,
	TextField,
	Button,
	MenuItem,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	CircularProgress,
} from "@mui/material";
import "../../../Explore/business.css";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router";
import axios from "axios";
import { MainContext } from "../../../../context/Context";
import SnackbarContext from "../../../../CustomComponents/SnackbarContext";
import { createNotificationConfig } from "../../ApiServices/apiServices";

function CreateAutoNotification() {
	const context = React.useContext(MainContext);

	const { setModalData, setModalOpen, themeData } = context;
	const navigate = useNavigate();

	const [notificationData, setNotificationData] = React.useState({
		clickAction: "",
		title: "",
		description: "",
		durationType: "",
		inactivityType: "",
	});

	const durationTypeList = [
		{ title: "DAILY", subTitle: "Notify Users daily for selected filter" },
		{ title: "WEEKLY", subTitle: "Notify Users once a week for selected filter" },
		{ title: "BIWEEKLY", subTitle: "Notify Users once in 15 days for selected filter" },
		{ title: "MONTHLY", subTitle: "Notify Users once in a month for selected filter" },
		{ title: "QUICK_SEND", subTitle: "Notify users instantly only once when you create it" },
	];

	const clickActionList = [
		{ title: "OPEN_APP", subTitle: "" },
		{ title: "OPEN_NEIGHBOURHOOD_LIST", subTitle: "" },
		{ title: "OPEN_COMMUNITY", subTitle: "" },
		{ title: "OPEN_GLOBALALERT", subTitle: "" },
	];
	const inactivityTypeList = [
		{ title: "DAYS_2", subTitle: "Notify users who are not active since last 2 days" },
		{ title: "DAYS_5", subTitle: "Notify users who are not active since last 5 days" },
		{ title: "DAYS_7", subTitle: "Notify users who are not active since last 7 days" },
		{ title: "NEIGHBOURHOOD", subTitle: "Notify users who haven't join any Neighbourhood yet" },
		{ title: "All", subTitle: "Notify all users" },
	];

	function handleSubmit(event) {
		event?.preventDefault();

		CreateNoticationApiCall(notificationData);
	}

	const CreateNoticationApiCall = React.useCallback((payload) => {
		createNotificationConfig(payload)
			.then((res) => {
				// console.log("res", res);
				setModalOpen(true);
				setModalData("Notification Created Successfully", "success");
				setNotificationData({
					clickAction: "",
					title: "",
					description: "",
					durationType: "",
					inactivityType: "",
				});
				navigate("/notification/automation", { replace: true });
			})
			.catch((err) => console.error(err));
	}, []);

	// const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	if (notificationData) {
		return (
			<Container maxWidth='md'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBack color='primary' />
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "20px" }}>
							<Typography
								sx={{ fontSize: "22px", color: themeData ? "default" : "#666", fontWeight: 500 }}>
								Create Auto Notification Configuration
							</Typography>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "20px" }}>
							<form onSubmit={handleSubmit}>
								<Grid item container xs={12} spacing={2}>
									<Grid item xs={12}>
										<TextField
											required
											fullWidth
											className='neighbourhood-form-textField'
											name='title'
											value={notificationData?.title}
											onChange={(event) => {
												setNotificationData((prev) => ({
													...prev,
													title: event.target.value,
													// slug: event.target.value.replace(/[ ,]+/g, "-"),
												}));
											}}
											placeholder='Enter Title'
											label='Enter Title'
										/>
									</Grid>
									<Grid item xs={12}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>Select Click Action</InputLabel>
											<Select
												required
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='clickAction'
												label='Select Click Action'
												value={notificationData?.clickAction}
												onChange={(event, data) => {
													setNotificationData((prev) => ({
														...prev,
														clickAction: event.target.value,
													}));
												}}>
												{clickActionList &&
													clickActionList?.map((item, index) => {
														return (
															<MenuItem key={index} value={item?.title}>
																<Typography>{item?.title}</Typography>
															</MenuItem>
														);
													})}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>Select Duration Type</InputLabel>
											<Select
												required
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='durationType'
												label='Select Duration Type'
												value={notificationData?.durationType}
												onChange={(event, data) => {
													setNotificationData((prev) => ({
														...prev,
														durationType: event.target.value,
													}));
												}}>
												{durationTypeList &&
													durationTypeList?.map((item, index) => {
														return (
															<MenuItem
																key={index}
																value={item?.title}
																sx={{
																	display: "flex",
																	flexDirection: "column",
																	alignItems: "flex-start",
																	textAlign: "left",
																}}>
																<Typography>{item?.title}</Typography>
																<label>{item?.subTitle}</label>
															</MenuItem>
														);
													})}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>Select Filter</InputLabel>
											<Select
												required
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='durationType'
												label='Select Filter'
												value={notificationData?.inactivityType}
												onChange={(event, data) => {
													setNotificationData((prev) => ({
														...prev,
														inactivityType: event.target.value,
													}));
												}}>
												{inactivityTypeList &&
													inactivityTypeList?.map((item, index) => {
														return (
															<MenuItem
																key={index}
																value={item?.title}
																sx={{
																	display: "flex",
																	flexDirection: "column",
																	alignItems: "flex-start",
																	textAlign: "left",
																}}>
																<Typography>{item?.title}</Typography>
																<label>{item?.subTitle}</label>
															</MenuItem>
														);
													})}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12}>
										<TextField
											required
											className='neighbourhood-form-textField'
											fullWidth
											label='Description'
											rows={3}
											maxRows={5}
											placeholder='Description'
											name='description'
											value={notificationData?.description}
											multiline
											onChange={(event) => {
												setNotificationData((prev) => ({
													...prev,
													description: event.target.value,
												}));
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<Box>
											<Button
												// disabled={imgShow?.length === 0 ? false : submitForm ? false : true}
												type='submit'
												variant='contained'>
												Submit
											</Button>
										</Box>
									</Grid>
								</Grid>
							</form>
						</Card>
						<SnackbarContext />
					</Grid>
				</Grid>
			</Container>
		);
	} else {
		return (
			<Box
				sx={{
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<CircularProgress />
			</Box>
		);
	}
}

export default CreateAutoNotification;
