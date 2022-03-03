import React from "react";
import { Container,Box,Grid } from "@mui/material";
import Helmet from "react-helmet";
import Analytics from "./Analytics/Analytics";

function DashboardComp(){


    return(
        <Container maxWidth="xl" style={{padding: '0px',margin:'0px'}}>
            <Helmet>
                <title>Dashboard | Banjee Admin</title>
            </Helmet>
            <Box
                sx={{
                    minHeight: '100%',
                    // py: 2
                }}
            >
                <Grid
                container
                spacing={2}
                >
                <Analytics />
                </Grid>
            </Box>
        </Container>
    )
}

export default DashboardComp;