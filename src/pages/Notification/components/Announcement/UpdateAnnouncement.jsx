import React, { useContext } from "react";
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
} from "@mui/material";
import "../../../Explore/business.css";
import { ArrowBack } from "@mui/icons-material";
import { createBlog, updateBlog } from "../../../Explore/services/ApiServices";
import { useNavigate, useParams } from "react-router";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MainContext } from "../../../../context/Context";
import { findByIdBlog } from "../../ApiServices/apiServices";

function UpdateAnnouncement() {
	const params = useParams();
	const navigate = useNavigate();
	const context = useContext(MainContext);
	const { setModalOpen, setModalData, themeData } = context;

	const [businessData, setBusinessData] = React.useState("");
	const [data, setData] = React.useState({
		title: "",
		shortDescription: "",
		description: "",
		blogType: "ANNOUNCEMENT",
	});

	const [state, setState] = React.useState("");

	const UpdateBlogApiCall = React.useCallback((bData, updatedData) => {
		updateBlog({ ...bData, ...updatedData })
			.then((res) => {
				setModalOpen(true);
				setModalData("Announcement Updated Successfully", "success");
				navigate("/notification/template");
				setData({
					title: "",
					shortDescription: "",
					description: "",
					blogType: "ANNOUNCEMENT",
				});
			})
			.catch((err) => console.error(err));
	}, []);

	const DetailApiCall = React.useCallback(() => {
		findByIdBlog(params?.id)
			.then((res) => {
				setBusinessData(res);
				setData({
					title: res?.title,
					shortDescription: res?.shortDescription,
					description: res?.description,
					blogType: "ANNOUNCEMENT",
				});
				setState(res?.description);
			})
			.catch((err) => console.error(err));
	}, []);

	React.useEffect(() => {
		DetailApiCall();
	}, [DetailApiCall]);

	const handleSubmit = (event) => {
		event.preventDefault();

		// setFinalData(data);
		UpdateBlogApiCall(businessData, data);
	};

	const descriptionText = <div dangerouslySetInnerHTML={{ __html: data?.description }} />;

	return (
		<Container maxWidth='xl'>
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
							Update Announcement
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
										name='shortDescription'
										value={data?.title}
										onChange={(event) => {
											setData((prev) => ({
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
									<TextField
										required
										className='neighbourhood-form-textField'
										fullWidth
										label='Short Description'
										rows={3}
										maxRows={5}
										placeholder='Short Description'
										name='shortDescription'
										value={data.shortDescription}
										multiline
										onChange={(event) => {
											setData((prev) => ({
												...prev,
												shortDescription: event.target.value,
											}));
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<Box>
										<ReactQuill
											placeholder='Enter Description'
											theme='snow'
											formats={[
												"header",
												"font",
												"size",
												"bold",
												"italic",
												"underline",
												"strike",
												"blockquote",
												"list",
												"bullet",
												"indent",
												"link",
												"image",
												"video",
											]}
											modules={{
												toolbar: [
													[{ header: "1" }, { header: "2" }, { font: [] }],
													[{ size: [] }],
													["bold", "italic", "underline", "strike", "blockquote"],
													[
														{ list: "ordered" },
														{ list: "bullet" },
														{ indent: "-1" },
														{ indent: "+1" },
													],
													["link", "image", "video"],
													["clean"],
												],
												clipboard: {
													// toggle to add extra line breaks when pasting HTML:
													matchVisual: false,
												},
											}}
											value={state}
											onChange={(value) => {
												setState(value);
												setData((prev) => ({
													...prev,
													description: value,
												}));
											}}
										/>
									</Box>
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
				</Grid>
				{/* <Grid item xs={12}>
					<Box>
						<Typography>{descriptionText}</Typography>
					</Box>
				</Grid> */}
			</Grid>
		</Container>
	);
}

export default UpdateAnnouncement;
