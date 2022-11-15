import { Add, AddCircle, ExpandMore } from "@mui/icons-material";
import {
	Card,
	Typography,
	IconButton,
	Tooltip,
	Box,
	Accordion,
	AccordionActions,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import React from "react";
import CreateBusiness from "./Business/CreateBusiness";

function ChipComp({ listApiCall }) {
	const [expanded, setExpanded] = React.useState(false);

	const handleExpanded = () => {
		setExpanded((prev) => !prev);
	};

	return (
		<Accordion expanded={expanded}>
			<AccordionSummary onClick={handleExpanded} expandIcon={<AddCircle color='primary' />}>
				{/* <Card
					sx={{
						p: 2,
						mb: 2,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						flexDirection: { xs: "column", sm: "row" },
					}}> */}
				<Box sx={{ padding: "20px" }}>
					<Typography
						sx={{
							color: "#6b778c",
							fontSize: "22px",
							fontWeight: "500",
							textAlign: "left",
						}}>
						Create Business
					</Typography>
				</Box>
				{/* <Box sx={{ display: "flex", alignItems: "center" }}>
						<Box sx={{ ml: 1 }}>
							<Tooltip title='Refresh'>
								<IconButton
									// onClick={() => navigate("reported-feeds")}
									style={{
										borderRadius: "50px",
										background: "#1976D2",
										padding: window.innerWidth < 501 ? "5px" : "10px",
										color: "white",
									}}>
									<Add />
								</IconButton>
							</Tooltip>
						</Box>
					</Box> */}
				{/* </Card> */}
			</AccordionSummary>
			<AccordionDetails>
				<CreateBusiness listApiCall={listApiCall} handleExpanded={handleExpanded} />
			</AccordionDetails>
		</Accordion>
	);
}

export default ChipComp;
