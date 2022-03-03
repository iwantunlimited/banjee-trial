import React from "react";
import { Grid,Container, Card, IconButton, CircularProgress } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import { Helmet } from "react-helmet";
import ChipCompo from "./components/chipCompo";
import { filterRooms } from "./Services/ApiServices";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

function Room(){

    const navigate = useNavigate();

    const[state,setState] = React.useState();

    const[pagination,setPagination] = React.useState({
        page: 0,
        pageSize:10,
        totalElement: 0,
    })

    const { page, pageSize } = pagination;

    const [keywords, setKeywords] = React.useState("")

    function handleSearch(event){
        setState();
        setKeywords(event.target.value)
        // ApiCall({page,pageSize},event.target.value)
    }

    const ApiCall = React.useCallback(
        ({page,pageSize,keywords}) => {
        filterRooms({
            inactive: "",
            page: page,
            pageSize: pageSize,
            keywords: keywords, 
        }).then((res) => {
            console.log(res);
            const resp = res.content.map((ele) => {
                return{
                    routingId: ele.id ,
                    ...ele,
                    ...ele.users,
                    ...ele.creator
                }
            })
            setState(resp)
            setKeywords(keywords)
            setPagination({ page: res.pageable.pageNumber, pageSize: 10,totalElement: res.totalElements })
        }).catch((errr) => console.log(errr))
    },[])

    const rows = state ? state:[];

    const columns = [
        { 
            id:"1",
            field: "groupName", 
            headerClassName: 'app-header',
            headerName: "Room Name", 
            flex: 0.5 ,
            // renderCell: (params) => (
            //     <Avatar src={params.row.toUser.avtarUrl} alt={params.row.toUser.name} />
            //     )
        },
        { 
            id:"2",
            field: "userName", 
            headerClassName: 'app-header',
            headerName: "Created By", 
            flex: 0.3 ,
        },
        { 
            id:"3",
            field: "email", 
            headerClassName: 'app-header',
            headerName: "Email", 
            flex: 0.4 
        },
        { 
            id:"4",
            field: "mobile",
            headerClassName: 'app-header', 
            headerName: "Mobile Number", 
            align:'center',
            flex: 0.4  
        },
        { 
            id:"5",
            field: "communityType",
            headerClassName: 'app-header', 
            headerName: "Community Type", 
            align:'center',
            flex: 0.4, 
            
        },
        {
            id:"6",
            field: "users", 
            headerClassName: 'app-header',
            headerName: "Total Connected Users", 
            align: 'center',
            flex: 0.4 ,
            renderCell: (params) => {
                if(params.row && params.row.users && params.row.users.length > 0){
                    return params.row.users.length;
                }else{
                    return 0;
                }
            }
            
        },
        {
            id:"7",
            field: "createdOn", 
            headerClassName: 'app-header',
            headerName: "Created On", 
            align: 'center',
            flex: 0.4 ,
            renderCell: (params) => {
                if(params.row && params.row.createdOn){
                    const date = moment(params.row.createdOn).format("L")
                    return  date;
                }else{
                    return 0;
                }
            }
            
        },
        {
            id:"8",
            field: "id", 
            headerClassName: 'app-header',
            headerName: "View", 
            // align: 'center',
            flex: 0.3 ,
            renderCell: (params) => {
                
                return (
                    <strong>
                        <IconButton
                         onClick={() => { 
                             navigate('/rooms/view/' + params.row.routingId) 
                            console.log(params)
                            }}
                         >   
                            <Visibility />
                        </IconButton>
                    </strong>
                )
            }
            
        }
      ];

    React.useEffect(() => {
        ApiCall({page,pageSize,keywords});
    },[ApiCall,page,pageSize,keywords])


//    if(state){
    return(
        <>
            <Helmet>
                <title>Rooms | Banjee Admin</title>
            </Helmet>
            <Container maxWidth="lg" style={{paddingTop: window.innerWidth < 501 ? '0px' : '20px'}}>
                <Grid item container xs={12} spacing={window.innerWidth < 601 ? 2 : 4}>
                    <Grid item xs={12}>
                        <ChipCompo refreshApi={ApiCall} handleSearch={handleSearch} words={keywords}  />
                    </Grid>
                    <Grid item xs={12}>
                       {
                           state ?
                           <Card style={{display:'flex',flexDirection: 'column',padding:'20px',color: 'grey',justifyContent:"left"}}>
                            <div style={{color:'#6b778c',fontSize:'20px',fontWeight:'500'}}>
                                Total Rooms
                            </div>
                            <hr  />
                            <div style={{width: "100%" }}>
                                <div className="root">
                                    <DataGrid 
                                        autoHeight
                                        page={pagination.page}
                                        pageSize={pagination.pageSize}
                                        onPageSizeChange={(event) => {
                                            setPagination((prev)=>({
                                                ...prev,
                                                pageSize:event
                                            }))
                                            ApiCall({page:pagination.page, pageSize:event});
                                        }}
                                        rowCount={pagination.totalElement}
                                        rows={rows} 
                                        columns={columns} 
                                        paginationMode="server"
                                        // autoPageSize
                                        pagination
                                        onPageChange={(event) => { ApiCall({page:event, pageSize: pagination.pageSize})}}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        className="dataGridFooter"
                                    />
                                </div>
                            </div>
                        </Card> 
                        :
                        <div style={{display:'flex',justifyContent:'center',alignItems:'center',height: '50vh'}}>
                            <CircularProgress />
                        </div>
                       }
                    </Grid>
                </Grid>
            </Container>
        </>
    )
//    }else{
//        return(
//         <Box style={{width: '100%',height: '50vh'}} className="d-flex justify-content-center align-items-center">
//             <CircularProgress />
//         </Box>
//        )
//    }
}

export default Room;