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
import { createBlog } from "../../../Explore/services/ApiServices";
import { useNavigate } from "react-router";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MainContext } from "../../../../context/Context";

function CreateAnnouncement() {
	const navigate = useNavigate();
	const context = useContext(MainContext);
	const { setModalOpen, setModalData } = context;

	const [data, setData] = React.useState({
		title: "",
		shortDescription: "",
		description: "",
		blogType: "ANNOUNCEMENT",
	});

	const [state, setState] = React.useState("");

	const CreateBlogApiCall = React.useCallback((data) => {
		createBlog(data)
			.then((res) => {
				setModalOpen(true);
				setModalData("Announcement Created Successfully", "success");
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

	const handleSubmit = (event) => {
		event.preventDefault();

		// setFinalData(data);
		CreateBlogApiCall(data);
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
						<Typography sx={{ fontSize: "22px", color: "#666", fontWeight: 500 }}>
							Create Announcement
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

export default CreateAnnouncement;
