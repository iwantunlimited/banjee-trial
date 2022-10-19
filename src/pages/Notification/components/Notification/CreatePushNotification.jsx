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
	Checkbox,
	ListItemText,
	OutlinedInput,
	CircularProgress,
	Autocomplete,
} from "@mui/material";
import "../../../Explore/business.css";
import { ArrowBack, Cancel, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { blogsList } from "../../../Explore/services/ApiServices";
import { useNavigate } from "react-router";
import { createAlert } from "../../ApiServices/apiServices";
import { filterNeighbourhood } from "../../../Neighbourhoods/services/apiServices";
import axios from "axios";
import { MainContext } from "../../../../context/Context";
import SnackbarContext from "../../../../CustomComponents/SnackbarContext";

const icon = <CheckBoxOutlineBlank fontSize='small' />;
const checkedIcon = <CheckBox fontSize='small' />;

function CreatePushNotification() {
	const context = React.useContext(MainContext);

	console.log("context", context);
	const { modalOpen, modalData, setModalOpen, setModalData } = context;
	const navigate = useNavigate();
	const [data, setData] = React.useState({
		anonymous: false,
		eventCode: "ADMIN_NOTIFICATION",
		eventName: "",
		cloudIds: [],
		description: "",
		imageUrl: "",
		metaInfo: {
			templateId: "",
			templateName: "",
			detail: false,
		},
		sendTo: "MEMBERS",
		location: {
			coordinates: [72.51113723963499, 23.069438702322635],
			type: "Point",
		},
	});

	const [imgShow, setImgShow] = React.useState("");
	const [neighbourList, setNeighbourList] = React.useState("");
	const [blogList, setBLogList] = React.useState("");

	// console.log("====================================");
	// console.log("selectedNeighbour", data);
	// console.log("====================================");

	const NeighbourListApi = React.useCallback(() => {
		filterNeighbourhood({ page: 0, pageSize: 100, online: true })
			.then((res) => {
				console.log("====================================");
				console.log(res.content);
				console.log("====================================");
				setNeighbourList(res?.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const BlogsListApiCall = React.useCallback((page, pageSize) => {
		blogsList({ page: page, pageSize: pageSize, blogType: "ANNOUNCEMENT" })
			.then((res) => {
				setBLogList(res?.content);
			})
			.catch((err) => console.error(err));
	}, []);

	const CreateAlertApiCall = React.useCallback((data) => {
		createAlert(data)
			.then((res) => {
				setModalOpen(true);
				setModalData("Notification created successfully", "success");
				navigate("/notification");
				setData({
					anonymous: false,
					eventCode: "ADMIN_NOTIFICATION",
					eventName: "",
					cloudIds: [],
					description: "",
					imageUrl: "",
					metaInfo: {
						templateId: "",
						templateName: "",
						detail: false,
					},
					sendTo: "MEMBERS",
					location: {
						coordinates: [72.51113723963499, 23.069438702322635],
						type: "Point",
					},
				});
			})
			.catch((err) => console.error(err));
	}, []);

	const ImageApiCAll = React.useCallback((data) => {
		const mime = "image";
		const formData = new FormData();

		// formData.append("directoryId", "root");

		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "alert_preset");
		formData.append("file", data);
		// { headers: { "Content-Type": "multipart/form-data" }

		const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

		axios
			.post(url, formData)
			.then((res) => {
				setData((prev) => ({
					...prev,
					// imageUrl: res?.data?.data[0]?.data?.id,
					imageUrl: res?.data?.public_id,
				}));
			})
			.catch((err) => console.error(err));
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		// setFinalData(data);
		CreateAlertApiCall(data);
	};

	React.useEffect(() => {
		NeighbourListApi();
		BlogsListApiCall();
	}, [NeighbourListApi, BlogsListApiCall]);

	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	if (neighbourList && blogList) {
		return (
			<Container maxWidth='xl'>
				<Grid item container xs={12} spacing={2}>
					<Grid item xs={12}>
						<IconButton onClick={() => navigate(-1)}>
							<ArrowBack color='primary' />
						</IconButton>
						<Button
							onClick={() => {
								setModalOpen(true);
								setModalData("success", "success");
							}}>
							ok
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Card sx={{ padding: "20px" }}>
							<Typography sx={{ fontSize: "22px", color: "#666", fontWeight: 500 }}>
								Create Push Notification
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
											name='eventName'
											value={data?.eventName}
											onChange={(event) => {
												setData((prev) => ({
													...prev,
													eventName: event.target.value,
													// slug: event.target.value.replace(/[ ,]+/g, "-"),
												}));
											}}
											placeholder='Enter Title'
										/>
									</Grid>
									<Grid item xs={12}>
										<Autocomplete
											fullWidth
											multiple
											id='checkboxes-tags-demo'
											options={neighbourList}
											disableCloseOnSelect
											onChange={(event, value) => {
												setData((prev) => ({
													...prev,
													cloudIds: value?.map((item) => item?.id),
												}));
											}}
											getOptionLabel={(option) => option?.name}
											renderOption={(props, option, { selected }) => {
												return (
													<li {...props}>
														<Checkbox
															icon={icon}
															checkedIcon={checkedIcon}
															style={{ marginRight: 8 }}
															checked={selected}
														/>
														{option.name}
													</li>
												);
											}}
											renderInput={(params) => (
												<TextField
													fullWidth
													{...params}
													label='Select Neighbourhood'
													placeholder='Favorites'
												/>
											)}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormControl fullWidth>
											<InputLabel id='demo-simple-select-label'>Select Template</InputLabel>
											<Select
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												name='templateId'
												label='Select Template'
												value={data?.metaInfo.templateId}
												onChange={(event, data) => {
													setData((prev) => ({
														...prev,
														metaInfo: {
															templateId: event.target.value,
															templateName: data?.props?.children,
															detail: true,
														},

														// categoryName: data?.props?.children,
													}));
												}}>
												{blogList &&
													blogList?.map((item, index) => {
														return (
															<MenuItem key={index} value={item?.id}>
																{item?.title}
															</MenuItem>
														);
													})}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12}>
										<Box>
											<Typography sx={{ marginLeft: "0.3px" }}>Select Image</Typography>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													// justifyContent: "space-around",
													width: "100%",
													height: "100%",
													border: "0.5px solid lightgrey",
													padding: "10px",
													borderRadius: "5px",
												}}>
												<input
													className='neighbourhood-form-textField'
													type='file'
													name='logoURL'
													id='img'
													accept='.jpg, .jpeg, .png'
													onChange={(event) => {
														// newImageFunc(event.target.files[0]);
														setImgShow(URL.createObjectURL(event?.target?.files[0]));
														ImageApiCAll(event?.target?.files[0]);
														// setData((prev) => ({
														// 	...prev,
														// 	logoURL: event.target.files[0],
														// }));
													}}
												/>
												{imgShow && (
													<Box
														sx={{
															position: "relative",
															width: "80px",
															height: "80px",
															border: "0.5px solid lightgrey",
															padding: "5px",
															borderRadius: "5px",
														}}>
														<IconButton
															onClick={() => {
																document.getElementById("img").value = "";
																setImgShow("");
																setData((prev) => ({
																	...prev,
																	imageUrl: "",
																}));
															}}
															sx={{
																position: "absolute",
																top: "0px",
																right: "0px",
																padding: "0px",
																background: "white",
															}}>
															<Cancel fontSize='small' style={{ color: "brown" }} />
														</IconButton>
														<img
															src={imgShow}
															alt='photo'
															style={{ width: "100%", height: "100%" }}
														/>
													</Box>
												)}
											</Box>
										</Box>
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
											value={data.description}
											multiline
											onChange={(event) => {
												setData((prev) => ({
													...prev,
													description: event.target.value,
												}));
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<Box>
											<Button type='submit' variant='contained'>
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

export default CreatePushNotification;
