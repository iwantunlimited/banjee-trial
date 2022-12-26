import { AddCircle } from "@mui/icons-material";
import {
	Typography,
	Box,
	Accordion,
	AccordionActions,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import React from "react";
import CreateNeighbour from "./createNeighbour";
import { useTheme } from "@mui/material/styles";
import { MainContext } from "../../../context/Context";

function ChipComp(props) {
	const { listApiCAll } = props;
	const theme = useTheme();
	const { themeData } = React.useContext(MainContext);

	const [expanded, setExpanded] = React.useState(false);

	const handleExpanded = () => {
		setExpanded((prev) => !prev);
	};

	return (
		<Accordion expanded={expanded}>
			<AccordionSummary
				onClick={handleExpanded}
				expandIcon={<AddCircle style={{ color: theme.palette.primary.main }} />}>
				<Box sx={{ padding: { xs: "10px", sm: "20px" } }}>
					<Typography
						sx={{
							color: themeData ? "default" : "#6b778c",
							fontSize: "22px",
							fontWeight: "500",
							textAlign: "left",
						}}>
						Create Neighbourhood
					</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				<CreateNeighbour listApiCAll={listApiCAll} handleExpanded={handleExpanded} />
			</AccordionDetails>
		</Accordion>
	);
}

export default ChipComp;
