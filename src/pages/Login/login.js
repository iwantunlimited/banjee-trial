import {
	Card,
	Container,
	Grid,
	TextField,
	Button,
	IconButton,
	InputAdornment,
	Box,
} from "@mui/material";
import Helmet from "react-helmet";
import React from "react";
import "./login.css";
import Logo from "../../assets/Logo.svg";
import { urls } from "../../Environment/ApiUrl";
import Setting from "../../Environment/Setting";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/Context";
import SnackbarContext from "../../CustomComponents/SnackbarContext";
import jwt_decode from "jwt-decode";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
	const context = React.useContext(MainContext);
	const { setModalData, setModalOpen } = context;
	const navigate = useNavigate();

	const [state, setState] = React.useState({
		formType: "login",
		align: "right",
		data: {},
		isLoggedIn: false,
		token: "",
		username: "",
		password: "",
	});

	const { username, password } = state;

	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const setSecurity = (time) => {
		const setting = new Setting();
		let seedValue = time;
		let rid = setting.lcrng(seedValue, 16);

		let hash = setting.md5Hash(urls.headers["itpl-client-id"], rid);
		return hash;
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};
	// console.log("====================================");
	// console.log("state", state);
	// console.log("====================================");

	const handleTokenExpired = (exp) => {
		// let expiredTimer;
		// window.clearTimeout(expiredTimer);
		// const currentTime = Date.now();
		// const timeLeft = exp * 1000 - currentTime;
		// // console.log(timeLeft);
		// expiredTimer = window.setTimeout(() => {
		// 	localStorage.removeItem("token");
		// 	window.location.reload();
		// 	// You can do what ever you want here, like show a notification
		// }, timeLeft);
	};

	React.useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			const { exp, authorities } = jwt_decode(token);
			if (exp * 1000 < new Date().getTime()) {
				localStorage.removeItem("token");
				window.location.reload();
			}
		}
	});

	const handleSubmit = (event) => {
		const { formType } = state;

		event.preventDefault();

		if (formType === "login") {
			const formData = new FormData();
			//domain ---------------  balajihouse
			formData.append("domain", "208991");
			formData.append("username", username);
			formData.append("password", password);
			formData.append("accountType", -1);
			formData.append("passwordType", "password");
			formData.append("grant_type", "password");
			formData.append("tid", Date.now() + 30000);

			axios
				.post(urls.LOGIN, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: "Basic aXRwbDppd2FudHVubGltaXRlZA==",
					},
				})
				.then((response) => {
					setModalOpen(true);
					setModalData("Login Success", "success");

					const access_token =
						response && response.data?.access_token ? response.data?.access_token : null;
					const decoded = jwt_decode(access_token);
					if (access_token !== null) {
						localStorage.setItem("token", access_token);
						setState({
							isLoggedIn: true,
							token: access_token,
							currentItem: localStorage.setItem("currentItem", "Dashboard"),
						});
						navigate("/");
						const { exp, authorities } = jwt_decode(access_token);
						if (authorities?.[0] === "ROLE_MERCHANT_ADMIN") {
							localStorage?.setItem("userType", "merchant");
						} else {
							localStorage?.setItem("userType", "admin");
						}
					}

					//   const {firstName}  = response && response.data ? response.data : null ;
					//   const {lastName}  = response && response.data ? response.data : null ;
					//   const {mobile}  = response && response.data ? response.data : null ;
					//   const {email}  = response && response.data ? response.data : null ;
					//   const {externalReferenceId} = response && response.data ? response.data : null ;
					//   localStorage.setItem('id', externalReferenceId);
					//   localStorage.setItem('firstName', firstName);
					//   localStorage.setItem('lastName', lastName);
					//   localStorage.setItem('mobile', mobile);
					//   localStorage.setItem('email', email);
					// console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + response.data.externalReferenceId);
					const resCode = response.status;
					// console.log(resCode);
				})
				.catch((error) => {
					console.error(error);
					if (error.response.status === 400) {
						setModalOpen(true);
						setModalData("Invalid UserName or Password", "error");

						// alert("Please Enter Correct UserName or Password");
					} else if (error.response.status === 404) {
						setModalOpen(true);
						setModalData("Request URL was not found on this server", "warning");

						// alert("The Requested URL/badpage was not found on this server.");
					} else if (error.response.status === 500) {
						setModalOpen(true);
						setModalData("Something Went Wrong!", "warning");

						// alert("Something Went Wrong!");
					}
				});
		}
	};

	return (
		<>
			<Helmet>
				<title>Login | Banjee Admin</title>
			</Helmet>
			<div className='main-div'>
				<Container maxWidth='sm'>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "100vh",
							width: "100%",
						}}>
						<Card elevation={5} style={{ width: "100%" }}>
							<Grid item container xs={12}>
								{/* <Grid item xs={6}>
                                <div className='login-background'>
                                </div>
                            </Grid> */}
								<Grid item xs={12} style={{ padding: "20px" }}>
									<Grid item xs={12} style={{ textAlign: "center" }}>
										<img src={Logo} alt='logo' />
										<h2 style={{ marginTop: "10px" }}>Sign In</h2>
									</Grid>
									<Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
										<Box sx={{ maxWidth: "300px" }}>
											<form onSubmit={handleSubmit}>
												<div style={{ display: "flex", justifyContent: "center" }}>
													<TextField
														fullWidth
														type='text'
														className='text-input'
														variant='filled'
														label='Username'
														placeholder='Enter UserName'
														name='username'
														value={username}
														onChange={handleChange}
														required
													/>
												</div>
												<div
													style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
													<TextField
														fullWidth
														type={showPassword ? "text" : "password"}
														className='text-input'
														variant='filled'
														label='Password'
														placeholder='Enter Password'
														name='password'
														value={password}
														onChange={handleChange}
														required
														InputProps={{
															endAdornment: (
																<InputAdornment position='end'>
																	<IconButton
																		aria-label='toggle password visibility'
																		onClick={handleClickShowPassword}
																		onMouseDown={handleMouseDownPassword}
																		edge='end'>
																		{showPassword ? <VisibilityOff /> : <Visibility />}
																	</IconButton>
																</InputAdornment>
															),
														}}
													/>
												</div>
												<div
													style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
													<Button type='submit' variant='contained' className='login-btn'>
														Login
													</Button>
												</div>
											</form>
										</Box>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					</div>
				</Container>
				<SnackbarContext />
			</div>
		</>
	);
}

export default Login;
