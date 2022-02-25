import React from "react";
import Navbar from "./pages/navbar/navbar";
import AuthContext from "./context/AuthContext";
import { useNavigate } from 'react-router-dom';

function Main(props){

    const context = React.useContext(AuthContext);

    const [ state,setState ] = React.useState({
        data: context.data
    })

    const setDataHandler = (value) => {
        setState({ data: value })
    }

    const { router }  = props;

    const navigate = useNavigate();

    const checkingLogin = () =>{
        if(!localStorage.getItem('token') && (props.location.pathname === '/' || props.location.pathname === '') ){
            navigate('/login')
        }else if(localStorage.getItem('token') && (props.location.pathname === '/' || props.location.pathname === '')){
            navigate('/')
        }
    }

    React.useEffect(() => {
        checkingLogin();
    },[])

    return(
        <div>
            <AuthContext.Provider value={{ data : state.data, setData: setDataHandler }}>  
                <Navbar />
            </AuthContext.Provider>
        </div>
    )
}

export default Main;