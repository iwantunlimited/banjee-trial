import React from 'react';
import {
	Card,
	CardContent,
	Box,
	Grid,
	Typography,
	Button,
	TextField,
} from "@mui/material";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DashboardlistCustomer } from '../../Users/User_Services/UserApiService';


function TrigeredArea(props){

    const { handleIsLoad, handleAnalyticsData, dataType ,typeData} = props

    // const [age, setAge] = React.useState(' ');

    const handleChange = (event) => {
        typeData(event.target.value);
        listApiCall(event.target.value)
    };

    const[data,setData] = React.useState([])

    const [searchData, setSearchData] = React.useState([new Date(), new Date()]);

    const returnDate = (dateString) => {
		let month = {
			Jan: "01",
			Feb: "02",
			Mar: "03",
			Apr: "04",
			May: "05",
			Jun: "06",
			Jul: "07",
			Aug: "08",
			Sep: "09",
			Oct: "10",
			Nov: "11",
			Dec: "12",
		};
		let dateArr = dateString.toDateString().split(" ").slice(1, 4);
		return `${dateArr[2]}-${month[dateArr[0]]}-${dateArr[1]}`;
	};

    console.log(searchData);
    
    console.log(data);

    console.log(dataType);

    const listApiCall = React.useCallback((dataType) => {
        DashboardlistCustomer({
            startDate: searchData[0].toISOString(),
            endDate: searchData[1].toISOString(),
            type: dataType                                                                                                                                                                                                                                           
        }).then((res) => {
            console.log(res);
            handleAnalyticsData(res)
            setData(res)
        }).catch((err) => {console.log(err)})
    },[searchData])

    React.useEffect(() => {
        console.log("Called");  
        listApiCall(typeData)
    },[listApiCall])

    return(
        <Card
            className='chip-card'
			elevation={6}
		>
            <CardContent style={{paddingBottom: '20px'}}>
				{/* <Grid container spacing={4}> */}
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
						<Grid container>
							<Grid item xs={12}>
								<Typography variant="body1" sx={{ marginBottom: "10px" }}>
									{" "}
									Select Time Period
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateRangePicker
										startText="Start Date"
										endText="End Date"
										inputFormat="dd/MM/yyyy"
                                        value={searchData}
										onChange={(newValue) => {
											setSearchData(newValue);
										}}
										renderInput={(startProps, endProps) => (
											<React.Fragment>
												<TextField size="small" fullWidth {...startProps} />
												<Box sx={{ mx: 2 }}> - </Box>
												<TextField size="small" fullWidth {...endProps} />
											</React.Fragment>
										)}
									/>
								</LocalizationProvider>
							</Grid>
						</Grid>
					</Grid>
                    <Grid
                        item
                        xs={12}
                        container
                        spacing={2}
                        // style={{paddingTop:'20px',alignItems: "center", margin: "5px 10px 0px 10px"}}
                        style={{marginTop:'10px'}}
                    >
                        <Grid item xs={12} style={{display:'flex',alignItems:'center'}}>
                            <Typography variant="h6">Period :</Typography>
                            <div style={{marginLeft: '10px',fontSize:'18px'}}>
                                {(searchData &&
                                    searchData[0] &&
                                    returnDate(searchData[0])
                                        .split("-")
                                        .reverse()
                                        .join("/")) +
                                    " - " +
                                    (searchData &&
                                        searchData[1] &&
                                        returnDate(searchData[1])
                                            .split("-")
                                            .reverse()
                                            .join("/"))}
                            </div>
                        </Grid>
                        <Grid item xs={12} >
                        <FormControl>
                            {/* <InputLabel id="demo-simple-select-label">Select</InputLabel> */}
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            style={{height: '40px',minWidth:'200px'}}
                            value={dataType}
                            label="Age"
                            onChange={handleChange}
                            >
                            <MenuItem value={" "}>Date</MenuItem>
                            <MenuItem value={"month"}>Month</MenuItem>
                            <MenuItem value={"year"}>Year</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                // onClick={() =>console.log(searchData.dateRange)}
                                onClick={() => {listApiCall();handleIsLoad(true)}} 
                                sx={{
                                    background: "#FFFFFF",
                                    boxShadow: "0px 20px 27px rgba(0, 0, 0, 0.05)",
                                    borderRadius: "8px",
                                    padding: "10px 35px",
                                    marginTop: '5px !important'
                                }}
                            >
                                Get Analytics
                            </Button>
                        </Grid>
                    </Grid>
					{/* <Grid item xs={12} style={{paddingTop: '26px'}}>
						
					</Grid> */}
				{/* </Grid> */}
			</CardContent>
        </Card>
    )
}

export default TrigeredArea;