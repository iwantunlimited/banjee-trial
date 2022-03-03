import { Avatar,Grid,Card, TextField } from "@mui/material";
import React from "react";
import { findAdmin } from './Account_Services/AccountApiService'


function AccountProfile(){

    const Id = localStorage.getItem('id');

    const [userData , setUserData] = React.useState({})
   
    const findApi = React.useCallback(() => {
        findAdmin(Id).then( response => {
            setUserData(response)
            console.log(response)
          });
    },[])
    
    React.useEffect(() => {
        findApi()
    },[findApi,Id]);

    return(
        <div style={{display:'flex',justifyContent:'center'}}>
            <Grid container maxWidth="xl" style={{display:'flex'}}>
                <Grid item container xs={12} sm={12}>
                    <Grid item xs={12}>
                        <Card elevation={5} style={{width:'100%',padding: '20px',display:'flex',flexDirection: 'column',justifyContent:'center',alignItems:'center'}}>
                            <Avatar style={{width: '100px',height: '100px'}} alt="avatar" />
                            <TextField variant="filled" style={{marginTop:'20px'}} disabled value={userData && userData.firstName} />
                            <TextField variant="filled" style={{marginTop:'20px'}} disabled value="uvpatel@gmail.com" />
                            <TextField variant="filled" type="password" style={{marginTop:'20px'}} disabled value="Password" />
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default AccountProfile;