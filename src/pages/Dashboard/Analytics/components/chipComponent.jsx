import { Grid,Card, CardContent, Typography,Box } from '@mui/material';
import React from 'react'
import './chip.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers,faUsersSlash, faPhone, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@mui/material';


function ChipComponent(props){

    const { reportedUsers,totalUsers,totalRooms  } = props.totalData;

    return(
        <Grid item container xs={12} spacing={window.innerWidth < 1441 ? 2 : 4}>
            <Grid item xs={12} sm={6} md={6} lg={3}>
                <Card className='chip-card'>
                    <CardContent className='card-body'>
                        <FontAwesomeIcon className='card-icon' style={{color: '#1976D2'}} icon={faUsers} />
                        <Box style={{display:'flex',flexDirection:'column'}}>
                            <span className='cardinfo-title'>Total Users</span>
                            <span className='cardinfo-number'>
                                {
                                    totalUsers ? (
                                        totalUsers && totalUsers > 0 ? 
                                        totalUsers
                                            : (
                                            0
                                        )
                                    ) : (
                                        <CircularProgress
                                            style={{
                                                width: "21px",
                                                height: "21px",
                                            }}
                                        />
                                    )
                                }
                            </span>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
                <Card className='chip-card'>
                    <CardContent className='card-body'>
                        <FontAwesomeIcon className='card-icon' style={{color: 'rgb(143, 201, 251)'}} icon={faUsersSlash} />
                        <Box style={{display:'flex',flexDirection:'column'}}>
                            <span className='cardinfo-title'>Total Reported Uers</span>
                            <span className='cardinfo-number'>
                                {
                                    reportedUsers ? (
                                        reportedUsers && reportedUsers > 0 ? 
                                        reportedUsers
                                            : (
                                            0
                                        )
                                    ) : (
                                        <CircularProgress
                                            style={{
                                                width: "21px",
                                                height: "21px",
                                            }}
                                        />
                                    )
                                }
                            </span>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
                <Card className='chip-card'>
                    <CardContent className='card-body'>
                        <FontAwesomeIcon className='card-icon' style={{color: 'rgb(216, 151, 235)'}} icon={faPhone} />
                        <Box style={{display:'flex',flexDirection:'column'}}>
                               <span className='cardinfo-title'>Total Call Established</span>
                            <span className='cardinfo-number'>
                                {
                                    reportedUsers ? (
                                        reportedUsers && reportedUsers > 0 ? 
                                        reportedUsers
                                            : (
                                            100
                                        )
                                    ) : (
                                        <CircularProgress
                                            style={{
                                                width: "21px",
                                                height: "21px",
                                            }}
                                        />
                                    )
                                }
                            </span>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
                <Card className='chip-card'>
                    <CardContent className='card-body'>
                        <FontAwesomeIcon className='card-icon' icon={faLayerGroup} />
                        <Box style={{display:'flex',flexDirection:'column'}}>
                            <span className='cardinfo-title'>Total Room Created</span>
                            <span className='cardinfo-number'>
                                {
                                    totalRooms ? (
                                        totalRooms && totalRooms > 0 ? 
                                        totalRooms
                                            : (
                                            0
                                        )
                                    ) : (
                                        <CircularProgress
                                            style={{
                                                width: "21px",
                                                height: "21px",
                                            }}
                                        />
                                    )
                                }
                            </span>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default ChipComponent;