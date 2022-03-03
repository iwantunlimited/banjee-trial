import React from 'react';
import routing from './navRouting';
import { List } from '@mui/material';
import  { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText'; 

function Sidebar(props){

    const location = useLocation();

    console.log(location.pathname);

    const {handleId} = props

    return(
        <List>
            {
                routing.map((text,index) => {
                    return(
                        <Link to={text.path} style={{display:'flex',textDecoration:'none',color:'grey'}} onClick={() => {handleId(text.id)}}>
                            <ListItem button key={index} onClick={props.handleClick} style={{color: location.pathname === text.path ? '#1976D2' : 'grey'}}>
                                    <ListItemIcon style={{display:'flex',justifyContent:'center',color: location.pathname === text.path ? '#1976D2' : 'grey'}}>{text.icon}</ListItemIcon>
                                    <ListItemText>
                                    {text.name}
                                    </ListItemText>
                                    {/* <Typography variant='h5' style={{marginLeft: window.innerWidth < 500 ? '-20px' : '0px',fontWeight:'500'}}>{text.name}</Typography> */}
                            </ListItem>
                        </Link>
                    )
                })
            }
        </List>
    )
}

export default Sidebar;