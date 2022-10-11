import React from 'react';
import { DataGrid } from '@mui/x-data-grid';



function DataGridCustom(porps){

    const { data } = porps;


    return(
            <DataGrid
                style={{height: '265px'}}
                rows={[
                    {
                        Male: 'urvik',
                        id: Math.random(),
                        Female: '1',
                        TransGender: '9925650140'
                    }
                ]}
                columns={[
                    {
                        width: 150,
                        field: 'Male'
                    },
                    {
                        width: 150,
                        field: 'Female'
                    },
                    {
                        width: 150,
                        field: 'TransGender'
                    }
                ]}
            />

    )
}
export default DataGridCustom;