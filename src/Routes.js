
import Dashboard from "./pages/Dashboard/dashboard";
import User from "./pages/Users/Users";
import Account from "./pages/Account/Account";
import Navbar from "./pages/navbar/navbar";
import { useRoutes } from "react-router-dom";
import Login from "./pages/Login/login";
import Category from "./pages/Category/Category";
import CustomerView from "./pages/Users/components/userView";
import Example from "./pages/Users/components/example";
import { ReportedUserList } from "./pages/Users/User_Services/UserApiService";
import ReportedUser1 from "./pages/Users/components/ReportedUser";

const Routes = () => {

    return useRoutes([
        {
            path: '',
            element: <Navbar />,
            children: [
                {
                    path: '',
                    element: <Dashboard />
                },
                {
                    path: 'category',
                    element: <Category />
                },
                {
                    path: 'user',
                    element: <User />,
                },
                {
                    path: 'user/view/:id',
                    element: <CustomerView />
                },
                {
                    path: 'user/reporteduser',
                    element: <ReportedUser1 />
                }
                // {
                //     path: '/account',
                //     element: <Account />
                // }
            ]
        },
        {
            path: 'login',
            element: <Login />,
        }
    ])
} 

export default Routes;