import React from "react";
import {
	Box,
	Grid,
	Card,
	Button,
	IconButton,
	Modal,
	TextField,
	Container,
	CircularProgress,
	Autocomplete,
	Slider,
	FormControl,
	Select,
	MenuItem,
	useTheme,
	Typography,
} from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import { ExpandMore, ChevronRight, Refresh, Add, Delete, Cancel } from "@mui/icons-material";
import TreeItem from "@mui/lab/TreeItem";
import "./Category.css";
import axios from "axios";
import {
	CategoryList,
	CreateCategory,
	CreateSubCategory,
	deleteCategory,
	deleteSubCategory,
} from "../Users/User_Services/UserApiService";
import SwitchSelector from "react-switch-selector";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: window.innerWidth < 500 ? 350 : 600,
	bgcolor: "background.paper",
	border: "2px solid #fff",
	boxShadow: 24,
	p: 3,
};

function Category(props) {
	const theme = useTheme();

	const [showId, setShowId] = React.useState();
	const [openModal, setOpenModal] = React.useState(false);
	const [toggleBtn, setToggleBtn] = React.useState("parent");

	const [categoryList, setCategoryList] = React.useState([]);

	const intialValue = {
		name: "",
		type: "",
		description: "",
		category: {},
		priority: "",
		image: "",
	};

	const [modalData, setModalData] = React.useState(intialValue);

	const [imgShow, setImgShow] = React.useState("");

	// console.log("====================================");
	// console.log("images", images);
	// console.log("====================================");

	function handleChange(event) {
		const { name, value } = event.target;
		setModalData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	}

	function handleSubmit(event) {
		if (toggleBtn === "parent") {
			CreateCategoryApiCall();
		} else {
			CreateSubCategoryApiCall();
		}
		setOpenModal(false);
		setToggleBtn("parent");
		setImgShow("");
		event.preventDefault();
	}

	function handleDelete(event) {
		DeleteCategoryApiCall(event);
	}

	function handleSubCategoryDelete(event) {
		DeleteSubCategoryApiCall(event);
	}

	const DeleteCategoryApiCall = (id) => {
		deleteCategory(id)
			.then(() => {
				setModalData(intialValue);
				CategoryListApiCall();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const DeleteSubCategoryApiCall = (id) => {
		deleteSubCategory(id)
			.then(() => {
				setModalData(intialValue);
				CategoryListApiCall();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const CreateCategoryApiCall = () => {
		// console.log("handle Submit", modalData);
		CreateCategory({
			name: modalData.name,
			description: modalData.description,
			priority: 3,
			image: modalData?.image,
			type: modalData?.type,
		})
			.then(() => {
				setModalData(intialValue);
				CategoryListApiCall();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const CreateSubCategoryApiCall = () => {
		CreateSubCategory({
			name: modalData.name,
			categoryId: modalData.category.id,
			categoryName: modalData.category.name,
		})
			.then(() => {
				setModalData(intialValue);
				CategoryListApiCall();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const CategoryListApiCall = React.useCallback(() => {
		CategoryList({ type: props?.categoryName })
			.then((response) => {
				setCategoryList(response);
			})
			.catch((err) => console.log(err));
	}, [props?.categoryName]);

	// Image api call for image upload to get image id

	const ImageApiCAll = React.useCallback((data) => {
		const mime = "image";
		const formData = new FormData();

		// formData.append("directoryId", "root");

		formData.append("cloud_name", "banjee");
		formData.append("upload_preset", "business_images");
		formData.append("file", data);
		// { headers: { "Content-Type": "multipart/form-data" }

		const url = `https://api.cloudinary.com/v1_1/banjee/${mime}/upload`;

		axios
			.post(url, formData)
			.then((res) => {
				// console.log("====================================");
				// console.log("image upload response", res);
				// console.log("====================================");
				setModalData((prev) => ({
					...prev,
					// imageUrl: res?.data?.data[0]?.data?.id,
					image: res?.data?.public_id,
				}));
			})
			.catch((err) => console.log(err));
	}, []);

	React.useEffect(() => {
		CategoryListApiCall();
	}, [CategoryListApiCall]);

	function handleClick(id) {
		setShowId(id);
	}

	if (categoryList?.content) {
		return (
			<Container maxWidth='lg'>
				<div style={{ marginTop: "50px", background: "white", fontSize: "33px" }}>
					<Card style={{ width: "auto", height: "100%", padding: "20px", borderRadius: "5px" }}>
						{/* ---------------------- Refresh and Add Category button with modal start ------------------------- */}

						<Box style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								<IconButton
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: "10px",
										fontSize: "20px",
										color: "white",
									}}
									onClick={CategoryListApiCall}>
									<Refresh />
								</IconButton>
							</div>
							<div>
								<IconButton
									style={{
										borderRadius: "50px",
										background: theme.palette.primary.main,
										padding: "10px",
										fontSize: "20px",
										color: "white",
									}}
									onClick={() => setOpenModal(true)}>
									<Add />
								</IconButton>
							</div>
							<Modal
								open={openModal}
								onClose={() => {
									setOpenModal(false);
									setToggleBtn("parent");
								}}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'>
								<Card sx={style}>
									<Grid container maxWidth='lg'>
										<form onSubmit={handleSubmit}>
											<Grid item container xs={12}>
												<Grid item xs={12}>
													<Box style={{ display: "flex", justifyContent: "space-between" }}>
														<span style={{ color: "grey", fontSize: "20px", fontWeight: "500" }}>
															{toggleBtn === "parent" ? "Create Category" : "Create Sub-Category"}
														</span>
														{props.categoryName === "ROOMS" && (
															<div style={{ width: 150, height: 35, display: "flex" }}>
																<SwitchSelector
																	onChange={(e) => {
																		setToggleBtn(e);
																	}}
																	options={[
																		{ label: "Parent", value: "parent" },
																		{ label: "Child", value: "child" },
																	]}
																	initialSelectedIndex={0}
																	backgroundColor={"#999"}
																	fontColor={"#fff"}
																	selectedBackgroundColor='#1976D2'
																/>
															</div>
														)}
													</Box>
													<hr />
												</Grid>
												{toggleBtn === "parent" ? (
													<React.Fragment>
														<Grid item xs={12}>
															<Box
																style={{
																	display: "flex",
																	flexDirection: "column",
																	marginBottom: "10px",
																}}>
																<span style={{ marginBottom: "5px" }}>Category Name</span>
																<TextField
																	onChange={handleChange}
																	value={modalData.name}
																	className='modalTextField'
																	size='small'
																	variant='outlined'
																	name='name'
																	required
																/>
															</Box>
														</Grid>
														<Grid item xs={12}>
															<Box
																style={{
																	display: "flex",
																	flexDirection: "column",
																	marginBottom: "10px",
																}}>
																<span style={{ marginBottom: "5px" }}>Type</span>
																<FormControl fullWidth>
																	<Select
																		size='small'
																		className='modalSelectField'
																		id='demo-simple-select'
																		name='type'
																		value={modalData?.type}
																		onChange={handleChange}>
																		<MenuItem value={"ROOMS"}>Rooms</MenuItem>
																		<MenuItem value={"LOCALBUSINESS"}>Local Business</MenuItem>
																		<MenuItem value={"BLOG"}>Blog</MenuItem>
																	</Select>
																</FormControl>
															</Box>
														</Grid>
														<Grid item xs={12}>
															<Box
																style={{
																	display: "flex",
																	flexDirection: "column",
																	marginBottom: "10px",
																}}>
																<span style={{ marginBottom: "5px" }}>Choose Image</span>
																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																		// justifyContent: "space-around",
																		width: "100%",
																		height: "100%",
																		border: "0.5px solid lightgrey",
																		p: 1,
																		borderRadius: "5px",
																	}}>
																	<input
																		type='file'
																		name='image'
																		id='img'
																		accept='.jpg, .jpeg, .png'
																		onChange={(event) => {
																			// newImageFunc(event.target.files[0]);
																			setImgShow(URL.createObjectURL(event?.target?.files[0]));
																			ImageApiCAll(event?.target?.files[0]);
																			// setData((prev) => ({
																			// 	...prev,
																			// 	imageUrl: event.target.files[0],
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
																					setModalData((prev) => ({
																						...prev,
																						image: "",
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
															<Box
																style={{
																	display: "flex",
																	flexDirection: "column",
																	marginBottom: "10px",
																}}>
																<span style={{ marginBottom: "5px" }}>Description</span>
																<TextField
																	onChange={handleChange}
																	value={modalData.description}
																	multiline
																	minRows={4}
																	className='modalTextField'
																	size='small'
																	variant='outlined'
																	name='description'
																	required
																/>
															</Box>
														</Grid>
														<Grid item xs={12}>
															<Box sx={{ width: 300 }}>
																<span>Select Priority</span>
																<Slider
																	aria-label='Priority'
																	defaultValue={0}
																	getAriaValueText={(value) => {
																		return `${value}`;
																	}}
																	valueLabelDisplay='auto'
																	onChange={handleChange}
																	name='priority'
																	value={modalData.priority}
																	step={10}
																	marks
																	min={0}
																	max={100}
																/>
															</Box>
														</Grid>
													</React.Fragment>
												) : (
													<React.Fragment>
														<Grid item xs={12}>
															<Box
																style={{
																	display: "flex",
																	flexDirection: "column",
																	marginBottom: "10px",
																}}>
																<span style={{ marginBottom: "5px" }}>Category Name</span>
																<Autocomplete
																	// disablePortal
																	id='combo-box-demo'
																	options={categoryList.content}
																	getOptionLabel={(e) => e.name}
																	// sx={{ width: 300 }}
																	onChange={(e, d) =>
																		handleChange({ target: { name: "category", value: d } })
																	}
																	renderInput={(params) => (
																		<TextField {...params} label='Select Category' />
																	)}
																/>
															</Box>
														</Grid>
														<Grid item xs={12}>
															<Box
																style={{
																	display: "flex",
																	flexDirection: "column",
																	marginBottom: "10px",
																}}>
																<span style={{ marginBottom: "5px" }}>Sub-Category</span>
																<TextField
																	onChange={handleChange}
																	value={modalData.name}
																	className='modalTextField'
																	size='small'
																	variant='outlined'
																	name='name'
																/>
															</Box>
														</Grid>
													</React.Fragment>
												)}
												<Grid item xs={12}>
													<Box
														style={{
															marginBottom: "10px",
															marginTop: "10px",
															display: "flex",
															justifyContent: "flex-end",
														}}>
														<Button
															variant='contained'
															style={{ background: "#1976D2" }}
															type='submit'>
															Submit
														</Button>
													</Box>
												</Grid>
											</Grid>
										</form>
									</Grid>
								</Card>
							</Modal>
						</Box>
						{/* ---------------------- Refresh and Add Category button with modal ends ------------------------- */}

						<hr />

						{categoryList?.content?.length > 0 ? (
							<Grid container>
								<Grid item container xs={12} spacing={4}>
									<Grid item xs={12} sm={4} md={4} lg={4}>
										<Box style={{ padding: "10px", borderRadius: "10px" }}>
											<TreeView
												aria-label='multi-select'
												defaultCollapseIcon={<ExpandMore />}
												defaultExpandIcon={<ChevronRight />}
												multiSelect
												sx={{
													minHeight: 216,
													height: "100%",
													flexGrow: 1,
													maxWidth: 400,
													overflowY: "auto",
												}}>
												{categoryList &&
													categoryList.content &&
													categoryList.content.map((ele) => {
														return (
															<TreeItem
																className='treeview-css'
																onClick={() => {
																	handleClick(ele.id);
																}}
																nodeId={ele.id}
																label={ele.name}>
																{ele &&
																	ele.subCategories &&
																	ele.subCategories
																		.filter((ele) => ele.deleted === false)
																		.map((ele) => {
																			return (
																				<React.Fragment>
																					<TreeItem nodeId={ele.id} label={ele.name} />
																				</React.Fragment>
																			);
																		})}
															</TreeItem>
														);
													})}
											</TreeView>
										</Box>
									</Grid>
									<Grid item xs={12} sm={8} md={8} lg={8}>
										{categoryList &&
											categoryList.content &&
											categoryList.content.map((ele) => {
												if (ele.id === showId) {
													return (
														<React.Fragment>
															<Card
																style={{
																	width: "100%",
																	minHeight: "200px",
																	maxHeight: "auto",
																	padding: "20px",
																	flexDirection: "column",
																}}>
																<Box style={{ display: "flex", flexDirection: "column" }}>
																	<Box>
																		<h4 style={{ textAlign: "center" }}>
																			{ele.id === showId && ele.name}
																		</h4>
																	</Box>
																	<Box
																		style={{
																			display: "flex",
																			fontSize: "20px",
																			marginTop: "20px",
																		}}>
																		<div style={{ marginRight: "10px" }}>
																			{ele && ele.description ? "Description:" : null}
																		</div>
																		<div style={{ color: "grey" }}>
																			{ele.id === showId && ele.name}
																		</div>
																	</Box>
																	<Box
																		style={{
																			display: "flex",
																			fontSize: "20px",
																			marginTop: "10px",
																		}}>
																		<div style={{ marginRight: "10px" }}>
																			{ele && ele.subCategories ? "Sub-Category: :" : null}
																		</div>
																		<div style={{ display: "flex", flexDirection: "column" }}>
																			{ele &&
																				ele.id === showId &&
																				ele.subCategories &&
																				ele.subCategories
																					.filter((ele) => ele.deleted === false)
																					.map((ele) => {
																						return (
																							<div
																								style={{ display: "flex", alignItems: "center" }}>
																								<span style={{ fontSize: "18px", color: "grey" }}>
																									{ele.name + " "}
																								</span>
																								<IconButton
																									style={{ fontSize: "20px" }}
																									onClick={() => {
																										handleSubCategoryDelete(ele.id);
																									}}>
																									<Delete
																										fontSize='smaller'
																										style={{ color: "grey" }}
																									/>
																								</IconButton>
																							</div>
																						);
																					})}
																		</div>
																	</Box>
																	<Box
																		style={{
																			marginTop: "10px",
																			display: "flex",
																			fontSize: "20px",
																			justifyContent: "space-between",
																		}}>
																		<div style={{ display: "flex", fontSize: "20px" }}>
																			<div style={{ marginRight: "10px" }}>
																				{ele && ele.priority ? "Priority:" : null}
																			</div>
																			<div style={{ color: "grey" }}>
																				{ele.id === showId && ele.priority}
																			</div>
																		</div>
																		<div>
																			<IconButton
																				onClick={() => {
																					handleDelete(ele.id);
																				}}
																				style={{ color: "#5664D2" }}>
																				<Delete />
																			</IconButton>
																		</div>
																	</Box>
																</Box>
															</Card>
														</React.Fragment>
													);
												} else {
													return null;
												}
											})}
									</Grid>
								</Grid>
							</Grid>
						) : (
							<>
								<Box
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "80vh",
									}}>
									<Typography>No data found !</Typography>
								</Box>
							</>
						)}
					</Card>
				</div>
			</Container>
		);
	} else {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "500px",
				}}>
				<CircularProgress />
			</div>
		);
	}
}

export default Category;
