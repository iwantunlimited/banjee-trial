export const NewUserRegistered = [{
    Date: '1/1/2021',
    Male: 36,
    Female: 38,
    TransGender: 36,
  },{
    Date: '1/1/2221',
    Male: 51,
    Female: 21,
    TransGender: 28,
  },{
    Date: '21/2/2021',
    Male: 23,
    Female: 21,
    TransGender: 28,
  },{
    Date: '3/3/1999',
    Male: 19,
    Female: 13,
    TransGender: 15,
  },{
    Date: '7/7/2027',
    Male: 14,
    Female: 15,
    TransGender: 17,
  },{
    Date: '6/6/2021',
    Male: 16,
    Female: 10,
    TransGender: 15,
  }];

  


          
export const series= [
      {
        name: 'Male',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, 
      {
        name: 'Female',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }, 
      {
        name: 'Total User',
        data: [120, 41, 36, 26, 45, 48, 52, 53, 41]
      },
]
export const options = {
    options: {
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
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
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
    }
}
  
  