import React from 'react'
import { Grid,Container } from '@mui/material';
import { Helmet } from 'react-helmet';
import AccountProfile from './AccountProfile';
import AccountProfileDetail from './AccountProfile_Details';

function Account(){

    const [showRest , setShowReset] = React.useState(false);

    const openRestPass = () =>{
        setShowReset(!showRest)
    };

    return(
        <div>
            <Helmet>
                <title>Account | Banjee Admin</title>
            </Helmet> 
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        lg={4}
                        md={4}
                        xs={12}
                    >
                        <AccountProfile showResetPass={openRestPass}/>
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        xs={12}
                    >
                        <AccountProfileDetail />
                    </Grid>
                    {/* <Grid
                        item
                        lg={4}
                        md={4}
                        xs={12}
                    >
                        {showRest && <AccountPasswordChange />}
                    </Grid> */}
                </Grid>
            </Container>
        </div>
    )
}

export default Account;