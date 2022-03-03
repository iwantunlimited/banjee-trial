import React from "react";
import { withScriptjs,
    withGoogleMap,
    GoogleMap,Marker } from "react-google-maps"
    import { compose } from "recompose";

  
  
  const MapComponent = compose(
    withScriptjs,
    withGoogleMap
  )(props =>
    {
      console.log(props.data);
      return (<GoogleMap
        defaultZoom={3}
        defaultCenter={{ lat: 24.6282, lng: 25.9231 }}
      >
        {
          props && props.data && props.data.map((ele) => {
            return(
              <GoogleMap defaultZoom={15} defaultCenter={{ lat: ele.currentLocation &&  ele.currentLocation.lat, lng: ele.currentLocation &&  ele.currentLocation.lon }}>
                <Marker  
                  position={{ lat: ele.currentLocation &&  ele.currentLocation.lat , lng: ele.currentLocation &&  ele.currentLocation.lon }}
                  options={{
                    // anchorPoint: new google.maps.Point(102, 10)
                  }}
                  label={{
                    text:ele.name,
                    color:'white',
                    className:"markerCss"
                  }}
                  labelStyle={{
                    backgroundColor: "yellow",
                    fontSize: "32px",
                    padding: "16px"
                  }} />
            </GoogleMap>
            )
          })
        }
      </GoogleMap>)
    }
  );
  
  
  export default MapComponent;