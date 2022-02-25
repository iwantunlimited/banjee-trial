
import { CircularProgress } from "@mui/material";
import React, { Component } from "react";
import Chart from "react-apexcharts";

class Trial extends Component {

  constructor(props) {
    super(props);
  }
  render() {

  const { chart,data ,myDate} = this.props

  const{ option,series } = data
  const { options } = option

  console.log(chart);
  console.log(myDate,'date,month,year');

  const monthData = {
    "Jan" :0,
   "Feb" :0,
   "Mar":0,
   "Apr":0,
   "May":0,
   "Jun":0,
   "Jul":0,
   'Aug':0,
   "Sep":0,
   "Oct":0,
   "Nov":0,
   "Dec":0,
 }

  
  const { Female,Male } = chart;
  console.log(chart);


  // typeData === 'month' ? console.log('month done') : console.log('year,done');;

  // console.log(Object.keys({...month,...Female}));
	// console.log(Object.values({...month , ...Female}));

   if(chart){
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
                options={{
                    chart: {
                        type: 'bar',
                        height: 350
                      },
                      plotOptions: {
                        bar: {
                          horizontal: false,
                          columnWidth: '55%',
                          endingShape: 'rounded'
                        },
                      },
                      dataLabels: {
                        enabled: false
                      },
                      stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                      },
                      xaxis: {
                        categories: myDate === 'month' ? Object.keys(monthData) :  Object.keys({...Male,...Female}) ,
                      },
                      yaxis: {
                        title: {
                          text: 'Users'
                        }
                      },
                      fill: {
                        opacity: 1
                      },
                      tooltip: {
                        y: {
                          formatter: function (val) {
                            return "" + val + ""
                          }
                        }
                      }
                }}
                series={[
                  { 
                    name: 'Male',
                    // data:  [0,25,52],
                    data: Object.values({...monthData, ...Male}) 
                  }, 
                  {
                    name: 'Female',
                    // data:  [0,52,52,52],
                    data: Object.values({...monthData , ...Female})
                  }, 
                  // {
                  //   name: 'Total User',
                  //   data: []
                  // },
                ]}
                type="bar" 
                width={window.innerWidth > 1440 ? '600': '430'}
                height={window.innerHeight > 1440 ? '300' : '220'}
            />
          </div>
        </div>
      </div>
    );
   }else{
     return(
       <div style={{display:'flex',justifyContent:'center'}}>
         <CircularProgress />
       </div>

     )
   }
  }
}

export default Trial;