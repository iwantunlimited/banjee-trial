import React from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Grid, Typography, Avatar, CircularProgress, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { findRoomsById } from "./Services/ApiServices";
import moment from "moment";
import "../Users/users.css";

const useStyles = makeStyles((theme) => ({
	typoColor: {
		color: "#444",
	},
}));

function ViewRooms() {
	const params = useParams();

	const classes = useStyles();

	const roomId = params.id;

	const [data, setData] = React.useState();

	// const [ pagination, setPagination ] = React.useState({
	// 	page: 0,
	// 	pageSize: 10,
	// 	tootalElement: 0
	// })

	// ------------------------------------ find Groups By ID Api Call ---------------------------------------

	const findRoomsByIdApiCall = React.useCallback(() => {
		findRoomsById(roomId)
			.then((response) => {
				setData(response);
				console.log(response);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [roomId]);

	React.useEffect(() => {
		findRoomsByIdApiCall();
	}, [findRoomsByIdApiCall]);

	// const rows = connectedUser ? connectedUser : [] ;

	// const columns = [
	//     {
	//         id:"1",
	//         field: "avatarUrl",
	//         headerClassName: 'app-header',
	//         headerName: "User Name",
	//         flex: 0.5 ,
	//         // renderCell: (params) => (
	//         //     <Avatar src={params.row.connectedUser.avtarUrl} alt={params.row.connectedUser.name} />
	//         //     )
	//     },
	//     {
	//         id:"2",
	//         field: "username",
	//         headerClassName: 'app-header',
	//         headerName: "User Name",
	//         flex: 0.3 ,
	//     },
	//     {
	//         id:"3",
	//         field: "email",
	//         headerClassName: 'app-header',
	//         headerName: "Email",
	//         flex: 0.4
	//     },
	//     {
	//         id:"4",
	//         field: "mobile",
	//         headerClassName: 'app-header',
	//         headerName: "Mobile Number",
	//         align:'center',
	//         flex: 0.4
	//     }
	//   ];

	function ImageAvatar() {
		if (data && data.imageContent && data.imageContent.src) {
			return (
				<img
					style={{ width: "100px", height: "100px", borderRadius: "50px" }}
					src={
						"https://gateway.banjee.org//services/media-service/iwantcdn/resources/" +
						data.imageContent.src +
						"?actionCode=ACTION_DOWNLOAD_RESOURCE"
					}
					alt='Profile'
				/>
			);
		} else {
			return <Avatar sx={{ width: 68, height: 68 }} alt='P' />;
		}
	}

	if (data) {
		return (
			<Container maxWidth='lg'>
				<Grid container spacing={3} className='mt-1'>
					<Grid item xs={12} className='d-flex justify-content-center'>
						<Card
							style={{
								padding: "30px",
								width: "100%",
								margin: "5px",
								borderRadius: "15px",
								// boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
							}}>
							<Grid container>
								<Grid item container xs={12}>
									<Grid
										item
										xs={12}
										style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
										<div style={{ marginRight: "20px" }}>{ImageAvatar()}</div>
										<div style={{ display: "flex", flexDirection: "column" }}>
											<Typography
												variant='h2'
												style={{ color: "#5664D2" }}
												className={["fs-5 text-center ", classes.typoColor].join(" ")}>
												{data.groupName}
											</Typography>
											<Typography
												variant='h5'
												className={["fs-6 my-1 text-center", classes.typoColor].join(" ")}>
												{moment(data.createdOn).format("LLL")}
											</Typography>
											<Typography
												variant='h5'
												className={["fs-6 my-1 text-center", classes.typoColor].join(" ")}>
												{data.connectedUsers.length} Users Connected
											</Typography>
										</div>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					</Grid>

					<Grid item xs={12} sm={4} md={4} lg={4}>
						<Typography style={{ fontSize: "22px", color: "#444" }} className='mb-3'>
							Created By:
						</Typography>
						<Card
							style={{
								padding: "20px",
								width: "100%",
								borderRadius: "15px",
								// boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
							}}>
							<Grid item container xs={12}>
								<Grid item xs={12} className='d-flex justify-content-center align-items-center'>
									<Avatar
										alt=''
										src={data.creator.avtarUrl ? data.creator.avtarUrl : ""}
										style={{
											width: "100px",
											height: "100px",
											fontSize: "45px",
										}}>
										{data.creator.userName.slice(0, 1)}
									</Avatar>
								</Grid>
								<Grid item container xs={12} className='d-flex justify-content-center mt-3 px-2'>
									<Grid
										item
										xs={12}
										className='d-flex'
										sx={{ display: "flex", alignItems: "center" }}>
										<Typography style={{ fontSize: "14px" }}>Username:</Typography>
										<Typography sx={{ fontSize: "16px", marginLeft: "10px" }}>
											{data.creator.userName}
										</Typography>
									</Grid>
									<Grid
										item
										xs={12}
										className='d-flex mt-1'
										sx={{ display: "flex", alignItems: "center" }}>
										<Typography style={{ fontSize: "14px" }}>Mobile No:</Typography>
										<Typography sx={{ fontSize: "16px", marginLeft: "10px" }}>
											{data.creator.mobile}
										</Typography>
									</Grid>
									<Grid
										item
										xs={12}
										className='d-flex mt-1'
										sx={{ display: "flex", alignItems: "center" }}>
										<Typography style={{ fontSize: "14px" }}>Email Id :</Typography>
										<Typography sx={{ fontSize: "16px", marginLeft: "10px" }}>
											{data.creator.email}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item xs={12} sm={8} md={8} lg={8}>
						<div style={{ fontSize: "22px", color: "#444" }} className='mb-3'>
							Connected Members in Room
						</div>
						<Card
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "15px",
								// boxShadow: "0px 0px 10px rgb(0,0,0,0.5)",
							}}>
							<div>
								<table className='table'>
									<thead>
										<tr style={{ color: "#1976D2" }}>
											<th scope='col'>Sr. No</th>
											<th scope='col'>Username</th>
											<th scope='col'>Email</th>
											<th scope='col'>Mobile Number</th>
										</tr>
									</thead>
									<tbody>
										{data.connectedUsers.map((ele, index) => {
											return (
												<tr>
													<th scope='row'>{index + 1}</th>
													<td>{ele.username ? ele.username : "-"}</td>
													<td>{ele.email ? ele.email : "-"}</td>
													<td>{ele.mobile ? ele.mobile : "-"}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
							<div className='root'>
								{/* <DataGrid 
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
									autoPageSize
									pagination
									onPageChange={(event) => { ApiCall({page:event, pageSize: pagination.pageSize})}}
									rowsPerPageOptions={[5, 10, 20]}
									className="dataGridFooter"
								/> */}
							</div>
						</Card>
					</Grid>
				</Grid>
			</Container>
		);
	} else {
		return (
			<div className='d-flex justify-content-center' style={{ margin: "25%" }}>
				<CircularProgress />
			</div>
		);
	}
}

export default ViewRooms;
