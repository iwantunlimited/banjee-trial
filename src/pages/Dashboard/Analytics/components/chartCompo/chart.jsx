import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CircularProgress } from "@mui/material";
import '../../Analytics.css'

function ChartComp(props){

    const { data } = props;

    console.log(data);
    
    const [state , setState] = React.useState({
        series: [ 0,0,0],
        // series: ["54","54","54"],
        options: {
            chart: {
            width: 380,
            type: 'pie',
            },
            labels: ['Male', 'Female', 'Other'],
            responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                width: 200
                },
                legend: {
                position: 'bottom'
                }
            }
            }]
        }
    })


    React.useEffect(()=>{
        setState((prev) => ({
            ...prev,
            series :[data?.content?.filter(ele => ele.gender === 'Male').length, data?.content?.filter(ele => ele.gender === 'Female').length, data?.content?.filter(ele => ele.gender === "I'd rather not to say" || ele.gender === "" ).length ]
        }))
    },[data])

    console.log("State " ,state);
   
    return (
        <Card className="main-card" style={{display:'flex',justifyContent: 'center',padding:'10px'}}>
            <div id="chart">
                {data && data.content && data.content.length> 0 ?<ReactApexChart options={state.options} series={state.series} type="pie" width={ window.innerWidth < 769 ? 370 : 450} /> :  <CircularProgress /> }
            </div>
        </Card>
    );
  
}

export default ChartComp;



// import React, { Component } from "react";
// import ReactApexChart from "react-apexcharts";
// import { Card } from "@mui/material";
// import '../../Analytics.css'

// class ChartComp extends Component {
//   constructor(props) {
//     super(props);



//     const { data } = props;

//     console.log(this.state.male);

//     this.state = {
//     male: 0,
//     female: 0,
//     series: [50, 44, 13],
//     options: {
//         chart: {
//         width: 380,
//         type: 'pie',
//         },
//         labels: ['Male', 'Female', 'TransGender'],
//         responsive: [{
//         breakpoint: 480,
//         options: {
//             chart: {
//             width: 200
//             },
//             legend: {
//             position: 'bottom'
//             }
//         }
//         }]
//     }
//     }
//     }

//   render() {
//     return (
//         <Card className="main-card" style={{display:'flex',justifyContent: 'center',padding:'10px'}}>
//             <div id="chart">
//                 <ReactApexChart options={this.state.options} series={this.state.series} type="pie" width={window.innerWidth< 769 ? 370 : 450} />
//             </div>
//         </Card>
//     );
//   }
// }

// export default ChartComp;