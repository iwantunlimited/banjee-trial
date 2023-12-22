import React, { useContext, useEffect, useState } from "react";
import {
	Card,
	Container,
	Typography,
	Box,
	Grid,
	Divider,
	Avatar,
	IconButton,
	Button,
	CircularProgress,
	Stack,
	Paper,
	Tooltip,
	TextField,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";
import moment from "moment";
import { Delete, Done, MoreHoriz, Refresh, Visibility } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { PaginationContext } from "../../../../context/PaginationContext";

function TotalMembers(props) {
	const {
		setNHPrivacyPagination,
		nHPrivacyPagination: { nhMemberpage, nhMemberpageSize },
	} = useContext(PaginationContext);

	const [keyword, setKeyword] = useState("");

	let rows = props?.members?.data ? props?.members?.data : [];

	let columns = [
		{
			id: "1",
			field: "mavatarUrl",
			headerClassName: "app-header",
			headerName: "Avatar",
			flex: 0.2,
			align: "center",

			renderCell: (params) => {
				return (
					<Avatar
						src={`https://gateway.banjee.org/services/media-service/iwantcdn/resources/${params.row.mavtarUrl}?actionCode=ACTION_DOWNLOAD_RESOURCE`}
						alt={params.row.muserName}
					/>
				);
			},
		},
		{
			id: "2",
			field: "muserName",
			headerClassName: "app-header",
			headerName: "Full Name",
			flex: 0.3,
			renderCell: (params) => {
				if (params?.row?.mfirstName) {
					return params?.row?.mfirstName;
				} else {
					return "-";
				}
			},
		},
		{
			id: "3",
			field: "mmcc",
			headerClassName: "app-header",
			headerName: "Mobile",
			// align: "center",
			flex: 0.3,
			renderCell: (params) => {
				if (params?.row?.mmcc && params?.row?.mmobile) {
					const number = params?.row?.mmcc && params?.row?.mmcc + " " + params?.row?.mmobile;

					return number;
				} else if (params?.row?.mmobile) {
					const number = params?.row?.mmobile;
					return number;
				} else {
					return "-";
				}
			},
		},
		{
			id: "4",
			field: "memail",
			headerClassName: "app-header",
			headerName: "Email",
			// align: "center",
			flex: 0.4,
		},
		{
			id: "5",
			field: "createdOn",
			headerClassName: "app-header",
			headerName: "Created On",
			// align: "center",
			flex: 0.4,
			renderCell: (params) => {
				if (params.row && params.row.createdOn) {
					const date = moment(params.row.createdOn).format("L");
					return date;
				} else {
					return "-";
				}
			},
		},
		{
			id: "6",
			field: "name",
			headerClassName: "app-header-rejected",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Admin",
			// align: 'center',
			flex: 0.3,
			renderCell: (params) => {
				if (params?.row?.profile?.username === "root") {
					return (
						<strong>
							<IconButton>
								<Done color='success' />
							</IconButton>
						</strong>
					);
				} else {
					if (params?.row?.role === "ADMIN") {
						return (
							<strong>
								<Stack direction={"row"} spacing={1}>
									{params?.row?.role === "ADMIN" && (
										<IconButton>
											<Done color='success' />
										</IconButton>
									)}
									<IconButton
										onClick={() =>
											props?.handleModal({
												open: true,
												data: params?.row?.profile.id,
												modalId: params?.row?.role === "ADMIN" ? 4 : 3,
											})
										}>
										<MoreHoriz />
									</IconButton>
								</Stack>
							</strong>
						);
					} else {
						return "-";
					}
				}
			},
		},
		{
			id: "7",
			field: "id",
			headerClassName: "app-header-rejected",
			// cellClassName: (params) => (params.row.live === true ? "app-header-live" : "app-header"),
			headerName: "Action",
			// align: 'center',
			flex: 0.3,
			renderCell: (params) => {
				return (
					<strong>
						<IconButton
							onClick={() => {
								props?.handleModal({ open: true, data: params?.row, modalId: 5 });
								// navigate("/neighbourhood/" + params?.row?.routingId);
							}}>
							<Delete />
						</IconButton>
						<IconButton
							onClick={() => {
								props?.handleModal({ open: true, data: params?.row, modalId: 2 });
								// navigate("/neighbourhood/" + params?.row?.routingId);
							}}>
							<Visibility />
						</IconButton>
					</strong>
				);
			},
		},
	];

	useEffect(() => {
		props?.refreshApi();
	}, [props?.refreshApi]);

	return (
		<Box>
			<Box>
				{props?.totalMembers === 0 ? (
					<Typography style={{ textAlign: "center" }}>No Members !</Typography>
				) : (
					<div style={{ width: "100%" }}>
						<Box
							sx={{ marginBottom: { xs: 1, md: 2 }, display: "flex", justifyContent: "space-between" }}>
							<TextField
								variant='outlined'
								name='keyword'
								size='small'
								label='Search'
								className='search-field'
								// value={keyword}
								onChange={(event) => props?.refreshApi(event?.target?.value)}
							/>
							<IconButton
								onClick={() => {
									if (nhMemberpage === 0) {
										props?.refreshApi();
									} else {
										setNHPrivacyPagination({
											from: "member",
											page: 0,
											pageSize: 10,
										});
									}
								}}>
								<Refresh color='primary' />
							</IconButton>
						</Box>
						<Box
							className='root'
							sx={{
								"& .app-header-live": {
									bgcolor: "#76e060",
								},
							}}>
							<DataGrid
								autoHeight
								getRowClassName={(params) => `app-header-${params.row.status}`}
								page={nhMemberpage}
								pageSize={nhMemberpageSize}
								onPageSizeChange={(event) => {
									setNHPrivacyPagination({
										from: "member",
										page: nhMemberpage,
										pageSize: event,
									});
								}}
								rowCount={props?.members?.totalMembers}
								rows={rows}
								columns={columns}
								paginationMode='server'
								// autoPageSize
								pagination
								onPageChange={(event) => {
									setNHPrivacyPagination({
										from: "member",
										page: event,
										pageSize: nhMemberpageSize,
									});
								}}
								rowsPerPageOptions={[5, 10, 20]}
								className='dataGridFooter'
							/>
						</Box>
					</div>
				)}
			</Box>
		</Box>
	);
}

export default TotalMembers;
